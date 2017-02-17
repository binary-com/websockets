package main

import "fmt"
import "golang.org/x/net/websocket"

var origin = "http://localhost/"
var url = "wss://ws.binaryws.com/websockets/v3?app_id=1089"

func main() {
    ws, _ := websocket.Dial(url, "", origin)

    message := []byte("{\"ticks\": \"R_100\"}")
    ws.Write(message)
    fmt.Printf("Send: %s\n", message)

    var msg = make([]byte, 512000)
    for {
        ws.Read(msg)
        fmt.Printf("Receive: %s\n", msg)
    }
}
