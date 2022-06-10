/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import React, { useEffect, useMemo, useState } from "react"
import events from "../events"
import { useSpecificTokenInfo } from "../hooks/useTokenInfos"
import useViteConnect from "../hooks/useViteConnect"
import { getTokenSymbolFull } from "../utils"
import { contract, defaultToken } from "../vite"
import Loading from "./Loading"
import * as vite from "@vite/vitejs"
import { showToast } from "../layers/Toasts"

export default function AddLiquidityModal(props:{
    vite: BigNumber,
    amount: BigNumber,
    token: string
    close: () => void,
    first: boolean
}){
    const defaultTokenInfo = useSpecificTokenInfo(defaultToken)
    const tokenInfo = useSpecificTokenInfo(props.token)
    const [refreshBalance, setRefreshBalance] = useState(0)
    const [balance, setBalance] = useState(null)
    const viteconnect = useViteConnect()
    const [step, setStep] = useState(0)
    const steps = useMemo(() => {
        return [
            `Deposit ${getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)}`,
            `Deposit ${getTokenSymbolFull(tokenInfo.tokenSymbol, tokenInfo.index)}`,
            `Withdraw any ${getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)} left`
        ].map((label, i) => {
            return <Step key={i+""}>
                <StepLabel>
                    {label}
                </StepLabel>
            </Step>
        })
    }, [])
    const [disabled, setDisabled] = useState(false)
    useEffect(() => {
        if(!viteconnect[0].ready)return props.close()
    }, [viteconnect[1]])
    useEffect(() => {
        setBalance(null)
        if(!viteconnect[0].ready)return

        let cancel = false

        contract.methods.getVITEBalance.call([
            viteconnect[0].accounts[0]
        ]).then(balance => {
            if(cancel)return
            setBalance(balance[1].map.userBalance)
        }).catch(err => {
            console.error(err)
            setBalance("0")
        })

        return () => {
            cancel = true
        }
    }, [refreshBalance, viteconnect[1]])
    useEffect(() => {
        if(!viteconnect[0].ready)return

        const listener = () => {
            setRefreshBalance(e => e + 1)
        }

        const address = viteconnect[0].accounts[0]
        events.on(`VITE_BALANCE_UPDATE_${address}`, listener)
        return () => {
            events.off(`VITE_BALANCE_UPDATE_${address}`, listener)
        }
    }, [viteconnect[1]])

    let component = null
    switch(step){
        case 0: {
            const hasEnough = props.vite.isLessThanOrEqualTo(balance||0)
            const toDeposit = props.vite.minus(balance||0)
            // deposit vite
            component = !balance ? <Loading/> : <>
                <Typography>
                    {!hasEnough ? `Please deposit ${
                        toDeposit
                        .shiftedBy(-defaultTokenInfo.decimals)
                        .toFixed()
                    } ${getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)}` : "You have enough vite in the contract's balance to continue."}
                </Typography>

                <Button onClick={async () => {
                    if(hasEnough){
                        setStep(1)
                    }else{
                        const block = vite.accountBlock.createAccountBlock("send", {
                            address: viteconnect[0].accounts[0],
                            tokenId: defaultToken,
                            amount: toDeposit.toFixed(0),
                            toAddress: contract.address,
                            data: contract.methods.depositVITE.encodeCall([])
                        })
    
                        showToast("Please accept the transaction on your phone!", {
                            type: "info",
                            timeout: 3000,
                            icon: true
                        })
                        try{
                            await viteconnect[0].sendTransactionAsync({
                                block: block.accountBlock
                            })
                        }catch(err){
                            console.error(err)
                            showToast(`${err.name || err.code}: ${err.message}`, {
                                type: "error",
                                timeout: 5000,
                                icon: true
                            })
                            return
                        }
                        showToast("Deposit Request sent!", {
                            type: "success",
                            timeout: 1000,
                            icon: true
                        })
                    }
                }}>
                    {hasEnough ? "Continue" : `Deposit ${getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)}`}
                </Button>
            </>
            break
        }
        case 1: {
            // add token liquidity
            component = !balance ? <Loading/> : <>
            <Typography>
                Please deposit {
                    props.amount
                    .shiftedBy(-tokenInfo.decimals)
                    .toFixed()
                } {getTokenSymbolFull(tokenInfo.tokenSymbol, tokenInfo.index)}
            </Typography>

            <Button disabled={disabled} onClick={async () => {
                try{
                setDisabled(true)
                const block = vite.accountBlock.createAccountBlock("send", {
                    address: viteconnect[0].accounts[0],
                    tokenId: props.token,
                    amount: props.amount.toFixed(0),
                    toAddress: contract.address,
                    data: !props.first ? 
                        contract.methods.addLiquidity.encodeCall([]) :
                        contract.methods.addOriginalLiquidity.encodeCall([
                            props.vite.toFixed(0)
                        ])
                })
                console.log(block.accountBlock)

                showToast("Please accept the transaction on your phone!", {
                    type: "info",
                    timeout: 3000,
                    icon: true
                })
                try{
                    await viteconnect[0].sendTransactionAsync({
                        block: block.accountBlock
                    })
                }catch(err){
                    console.error(err)
                    showToast(`${err.name || err.code}: ${err.message}`, {
                        type: "error",
                        timeout: 5000,
                        icon: true
                    })
                    setDisabled(false)
                    return
                }
                showToast("Liquidity Request sent!", {
                    type: "success",
                    timeout: 1000,
                    icon: true
                })
                await new Promise(r=>setTimeout(r,2000))
                setDisabled(false)
                setStep(2)
                }catch(err){
                    console.error(err)
                }
            }}>
                Deposit {getTokenSymbolFull(tokenInfo.tokenSymbol, tokenInfo.index)}
            </Button>
        </>
            break
        }
        case 2: {
            const hasDvite = new BigNumber(balance || "0").isGreaterThan(0)
            const dvite = new BigNumber(balance)
            component = !balance ? <Loading /> : <>
                <Typography>
                    {hasDvite ?
                    `You have ${
                        dvite.shiftedBy(-defaultTokenInfo.decimals).toFixed()
                    } ${
                        getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)
                    } available to withdraw.` : `You don't have anything to withdraw.`}
                </Typography>

                <Button disabled={disabled} onClick={async () => {
                    if(!hasDvite){
                        props.close()
                    }else{
                        setDisabled(true)
                        const block = vite.accountBlock.createAccountBlock("send", {
                            address: viteconnect[0].accounts[0],
                            tokenId: defaultToken,
                            amount: "0",
                            toAddress: contract.address,
                            data: contract.methods.withdrawVITE.encodeCall([
                                balance
                            ])
                        })
    
                        showToast("Please accept the transaction on your phone!", {
                            type: "info",
                            timeout: 3000,
                            icon: true
                        })
                        try{
                            await viteconnect[0].sendTransactionAsync({
                                block: block.accountBlock
                            })
                        }catch(err){
                            console.error(err)
                            showToast(`${err.name || err.code}: ${err.message}`, {
                                type: "error",
                                timeout: 5000,
                                icon: true
                            })
                            setDisabled(false)
                            return
                        }
                        showToast("Withdrawal Request sent!", {
                            type: "success",
                            timeout: 1000,
                            icon: true
                        })
                        props.close()
                    }
                }}>
                    {hasDvite ? 
                    `Withdraw ${getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index)}` : 
                    `Continue`}
                </Button>
            </>
            break
        }
    }
    return <>
        <Stepper activeStep={step}>
            {steps}
        </Stepper>
        <Box css={{
            marginTop: 20
        }}>
            {component}
        </Box>
    </>
}