import React from "react"
import websocket, { WebSocketStates } from "../websocket"
import useEvent from "./useEvent"
import useForceUpdate from "./useForceUpdate"
import useSubscription from "./useSubscription"

export type ExchangeRates = {
    global: {
        [pairId: string]: {
            tokenId: string,
            quoteId: string,
            price: string
        }
    },
    quotes: {
        [tokenId: string]: {
            USD: string,
            EUR: string,
            CHF: string,
            GBP: string,
            ILS: string,
            CNY: string,
            JPY: string,
            INR: string
        }
    }
}

let cached_prices:ExchangeRates = null

export default function useExchangeRates():{
    loaded: boolean,
    prices: ExchangeRates
}{
    const forceUpdate = useForceUpdate()
    const wsState = useEvent("WS_STATE", websocket.state)
    React.useEffect(() => {
        if(wsState !== WebSocketStates.OPEN)cached_prices = null
    }, [wsState])
    useSubscription("exchange_rates", (prices) => {
        cached_prices = prices
        forceUpdate()
    }, () => {
        cached_prices = null
    })
    const loaded = !!cached_prices
    return {
        loaded,
        prices: cached_prices
    }
}