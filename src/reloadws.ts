import events from "./events"
import { WebSocketStates } from "./vitcswapws"

export class WebSocketConnection {
    url:string
    ws:WebSocket
    constructor(){
        this.url = "ws"+location.origin.slice(4)
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

            events.emit("WS_STATE_RELOAD", this.state)
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
            events.emit("WS_STATE_RELOAD", this.state)
            setTimeout(() => {
                this.connect()
            }, 2000)
        }
    }

    onMessage(message:MessageEvent<string>){
        switch(message.data){
            case "update": {
                // the files were updated, reload
                location.reload()
            }
        }
    }
}
export default new WebSocketConnection()