import Connector from "@vite/connector"
import { EEventEmitter } from "../events"
import { showToast } from "../layers/Toasts"

export const VITECONNECT_BRIDGE = "wss://viteconnect.thomiz.dev/"

export class ViteConnect extends EEventEmitter<{
    ready: [],
    close: [],
    newSession: []
}> {
    vbInstance: any
    readyConnect = false
    ready = false
    accounts: string[] = null
    constructor(){
        super()
        this.setupVbInstance()
    }

    private setupVbInstance(){
        this.vbInstance = new Connector({ bridge: VITECONNECT_BRIDGE })
        this.vbInstance.createSession()
        .then(() => {
            this.readyConnect = true
            this.emit("newSession")
        })
        this.vbInstance.on("connect", (err, payload) => {
            console.log(`[VC]: Connect`, err, payload)
            this.accounts = payload.params[0].accounts
            this.ready = true
            this.readyConnect = false
            this.emit("ready")
        })
        this.vbInstance.on("disconnect", (err, payload) => {
            console.log(`[VC]: Disconnect`, err, payload)
            this.accounts = null
            this.ready = false
            this.vbInstance.stopBizHeartBeat()
            this.emit("close")
            showToast(`[ViteConnect]: ${payload.params?.[0]?.message || "Disconnected"}`, {
                type: "error",
                icon: true,
                timeout: 4000
            })
            this.setupVbInstance()
        })
    }

    async sendTransactionAsync(...args: any): Promise<any> {
      return new Promise((res, rej) => {
        this.on("close", () => {
          rej("Request aborted due to disconnect.");
        })
  
        this.vbInstance.sendCustomRequest({ method: "vite_signAndSendTx", params: args })
        .then(res, rej)
      })
    }
  
    async signMessageAsync(...args: any): Promise<any> {
      return new Promise((res, rej) => {
        this.on("close", () => {
          rej("Request aborted due to disconnect.")
        })
  
        this.vbInstance.sendCustomRequest({ method: "vite_signMessage", params: args })
        .then(res, rej)
      })
    }
}

export default new ViteConnect