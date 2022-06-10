/** @jsx jsx */
import { jsx } from "@emotion/react"
import { ReactNode } from "react"
import useMobile from "../hooks/useMobile"
import darkTheme from "../themes/dark"
import useWindowSize from "../hooks/useWindowSize"

export default function Modal(props:{children: ReactNode, close: ()=>void, className?: string}):JSX.Element{
    const isMobile = useMobile()
    const windowSize = useWindowSize()

    return <div css={{
        width: windowSize[0],
        height: windowSize[1],
        background: "rgba(0, 0, 0, 0.4)",
        position: "absolute",
        top: document.documentElement.scrollTop,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
    }}>
        <div css={{
            textAlign: "center",
            ...(isMobile ? {
                width: "100%",
                backgroundColor: darkTheme.palette.secondary.main,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            } : {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            })
        }} onClick={() => {
            if(isMobile)return
            props?.close()
        }}>
            {
                !isMobile ? <div css={{
                    borderRadius: "8px",
                    backgroundColor: darkTheme.palette.secondary.main,
                    padding: "20px"
                }} onClick={ev => {
                    ev.stopPropagation()
                }}>
                    {props.children}
                </div> : <div>
                    {props.children}
                </div>
            }
        </div>
    </div>
}