import { useEffect, useState } from "react";
import events from "../events";
import { contract } from "../vite";

export default function usePairCreationFee(){
    const [fee, setFee] = useState(null)
    useEffect(() => {
        let cancel = false
        contract.methods.PAIR_CREATION_FEE.call([])
        .then(([,result]) => {
            if(cancel)return
            setFee(result.raw[0])
        })
        const listener = (fee) => {
            setFee(fee)
        }
        events.on("PAIR_CREATION_FEE_CHANGE", listener)
        return () => {
            cancel = true
            events.off("PAIR_CREATION_FEE_CHANGE", listener)
        }
    }, [])
    return fee
}