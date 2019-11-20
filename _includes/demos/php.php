<?php

require __DIR__ . '/vendor/autoload.php';

$loop = \React\EventLoop\Factory::create();
$reactConnector = new \React\Socket\Connector($loop, [
    'timeout' => 10
]);
$connector = new \Ratchet\Client\Connector($loop, $reactConnector);

$connector('wss://ws.binaryws.com/websockets/v3?app_id=1089')
->then(function(Ratchet\Client\WebSocket $conn) {
    $conn->on('message', function(\Ratchet\RFC6455\Messaging\MessageInterface $msg) use ($conn) {
        echo "Received: {$msg}\n";
    });

    $conn->on('close', function($code = null, $reason = null) {
        echo "Connection closed ({$code} - {$reason})\n";
    });

    $conn->send("{\"ticks\":\"R_100\"}");
}, function(\Exception $e) use ($loop) {
    echo "Could not connect: {$e->getMessage()}\n";
    $loop->stop();
});

$loop->addTimer(10, function () use ($loop) {
    $loop->stop();
});

$loop->run();
