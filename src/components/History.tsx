/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Box, Divider, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import useViteConnect from "../hooks/useViteConnect"
import { useVmLogs } from "../hooks/useVmLogs"
import { contract, getTokenTicker } from "../vite"
import * as vite from "@vite/vitejs"
import React, { useMemo } from "react"
import useTokenInfo from "../hooks/useTokenInfos"
import BigNumber from "bignumber.js"

export default function History(props:{
    close:()=>void
}){
    const [wallet] = useViteConnect()
    if(!wallet){
        props.close()
        return null
    }
    const logs = useVmLogs<{
        _address: string,
        fromToken: string,
        toToken: string,
        fromAmount: string,
        toAmount: string
    }>(contract.abi, "Swap", [[
        vite.abi.encodeParameter("address", wallet.accounts[0])
    ]])

    const tokenInfos = useTokenInfo()
    
    const displayData = useMemo(() => {
        return logs.map(log => {
            const fromToken = tokenInfos.get(log.data.fromToken)
            const toToken = tokenInfos.get(log.data.toToken)
            const hash = log.log.accountBlockHash
            const hash_shortened = `${hash.slice(0, 6)}...${hash.slice(-6)}`
            const fromTokenTicker = getTokenTicker(fromToken?.tokenSymbol || log.data.fromToken, fromToken?.index || 0)
            const toTokenTicker = getTokenTicker(toToken?.tokenSymbol || log.data.toToken, toToken?.index || 0)
            return {
                hash: hash,
                display_hash: <Link target="_blank" rel="noopener" href={`https://vitcscan.com/tx/${hash}`}>{hash_shortened}</Link>,
                from_amount: <>{new BigNumber(log.data.fromAmount)
                    .shiftedBy(-(fromToken.decimals || 0))
                    .toFixed()} <Link target="_blank" rel="noopener" href={`https://vitescan.com/token/${log.data.fromToken}`}>
                    {
                        fromToken?.tokenName || log.data.fromToken
                    } ({fromTokenTicker})
                </Link></>,
                to_amount: <>{new BigNumber(log.data.toAmount)
                    .shiftedBy(-(toToken.decimals || 0))
                    .toFixed()} <Link target="_blank" rel="noopener" href={`https://vitescan.com/token/${log.data.toToken}`}>
                    {
                        toToken?.tokenName || log.data.toToken
                    } ({toTokenTicker})
                </Link></>
            }
        })
    }, [tokenInfos, logs])

    console.log(displayData)

    return <Box css={{
        margin: 20
    }}>
        <div css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        }}>
            <Typography variant="h5">
                Past Trades
            </Typography>
        </div>
        <Divider css={{
            marginTop: 20,
            marginBottom: 20
        }} />
        {logs.length ? <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Tx Hash
                            </TableCell>
                            <TableCell>
                                Input
                            </TableCell>
                            <TableCell>
                                Output
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayData.map(row => {
                            return <TableRow key={row.hash}>
                                <TableCell>
                                    {row.display_hash}
                                </TableCell>
                                <TableCell>
                                    {row.from_amount}
                                </TableCell>
                                <TableCell>
                                    {row.to_amount}
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </> : <>
            <Typography>
                No trades yet
            </Typography>
        </>}
    </Box>
}