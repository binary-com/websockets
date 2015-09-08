import websocket
import json

def on_open(ws):
    json_data = json.dumps({'ticks':'R_100'})
    ws.send(json_data)

def on_message(ws, message):
    print('ticks update: %s' % message)

if __name__ == "__main__":
    apiUrl = "wss://www.binary.com/websockets/v2"
    ws = websocket.WebSocketApp(apiUrl, on_message = on_message, on_open = on_open)
    ws.run_forever()
