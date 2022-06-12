/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Box, Typography, Divider, Button, Skeleton, Alert } from "@mui/material";
import React, { useState } from "react";
import usePairs from "../hooks/usePairs";
import useTokenDetails from "../hooks/useTokenDetails";
import useTokenInfo from "../hooks/useTokenInfos";
import { getTokenSymbolFull } from "../utils";
import TokenSelect from "./TokenSelect";
import BigNumber from "bignumber.js";
import useViteConnect, { ViteConnectStateType } from "../hooks/useViteConnect";
import { openViteConnect } from "./Navbar";
import * as vite from "@vite/vitejs"
import usePairCreationFee from "../hooks/usePairCreationFee";
import { contract, defaultToken } from "../vite";
import { showToast } from "../layers/Toasts";
import { hiddenTokens } from "../constants";

export default function CreatePair(){
    const pairs = usePairs()
    const tokenInfos = useTokenInfo()
    const [token, setToken] = useState(() => {
        return [...tokenInfos.entries()].find(e => {
            return !pairs.has(e[0])
        })[1].tokenId
    })
    const tokenInfo = tokenInfos.get(token)
    const defaultTokenInfo = tokenInfos.get(defaultToken)
    const tokenDetails = useTokenDetails(token)
    const viteconnect = useViteConnect()
    const [disabled, setDisabled] = useState(false)
    const pairCreationFee = usePairCreationFee()
    const loaded = !!tokenInfo
    // listen for liquidity changes
    return <>
        <Box css={{
            marginBottom: 10
        }}>
            <Typography variant="h5">
                Create Pair
            </Typography>
            <Typography variant="caption">
                Create a pair for your token.
            </Typography>
        </Box>
        <Divider />
        <Alert severity="warning">Please note that for trading, you will have to provide liquidity.</Alert>
        <Box css={{
            marginTop: 10
        }}>
            {/** token1 */}
            <Box>
                <Box>
                    {loaded ? 
                    <TokenSelect
                        details={tokenDetails.details}
                        tokenId={token}
                        setToken={(tokenId) => {
                            setToken(tokenId)
                        }}
                        disabled={disabled} 
                        disableNative={true}
                        noPairs={true}
                        exclude={hiddenTokens}
                    /> : <>
                        <Skeleton variant="rectangular" height={56}></Skeleton>
                    </>}
                </Box>
            </Box>
            <Box css={{
                marginTop: 10
            }}>
                <Typography>
                    Pair Creation Fee:
                </Typography>
                <Typography color="Highlight">
                    {pairCreationFee && new BigNumber(pairCreationFee)
                    .shiftedBy(-defaultTokenInfo.decimals)
                    .toFixed() + " " + getTokenSymbolFull(defaultTokenInfo.tokenSymbol, defaultTokenInfo.index) || "Loading..."}
                </Typography>
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
                disabled || !pairCreationFee
            } onClick={async () => {
                if(viteconnect[1] !== ViteConnectStateType.READY){
                    openViteConnect()
                }else{
                    const block = vite.accountBlock.createAccountBlock("send", {
                        address: viteconnect[0].accounts[0],
                        tokenId: defaultToken,
                        amount: new BigNumber(pairCreationFee),
                        toAddress: contract.address,
                        data: contract.methods.createNewPair.encodeCall([
                            token
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
                    showToast("Pair Created!", {
                        type: "success",
                        timeout: 3000,
                        icon: true
                    })
                    setDisabled(false)
                    await new Promise(r=>setTimeout(r,3000))
                    window.location.reload()
                }
            }}>
                {viteconnect[1] === ViteConnectStateType.READY ? "Create Pair" : "Connect Wallet"}
            </Button>
        </Box>
    </>
}