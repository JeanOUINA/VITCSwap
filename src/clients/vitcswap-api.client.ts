import BigNumber from "bignumber.js";
import { klinesDurations, VITCSWAP_API_URL } from "../constants";

export class VITCSwapAPIClient {
    static BASE_URL = `http${VITCSWAP_API_URL}/api`

    async getCandles(token:string, quote:string, candletime:keyof typeof klinesDurations, startIndex?:number){
        const params = new URLSearchParams()
        if(startIndex){
            params.set(`start`, startIndex.toFixed(0))
        }
        const paramsstr = params.toString()
        const res = await fetch(`${
            VITCSwapAPIClient.BASE_URL
        }/candles/${token}/${quote}/${
            candletime
        }${paramsstr ? `?${paramsstr}` : ""}`)

        const duration = klinesDurations[candletime]
        const content:{
            start: number,
            end: number,
            creation: number,
            latest: number,
            candles: [string, string, string, string, string, string][],
            prices: {
                [key: string]: string
            }
        } = await res.json()

        return content.candles.map((candle, i) => {
            if(!candle)return null
            return {
                open: new BigNumber(candle[0]).toNumber(),
                close: new BigNumber(candle[1]).toNumber(),
                high: new BigNumber(candle[2]).toNumber(),
                low: new BigNumber(candle[3]).toNumber(),
                volume: new BigNumber(candle[5]).toNumber(),
                timestamp: duration*(startIndex + i)*1000
            }
        })
    }

    getIndex(duration:number, time:number){
        time = time/1000
        const index = (time-(time%duration))/duration
        return index
    }
}

export default new VITCSwapAPIClient();