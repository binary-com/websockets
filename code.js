require.config({ baseUrl: '/' });

require(["docson/docson", "lib/jquery"], function(docson) {

    var ws,
        $console = $('#playground-console');

    docson.templateBaseUrl = '/docson';


    function initConnection() {
        ws = new WebSocket('wss://www.binary.com/websockets/v2');

        ws.onmessage = incomingMessageHandler;
    }

    function sendToApi(jsonStr) {
        ws.send(JSON.stringify(jsonStr));
    }

    function incomingMessageHandler(msg) {
        var json = JSON.parse(msg.data),
            authorizationError = !!(json.error && json.error.code == "AuthorizationRequired");
            prettyJson = getFormattedJsonStr(json);
       console.log(json); // intended to help developers, not for debugging, do not remove
       $('.progress').remove();
       appendAndScrollIntoView($console, prettyJson);
       $('#unauthorized-error').toggle(authorizationError);
    };

    function getCurrentApi() {
        var apiPageStrIdx = window.location.href.indexOf('/#');

        if (!~apiPageStrIdx) return '';

        return window.location.href.substr(apiPageStrIdx + 2);
    }

    function resetWebsocket() {
        if (!ws) return;
        ws.close();
        initConnection();
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

    function issueRequestAndDisplayResult($node, requestUrl) {
        $node.html('<div class="progress"></div>');
        $.get(requestUrl, function(requestJson) {
            ws.send(JSON.stringify(requestJson));
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
            $node.val(JSON.stringify(exampleJson, null, 2));
        });
    }

    function appendAndScrollIntoView($node, html) {

        var shouldScroll = Math.abs($node[0].scrollHeight - $node.scrollTop() - $node.outerHeight()) < 100;

        $node.append(html)[0];

        if (shouldScroll) {
            $node.animate({ scrollTop: $node[0].scrollHeight }, 500);
            setTimeout(function() {
                $node.animate({ scrollTop: $node[0].scrollHeight }, 500);
            }, 1000);
        }
    }

    function updatePlaygroundWithRequestAndResponse() {

        try {
            var json = JSON.parse($('#playground-request').val());
        } catch(err) {
            alert('Invalid JSON!');
            return;
        }

        appendAndScrollIntoView($console, '<pre class="req">' + jsonToPretty(json) + '</pre>');
        appendAndScrollIntoView($console, '<div class="progress"></div>');
        sendToApi(json);
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
        loadAndEditJson($('#playground-request'), exampleJsonUrl);
    });

    $('#playground-send-btn').on('click', function() {
        updatePlaygroundWithRequestAndResponse();
    });

    $('#open-in-playground').on('click', function() {
        window.location.href = '/playground#' + getCurrentApi();
    });

    $('#playground-reset-btn').on('click', function() {
        $('#playground-console').html('');
        resetWebsocket();
    });

    $('#api-token').on('change', function() {
        sessionStorage.setItem('token', $('#api-token').val());
        console.log($('#api-token').val())
    });

    function showDemoForLanguage(lang) {
        $('[data-language]').hide();
        $('[data-language="' + lang + '"]').show();
    }

    $('#demo-language').on('change', function() {
        showDemoForLanguage($(this).val());
    });

    $('#mobile-page-selector').val(window.location.pathname + window.location.hash);
    $('#mobile-page-selector').on('change', function(event) {
        if (!event.originalEvent) return;

        window.location.href = $(this).val();
        console.log('going to ', $(this).val());
    });

    function updateApiDisplayed() {
        if ($('#api-call-selector').length == 0) return;

        var apiToDisplay = getCurrentApi();
        if (apiToDisplay) {
            $('#api-call-selector').val(apiToDisplay).change();
        }
    }

    $('#send-auth-manually-btn').on('click', function() {
        var token = sessionStorage.getItem('token');
            authReqStr = JSON.stringify({
                authorize: token || ''
            }, null, 2);

        $('#playground-request').val(authReqStr);
        if (token) {
            $('#playground-send-btn').click();
        } else {
            $('#playground-request').focus();
        }
    });

    $(window).on('hashchange', updateApiDisplayed);
    initConnection();
    showDemoForLanguage('javascript');
    updateApiDisplayed();
    $('#api-token').val(sessionStorage.getItem('token'));
});
