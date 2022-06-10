import { callViteApi } from "../api"

export type TokenDetailResult = {
  name: string
  symbol: string
  originalSymbol: string
  tokenDecimals: number
  urlIcon: string
}
export type LPTokenValue = {
  contractAddress: string,
  tokenId: string,
  supply: string,
  usd: string,
  tokens: {
    contractAddress: string,
    tokenId: string,
    usd: string,
    total: string,
    amount: string,
    price: string
  }[]
}

export class ViteAPIClient {
  async getTokenDetailAsync(tokenId: string): Promise<TokenDetailResult> {
    const data = await callViteApi(`/crypto-info/tokens/${tokenId}/details`)
    return data.data
  }
}

export default new ViteAPIClient();