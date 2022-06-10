import { useEffect, useState } from "react"
import wallet, { ViteConnect } from "../wallet"
import useForceUpdate from "./useForceUpdate"

export enum ViteConnectStateType {
    CLOSED = "CLOSED",
    CONNECT = "CONNECT",
    READY = "READY"
}

export default function useViteConnect():[ViteConnect, ViteConnectStateType]{
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        const forceUpdateListener = () => {
            forceUpdate()
        }
        wallet.on("ready", forceUpdateListener)
        wallet.on("close", forceUpdateListener)
        wallet.on("newSession", forceUpdateListener)
        return () => {
            wallet.off("ready", forceUpdateListener)
            wallet.off("close", forceUpdateListener)
            wallet.off("newSession", forceUpdateListener)
        }
    }, [])
    return [
        wallet, 
        wallet.ready ? 
            ViteConnectStateType.READY :
            wallet.readyConnect ? 
                ViteConnectStateType.CONNECT :
                ViteConnectStateType.CLOSED
    ]
}