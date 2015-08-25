require.config({ baseUrl: '/' });

require(["docson/docson", "lib/jquery"], function(docson) {

    docson.templateBaseUrl = '/docson';

    function formatCode(json, $node) {
        Rainbow.color(JSON.stringify(json, null, 4), 'javascript', function(highlightedJson) {
            $node.replaceWith('<pre><code data-language="javascript">' +
                highlightedJson + '</code></pre>');
        });
    }

    function wsResult(json, $responseNode, apiKey) {
        var ws = new WebSocket('wss://ws.binary.com/websockets/contracts');

        ws.onopen = function(evt) {
            var authorizeReq = '{"authorize":"' + apiKey + '"}';
            if (apiKey.length) ws.send(authorizeReq);
            ws.send(JSON.stringify(json));
        };

        ws.onmessage = function(msg) {
           var json = JSON.parse(msg.data);
           console.log(json);
           formatCode(json, $responseNode);
           // ws.close()
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
        var $response = $('#playground-response');
        $response.html('<div class="progress"></div>');
        wsResult($('#playground-request'), $response, $('#api-key'));
    }

    $('[data-schema]').each(function() {
        var $this = $(this);
        loadAndDisplaySchema($this, $this.attr('data-schema'));
    });

    $('#playground-api-selector').on('change', function() {
        var requestSchemaUrl = '/config/v1/' + $(this).val() + '/send.json',
            responseSchemaUrl = '/config/v1/' + $(this).val() + '/receive.json';
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
});
