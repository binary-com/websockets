require __DIR__ . '/vendor/autoload.php';

$loop = \React\EventLoop\Factory::create();
$connector = new \Ratchet\Client\Connector($loop);

$connector('wss://ws.binaryws.com/websockets/v3?app_id=1089')->then(function ($conn) {
    $conn->on('message', function ($msg) {
        echo "ticks update: {$msg}\n";
    });

    $conn->send("{\"ticks\": \"R_100\"}");
});

$loop->run();
