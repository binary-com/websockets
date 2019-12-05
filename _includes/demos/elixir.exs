# Build as an escript, cf https://elixirschool.com/en/lessons/advanced/escripts/
# Depends on: [{:socket, "~> 0.3"}, {:poison, "~> 4.0"}]
defmodule BinaryWS do
  def main(_args) do
    {:ok, omsg} = Poison.encode(%{"ticks" => "R_100"})
    socket = Socket.Web.connect! "ws.binaryws.com", 443,
      [{:secure, true}, {:path, "/websockets/v3?app_id=1089"}]
    socket |> Socket.Web.send!({:text, omsg})
    spawn_link(fn -> loop(socket) end)
    :timer.sleep(:infinity)
    socket |> Socket.Web.close
  end

  # Start receiving updates in another process until main process wakes up.
  defp loop(socket) do
    case socket |> Socket.Web.recv! do
      {:text, imsg} ->
        IO.puts "ticks update: " <> imsg
        loop(socket)
      _ -> exit(:normal)
    end
  end
end
