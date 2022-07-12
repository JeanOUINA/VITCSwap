import { useEffect } from "react"
import events from "../events"

export default function useCandleUpdate(token0:string, token1:string, onChange:()=>void){
    useEffect(() => {
        const listener = () => {
            
        }

        events.on(`CANDLE_UPDATE_${token0}`, listener)
        events.on(`CANDLE_UPDATE_${token1}`, listener)
        return () => {
            events.on(`CANDLE_UPDATE_${token0}`, listener)
            events.on(`CANDLE_UPDATE_${token1}`, listener)
        }
    }, [token0, token1])
}