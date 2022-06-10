/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Box, Typography, Divider, Button, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { contracts, hiddenTokens } from "../constants";
import useNetwork from "../hooks/useNetwork";
import usePairs from "../hooks/usePairs";
import useTokenDetails from "../hooks/useTokenDetails";
import useTokenInfo from "../hooks/useTokenInfos";
import { AMOUNT_REGEXP } from "../utils";
import TokenSelect from "./TokenSelect";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { SwapAmount } from "./SwapAmount";
import { contract, defaultToken } from "../vite";
import BigNumber from "bignumber.js";
import useLiquidity from "../hooks/useLiquidity";
import useViteConnect, { ViteConnectStateType } from "../hooks/useViteConnect";
import { openViteConnect } from "./Navbar";
import * as vite from "@vite/vitejs"
import { showToast } from "../layers/Toasts";
import events from "../events";
import SwapBalance from "./SwapBalance";
// import useChart from "../hooks/useChart";

export default function Swap(/*{
    chartRef
}:{
    chartRef: React.MutableRefObject<undefined>
}*/){
    const network = useNetwork()
    const pairs = usePairs()
    const [from, setFrom] = useState(contracts[network].v1.defaultToken)
    const [to, setTo] = useState(contracts[network].v1.defaultTargetToken)
    const tokenInfos = useTokenInfo()
    const fromToken = tokenInfos.get(from)
    const toToken = tokenInfos.get(to)
    const fromDetails = useTokenDetails(from)
    const toDetails = useTokenDetails(to)
    const [amount0, setAmount0] = useState(null)
    const [amount1, setAmount1] = useState(null)
    const [refreshRate, setRefreshRate] = useState(0)
    const [lastModified, setLastModified] = useState(null)
    const liquidity0 = useLiquidity(from)
    const liquidity1 = useLiquidity(to)
    const viteconnect = useViteConnect()
    const [disabled, setDisabled] = useState(false)
    const loaded = (pairs.has(from) && pairs.has(to)) && 
        (fromToken && toToken)
    const loaded2 = loaded && 
        (
            (from === defaultToken || liquidity0) && 
            (to === defaultToken || liquidity1)
        )
    // const candles = useChart(to, from, "6h")
    // simulate directly in the contract
    const getConversion = useCallback((amount: string) => {
        return contract.methods.getConversion.call([from, to, amount])
        .then((result) => {
            return result[1].map.returnAmount
        })
    }, [from, to])
    const getInversedConversion = useCallback((amount: string) => {
        return contract.methods.getInversedConversion.call([from, to, amount])
        .then((result) => {
            return result[1].map.returnAmount
        })
    }, [from, to])
    useEffect(() => {
        if(!amount0 || !AMOUNT_REGEXP.test(amount0))return
        if(lastModified !== 0)return
        let cancel = false
        getConversion(
            new BigNumber(amount0)
            .shiftedBy(fromToken.decimals)
            .toFixed(0)
        ).then(result => {
            if(cancel)return
            setAmount1(
                new BigNumber(result)
                .shiftedBy(-toToken.decimals)
                .precision(6)
                .toFixed()
            )
        }, (err) => {
            if(cancel)return
            console.error(err)
            setAmount1("An error occured")
        })
        return () => {
            cancel = true
        }
    }, [from, amount0, refreshRate])
    useEffect(() => {
        if(!amount1 || !AMOUNT_REGEXP.test(amount1))return
        if(lastModified !== 1)return
        let cancel = false
        getInversedConversion(
            new BigNumber(amount1)
            .shiftedBy(toToken.decimals)
            .toFixed(0)
        ).then(result => {
            if(cancel)return
            setAmount0(
                new BigNumber(result)
                .shiftedBy(-fromToken.decimals)
                .precision(6)
                .toFixed()
            )
        }, (err) => {
            if(cancel)return
            console.error(err)
            setAmount0("An error occured")
        })
        return () => {
            cancel = true
        }
    }, [to, amount1, refreshRate])
    useEffect(() => {
        if(lastModified == null)return
        const listener = () => {
            setRefreshRate(e => e + 1)
        }
        events.on(`RATE_CHANGE_${from}`, listener)
        events.on(`RATE_CHANGE_${to}`, listener)
        return () => {
            events.off(`RATE_CHANGE_${from}`, listener)
            events.off(`RATE_CHANGE_${to}`, listener)
        }
    }, [from, to, lastModified])

    return <>
        {/*<Portal container={chartRef.current}>
            <Chart data={candles || []}/>
        </Portal>*/}
        <Box css={{
            marginBottom: 10
        }}>
            <Typography variant="h5">
                Swap
            </Typography>
            <Typography variant="caption">
                Trade tokens in an instant
            </Typography>
        </Box>
        <Divider />
        <Box css={{
            marginTop: 10
        }}>
            {/** token0 */}
            <Box>
                <Box>
                    {loaded ? 
                    <TokenSelect
                        details={fromDetails.details}
                        tokenId={from}
                        setToken={(tokenId) => {
                            setFrom(tokenId)
                        }}
                        disabled={disabled}
                        exclude={hiddenTokens}
                    /> : <>
                        <Skeleton variant="rectangular" height={56}></Skeleton>
                    </>}
                </Box>
                <Box css={{
                    marginTop: 10
                }}>
                    {loaded2 ? <SwapAmount amount={amount0} setAmount={(amount) => {
                        setLastModified(0)
                        setAmount0(amount)
                    }} ticker={fromToken.tokenSymbol} disabled={disabled}/> : <Skeleton variant="rectangular" height={56}/>}
                    <SwapBalance address={viteconnect[0].accounts?.[0]} setAmount={(amount)=>{
                        setLastModified(0)
                        setAmount0(new BigNumber(amount).shiftedBy(-fromToken.decimals).toFixed())
                    }} tokenId={from} decimals={fromToken?.decimals || 0}/>
                </Box>
            </Box>
            <Box css={{
                marginTop: 10,
                marginBottom: 10
            }}>
                <Button onClick={() => {
                    setTo(from)
                    setFrom(to)
                    setLastModified(0)
                    setAmount1(amount0)
                    setAmount0(amount1)
                }} disabled={disabled}>
                    <CompareArrowsIcon css={{
                        transform: "rotate(-90deg)"
                    }}/>
                </Button>
            </Box>
            {/** token1 */}
            <Box>
                <Box>
                    {loaded ? 
                    <TokenSelect
                        details={toDetails.details}
                        tokenId={to}
                        setToken={(tokenId) => {
                            setTo(tokenId)
                        }}
                        disabled={disabled}
                        exclude={hiddenTokens}
                    /> : <>
                        <Skeleton variant="rectangular" height={56}></Skeleton>
                    </>}
                </Box>
                <Box css={{
                    marginTop: 10
                }}>
                    {loaded2 ? <SwapAmount amount={amount1} setAmount={(amount) => {
                        setLastModified(1)
                        setAmount1(amount)
                    }} ticker={toToken.tokenSymbol} disabled={disabled}/> : <Skeleton variant="rectangular" height={56}/>}
                </Box>
            </Box>
            {amount0 && AMOUNT_REGEXP.test(amount0) && amount1 && AMOUNT_REGEXP.test(amount1) ? 
                <Box css={{
                    marginTop: 10
                }}>
                    <Typography>
                        Rate:
                    </Typography>
                    <Typography color="ActiveCaption">{new BigNumber(amount0).div(amount1).precision(6).toFixed()} {fromToken.tokenSymbol} per {toToken.tokenSymbol}</Typography>
                </Box> : null        
            }
            <Box css={{
                marginTop: 10
            }}>
                <Typography>
                    Slippage Tolerance:
                </Typography>
                <Typography color="Highlight">0.5%</Typography>
            </Box>
        </Box>
        <Divider css={{
            marginTop: 10,
            marginBottom: 10
        }} />
        <Box>
            <Button css={{
                width: "100%"
            }} disabled={
                disabled || !(
                    loaded2 && 
                    AMOUNT_REGEXP.test(amount0) && 
                    AMOUNT_REGEXP.test(amount1)
                )
            } onClick={async () => {
                if(viteconnect[1] !== ViteConnectStateType.READY){
                    openViteConnect()
                }else{
                    const block = vite.accountBlock.createAccountBlock("send", {
                        address: viteconnect[0].accounts[0],
                        tokenId: from,
                        amount: new BigNumber(amount0)
                        .shiftedBy(fromToken.decimals)
                        .toFixed(0),
                        toAddress: contract.address,
                        data: contract.methods.swap.encodeCall([
                            viteconnect[0].accounts[0],
                            to,
                            new BigNumber(amount1)
                            .shiftedBy(toToken.decimals)
                            .times(0.995)
                            .toFixed(0)
                        ])
                    })

                    showToast("Please accept the transaction on your phone!", {
                        type: "info",
                        timeout: 3000,
                        icon: true
                    })
                    setDisabled(true)
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
                    setDisabled(false)
                    showToast("Swap request sent!", {
                        type: "success",
                        timeout: 1000,
                        icon: true
                    })
                }
            }}>
                {viteconnect[1] === ViteConnectStateType.READY ? "Trade" : "Connect Wallet"}
            </Button>
        </Box>
    </>
}