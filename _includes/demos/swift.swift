let ws = WebSocket("wss://www.binary.com/websockets/v2")

ws.event.open = {
    ws.send("{\"ticks\":\"R_100\"}")
}

ws.event.message = {
    var obj: AnyObject? = NSJSONSerialization.JSONObjectWithData(
        source.dataUsingEncoding(NSUTF8StringEncoding)!,
        options: nil,
        error: &err
    )
    print(obj)
}
