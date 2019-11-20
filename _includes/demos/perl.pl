use strict;
use warnings;
use v5.10;
use Mojo::UserAgent;
use Data::Dumper;

my $ua = Mojo::UserAgent->new;
$ua->websocket('wss://ws.binaryws.com/websockets/v3?app_id=1089' => sub {
    my ($ua, $tx) = @_;
    unless($tx->is_websocket) {
        say 'WebSocket handshake failed!';
        return;
    }

    $tx->on(json => sub {
        my ($tx, $data) = @_;
        say "ticks update: " . Dumper(\$data);
    });

    $tx->send({json => {
        ticks => 'R_100'
    }});
});
Mojo::IOLoop->start unless Mojo::IOLoop->is_running;
