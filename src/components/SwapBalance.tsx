/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Button, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { client } from "../vite"

export default function SwapBalance(props:{
    address: string,
    setAmount: (amount: string) => void,
    tokenId: string,
    decimals: number,
    fetchBalance?(address:string, tokenId: string):Promise<string>
}){
    const [balance, setBalance] = useState(null)
    useEffect(() => {
        setBalance(null)
        if(!props.address)return
        let cancel = false
        if(props.fetchBalance){
            props.fetchBalance(props.address, props.tokenId)
            .then(balance => {
                if(cancel)return
                setBalance(balance)
            })
        }else{
            client.methods.ledger.getAccountInfoByAddress(props.address)
            .then(accountInfo => {
                if(cancel)return
                const balance = accountInfo.balanceInfoMap?.[props.tokenId]?.balance || "0"
                setBalance(balance)
            })
        }
        return () => {
            cancel = true
        }
    }, [props.address, props.tokenId])
    if(!balance)return null

    return <div css={{
        display: "flex",
        flexDirection: "row"
    }}>
        <div css={{
            flexGrow: 1
        }}></div>
        <div>
            <Button onClick={() => {
                props.setAmount(balance)
            }}>
                <Typography variant="caption">
                    Balance: {new BigNumber(balance).shiftedBy(-props.decimals).precision(6).toFixed()}
                </Typography>
            </Button>
        </div>
    </div>
}