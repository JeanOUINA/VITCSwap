/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Box, Typography, Divider, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { contracts, NULL_TOKEN } from "../constants";
import useNetwork from "../hooks/useNetwork";
import usePairs from "../hooks/usePairs";
import useTokenDetails from "../hooks/useTokenDetails";
import useTokenInfo from "../hooks/useTokenInfos";
import { AMOUNT_REGEXP } from "../utils";
import TokenSelect from "./TokenSelect";
import AddIcon from "@mui/icons-material/Add";
import { SwapAmount } from "./SwapAmount";
import { contract, defaultToken } from "../vite";
import BigNumber from "bignumber.js";
import useLiquidity from "../hooks/useLiquidity";
import useViteConnect, { ViteConnectStateType } from "../hooks/useViteConnect";
import { openViteConnect } from "./Navbar";
import events from "../events";
import { DragHandle } from "@mui/icons-material";
import { TokenInfo } from "web3-vite";
import SwapBalance from "./SwapBalance";
import * as vite from "@vite/vitejs"
import { showToast } from "../layers/Toasts";

export default function RemoveLiquidity(){
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
    const [amount2, setAmount2] = useState(null)
    const [refresh, setRefreshRate] = useState(0)
    const [lastModified, setLastModified] = useState(null)
    const liquidity1 = useLiquidity(to, refresh)
    const viteconnect = useViteConnect()
    const [disabled, setDisabled] = useState(false)
    const loaded = pairs.has(to) && 
        (fromToken && toToken)
    const loaded2 = loaded && 
        liquidity1
    // listen for liquidity changes
    useEffect(() => {
        if(lastModified == null)return
        const listener = () => {
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
        // amount0 is the lp token
        setAmount1(new BigNumber(liquidity1.total)
        .div(liquidity1.tknSupply)
        .times(amount0)
        .shiftedBy(18)
        .decimalPlaces(0)
        .shiftedBy(-fromToken.decimals)
        .toFixed())
        setAmount2(new BigNumber(liquidity1.totalVITE)
        .div(liquidity1.tknSupply)
        .times(amount0)
        .shiftedBy(18)
        .decimalPlaces(0)
        .shiftedBy(-toToken.decimals)
        .toFixed())
    }, [amount0, refresh, liquidity1])
    useEffect(() => {
        if(!amount1 || !AMOUNT_REGEXP.test(amount1))return
        if(lastModified !== 1)return
        if(!liquidity1 || liquidity1.totalVITE === "0")return
        setAmount0(new BigNumber(liquidity1.tknSupply)
        .div(liquidity1.total)
        .times(amount1)
        .shiftedBy(fromToken.decimals)
        .decimalPlaces(0)
        .shiftedBy(-18)
        .toFixed())
        setAmount2(new BigNumber(liquidity1.totalVITE)
        .div(liquidity1.total)
        .times(amount1)
        .shiftedBy(fromToken.decimals)
        .decimalPlaces(0)
        .shiftedBy(-toToken.decimals)
        .toFixed())
    }, [amount1, refresh, liquidity1])
    useEffect(() => {
        if(!amount2 || !AMOUNT_REGEXP.test(amount2))return
        if(lastModified !== 2)return
        if(!liquidity1 || liquidity1.totalVITE === "0")return
        setAmount0(new BigNumber(liquidity1.tknSupply)
        .div(liquidity1.totalVITE)
        .times(amount2)
        .shiftedBy(toToken.decimals)
        .decimalPlaces(0)
        .shiftedBy(-18)
        .toFixed())
        setAmount1(new BigNumber(liquidity1.total)
        .div(liquidity1.totalVITE)
        .times(amount2)
        .shiftedBy(toToken.decimals)
        .decimalPlaces(0)
        .shiftedBy(-fromToken.decimals)
        .toFixed())
    }, [amount2, refresh, liquidity1])
    const lpTokenInfo:TokenInfo = {
        decimals: 18,
        index: 0,
        isOwnerBurnOnly: true,
        isReIssuable: true,
        maxSupply: "0",
        owner: contract.address,
        ownerBurnOnly: true,
        tokenId: "tti_lptokentti",
        tokenName: `${toToken.tokenSymbol}_${
            "0".repeat(3-toToken.index.toString().length)+toToken.index
        }-${fromToken.tokenSymbol} LP`,
        tokenSymbol: `${toToken.tokenSymbol}${fromToken.tokenSymbol}`,
        totalSupply: liquidity1?.tknSupply || "0"
    }
    return <>
        <Box css={{
            marginBottom: 10
        }}>
            <Typography variant="h5">
                Remove Liquidity
            </Typography>
            <Typography variant="caption">
                Withdraw your Liquidity position from a pool
            </Typography>
        </Box>
        <Divider />
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
                        disabled={disabled} 
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
                    }} ticker={toToken.tokenSymbol} disabled={disabled}/> : <Skeleton variant="rectangular" height={56}/>}
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
                        disabled={true}
                    /> : <>
                        <Skeleton variant="rectangular" height={56}></Skeleton>
                    </>}
                </Box>
                <Box css={{
                    marginTop: 10
                }}>
                    {loaded2 ? <SwapAmount amount={amount2} setAmount={(amount) => {
                        setLastModified(2)
                        setAmount2(amount)
                    }} ticker={fromToken.tokenSymbol} disabled={disabled}/> : <Skeleton variant="rectangular" height={56}/>}
                </Box>
            </Box>
            <Box css={{
                marginTop: 10,
                marginBottom: 10
            }}>
                <DragHandle color="primary"/>
            </Box>
            <Box>
                <Box>
                    {loaded2 ? 
                        <>
                            <TokenSelect
                                details={null}
                                tokenId={lpTokenInfo.tokenId}
                                setToken={() => {}}
                                disabled={true}
                                tokens={[lpTokenInfo]}
                                noPairs 
                            />
                        </> : <>
                            <Skeleton variant="rectangular" height={56}></Skeleton>
                        </>
                    }
                </Box>
                <Box css={{
                    marginTop: 10
                }}>
                    {loaded2 ? <>
                        <SwapAmount amount={amount0} setAmount={(amount) => {
                            setLastModified(0)
                            setAmount0(amount)
                        }} ticker={lpTokenInfo.tokenSymbol} disabled={disabled}/>
                        {
                            liquidity1.lpToken !== NULL_TOKEN ? 
                            <SwapBalance address={viteconnect[0].accounts?.[0]} setAmount={(amount)=>{
                                setLastModified(0)
                                setAmount0(new BigNumber(amount).shiftedBy(-18).toFixed())
                            }} tokenId={liquidity1.lpToken} decimals={18} /> : 
                            <SwapBalance address={viteconnect[0].accounts?.[0]} setAmount={(amount)=>{
                                setLastModified(0)
                                setAmount0(new BigNumber(amount).shiftedBy(-18).toFixed())
                            }} tokenId={liquidity1.lpToken} decimals={18} fetchBalance={async (address) => {
                                return contract.methods.getLiquidityTokenBalance.call([address, to])
                                .then(e => e[1].map.lpBalance || "0")
                            }}/>
                        }
                    </> : <Skeleton variant="rectangular" height={56}/>}
                </Box>
            </Box>
            {amount0 && AMOUNT_REGEXP.test(amount0) && amount1 && AMOUNT_REGEXP.test(amount1) ? 
                <Box css={{
                    marginTop: 10
                }}>
                    <Typography>
                        Rate:
                    </Typography>
                    <Typography color="Highlight">{new BigNumber(amount0).div(amount1).precision(6).toFixed()} {fromToken.tokenSymbol} per {toToken.tokenSymbol}</Typography>
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
                        tokenId: liquidity1.lpToken === NULL_TOKEN ? 
                            vite.constant.Vite_TokenId :
                            liquidity1.lpToken,
                        amount: liquidity1.lpToken === NULL_TOKEN ? 
                            "0" :
                            new BigNumber(amount0)
                            .shiftedBy(18)
                            .toFixed(0),
                        toAddress: contract.address,
                        data: contract.methods.removeLiquidity.encodeCall([
                            to,
                            new BigNumber(amount0)
                            .shiftedBy(18)
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
                    showToast("Remove Liquidity request sent!", {
                        type: "success",
                        timeout: 1000,
                        icon: true
                    })
                }
            }}>
                {viteconnect[1] === ViteConnectStateType.READY ? "Remove Liquidity" : "Connect Wallet"}
            </Button>
        </Box>
    </>
}