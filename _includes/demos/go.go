package main

import "golang.org/x/net/websocket"

func main() {
	ws, _ := websocket.Dial("wss://ws.binaryws.com/websockets/v3?app_id=1089", "", "http://localhost/")

	ws.Write([]byte(`{"ticks": "R_100"}`))

	var msg = make([]byte, 512000)
	for {
		ws.Read(msg)
		println("Received: ", string(msg))
	}
}
