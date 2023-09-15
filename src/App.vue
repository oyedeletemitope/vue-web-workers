<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// import '../worker.js'

import Worker from './worker?worker'

export default {
  setup() {
    const coins = ref([]) // Create a reactive reference for coins array

    // Fetch coins data from API
    const fetchCoins = () => {
      fetch('https://api.coingecko.com/api/v3/search/trending')
        .then((res) => res.json())
        .then((data) => {
          const mappedCoins = data.coins.map((coin) => ({
            name: coin.item.name,
            symbol: coin.item.symbol,
            price: coin.item.price_btc,
            logo: coin.item.large
          }))
          coins.value = mappedCoins // Update the coins array
        })
        .catch((err) => console.error(err))
    }

    // Initialize the web worker
    const worker = new Worker()
    worker.onmessage = (e) => {
      coins.value = e.data // Update the coins array when worker sends a message
    }

    // Fetch coins data and start worker when component is mounted
    onMounted(() => {
      fetchCoins()
      worker.postMessage('start') // Start the worker
    })

    // Terminate the web worker when the component is unmounted
    onBeforeUnmount(() => {
      worker.terminate()
    })

    return { coins } // Return the reactive coins reference
  }
}
</script>

<template>
  <div>
    <h1>Trending</h1>
    <div class="container">
      <div v-for="coin in coins" :key="coin.name">
        <h2>{{ coin.name }}</h2>
        <p>{{ coin.symbol }}</p>
        <p>{{ coin.price }} BTC</p>
        <img :src="coin.logo" :alt="coin.name" />
      </div>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.container div {
  width: 200px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.container div img {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: block;
}
</style>
