import { VITCSWAP_API_URL } from "./constants"
import events from "./events"

export enum WebSocketStates {
    CLOSED="CLOSED",
    CLOSING="CLOSING",
    CONNECTING="CONNECTING",
    OPEN="OPEN"
}

export class WebSocketConnection {
    url:string
    ws:WebSocket
    constructor(){
        this.url = `ws${VITCSWAP_API_URL}`
        this.debug(`Connecting to ${this.url} with websocket.`)
    }

    debug(...messages:any[]){
        console.debug("WebSocket", ...messages)
    }

    get state(){
        if(!this.ws)return WebSocketStates.CLOSED
        return [
            WebSocketStates.CONNECTING,
            WebSocketStates.OPEN,
            WebSocketStates.CLOSING,
            WebSocketStates.CLOSED
        ][this.ws.readyState]
    }

    async connect(){
        try{
            const ws = this.ws = new WebSocket(this.url)
            await new Promise<void>((resolve, reject) => {
                let cancel = false
                ws.onerror = (err) => {
                    if(cancel)return
                    cancel = true
                    reject(err)
                }
                ws.onopen = () => {
                    if(cancel)return
                    cancel = true
                    resolve()
                }
            })

            events.emit("WS_STATE_VITCSWAP", this.state)
            this.debug(`WebSocket Connected`)
            ws.onmessage = (data) => {
                this.onMessage(data)
            }

            const error = await new Promise<Event|void>((resolve) => {
                ws.onerror = (err) => resolve(err)
                ws.onclose = () => resolve()
            })
            console.error(error || "close")
            throw new Error("WebSocket disconnected")
        }catch(err){
            console.error(err)
            this.debug("trying to reconnect")
            this.ws = null
            events.emit("WS_STATE_VITCSWAP", this.state)
            setTimeout(() => {
                this.connect()
            }, 2000)
        }
    }

    onMessage(message:MessageEvent<string>){
        const data = JSON.parse(message.data)
        switch(data.op){
            case "candle_update": {
                const {
                    token
                } = data.d

                events.emit(`CANDLE_UPDATE_${token}`, data.d)
            }
        }
    }
}
export default new WebSocketConnection()