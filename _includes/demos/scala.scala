package com.binary.ws

import com.github.andyglow.websocket._

object BinaryWS extends App {
  val uri = "wss://ws.binaryws.com/websockets/v3?app_id=1089"
  val cli = WebsocketClient[String](uri) {
    case str =>
      println("ticks update: " + str)
  }
  val ws = cli.open()

  ws ! "{\"ticks\":\"R_100\"}"
}
