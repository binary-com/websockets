ws = new WebSocket('wss://ws.binaryws.com/websockets/v3')

ws.onopen = (evt) ->
    ws.send JSON.stringify(ticks: 'R_100')

ws.onmessage = (msg) ->
    data = JSON.parse(msg.data)
    console.log 'ticks update: %o', data
