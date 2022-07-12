import { TokenInfo } from "web3-vite";
import { tokenInfos } from "../vite";
import useEvent from "./useEvent";

export default function useTokenInfo():Map<string, TokenInfo>{
    return useEvent("TOKEN_INFOS_UPDATE", tokenInfos)
}

export function useSpecificTokenInfo(token:string):Partial<TokenInfo>{
    return useEvent(`TOKEN_INFOS_UPDATE_${token}`, tokenInfos.get(token) || {
        tokenSymbol: token,
        index: 0,
        decimals: 0
    })
}