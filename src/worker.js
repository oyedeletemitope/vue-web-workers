// worker.js
self.onmessage = function () {
  // Fetch coins data from the API and send the result back to the main thread
  fetchCoins()
}

function fetchCoins() {
  fetch('https://api.coingecko.com/api/v3/search/trending')
    .then((res) => res.json())
    .then((data) => {
      const coins = data.coins.map((coin) => ({
        name: coin.item.name,
        price: coin.item.price_btc,
        logo: coin.item.large
      }))
      console.log(coins)
      // Post the result (coins data) back to the main thread
      self.postMessage(coins)
    })
    .catch((err) => console.log(err))
}

// Fetch data every 5 seconds
setInterval(fetchCoins, 5000)
