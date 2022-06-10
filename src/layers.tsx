import useForceUpdate from "./hooks/useForceUpdate";
import useTheme from "./hooks/useTheme";
import Toasts from "./layers/Toasts";
import Main from "./layers/Main";
import { ReactElement } from "react";
import darkTheme from "./themes/dark";
import lightTheme from "./themes/light";
import React from "react"

const layers:ReactElement[] = [
    <Main key="main"/>,
    <Toasts key="toasts" />
]
const baseLength = layers.length
let forceUpdate:()=>void
export default function AppLayers(){
    forceUpdate = useForceUpdate()
    const theme = useTheme() === "dark" ? darkTheme : lightTheme

    return <div style={{
        backgroundColor: theme.palette.background.default,
        display: "block",
        height: "100vh",
        width: "100%"
    }}>
        {layers}
    </div>
}
window.addEventListener("keydown", (ev) => {
    switch(ev.key){
        case "Escape": {
            const layer = [...layers].reverse().find(e => typeof e.key === "string" && e.key.startsWith("layer-"))
            if(!layer)return
            if(layer.props.close)layer.props.close()
            closeLayer(layer.key)    
        }
    }
})

export function closeLayer(key:string|number){
    const index = layers.findIndex(e => e.key === key)
    if(index === -1)return
    layers.splice(index, 1)
    forceUpdate()
    if(layers.length === baseLength)document.body.style.overflow = ""
}

export function pushLayer(layer:ReactElement){
    layers.push(layer)
    forceUpdate()
    if(layers.length === baseLength+1)document.body.style.overflow = "hidden"
}