Stock Data for tracking Trades and Info Across Different Brokers

1. User Workflow

   1. User watches stocks, adds stocks to watchlist or directly adds a transaction. Before anything, they need to add a broker and the amount of stake they are putting in. If they add a transaction, get transaction data, grab API data on the ticker, store the tocker data in the tickers table, then store the position in the position table with any calculated data needed from the ticker data if need be. finally, finish with a creation of the new transaction that was made. if adding stock to watch list, just add another stock to the watchlist with updated data from a finance API call.
      Step 1: make add broker routes. add with initial stake or can add stake later.

   2. Making a transaction: a user fills a form out to store their recent transaction. once that object is sent to back end:
      1. Grab the ticker name, run a api call to get live info on that Ticker, store specific data in the stock DB or update data it if the ticker is already there.
      2. Then create a new position or update an existing position if purchasing the same security on the same broker.
      3. finally add the new transaction to the database, associated with the respective position and broker, etc.
