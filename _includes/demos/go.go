package main

import (
	"fmt"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

func receive(ticks chan string, ws *websocket.Conn, done <-chan struct{}) {
	defer close(ticks)
	var msg string
	for {
		if err := websocket.Message.Receive(ws, &msg); err != nil {
			log.Fatalln("recv:", err)
		}
		select {
		case <-done:
			return
		case ticks <- msg:
		}
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

	var (
		done  = make(chan struct{})
		ticks = make(chan string)
	)
	go receive(ticks, ws, done)

	if err = websocket.Message.Send(ws, `{"ticks": "R_100"}`); err != nil {
		log.Fatalln("send:", err)
	}

	timeout := time.After(10 * time.Second)

	for {
		select {
		case tick := <-ticks:
			fmt.Println("ticks update:", tick)
		case <-timeout:
			done <- struct{}{}
			return
		}
	}
}
