import { IStockExchangeProvider } from "./IStockExchangeProvider";
import { StockExchangeProvider } from "./StockExchangeProvider";

const StockExchangeService: IStockExchangeProvider = new StockExchangeProvider();

export default StockExchangeService;