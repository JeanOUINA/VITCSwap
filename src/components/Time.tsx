import React, { useEffect } from "react"
import moment from "moment";
import EventEmitter from "events";
import useForceUpdate from "../hooks/useForceUpdate";

moment.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d seconds",
        ss: "%d seconds"
    }
})

const events = new EventEmitter()
setTimeout(() => {
    events.emit("SECOND")
    setInterval(() => {
        events.emit("SECOND")
    }, 1000)
}, Math.floor(Date.now()/1000)*1000+1000)

export function Duration({
    timestamp
}:{
    timestamp: number
}):JSX.Element{
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        const listener = () => {
            forceUpdate()
        }
        events.on("SECOND", listener)
        return () => {
            events.off("SECOND", listener)
        }
    }, [])

    return <>
        {moment(timestamp).fromNow()}
    </>
}

export default function Time({
    timestamp
}:{
    timestamp: number
}){
    return <>
        {moment(timestamp).format("MM/DD/YYYY HH:mm:ss")}
    </>
}