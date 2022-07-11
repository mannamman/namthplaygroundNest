import yfinance
import datetime
from typing import Tuple, List

subejct_mapping = {
    "google" : "GOOG",
    "nasdaq" : "NDX",
    "tesla" : "TSLA",
    "snp500" : "^GSPC",
    "americanelectricpower" : "AEP",
    "oneok" : "OKE",
    "amazon" : "AMZN",
    "apple" : "AAPL"
}

history_period = "1d"

class YFin:
    def __init__(self) -> None:
        global history_period
        self.date_format = "%Y-%m-%d"

    def get_real_stock(self, subejct: str, start: str, end: str) -> Tuple[List[float], List[str]]:
        global subejct_mapping
        global history_period

        stock = subejct_mapping[subejct]

        stock_yf = yfinance.Ticker(stock)
        print(f"{start=}, {end=}")
        stock_history = stock_yf.history(period=history_period, start=start, end=end)
    
        close_prices = stock_history["Close"].tolist()
        # close_prices = [round(close_price, 4) for close_price in close_prices]
        close_dates = stock_history.index.tolist()
        close_dates = [datetime.datetime.strftime(close_date, self.date_format) for close_date in close_dates]
        
        return (close_prices, close_dates)

if(__name__ == "__main__"):
    yfin = YFin()
    p,d = yfin.get_real_stock("apple", "2022-02-28", "2022-03-07")
    print(p,d)
    print(len(p))
