require_once("vendor/autoload.php");

$loop = \React\EventLoop\Factory::create();

$logger = new \Zend\Log\Logger();
$writer = new Zend\Log\Writer\Stream("php://output");
$logger->addWriter($writer);

$client = new \Devristo\Phpws\Client\WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089", $loop, $logger);

$client->on("connect", function($headers) use ($client, $logger){
    $logger->notice("connected!");
    $client->send("{\"ticks\":\"R_100\"}");
});

$client->on("message", function($message) use ($client, $logger){
    $logger->notice("ticks update: ".$message->getData());
});

$client->open();
$loop->run();
