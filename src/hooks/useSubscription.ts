import React from "react"
import events from "../events"
import websocket from "../websocket"

const usedSubscriptions = {} as {
    [key:string]: number
}

export default function useSubscription(sub:string, onEvent:((data:any)=>void) = () => {}, onClear?:()=>void){
    React.useEffect(() => {
        usedSubscriptions[sub] = usedSubscriptions[sub] || 0
        usedSubscriptions[sub]++
        if(usedSubscriptions[sub] === 1){
            websocket.subscriptions.push(sub as any)
            websocket.updateSubscriptions()
        }
        events.on(sub, onEvent)
        return () => {
            events.off(sub, onEvent)
            usedSubscriptions[sub]--
            if(usedSubscriptions[sub] === 0){
                delete usedSubscriptions[sub]
                websocket.subscriptions.splice(websocket.subscriptions.indexOf(sub as any), 1)
                websocket.updateSubscriptions()
                if(onClear)onClear()
            }
        }
    }, [])
}