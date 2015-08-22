---
layout: default
---

The binary.com websockets service is at this URL:

> wss://ws.binary.com/websockets/contracts

There are several useful references for this object such as [here](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) .

This will open the Binary.com WebSocket service:
```
var ws = new WebSocket('wss://ws.binary.com/websockets/contracts');
```
You can now 'send' data down the websocket using any of the messages described in this Reference.   Depending on the call, zero, one or many messages will be sent back to you.

All the examples in this Reference assume that a websocket object named 'ws' has already been opened as shown above.

All movement of data in both directions is done with structured JSON-encoded data.  This means that all field name identifiers, and most field values, will be double-quoted in the encoded data.  You can avoid the tedious problem of constructing your own JSON strings by invoking the built-in JSON.stringify method on an in-line Javascript object.

The same applies to receiving messages.  Each message is a serialized JSON-encoded string, and so you would normally start by 'inflating' it to a Javascript object using JSON.parse.

All of our examples use this technique.

Combining some of the examples, here is a javascript fragment that opens a websocket, and requests a stream of updates for the symbol "R_100".  On receipt of each message, it generates a console line allowing inspection of the message.

```
var ws = new WebSocket('wss://ws.binary.com/websockets/contracts');

ws.onmessage = function(msg) {
   var data = JSON.parse(msg.data);
   console.log('ticks update: %o', data);
};

ws.send(JSON.stringify({authorize: "0d4abc3j3MTabcQJnmabcactabd"}));
ws.send(JSON.stringify({ticks:'R_100'}));
```
