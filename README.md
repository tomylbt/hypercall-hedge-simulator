# Hypercall Hedge Simulator

Community dashboard for simulating perp hedges with Hypercall options.

## Features
- **Hedge Simulator** — Enter your perp position, select options, see combined PnL at expiry
- **Whale Trades Feed** — Live trade feed via WebSocket with large trade highlighting
- **Greeks Calculator** — Client-side Black-Scholes calculation of position Greeks
- **Price Scenario Slider** — Drag to simulate different price outcomes
- **Expiry Filter Tabs** — Browse options by expiration date
- **OTM/ATM/ITM Labels** — Color-coded moneyness indicators

## Architecture
- `public/index.html` — Single-page dashboard (HTML + CSS + JS, no build step)
- `api/proxy.js` — Vercel serverless function proxying requests to Hypercall API (bypasses CORS)

## Data Sources
- REST: `https://testnet-api.hypercall.xyz/options-summary?currency=BTC`
- REST: `https://testnet-api.hypercall.xyz/markets`
- WebSocket: `wss://testnet-api.hypercall.xyz/ws` (trades, orderbook, index_prices channels)

## Deploy
```bash
npm i -g vercel
vercel
```

## API Response Formats

### /options-summary
```json
{
  "jsonrpc": "2.0",
  "result": [{
    "instrument_name": "BTC-20260402-69000-P",
    "bid_price": 1234.0,
    "ask_price": 1290.0,
    "mark_price": 1262.0,
    "mark_iv": 0.55,
    "underlying_price": 68579.0,
    "expiration_timestamp": 1775116800000,
    "open_interest": 23.5,
    "volume_usd": 47649.8
  }]
}
```

### /markets
```json
{
  "success": true,
  "data": [{
    "underlying": "BTC",
    "expiry": 1775030400,
    "index_price": "68206",
    "instruments": [{
      "id": "BTC-20260401-66000-P",
      "strike": "66000.00000000",
      "option_type": "put",
      "mark_iv": "0.67",
      "volume_24h": "114906",
      "open_interest": "359"
    }]
  }]
}
```

### WebSocket Messages
```json
{"type": "Subscribe", "channel": "trades"}
{"type": "Trade", "symbol": "BTC-20260131-100000-C", "price": "0.0523", "size": "5.0", "side": "buy", "timestamp": 1737331200000}
{"type": "OrderbookUpdate", "symbol": "...", "bids": [["price","size"]], "asks": [["price","size"]]}
```

## Not affiliated with Hypercall. Community project.
