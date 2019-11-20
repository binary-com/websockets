import org.jfarcand.wcs._   // "org.jfarcand" % "wcs" % "1.4"

object BinaryWS extends App {
  WebSocket().open("wss://ws.binaryws.com/websockets/v3?app_id=1089")
      .listener(new TextListener() {
          override def onMessage(message: String) {
              println("ticks update: "+message)
          }
      })
      .send("{\"ticks\":\"R_100\"}")
}
