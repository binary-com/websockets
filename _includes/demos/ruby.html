gem install faye-websocket

require 'faye/websocket'
require 'eventmachine'
require 'json'

EM.run {
    ws = Faye::WebSocket::Client.new('wss://www.binary.com/websockets/v2')

    ws.on :open do |event|
        p [:open]
        ws.send(JSON.generate({ticks:'R_100'}))
    end

    ws.on :message do |event|
        p [:message, event.data]
    end
}
