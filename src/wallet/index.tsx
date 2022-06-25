/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Button } from "@mui/material"
import Connector from "@vite/connector"
import BigNumber from "bignumber.js"
import toast from "react-hot-toast"
import { EEventEmitter } from "../events"
import { showToast } from "../layers/Toasts"
import { contract } from "../vite"
import * as vite from "@vite/vitejs"
import { useState } from "react"

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

            // we're now fetching if the user has any leftovers vite
            // in the contract lp balance
            contract.methods.getVITEBalance.call([
                this.accounts[0]
            ]).then(balance => {
                //if(balance[1].map.userBalance === "0")return
                const vite_balance = new BigNumber(balance[1].map.userBalance)
                .shiftedBy(-18)
                .toFixed(0)

                toast((t) => {
                    const [disabled, setDisabled] = useState(false)
                    return <span>
                        You have <span css={{
                            fontWeight: "bold"
                        }}>{vite_balance} Vite</span> in the Liquidity Contract. Click <Button onClick={async () => {
                            setDisabled(true)
                            try{
                                const block = vite.accountBlock.createAccountBlock("send", {
                                    address: this.accounts[0],
                                    tokenId: vite.constant.Vite_TokenId,
                                    amount: "0",
                                    toAddress: contract.address,
                                    data: contract.methods.withdrawVITE.encodeCall([
                                        balance[1].map.userBalance
                                    ])
                                })

                                showToast("Please accept the transaction on your phone!", {
                                    type: "info",
                                    timeout: 3000,
                                    icon: true
                                })
                                await this.sendTransactionAsync({
                                    block: block.accountBlock
                                })
                                toast.success(`${vite_balance} Vite were withdrawn!`)
                            }catch(err){
                                toast.error(`${err.name}: ${err.message}`)
                            }
                            toast.dismiss(t.id)
                        }} disabled={disabled} variant="text">Here</Button> to withdraw them.<br/><br/>
                        <Button onClick={() => {
                            toast.dismiss(t.id)
                        }}>
                            Dismiss
                        </Button>
                    </span>
                }, {
                    duration: 20000
                })
            }).catch(err => {
                console.error(err)
            })
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