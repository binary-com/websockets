require.config({ baseUrl: '/' });

require(["docson/docson", "lib/jquery"], function(docson) {

    docson.templateBaseUrl = '/docson';

    function formatCode(json, $node) {
        Rainbow.color(JSON.stringify(json, null, 2), 'javascript', function(highlightedJson) {
            $node.html('<pre><p data-language="javascript">' +
                highlightedJson + '</pre>');
        });
    }

    function wsResult(json, $responseNode, apiToken) {
        var tokenProvided = apiToken && apiToken.trim().length;
        var ws = new WebSocket('wss://ws.binary.com/websockets/v2');

        ws.onopen = function(evt) {
            var authorizeReq = '{"authorize":"' + apiToken + '"}';
            if (tokenProvided) ws.send(authorizeReq);
            ws.send(JSON.stringify(json));
        };

        ws.onmessage = function(msg) {
           var json = JSON.parse(msg.data);
           console.log(json);
           formatCode(json, $responseNode);
        };
    }

    function issueRequestAndDisplayResult($this, requestUrl) {
        $this.html('<div class="progress"></div>');
        $.get(requestUrl, function(requestJson) {
            wsResult(requestJson, $this);
        });
    }

    function loadAndDisplaySchema($this, schemaUrl) {
        $.get(schemaUrl, function(schema) {
            docson.doc($this, schema);
        });
    }

    function loadAndDisplayJson($this, jsonUrl) {
        $.get(jsonUrl, function(exampleJson) {
            formatCode(exampleJson, $this);
        });
    }

    function updatePlaygroundResponse() {
        var $response = $('#playground-response'),
            json;

        try {
            json = JSON.parse($('#playground-request').val());
        } catch(err) {
            alert('Not valid json!');
            return;
        }

        $response.html('<code><div class="progress"></div></code>');
        wsResult(json, $response, $('#api-token').val());
    }

    $('[data-schema]').each(function() {
        var $this = $(this);
        loadAndDisplaySchema($this, $this.attr('data-schema'));
    });

    $('#playground-api-selector').on('change', function() {
        var requestSchemaUrl = '/config/v2/' + $(this).val() + '/send.json',
            responseSchemaUrl = '/config/v2/' + $(this).val() + '/receive.json';
        loadAndDisplaySchema($('#playground-req-schema'), requestSchemaUrl);
        loadAndDisplaySchema($('#playground-res-schema'), responseSchemaUrl);
    });

    $('[data-example]').each(function() {
        var $this = $(this);
        loadAndDisplayJson($this, $this.attr('data-example'))
    });

    $('[data-response]').each(function() {
        var $this = $(this);
        issueRequestAndDisplayResult($this, $this.attr('data-response'));
    });

    $('#playground-btn').on('click', function() {
        updatePlaygroundResponse();
    });

    $('.open-in-playground').on('click', function() {
        window.location.href='/playground?=' + $this.attr('data-example');
    });
});
