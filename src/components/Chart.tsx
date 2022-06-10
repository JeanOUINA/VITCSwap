/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { init, dispose } from "klinecharts";
import * as uuid from "uuid"
import { Candle } from "../hooks/useChart";
import { EEventEmitter } from "../events";

export type ChartEvents = {
    prout: [string]
}
export default function Chart(props: {
    data: Candle[]
}) {
    const id = useMemo(() => uuid.v4(), [])
    const events = useMemo(() => new EEventEmitter<ChartEvents>(), [])
    const [chart, setChart] = useState(null)
    useEffect(() => {
        // Init chart
        const chart = init(id, {
            candle: {
                tooltip: {
                    labels: ["T: ", "O: ", "C: ", "H: ", "L: ", "V: "],
                    defaultValue: 'n/a'
                }
            }
        });
        // Create main technical indicator MA
        //chart.createTechnicalIndicator("MA", false);
        // Create sub technical indicator VOL
        chart.createTechnicalIndicator("VOL");

        setChart(chart)
        return () => {
            dispose(id);
        }
    }, []);
    useEffect(() => {
        if (!chart) return
        // Fill data
        chart.applyNewData(props.data);
    }, [props.data, chart])

    return <div>
        {/** top bar */}
        <div css={{
            height: 38
        }}>
            <span>Line</span>
            <span>Line</span>
        </div>
        <div id={id} style={{ height: 600 }} />;
    </div>
}