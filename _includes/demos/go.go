package main

import (
	"fmt"
	"log"

	"golang.org/x/net/websocket"
)

func receive(ticks chan string, ws *websocket.Conn) {
	defer close(ticks)
	var msg string
	for {
		if err := websocket.Message.Receive(ws, &msg); err != nil {
			log.Fatalln("recv:", err)
		}
		ticks <- msg
	}
}

func main() {
	origin := "http://localhost"
	url := "wss://ws.binaryws.com/websockets/v3?app_id=1089"

	ws, err := websocket.Dial(url, "", origin)
	if err != nil {
		log.Fatalln("dial:", err)
	}
	defer ws.Close()

	var ticks = make(chan string)
	go receive(ticks, ws)

	if err = websocket.Message.Send(ws, `{"ticks": "R_100"}`); err != nil {
		log.Fatalln("send:", err)
	}

	for {
		select {
		case tick := <-ticks:
			fmt.Println("ticks update:", tick)
		}
	}
}
