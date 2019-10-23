extern crate ws;
extern crate env_logger;

use ws::{connect, CloseCode};

fn main() {
    env_logger::init();
        println!("Starting connection");
        connect("wss://frontend.binaryws.com/websockets/v3?app_id=1089", |out| {
        println!("Connection established");
                out.send("{\"ping\" : 1}").unwrap();

                move |msg| {
                        println!("Got message: {}", msg);
                        out.close(CloseCode::Normal)
                }
        }).unwrap();
        println!("Event loop ended");
}
