import * as React from "react"
import {v4 as uuid} from "uuid"
import useForceUpdate from "../hooks/useForceUpdate"

let forceUpdate = () => {}
const toasts:{
    elem: React.ReactNode,
    id: string
}[] = []
export default function Toasts():JSX.Element {
    forceUpdate = useForceUpdate()
    if(toasts.length === 0)return null
    return <div className="custom-toasts" style={{
        bottom: 80
    }} ref={(div) => {
        if(!div)return
        div.style.setProperty("left", `calc(50% - ${div.offsetWidth / 2}px)`)
    }}>
        {toasts.map(e => e.elem)}
    </div>
}

export type toastType = "info" |
    "success" |
    "danger" |
    "error" |
    "warning" |
    "warn"

window["showToast"] = showToast
export function showToast(text:string, options: {timeout?: number, type?:toastType, icon?: boolean} = {
    timeout: 3000,
    type: null,
    icon: false
}){
    const id = uuid()
    const classNames = ["custom-toast"]
    if(options.type)classNames.push("toast-"+options.type)
    if(options.type && options.icon) classNames.push("icon");
    const getElem = () => {
        return <div key={id} className={classNames.join(" ")}>
            {text}
        </div>
    }
    toasts.push({
        elem: getElem(), 
        id: id
    })
    forceUpdate()
    setTimeout(() => {
        classNames.push("closing")
        toasts.find(e => e.id === id).elem = getElem()
        forceUpdate()
        setTimeout(() => {
            toasts.splice(toasts.findIndex(e => e.id === id), 1)
            forceUpdate()
        }, 300);
    }, options.timeout || 3000);
}