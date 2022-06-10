import { useEffect, useState } from "react";
import viteApiClient, { TokenDetailResult } from "../clients/vite-api.client";

export default function useTokenDetails(tokenId: string):{
    type: "loading"|"ready"|"error",
    details: TokenDetailResult
}{
    const [details, setDetails] = useState({
        details: null,
        type: "loading"
    })

    useEffect(() => {
        setDetails({
            details: null,
            type: "loading"
        })
        let cancel = false
        viteApiClient.getTokenDetailAsync(tokenId)
        .then(details => {
            if(cancel)return
            setDetails({
                details: details,
                type: "ready"
            })
        }).catch((err) => {
            console.error(err)
            if(cancel)return
            setDetails({
                details: err,
                type: "error"
            })
        })
        return () => {
            cancel = true
        }
    }, [tokenId])

    return details as any
}