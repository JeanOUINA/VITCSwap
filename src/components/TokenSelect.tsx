/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { MenuItem, Select } from "@mui/material"
import { useMemo } from "react"
import { TokenInfo } from "web3-vite"
import { TokenDetailResult } from "../clients/vite-api.client"
import usePairs from "../hooks/usePairs"
import useTokenInfo from "../hooks/useTokenInfos"
import { getTokenSymbolFull } from "../utils"
import { defaultToken } from "../vite"
import TokenIcon from "./TokenIcon"

export default function TokenSelect(props:{
    details: TokenDetailResult,
    tokenId: string,
    setToken(tokenId: string):void,
    disabled?: boolean,
    disableNative?: boolean,
    noPairs?: boolean,
    tokens?: TokenInfo[],
    exclude?: Set<string>
}){
    let tokenInfos = useTokenInfo()
    const customTokenInfos = useMemo(() => {
        if(!props.tokens)return new Map()
        return new Map(props.tokens.map(token => {
            return [token.tokenId, token]
        }))
    }, props.tokens || [])
    if(props.tokens)tokenInfos = customTokenInfos

    const pairs = usePairs()
    return <div css={{
        display: "flex",
        gap: 10
    }}>
        <div css={{
            flexGrow: 100
        }}>
            <Select
                value={props.tokenId}
                onChange={(ev) => {
                    props.setToken(ev.target.value)
                }}
                css={{
                    width: "100%"
                }}
                disabled={props.disabled}
            >
                {[...(props.noPairs ? tokenInfos.keys() : pairs)].filter(token => {
                    return !(props.exclude || new Set()).has(token)
                }).sort((a, b) => {
                    const tokena = tokenInfos.get(a)
                    const tokenb = tokenInfos.get(b)
                    if(tokena && tokenb){
                        return getTokenSymbolFull(tokena.tokenSymbol, tokena.index).localeCompare(
                            getTokenSymbolFull(tokenb.tokenSymbol, tokenb.index)
                        )
                    }else if(!tokena && !tokenb){
                        return 0
                    }else return !tokena ? -1 : 1
                }).map(tokenId => {
                    if(props.disableNative && defaultToken === tokenId)return null
                    if(props.noPairs && pairs.has(tokenId))return null
                    const token = tokenInfos.get(tokenId)
                    // might happen if the pair is created but the token doesn't exist
                    if(!token)return null
                    return <MenuItem
                        key={token.tokenId}
                        value={token.tokenId}
                    >{getTokenSymbolFull(token.tokenSymbol, token.index)} ({token.tokenName})</MenuItem>
                })}
            </Select>
        </div>
        {props.details?.urlIcon ? <div>
            <TokenIcon iconURL={props.details?.urlIcon} />
        </div> : null}
    </div>
}