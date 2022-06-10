import { useEffect, useState } from "react";
import { contract, defaultToken } from "../vite";

export default function useLiquidity(token: string, refresh = 0){
    const [liquidity, setLiquidity] = useState<{
        total: string,
        totalVITE: string,
        k: string,
        tknSupply: string,
        lpToken: string
    }>(null)
    useEffect(() => {
        setLiquidity(null)
        console.log(token, defaultToken)
        if(token == defaultToken)return
        let cancel = false
        contract.methods.getLiquidity.call([
            token
        ]).then(liquidity => {
            if(cancel)return
            setLiquidity(liquidity[1].map as any)
        })
        return () => {
            cancel = true
        }
    }, [token, refresh])
    return liquidity
}