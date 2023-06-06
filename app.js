const express = require('express')
const path = require('path')
const stocks = require('./stocks')
const errMsg = {}

const app = express()
app.use(express.static(path.join(__dirname, 'static')))

app.get('/stocks', async (req, res, next) => {
  const stockSymbols = await stocks.getStocks();
  res.send({ stockSymbols });
});

app.get('/stocks/:symbol', async (req, res) => {
  const { params: { symbol } } = req;
  try {
    const data = await stocks.getStockPoints(symbol, new Date());
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.listen(3000, () => console.log('Server is running!'))
