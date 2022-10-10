import { NextApiRequest, NextApiResponse } from "next"
import StockExchangeService from "../../../services/stockExchangeService";

export default async function getStockInfoByTicker(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query

  if (!ticker || Array.isArray(ticker)) {
    res.statusCode = 400;

    return res.end();
  }

  const stockInfo = await StockExchangeService.getStockInfo(ticker);

  res.json({ data: stockInfo });
}