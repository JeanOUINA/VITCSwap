// This file is basically an EventEmitter
// but with type checking for events
// without writing the thing 40 times

// Just write definitions in the constructor 
// and you're done.

import { EventEmitter } from "events"
import { ShapeEventMoveDrawingParams } from "klinecharts"
import { TokenInfo } from "web3-vite"
import { FiatCurrencies } from "./stores/FiatCurrencyStore"
import { Network } from "./stores/NetworkStore"
import { WebSocketStates } from "./vitcswapws"

export class EEventEmitter <events extends {
    [key: string]: any[]
}> extends EventEmitter {
    on<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.on(event, listener)
    }
    once<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.once(event, listener)
    }
    off<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.off(event, listener)
    }
    removeListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.removeListener(event, listener)
    }
    removeAllListeners<key extends keyof events>(event:Exclude<key, number>){
        return super.removeAllListeners(event)
    }
    rawListeners<key extends keyof events>(event:Exclude<key, number>):((...args:events[key]) => void)[]{
        return super.rawListeners(event) as any
    }
    addListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.addListener(event, listener)
    }
    listenerCount<key extends keyof events>(event:Exclude<key, number>){
        return super.listenerCount(event)
    }
    emit<key extends keyof events>(event:Exclude<key, number>, ...args:events[key]){
        return super.emit(event, ...args)
    }
    eventNames():Exclude<keyof events, number>[]{
        return super.eventNames() as any
    }
    listeners<key extends keyof events>(event:Exclude<key, number>):((...args:events[key]) => void)[]{
        return super.listeners(event) as any
    }
    prependListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.prependListener(event, listener)
    }
    prependOnceListener<key extends keyof events>(event:Exclude<key, number>, listener:(...args:events[key]) => void){
        return super.prependOnceListener(event, listener)
    }
}

export type EventsDefinition = {
    WS_STATE_VITCSWAP: [WebSocketStates],
    WS_STATE_RELOAD: [WebSocketStates],
    [key: `TOKEN_INFOS_UPDATE_${string}`]: [TokenInfo],
    TOKEN_INFOS_UPDATE: [Map<string, TokenInfo>],
    PAIRS_UPDATE: [Set<string>]
    [key: `RATE_CHANGE_${string}`]: [{
        _address: string,
        fromToken: string,
        toToken: string,
        fromAmount: string,
        toAmount: ShapeEventMoveDrawingParams,
        total: string,
        totalVITE: string
    }],
    [key: `VITE_BALANCE_UPDATE_${string}`]: [],
    PAIR_CREATION_FEE_CHANGE: [string],
    SLIPPAGE_CHANGE: [number],
    FIAT_CHANGE: [FiatCurrencies],
    NETWORK_CHANGE: [Network],
    EULA_CHANGE: [boolean],
    CHART_DISABLED_CHANGE: [boolean],
    [key: `CANDLE_UPDATE_${string}`]: [{
        volume: string,
        closePrice: string,
        token: string
    }]
}
export default new EEventEmitter<EventsDefinition>()