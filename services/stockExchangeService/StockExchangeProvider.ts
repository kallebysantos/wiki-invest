import { IStock, IStockExchangeProvider } from "./IStockExchangeProvider";

export class StockExchangeProvider implements IStockExchangeProvider {

  constructor() {

  }

  getStockInfo(searchTicker: string): Promise<IStock> {
    throw new Error("Method not implemented.");
  }
}