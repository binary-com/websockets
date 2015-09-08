package main

import (
    "fmt"

    "golang.org/x/net/websocket"
)

var origin = "http://localhost/"
var url = "wss://ws.binary.com/websockets/v2?l=EN"

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
