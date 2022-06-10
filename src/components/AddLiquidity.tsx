/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Box, Typography, Divider, Button, Skeleton, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { contracts } from "../constants";
import useNetwork from "../hooks/useNetwork";
import usePairs from "../hooks/usePairs";
import useTokenDetails from "../hooks/useTokenDetails";
import useTokenInfo from "../hooks/useTokenInfos";
import { AMOUNT_REGEXP } from "../utils";
import TokenSelect from "./TokenSelect";
import AddIcon from '@mui/icons-material/Add';
import { SwapAmount } from "./SwapAmount";
import { defaultToken } from "../vite";
import BigNumber from "bignumber.js";
import useLiquidity from "../hooks/useLiquidity";
import useViteConnect, { ViteConnectStateType } from "../hooks/useViteConnect";
import { openViteConnect } from "./Navbar";
import events from "../events";
import { closeLayer, pushLayer } from "../layers";
import Modal from "../layers/Modal";
import AddLiquidityModal from "./AddLiquidityModal";
import SwapBalance from "./SwapBalance";

export default function AddLiquidity(){
    const network = useNetwork()
    const pairs = usePairs()
    const from = defaultToken
    const [to, setTo] = useState(contracts[network].v1.defaultTargetToken)
    const tokenInfos = useTokenInfo()
    const fromToken = tokenInfos.get(from)
    const toToken = tokenInfos.get(to)
    const fromDetails = useTokenDetails(from)
    const toDetails = useTokenDetails(to)
    const [amount0, setAmount0] = useState(null)
    const [amount1, setAmount1] = useState(null)
    const [refresh, setRefreshRate] = useState(0)
    const [lastModified, setLastModified] = useState(null)
    const liquidity1 = useLiquidity(to, refresh)
    const viteconnect = useViteConnect()
    const loaded = pairs.has(to) && 
        (fromToken && toToken)
    const loaded2 = loaded && 
        liquidity1
    // listen for liquidity changes
    useEffect(() => {
        if(lastModified == null)return
        let listener = () => {
            setRefreshRate(e => e + 1)
        }
        events.on(`RATE_CHANGE_${to}`, listener)
        return () => {
            events.off(`RATE_CHANGE_${to}`, listener)
        }
    }, [from, to, lastModified])
    useEffect(() => {
        if(!amount0 || !AMOUNT_REGEXP.test(amount0))return
        if(lastModified !== 0)return
        if(!liquidity1 || liquidity1.totalVITE === "0")return
        // amount0 is the vite
        setAmount1(new BigNumber(liquidity1.total)
        .div(liquidity1.totalVITE)
        .times(amount0)
        .shiftedBy(fromToken.decimals)
        .shiftedBy(-toToken.decimals)
        .decimalPlaces(toToken.decimals)
        .toFixed())
    }, [amount0, refresh, liquidity1])
    useEffect(() => {
        if(!amount1 || !AMOUNT_REGEXP.test(amount1))return
        if(lastModified !== 1)return
        if(!liquidity1 || liquidity1.totalVITE === "0")return
        setAmount0(new BigNumber(liquidity1.totalVITE)
        .div(liquidity1.total)
        .times(amount1)
        .shiftedBy(toToken.decimals)
        .shiftedBy(-fromToken.decimals)
        .decimalPlaces(fromToken.decimals)
        .toFixed())
    }, [amount1, refresh, liquidity1])
    return <>
        <Box css={{
            marginBottom: 10
        }}>
            <Typography variant="h5">
                Liquidity
            </Typography>
            <Typography variant="caption">
                Add liquidity to a pool
            </Typography>
        </Box>
        <Divider />
        {liquidity1?.totalVITE === "0" && <Alert severity="warning">You're the first one providing liquidity. You need to set the rate yourself. Please set an appropriate rate or other traders might profit from the low/high price.</Alert>}
        <Box css={{
            marginTop: 10
        }}>
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
                        disableNative={true}
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
                    }} ticker={toToken.tokenSymbol} /> : <Skeleton variant="rectangular" height={56}/>}
                    <SwapBalance address={viteconnect[0].accounts?.[0]} setAmount={(amount)=>{
                        setLastModified(1)
                        setAmount1(new BigNumber(amount).shiftedBy(-toToken.decimals).toFixed())
                    }} tokenId={to} decimals={toToken?.decimals || 0}/>
                </Box>
            </Box>
            <Box css={{
                marginTop: 10,
                marginBottom: 10
            }}>
                <AddIcon color="primary"/>
            </Box>
            {/** token0 */}
            <Box>
                <Box>
                    {loaded ? 
                    <TokenSelect
                        details={fromDetails.details}
                        tokenId={from}
                        setToken={() => {}}
                        disabled={true} /> : <>
                        <Skeleton variant="rectangular" height={56}></Skeleton>
                    </>}
                </Box>
                <Box css={{
                    marginTop: 10
                }}>
                    {loaded2 ? <SwapAmount amount={amount0} setAmount={(amount) => {
                        setLastModified(0)
                        setAmount0(amount)
                    }} ticker={fromToken.tokenSymbol}/> : <Skeleton variant="rectangular" height={56}/>}
                    <SwapBalance address={viteconnect[0].accounts?.[0]} setAmount={(amount)=>{
                        setLastModified(0)
                        setAmount0(new BigNumber(amount).shiftedBy(-fromToken.decimals).toFixed())
                    }} tokenId={from} decimals={fromToken?.decimals || 0}/>
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
        </Box>
        <Divider css={{
            marginTop: 10,
            marginBottom: 10
        }} />
        <Box>
            <Button css={{
                width: "100%"
            }} disabled={
                !(
                    loaded2 && 
                    AMOUNT_REGEXP.test(amount0) && 
                    AMOUNT_REGEXP.test(amount1)
                )
            } onClick={async () => {
                if(viteconnect[1] !== ViteConnectStateType.READY){
                    openViteConnect()
                }else{
                    pushLayer(<Modal key="layer-add-liquidity" close={() => {
                        closeLayer("layer-add-liquidity")
                    }}>
                        <AddLiquidityModal close={() => {
                            closeLayer("layer-add-liquidity")
                        }} amount={
                            new BigNumber(amount1)
                            .shiftedBy(toToken.decimals)
                            .decimalPlaces(0)
                        } vite={
                            new BigNumber(amount0)
                            .shiftedBy(fromToken.decimals)
                            // add a small slippage because of precision
                            .times("1.001")
                            .decimalPlaces(0)
                        } token={to} first={liquidity1.totalVITE === "0"} />
                    </Modal>)
                }
            }}>
                {viteconnect[1] === ViteConnectStateType.READY ? "Add Liquidity" : "Connect Wallet"}
            </Button>
        </Box>
    </>
}