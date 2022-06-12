import { Network } from "./stores/NetworkStore"
import * as vite from "@vite/vitejs"

export const colors = {
    Yellow: "#fff714",
    Red: "red",
    Blue: "#03b1fc",
    Green: "#1fa800"
}
export const klinesDurations = {
    "1m": 60,
    "3m": 3*60,
    "5m": 5*60,
    "15m": 15*60,
    "30m": 30*60,
    "1h": 60*60,
    "2h": 2*60*60,
    "4h": 4*60*60,
    "6h": 6*60*60,
    "8h": 8*60*60,
    "12h": 12*60*60,
    "1d": 24*60*60,
    "3d": 3*24*60*60,
    "1w": 7*24*60*60,
    "1mo": 30*24*60*60
}
export const klinesNames:{
    [e in keyof typeof klinesDurations]?: string
} = {
    "1mo": "1M"
}

export const hiddenTokens = new Set<string>([
    // KNOBSACK-000 (migrated to 001)
    "tti_17570072c7f919933963dfac",
    // BAN-000 (has reputation of bad operator, can unhide if asked)
    "tti_61f59e574f9f7babfe8908e5",
    // WBAN-000 (not used)
    "tti_4c4c64ea317db97d834cfc95",
    // Best Of Medical (scam)
    "tti_e463f70868334ebd591cff80",
    // Bananoman's BENIS
    "tti_4e9c1e66718021edf8e7604e",
    // Fake BTC
    "tti_d332d6978dfa5e2de16b8f43",
    // Bananoman's BussyCoin
    "tti_7c6f76ec3db1c8de0bcbda97",
    // Wrong EOS-000
    "tti_dfbe54e70bf02ea50f8c7da7",
    // Wrong EOS-002
    "tti_1627456b5d735ff5a38bd57a",
    // Wrong EOS-001
    "tti_f75d27e3303af7c89d5aa3d7",
    // Wrong EPIC-000
    "tti_76258c5f9da1e7d3faeb0937",
    // Wrong EPIC-001
    "tti_76258c5f9da1e7d3faeb0937",
    // Bananoman's FUCK
    "tti_b10c254ddb5dc0e939aa22b0",
    // Wrong FRM-000
    "tti_c573f15a6d56c58f88457e31",
    // Wrong ONE-000
    "tti_ccafb1cccca4469271d00241",
    // Wrong LTC-000
    "tti_4aa4bfa14bb4c3a0e40d2d49",
    // Wrong LTC-001
    "tti_b62165bd5c933a54957cbe8a",
    // Wrong LRC-001
    "tti_4a00783d54d541007825a1e5",
    // Wrong LRC-000
    "tti_25e5f191cbb00a88a6267e0f",
    // Old NYA-000
    "tti_57ed765fed9121e382efbf54",
    // Wrong LUNA-000
    "tti_98dcd9b770f09bfde9fb1675",
    // Wrong LUNA-001
    "tti_3ee91c8608645279d9fae62f",

])

