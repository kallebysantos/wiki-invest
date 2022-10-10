import puppeteer from 'puppeteer-core'
import { getOptions } from "../../lib/chromeOptions";
import { IStock, IStockDividend, IStockExchangeProvider } from "./IStockExchangeProvider";

export class StockExchangeProvider implements IStockExchangeProvider {

  private apiBase = 'https://sistemaswebb3-listados.b3.com.br';


  constructor() {

  }

  async getStockInfo(searchTicker: string): Promise<IStock> {
    const ticker = this.cleanTickerName(searchTicker);
    const requestUri = this.getApiRoute(ticker);

    const options = await getOptions(process.env.NODE_ENV !== 'production');
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    /* Getting about info */
    await page.goto(requestUri + 'about');

    /* Ticker name */
    await page.waitForSelector('app-funds-main #divContainerIframeB3 > div > div > h2');
    const titleTextContent = await page.evaluate(() => document.querySelector('app-funds-main #divContainerIframeB3 > div > div > h2')?.textContent) || undefined;

    /* Ticker */
    await page.waitForSelector('app-funds-about a');
    const tickerTextContent = await page.evaluate(() => document.querySelector('app-funds-about a')?.textContent) || undefined;


    /* Dividends */
    await page.goto(requestUri + 'events');

    await page.waitForSelector('app-funds-events table');
    const dividendRows = await page.$$eval('app-funds-events table tr', rows => Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText.trim());
    }))

    const parsedDividends = dividendRows.filter(row => row[0] === 'RENDIMENTO').map<IStockDividend>(row => ({
      value: Number(row[4].replace(',', '.')),
      paymentDate: new Date(row[3].split('/').reverse().join('-')),
      exDividendDate: new Date(row[6].split('/').reverse().join('-'))
    }));

    const stockInfo: IStock = {
      title: titleTextContent?.trim(),
      ticker: tickerTextContent?.trim(),
      dividends: parsedDividends
    };

    await browser.close();

    return stockInfo;
  }

  private getApiRoute = (ticker: string) => `${this.apiBase}/fundsPage/main/38065012000177/${ticker}/1/`;

  private cleanTickerName = (ticker: string) => ticker.substring(0, 4);
}