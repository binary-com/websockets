use WebSocket\Client;
use Illuminate\Support\Facades\Log;

$client = new Client("wss://ws.binaryws.com/websockets/v3?app_id=1089");
$request = (object) ['ticks' => 'R_100'] ;
$client->send(json_encode($request));
Log::info("ticks update: ". $client->receive());