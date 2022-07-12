import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { klinesDurations } from "../constants";
import events from "../events";
import { wait } from "../utils";

export type Candle = {
    timestamp: number,
    open: number,
    close: number,
    high: number,
    low: number,
    volume: number
}

export default function useChart(token:string, quote:string, candletime:keyof typeof klinesDurations){
    const [candles, setCandles] = useState<Candle[]>(null)
    const [refresh, setRefresh] = useState(0)
    useEffect(() => {
        setCandles(null)
        if(token === quote)return
        let cancel = false
        let fetched = false

        const duration = klinesDurations[candletime]
        const now = Date.now()/1000
        const startIndex = (now-(now%duration))/duration-100
        
        fetch(`https://vitcswap-api.thomiz.dev/api/candles/${token}/${quote}/${candletime}?start=${startIndex}`)
        .then(async res => {
            if(cancel)return
            const content:{
                start: number,
                end: number,
                creation: number,
                latest: number,
                candles: [string, string, string, string, string, string][]
            } = await res.json()
            if(cancel)return
            setCandles(content.candles.map((candle, i) => {
                if(!candle)return null
                return {
                    open: new BigNumber(candle[0]).toNumber(),
                    close: new BigNumber(candle[1]).toNumber(),
                    high: new BigNumber(candle[2]).toNumber(),
                    low: new BigNumber(candle[3]).toNumber(),
                    volume: new BigNumber(candle[5]).toNumber(),
                    timestamp: duration*(startIndex + i)*1000
                }
            }).filter(e => !!e))
            fetched = true
        }, () => {
            if(cancel)return
            fetched = true
            setCandles([])
        })
        
        const listener = () => {
            setRefresh(e => e+1)
            return
            /*
            if(!fetched)return

            setCandles(candles => {
                if(!candles.length)return candles

                const lastCandle = candles[candles.length-1]
                const type = token === data.fromToken ? "sell" : "buy"
                let price = 0;
                switch(type){
                    case "buy":
                }
            })*/
        }

        events.on(`RATE_CHANGE_${token}`, listener)
        events.on(`RATE_CHANGE_${quote}`, listener)
        
        ;(async () => {
            while(!cancel){
                const now = Date.now()/1000
                const index = (now-(now%duration))/duration-100
                // wait for the next index
                const time = (index+101)*duration*1000-Date.now()
                console.log(time)
                await wait(time)
                if(cancel)break
                // ok we're there
                setCandles(candles => {
                    if(!fetched)return candles
                    // invalid candles
                    if(candles.length === 0)return candles
                    const lastCandle = candles[candles.length-1]
                    return [
                        ...candles,
                        {
                            open: lastCandle.close,
                            close: lastCandle.close,
                            high: lastCandle.close,
                            low: lastCandle.close,
                            volume: 0,
                            timestamp: (index+1)*duration*1000
                        }
                    ]
                })
            }
        })()
        
        return () => {
            cancel = true

            events.off(`RATE_CHANGE_${token}`, listener)
            events.off(`RATE_CHANGE_${quote}`, listener)
        }
    }, [token, quote, candletime, refresh])

    return candles
}