var ws = new WebSocket(&#39;wss://ws.binaryws.com/websockets/v3?app_id=1089&#39;);

ws.onopen = function(evt) { ws.send(JSON.stringify({ticks:&#39;R_100&#39;})); };

ws.onmessage = function(msg) { var data = JSON.parse(msg.data); console.log(&#39;ticks update: %o&#39;, data);};
