class Program
{
    static async Task SendTicksRequest()
    {
        var ws = new ClientWebSocket();
        var uri = new Uri("wss://www.binary.com/websockets/v2");

        await ws.ConnectAsync(uri, CancellationToken.None);

        var reqAsBytes = Encoding.UTF8.GetBytes("{\"ticks\":\"R_100\"}");
        var ticksRequest = new ArraySegment&lt;byte>(reqAsBytes);

        await ws.SendAsync(ticksRequest,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        var buffer = new ArraySegment&lt;byte>(new byte[1024]);
        var result = await ws.ReceiveAsync(buffer, CancellationToken.None);

        string response = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
        Console.WriteLine(response);
    }

    static void Main(string[] args)
    {
        SendTicksRequest();
        Console.ReadLine();
    }
}
