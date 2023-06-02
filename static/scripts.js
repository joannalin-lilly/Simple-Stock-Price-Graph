const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

function drawLine(start, end, style) {
  ctx.beginPath();
  ctx.strokeStyle = style || 'black';
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();
  ctx.moveTo(...apex1);
  ctx.lineTo(...apex2);
  ctx.lineTo(...apex3);
  ctx.fill();
}

drawLine([50, 50], [50, 550]);
drawTriangle([35, 50], [65, 50], [50, 35]);

drawLine([50, 550], [950, 550]);
drawTriangle([950, 535], [950, 565], [965, 550]);

const loggedData = [];
const allStocksURL = '/stocks';
let totalStocks = -1;
let fetchedStocks = 0;

fetch(allStocksURL, {
  method: 'GET'
})
  .then(response => {
    return response.json();
  })
  .then(allStocks => {
    totalStocks = allStocks.stockSymbols.length;
    allStocks.stockSymbols.forEach(stock => {
      fetchIndividualStock(stock);
    });
  });

function getStockColor(symbol) {
  switch (symbol) {
    case 'MSFT':
      return 'yellow';
    case 'AAPL':
      return 'teal';
    case 'FB':
      return 'blue';
    case 'EA':
      return 'violet';
    case 'IBM':
      return 'orange';
    default:
      return 'black'; // Default color if symbol doesn't match
  }
}

function fetchIndividualStock(symbol) {
  const url = `/stocks/${symbol}`;
  fetch(url, {
    method: 'GET'
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error.message;
    })
    .then(result => {
      fetchedStocks++;
      const spinnerElement = document.getElementById('spinner');
      const errorMessageElement = document.getElementById('error-message');
      if (spinnerElement != null && !spinnerElement.classList.contains('remove-spinner')) {
        spinnerElement.classList.add('remove-spinner');
      }
      if (typeof result === 'string' && result.indexOf('Failed to fetch') > -1) {
        errorMessageElement.innerHTML = 'One or more stocks failed to generate stock data';
        return;
      }
      let prevX = 50;
      let prevY = 0;
      let x = 0;
      let y = 0;
      loggedData.push({ [symbol]: result });
      if (fetchedStocks === totalStocks) {
        console.log(loggedData);
      }
      result.forEach((entry, index) => {
        const value = entry.value;
        const timestamp = entry.timestamp;
        x = prevX + 90;
        y = 550 - 200 - value;
        let color = '';
        color = getStockColor(symbol);
        if (index !== 0) {
          drawLine([prevX, prevY], [x, y], color);
        }
        prevX = x;
        prevY = y;
      });
    });
}

