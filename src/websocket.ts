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
    pingTimeout: NodeJS.Timeout = null
    subscriptions:
        (
            "exchange_rates"
        )[] = []
    constructor(){
        this.url = "wss://vitcscan.thomiz.dev"
        this.debug(`Connecting to ${this.url} with websockets.`)
        this.connect()
        
        let lastState = WebSocketStates.CLOSED
        events.on("WS_STATE", state => {
            if(state === lastState)return
            lastState = state
            if(state !== WebSocketStates.OPEN)return
            // Connection opened
        })
    }

    debug(...messages:any[]){
        console.debug(...messages)
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
            if(this.pingTimeout)clearTimeout(this.pingTimeout)
            this.pingTimeout = setTimeout(() => {
                if(this.state === "OPEN")this.ws.close(1000, "PingTimeout")
            }, 60*1000)

            events.emit("WS_STATE", this.state)
            this.debug(`WebSocket Connected`)
            ws.onmessage = (data) => {
                this.onMessage(data)
            }
            this.updateSubscriptions()

            const error = await new Promise<Event|void>((resolve) => {
                ws.onerror = (err) => resolve(err)
                ws.onclose = () => resolve()
            })
            if(this.pingTimeout)clearTimeout(this.pingTimeout)
            console.error(error || "close")
            throw new Error("WebSocket disconnected")
        }catch(err){
            console.error(err)
            this.debug("trying to reconnect")
            this.ws = null
            events.emit("WS_STATE", this.state)
            setTimeout(() => {
                this.connect()
            }, 2000)
        }
    }

    onMessage(message:MessageEvent<string>){
        const data:{
            op: string,
            d: any
        } = JSON.parse(message.data)
        switch(data.op){
            case "ping": {
                if(this.pingTimeout)clearTimeout(this.pingTimeout)
                this.pingTimeout = setTimeout(() => {
                    this.ws.close(1000, "PingTimeout")
                }, 60*1000)
                this.rawsend({
                    op: "pong",
                    d: Date.now()
                })
                return
            }
        }
        events.emit(data.op, data.d)
    }

    rawsend<op extends string, data extends any>(data:OutgoingMessage<op, data>){
        this.ws.send(JSON.stringify(data))
    }

    willUpdateSubs = false

    updateSubscriptions(){
        if(this.willUpdateSubs)return
        this.willUpdateSubs = true
        setImmediate(() => {
            this.willUpdateSubs = false
            if(this.state !== WebSocketStates.OPEN)return
            this.rawsend({
                op: "subscriptions",
                d: this.subscriptions
            })
        })
    }
}
export default new WebSocketConnection()

interface OutgoingMessage<op extends string, data extends any> {
    op: op,
    d: data
}