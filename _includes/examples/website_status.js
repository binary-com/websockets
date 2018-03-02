const WebSocket = require('ws');
const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?l=EN&app_id=1089');

ws.on('open', function open() {
    ws.send(JSON.stringify({
        website_status: 1,
        subscribe: 1
    }));
});

ws.on('message', function incoming(data) {
    data = JSON.parse(data);
    console.log('website status: %s', data.website_status.site_status);
    if (data.website_status.message) {
        console.log('status message: %s', data.website_status.message);
    }
});
