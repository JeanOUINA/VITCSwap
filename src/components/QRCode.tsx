/** @jsx jsx */
import { jsx } from "@emotion/react"
import React from "react"
import qrcode from "qrcode"
import Loading from "./Loading"
import { showToast } from "../layers/Toasts"
import lightTheme from "../themes/light"

export default function QRCode(props:{
    text: string, 
    className?: string,
    size?: number
}){
    const colors = lightTheme
    const [url, setURL] = React.useState(null)
    React.useEffect(() => {
        let cancel = false
        qrcode.toDataURL(props.text, {
            color: {
                dark: colors.palette.common.black,
                light: colors.palette.background.default
            },
            scale: 10
        }, (err, url) => {
            if(cancel)return
            if(err !== null){
                console.error(err)
                showToast("Couldn't generate a qrcode.", {
                    type: "error",
                    icon: true
                })
                return
            }
            return setURL(url)
        })
        return () => {
            cancel = true
            setURL(null)
        }
    }, [props.text])
    if(!url)return <Loading/>
    
    return <img 
        src={url} 
        className={props.className||""} 
        draggable={false}
        width={props.size}
        height={props.size}
     />
}