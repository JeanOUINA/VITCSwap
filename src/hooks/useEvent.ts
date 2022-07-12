import React from "react"
import events, { EventsDefinition } from "../events"
import useForceUpdate from "./useForceUpdate"

export default function useEvent<T=any>(event:keyof EventsDefinition, defaultValue:T):T{
    const [value, setValue] = React.useState([defaultValue])
    const forceUpdate = useForceUpdate()
    React.useEffect(() => {
        const listener = (v) => {
            setValue([v])
            forceUpdate()
        }
        events.on(event, listener)
        return () => {
            events.off(event, listener)
        }
    }, [event])

    return value[0]
}