/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { init, dispose } from "klinecharts";
import * as uuid from "uuid"
import { Candle } from "../hooks/useChart";
import { klinesDurations } from "../constants";
import vitcswapApiClient from "../clients/vitcswap-api.client";
import Loading from "./Loading";
import { Button, Divider } from "@mui/material";
import { defaultToken } from "../vite";
import { useChartDisabled } from "../hooks/useChartDisabled";
import events from "../events";

export type ChartEvents = {
    prout: [string]
}
export default function Chart(props: {
    data: Candle[]
}|{
    token: string,
    quote: string
}) {
    const id = useMemo(() => uuid.v4(), [])
    const [chart, setChart] = useState(null)
    const [time, setTime] = useState<keyof typeof klinesDurations>("6h")
    const [candleType, setCandleType] = useState<"candle_solid"|"area">("candle_solid")
    const [data, setData] = useState("data" in props && props.data || [])
    const [dataReady, setDataReady] = useState(false)
    const [hitEnd, setHitEnd] = useState(false)
    const chartDisabled = useChartDisabled()
    useEffect(() => {
        if(chartDisabled)return setDataReady(false)
        if("token" in props && "quote" in props){
            setDataReady(false)
            let cancel = false
            console.log(`Fetching ${props.token}/${props.quote} for ${time}`)
            vitcswapApiClient.getCandles(
                props.token,
                props.quote,
                time,
                vitcswapApiClient.getIndex(
                    klinesDurations[time],
                    Date.now()
                )-100
            ).then(candles => {
                if(cancel)return
                console.log(`Fetched ${props.token}/${props.quote} for ${time}`)
                let hit = false
                setData(candles.filter(candle => {
                    if(!candle){
                        hit = true
                        return false
                    }
                    return true
                }))
                setHitEnd(hit)
                setDataReady(true)
            }).catch((err) => {
                if(cancel)return
                console.error(err)
                setData([])
                setHitEnd(true)
                setDataReady(true)
            })
            return () => {
                cancel = true
            }
        }else{
            setData(props.data)
            setHitEnd(true)
            setDataReady(true)
        }
    }, [
        "token" in props && props.token,
        "quote" in props && props.quote,
        "data" in props && props.data,
        time,
        chartDisabled
    ])
    useEffect(() => {
        if(!chart)return
        chart.setStyleOptions({
            candle: {
                type: candleType
            }
        })
    }, [candleType])
    useEffect(() => {
        if(!dataReady)return
        // Init chart
        const chart = init(id, {
            candle: {
                tooltip: {
                    labels: ["T: ", "O: ", "C: ", "H: ", "L: ", "V: "],
                    defaultValue: "n/a"
                },
                type: candleType
            },
            grid: {
                horizontal: {
                    color: "#393939"
                },
                vertical: {
                    color: "#393939"
                },
            }
        })
        chart.setPriceVolumePrecision(8, 2)
        // Create main technical indicator MA
        //chart.createTechnicalIndicator("MA", false)
        // Create sub technical indicator VOL
        if("token" in props && (props.token === defaultToken || props.quote === defaultToken)){
            chart.createTechnicalIndicator("VOL")
        }

        setChart(chart)
        return () => {
            dispose(id)
            setChart(null)
        }
    }, [data, dataReady])
    useEffect(() => {
        if(!("token" in props))return

        let cancel = false
        const duration = klinesDurations[time]
        const listener = () => {
            // we need to refresh the chart with the new data
            // only load the impacted candle

            const now = Date.now()
            const index = vitcswapApiClient.getIndex(duration, now)

            vitcswapApiClient.getCandles(
                props.token,
                props.quote,
                time,
                index-1
            ).then(candles => {
                if(cancel)return

                for(const candle of candles){
                    if(!candle)continue
                    
                    const exist = data.find(e => e.timestamp === candle.timestamp)
                    if(exist){
                        exist.open = candle.open
                        exist.close = candle.close
                        exist.high = candle.high
                        exist.low = candle.low
                        exist.volume = candle.volume
                    }else{
                        data.push(candle)
                    }
                }
                setData([...data])
            })
        }

        events.on(`RATE_CHANGE_${props.token}`, listener)
        events.on(`RATE_CHANGE_${props.quote}`, listener)

        const now = Date.now()
        const index = vitcswapApiClient.getIndex(duration, now)
        const timeout = setTimeout(() => {
            // we need to load the next candle
            listener()
            const interval = setInterval(() => {
                listener()
            }, duration*1000)
            clean = () => {
                clearInterval(interval)
            }
        }, (index + 1)*duration*1000-now)
        let clean = () => {
            clearTimeout(timeout)
        }

        return () => {
            cancel = true
            clean()
        }
    }, [
        "token" in props && props.token,
        "quote" in props && props.quote,
        "data" in props && props.data,
        dataReady,
        time
    ])
    useEffect(() => {
        if(!chart)return
        // Fill data
        chart.applyNewData(data);
        chart.loadMore(timestamp => {
            if(hitEnd || !("token" in props))return
            const duration = klinesDurations[time]
            const index = vitcswapApiClient.getIndex(duration, timestamp)
            vitcswapApiClient.getCandles(
                props.token,
                props.quote,
                time,
                index-101
            ).then(candles => {
                let hit = false
                candles = candles.filter(candle => {
                    if(!candle){
                        hit = true
                        return false
                    }
                    return true
                })
                setHitEnd(hit)
                setData(candles.concat(data))
            }).catch((err) => {
                console.error(err)
                setHitEnd(true)
            })
        })
    }, [data, chart, dataReady])

    return <div>
        {/** top bar */}
        <div css={{
            height: 38,
            marginBottom: 5
        }}>
            {([
                "Line",
                "1m",
                "5m",
                "30m",
                "1h",
                "6h",
                "1d",
                "1w",
                "1mo"
            ] as (keyof typeof klinesDurations | "Line")[]).map(candletime => {
                return <Button key={candletime} onClick={() => {
                    if(candletime === "Line"){
                        setCandleType(ctype => {
                            switch(ctype){
                                case "area":
                                    return "candle_solid"
                                default:
                                    return "area"
                            }
                        })
                    }else{
                        if(dataReady && time !== candletime){
                            setTime(candletime)
                            setDataReady(false)
                        }
                    }
                }} css={{
                    ...(candletime === time || (candleType === "area" && candletime === "Line") ? {
                        backgroundColor: "rgba(255, 103, 41, 0.08)"
                    } : {})
                }}>
                    {candletime}
                </Button>
            })}
        </div>
        <Divider/>
        <div id={id} style={{ height: 600 }}>
            {!dataReady && <Loading/>}
        </div>
    </div>
}