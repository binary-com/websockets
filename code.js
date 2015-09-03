require.config({ baseUrl: '/' });

require(["docson/docson", "lib/jquery"], function(docson) {

    var ws;

    docson.templateBaseUrl = '/docson';

    function getCurrentApi() {
        var apiPageStrIdx = window.location.href.indexOf('/#');

        if (!~apiPageStrIdx) return '';

        return window.location.href.substr(apiPageStrIdx + 2);
    }
    
    function resetWebsocket() {
        ws.close();
        ws = new WebSocket('wss://ws.binary.com/websockets/v2');
    }

    function formatJs(js, $node) {
        Rainbow.color(js, 'javascript', function (highlightedJs) {
            $node.html('<pre><p data-language="javascript">' +
                highlightedJs + '</pre>');
        });
    }

    function jsonToPretty(json, offset) {

        var spaces = function(n) {
            return Array(n + 1).join(" ");
        }

        var span = function(val, className) {
            return '<span class="' + className + '">' + val + '</span>';
        }

        var valToStr = function(val, offset) {
            if (typeof val == 'string') {
                return span('"' + val + '"', 'string');
            } else if (typeof val == 'number') {
                return span(val, 'number');
            } else if (Array.isArray(val)) {
                var elements =  val.map(function(val) {
                    return spaces(offset + 2) + valToStr(val, offset + 2);
                }).join(',\n');
                return '[\n' + elements + '\n' + spaces(offset) + ']';
            } else if (typeof val == 'boolean') {
                return span(val, 'boolean');
            } else {
                return objToStr(val, offset);
            }
        }

        var propsToStr = function (obj, offset) {
            var keyStr = Object.keys(obj).map(function (key) {
                return spaces(offset) + span('"' + key + '"', 'key') + ': ' + valToStr(obj[key], offset);
            });
            return keyStr.join(',\n');
        }

        var objToStr = function(obj, offset) {
            if (!obj || Object.keys(obj).length == 0) return '{}';
            return (
                '{\n' +
                propsToStr(obj, offset + 2) + '\n' +
                spaces(offset) + '}'
            )
        }

        return objToStr(json, offset || 0);
    }

    function getFormattedJsonStr(json) {
        if (typeof json == 'string') {
            json = JSON.parse(json);
        }
        return '<pre>' + jsonToPretty(json) + '</pre>';
    }

    function sendToApi(json, callback, apiToken) {
        var tokenProvided = apiToken && apiToken.trim().length;

        ws = new WebSocket('wss://ws.binary.com/websockets/v2');

        ws.onopen = function(evt) {
            var authorizeReq = '{"authorize":"' + apiToken + '"}';
            if (tokenProvided) ws.send(authorizeReq);
            ws.send(JSON.stringify(json));
        };

        ws.onmessage = function(msg) {
           var json = JSON.parse(msg.data);
           console.log(json); // intended to help developers, not for debugging, do not remove
           callback(json);
        };
    }

    function issueRequestAndDisplayResult($node, requestUrl) {
        $node.html('<div class="progress"></div>');
        $.get(requestUrl, function(requestJson) {
            sendToApi(requestJson, function(json) {
                $node.html(getFormattedJsonStr(json));
            });
        });
    }

    function loadAndDisplaySchema($node, schemaUrl) {
        $.get(schemaUrl, function(schema) {
            docson.doc($node, schema);
        });
    }

    function loadAndFormatJson($node, jsonUrl) {
        $.get(jsonUrl, function(exampleJson) {
            $node.html(getFormattedJsonStr(exampleJson));
            $node.show();
        }).fail(function() {
            $node.hide();
        });
    }

    function loadAndEditJson($node, jsonUrl) {
        $.get(jsonUrl, function(exampleJson) {
            $node.text(JSON.stringify(exampleJson, null, 2));
        });
    }

    function appendAndScrollIntoView($node, html) {
        $node.append(html)[0];
        $node.animate({ scrollTop: $node[0].scrollHeight }, 500);
        setTimeout(function() {
            $node.animate({ scrollTop: $node[0].scrollHeight }, 500);
        }, 1000);
    }

    function updatePlaygroundWithRequestAndResponse() {
        var $node = $('#playground-console'),
            resJson;

        try {
            resJson = JSON.parse($('#playground-request').val());
        } catch(err) {
            alert('Not valid json!');
            return;
        }

        appendAndScrollIntoView($node, '<pre class="req">' + jsonToPretty(resJson) + '</pre>');

        appendAndScrollIntoView($node, '<div class="progress"></div>');

        sendToApi(resJson, function(reqJson) {
            var $progress = $('.progress'),
                prettyJson = getFormattedJsonStr(reqJson);

            if ($progress.length > 0) {
                $progress.replaceWith(prettyJson);
            } else {
                appendAndScrollIntoView($node, prettyJson);
            }
        }, $('#api-token').val());
    }

    $('[data-schema]').each(function() {
        var $this = $(this);
        loadAndDisplaySchema($this, $this.attr('data-schema'));
    });

    $('#api-call-selector, #api-version-selector').on('change', function() {
        var verStr = $('#api-version-selector').val(),
            apiStr = $('#api-call-selector').val(),
            urlPath = '/config/' + verStr + '/' + apiStr + '/',
            requestSchemaUrl = urlPath + 'send.json',
            responseSchemaUrl = urlPath + 'receive.json',
            exampleJsonUrl = urlPath + 'example.json';
        loadAndDisplaySchema($('#playground-req-schema'), requestSchemaUrl);
        loadAndDisplaySchema($('#playground-res-schema'), responseSchemaUrl);
        if ($('#playground-example').length) {
            loadAndFormatJson($('#playground-example'), exampleJsonUrl);
        }
        if ($('#playground-request').length) {
            loadAndEditJson($('#playground-request'), exampleJsonUrl);
        }
        if ($('#api-example-response')) {
            issueRequestAndDisplayResult($('#api-example-response'), exampleJsonUrl);
        }
    });

    $('[data-example]').each(function() {
        var $this = $(this);
        loadAndDisplayJson($this, $this.attr('data-example'))
    });

    $('[data-response]').each(function() {
        var $this = $(this);
        issueRequestAndDisplayResult($this, $this.attr('data-response'));
    });

    $('#playground-send-btn').on('click', function() {
        updatePlaygroundWithRequestAndResponse();
    });

    $('#open-in-playground').on('click', function() {
        window.location.href='/playground#' + getCurrentApi();
    });

    $('#playground-reset-btn').on('click', function() {
        $('#playground-console').html('');
        resetWebsocket();
    });

    $(function() {
        var apiToDisplay = getCurrentApi();
        if (apiToDisplay) {
            $('#api-call-selector').val(apiToDisplay).change();
        }
    });

    localStorage.setItem('myCat', 'Tom');
});
