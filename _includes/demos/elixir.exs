# {:socket, "~> 0.3.0"}
# {:poison, "~> 1.5"}
{:ok, omsg}  = Poison.encode(%{:ticks => "R_100"})
socket = Socket.Web.connect! "ws.binaryws.com", 443, [{:secure, true}, {:path, "/websockets/v3"}]
socket |> Socket.Web.send! {:text, omsg}
{:text, imsg} = socket |> Socket.Web.recv!
IO.puts "ticks update: " <> imsg