export const tokenList = {}
export interface Token {
    id: string,
    name: string,
    decimals: number,
    symbol: string,
    index: number
}
export const contracts:{
    [key in Network]?: {
        [key in "v1"]: {
            name: string,
            address: string,
            abi: any,
            defaultToken: string,
            defaultTargetToken: string
        }
    } 
} = {
    TESTNET: {
        v1: {
            name: "VITCSwap Testnet v1",
            address: "vite_1781e9de44d1560b863aeb172ce0cdf6d45e60333f3435168f",
            abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ustAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenTotal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ustTotal","type":"uint256"}],"name":"AddLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"addr","type":"address"}],"name":"DAOAddressChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"NewPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"sbpName","type":"string"}],"name":"NewVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"PairCreationFeeChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ustAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenTotal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ustTotal","type":"uint256"}],"name":"RemoveLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"USTDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"USTWithdrawal","type":"event"},{"anonymous":false,"inputs":[],"name":"VoteCancel","type":"event"},{"inputs":[{"internalType":"string","name":"sbpName","type":"string"}],"name":"VoteForSBP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ustAmount","type":"uint256"}],"name":"addOriginalLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"cancelVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"changePairCreationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"createNewPair","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositUST","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"from","type":"tokenId"},{"internalType":"tokenId","name":"to","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getCurrencyConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId","value":"tti_22d0b205bed4d268a05dfc3c"}],"name":"getLiquidity","outputs":[{"internalType":"uint256","name":"total","type":"uint256"},{"internalType":"uint256","name":"totalUST","type":"uint256"},{"internalType":"uint256","name":"k","type":"uint256"},{"internalType":"uint256","name":"tknSupply","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getUSTBalance","outputs":[{"internalType":"uint256","name":"userBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getUSTConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"poolAmount","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newAddress","type":"address"}],"name":"setDAOAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"to","type":"tokenId"}],"name":"swap","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawUST","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            defaultToken: "tti_52b1504ede29da8f929a46a1",
            defaultTargetToken: "tti_9173de99661a46e0bbb26c4e"
        }
    },
    MAINNET: {
        v1: {
            name: "VITCSwap Mainnet v1",
            address: "vite_32330d5a87cd31ca782071aff24eda7bfc89b02c44298c8088",
            abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"viteAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenTotal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"viteTotal","type":"uint256"}],"name":"AddLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"addr","type":"address"}],"name":"DAOAddressChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"NewPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"sbpName","type":"string"}],"name":"NewVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"PairCreationFeeChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"tokenId","name":"token","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"viteAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenTotal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"viteTotal","type":"uint256"}],"name":"RemoveLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":true,"internalType":"tokenId","name":"fromToken","type":"tokenId"},{"indexed":true,"internalType":"tokenId","name":"toToken","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"fromAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toAmount","type":"uint256"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":true,"internalType":"tokenId","name":"fromToken","type":"tokenId"},{"indexed":true,"internalType":"tokenId","name":"toToken","type":"tokenId"},{"indexed":false,"internalType":"uint256","name":"fromAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"total","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalVITE","type":"uint256"}],"name":"SwapInternal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"VITEDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"VITEWithdrawal","type":"event"},{"anonymous":false,"inputs":[],"name":"VoteCancel","type":"event"},{"inputs":[],"name":"DAO_ADDRESS","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NULL_TOKEN","outputs":[{"internalType":"tokenId","name":"","type":"tokenId"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAIR_CREATION_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"UINT256_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VITE_TOKEN","outputs":[{"internalType":"tokenId","name":"","type":"tokenId"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"sbpName","type":"string"}],"name":"VoteForSBP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"viteAmount","type":"uint256"}],"name":"addOriginalLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"tokenId","type":"tokenId"},{"internalType":"bool","name":"isReIssuable","type":"bool"},{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"}],"name":"cacheTokenInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"","type":"tokenId"}],"name":"cached_tokens","outputs":[{"internalType":"bool","name":"isReIssuable","type":"bool"},{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"bool","name":"fetched","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancelVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256","value":"0"}],"name":"changePairCreationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId","value":"tti_22d0b205bed4d268a05dfc3c"}],"name":"createNewPair","outputs":[],"stateMutability":"payable","type":"function","token":{"tokenName":"VITE","tokenSymbol":"VITE-000","totalSupply":"1039026646437347898832817249","decimals":18,"owner":"vite_0000000000000000000000000000000000000004d28108e76b","tokenId":"tti_5649544520544f4b454e6e40","maxSupply":"115792089237316195423570985008687907853269984665640564039457584007913129639935","ownerBurnOnly":false,"isReIssuable":true,"index":0,"isOwnerBurnOnly":false},"amount":"0"},{"inputs":[],"name":"depositVITE","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"from","type":"tokenId"},{"internalType":"tokenId","name":"to","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getCurrencyConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"from","type":"tokenId"},{"internalType":"tokenId","name":"to","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getInversedConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getInversedCurrencyConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getInversedVITEConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"getLiquidity","outputs":[{"internalType":"uint256","name":"total","type":"uint256"},{"internalType":"uint256","name":"totalVITE","type":"uint256"},{"internalType":"uint256","name":"k","type":"uint256"},{"internalType":"uint256","name":"tknSupply","type":"uint256"},{"internalType":"tokenId","name":"lpToken","type":"tokenId"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"getLiquidityTokenBalance","outputs":[{"internalType":"uint256","name":"lpBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getVITEBalance","outputs":[{"internalType":"uint256","name":"userBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getVITEConversion","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"","type":"tokenId"}],"name":"pairs","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"},{"internalType":"uint256","name":"poolAmount","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newAddress","type":"address"}],"name":"setDAOAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"setLiquidityToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"tokenId","name":"targetToken","type":"tokenId"},{"internalType":"uint256","name":"minimum","type":"uint256"}],"name":"swap","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"tokenId","name":"token","type":"tokenId"}],"name":"withdrawLiquidityToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawVITE","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            defaultToken: vite.constant.Vite_TokenId,
            defaultTargetToken: "tti_22d0b205bed4d268a05dfc3c"
        }
    }
}

export const NULL_TOKEN = "tti_000000000000000000004cfd"