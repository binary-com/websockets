use strict;
use warnings;
use v5.10;
use Mojo::UserAgent;
use Data::Dumper;

my $ua = Mojo::UserAgent->new;
$ua->websocket('wss://www.binary.com/websockets/v2' => sub {
    my ($ua, $tx) = @_;
    say 'WebSocket handshake failed!' and return unless $tx->is_websocket;

    $tx->on(json => sub {
        my ($tx, $data) = @_;
        say "ticks update: " . Dumper(\$data);
    });

    $tx->send({json => {
        ticks => 'R_100'
    }});
});
Mojo::IOLoop->start unless Mojo::IOLoop->is_running;
