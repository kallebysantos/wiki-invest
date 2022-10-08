export type IStockDividend = {
  value: number
  paymentDate: Date
  exDividendDate: Date
}

export type IStock = {
  ticker: string
  type: string
  price: number
  dividends: IStockDividend[]
}

export interface IStockExchangeProvider {
  getStockInfo(searchTicker: string): Promise<IStock>
}