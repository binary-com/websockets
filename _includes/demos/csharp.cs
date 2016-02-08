using System;
using System.Text;
using System.Threading.Tasks;
using System.Net.WebSockets;
using System.Threading;
using System.Net;

namespace BinaryWSDemo
{
    class BinaryWS
    {
    	private ClientWebSocket ws = new ClientWebSocket();
        private Uri uri = new Uri("wss://ws.binaryws.com/websockets/v3");
            
        public async Task SendRequest(string data)
        {
        	
        	while(this.ws.State == WebSocketState.Connecting){};
            if (this.ws.State != WebSocketState.Open)
            {
                throw new Exception("Connection is not open.");
            }
            
            var reqAsBytes = Encoding.UTF8.GetBytes(data);
            var ticksRequest = new ArraySegment&ltbyte>(reqAsBytes);

            await this.ws.SendAsync(ticksRequest,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
            
            Console.WriteLine("The request has been sent: ");
            Console.WriteLine(data);
            Console.WriteLine("\r\n \r\n");

            
        }
        
        public async Task StartListen(){
        	WebSocketReceiveResult result;
        	while (this.ws.State == WebSocketState.Open){
        	var buffer = new ArraySegment&ltbyte>(new byte[1024]);
                    do
                    {
                        result = await this.ws.ReceiveAsync(new ArraySegment&ltbyte>(buffer.Array), CancellationToken.None);

                        if (result.MessageType == WebSocketMessageType.Close)
                        {
                        	Console.WriteLine("Connection Closed!");
                        	break;
                        }
                        else
                        {
                            var str = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                            Console.WriteLine("Received Data at: " + DateTime.Now);
                            Console.WriteLine(str);
                            Console.WriteLine("\r\n");
                        }

                    } while (!result.EndOfMessage);
        	}
        }
        
        public async Task Connect(){
        	Console.WriteLine("Prepare to connect to: " + this.uri.ToString());
        	Console.WriteLine("\r\n");
        	
        	ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11;
        	await ws.ConnectAsync(uri, CancellationToken.None);
        	
        	Console.WriteLine("The connection is established!");
        	Console.WriteLine("\r\n");
        }

        static void Main(string[] args)
        {
            
			string data = "{\"ticks\":\"R_100\"}";
            
			var bws = new BinaryWS();
			bws.Connect().Wait();
			
			bws.SendRequest(data).Wait();
			bws.StartListen();
            
            Console.ReadLine();
        }
    }
}
