extern crate websocket;    // websocket = "~0.12.2"

use std::string::String;
use websocket::client::request::Url;
use websocket::{Client, Message, Sender, Receiver};

fn main() {
    let url = Url::parse("wss://ws.binaryws.com/websockets/v3").unwrap();
    let request = Client::connect(url).unwrap();
    let response = request.send().unwrap();
    let (mut sender, mut receiver) = response.begin().split();
    let req = Message::Text(String::from("{\"ticks\": \"R_100\"}"));
    sender.send_message(req).unwrap();
    for message in receiver.incoming_messages::&lt;Message&gt;() {
        match message {
            Ok(Message::Text(m))    => { println!("tick update: {:?}", m) },
            _                       => { break },
        };
    }
}
