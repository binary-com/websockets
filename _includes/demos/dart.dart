import 'dart:async' show Future;
import 'dart:convert' show json;
import 'dart:io' show WebSocket;

Future<void> main() async {
    WebSocket ws;
    try {
        ws = await WebSocket.connect(
                'wss://ws.binaryws.com/websockets/v3?app_id=1089');

        if (ws?.readyState == WebSocket.open) {
            ws.listen(
                    (resposne) {
                        var data = Map<String, dynamic>.from(json.decode(resposne));
                        print('Ticks update:\r\n $data');
                    },
                    onDone: () => print('Done!'),
                    onError: (e) => throw new Exception(e),
            );
            ws.add(json.encode({'ticks': 'R_100'}));
        }
    } catch(e) {
        ws?.close();
        print('Error: $e');
    }
}
