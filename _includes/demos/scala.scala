import org.jfarcand.wcs._   // "org.jfarcand" % "wcs" % "1.4"

object BinaryWS extends App {
  WebSocket().open("wss://www.binary.com/websockets/v2")
      .listener(new TextListener() {
          override def onMessage(message: String) {
              println("ticks update: "+message)
          }
      })
      .send("{\"ticks\":\"R_100\"}")
}
