---
layout: page
title:  "Authorize"
permalink: authorize/
---

### Send

$schema /config/v1/authorize/send.json

{% highlight javascript %}
{
    "authorize": "dhfgishdfgisdgsdfgsdfg"
}
{% endhighlight %}

### Receive

$schema /config/v1/authorize/receive.json

{% highlight javascript %}
{
    "msg_type": "authorize",
    "echo_req": {
        "authorize": "dhfgishdfgisdgsdfgsdfg"
    },
    "authorize": {
        "email": "example@example.com",
        "currency": "USD",
        "balance": 10377.9900,
        "loginid": "VRTC573035",
        "fullname": "John Smith"
    }
}
{% endhighlight %}
