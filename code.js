require.config({ baseUrl: '/' });

var LiveApi = window['binary-live-api'].LiveApi;

var defaultAppId = 1089;
var defaultApiUrl = 'wss://ws.binaryws.com/websockets/v3';

var appId = defaultAppId;
var apiUrl = defaultApiUrl;
var langCode = 'en';

require(["docson/docson", "lib/jquery"], function(docson) {

    var api,
        manuallySentReq,
        $console = $('#playground-console');

    docson.templateBaseUrl = '/docson';

    $('#conn-error').hide();
    $('#connected').hide();

    function escapeHtml(unsafe) {
        return unsafe.toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function initConnection() {
        $('#connected').hide();
        $('#connecting').show();
        if (api && api.disconnect) {
            api.disconnect();
        }
        api = new LiveApi({ apiUrl: apiUrl, language: langCode, appId: appId || defaultAppId });
        api.socket.onopen = function (e) {
            api.onOpen.apply(api, e);
            $('#connecting').hide();
            $('#connected').show();
            $('#api-url').text(apiUrl);
        };
        api.events.on('*', incomingMessageHandler);
    }

    function incomingMessageHandler(json) {
        var authorizationError = !!(json.error && json.error.code == "AuthorizationRequired"),
            prettyJson = getFormattedJsonStr(json);
        console.log(json); // intended to help developers, not for debugging, do not remove
        $('.progress').remove();
        appendToConsoleAndScrollIntoView(prettyJson);
        $('#unauthorized-error').toggle(authorizationError);
    };

    function getCurrentApi() {
        var apiPageStrIdx = window.location.href.indexOf('/#');

        if (!~apiPageStrIdx) return '';

        return window.location.href.substr(apiPageStrIdx + 2);
    }

    function jsonToPretty(json, offset) {

        var spaces = function(n) {
            return Array(n + 1).join(" ");
        }

        var span = function(val, className) {
            return '<span class="' + className + '">' + escapeHtml(val) + '</span>';
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
        return (json.error ? '<pre class="error">' : '<pre>') +
            jsonToPretty(json) +
            '</pre>';
    }

    function issueRequestAndDisplayResult($node, requestUrl) {
        $node.html('<div class="progress"></div>');
        $.get(requestUrl, function(requestJson) {
            api.sendRaw(requestJson);
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

    function scrollConsoleToBottom() {
        $console.stop(false, true);
        $console.animate({ scrollTop: $console[0].scrollHeight }, 500);
    }

    function consoleShouldScroll() {
        return Math.abs($console[0].scrollHeight - $console.scrollTop() - $console.outerHeight()) > 10;
    }

    function appendToConsoleAndScrollIntoView(html) {
        $console.stop(false, true);

        setTimeout(function() {
            $console.append(html)[0];

            if (consoleShouldScroll()) {
                scrollConsoleToBottom();
                setTimeout(function() {
                    if (consoleShouldScroll()) {
                        $console.animate({ scrollTop: $console[0].scrollHeight }, 500);
                    }
                }, 1500);
            }
        }, 0);
    }

    function updatePlaygroundWithRequestAndResponse() {

        try {
            var json = JSON.parse($('#playground-request').val());
        } catch(err) {
            alert('Invalid JSON!');
            return;
        }

        appendToConsoleAndScrollIntoView('<pre class="req">' + jsonToPretty(json) + '</pre>' + '<div class="progress"></div>');
        api.sendRaw(json);
    }

    // trim leading and trailing white space
    function Trim(str){
      while(str.charAt(0) == (" ") ){str = str.substring(1);}
      while(str.charAt(str.length-1) ==" " ){str = str.substring(0,str.length-1);}
      return str;
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
        window.location.hash = apiStr;
    });

    $('#api-language-selector').on('change', function(е) {
        langCode = $('#api-language-selector').val();
        initConnection();
    });

    $('#api-version-selector').on('change', function () {
        $('#endpoint-input').val('');
        apiUrl = 'wss://ws.binaryws.com/websockets/' + $('#api-version-selector').val();
        initConnection();
    });

    $('#endpoint-button').on('click', function(e) {
        apiUrl = 'wss://' + $('#endpoint-input').val() + '/websockets/' + $('#api-version-selector').val();
        appId = $('#appid-input').val();
        $('#conn-error').hide();
        initConnection();
        api.socket.onerror = function () {
            $('#conn-error').show();
            apiUrl = defaultApiUrl;
            appId = defaultAppId;
            initConnection();
            $('#endpoint-input').val('');
        };
    });

    $('#playground-send-btn').on('click', function() {
        updatePlaygroundWithRequestAndResponse();
    });

    $('#open-in-playground').on('click', function() {
        window.location.href = '/playground#' + getCurrentApi();
    });

    $('#playground-reset-btn').on('click', function() {
        $('#playground-console').html('');
        initConnection();
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

    $('#btnRegister').on('click', function(e) {
      e.preventDefault();
      var request = {'app_register': 1, 'scopes':[]};

      var name     = document.getElementById('application-name').value,
          redirect = document.getElementById('application-redirect').value,
          homepage = document.getElementById('application-homepage').value,
          github   = document.getElementById('application-github').value,
          appstore = document.getElementById('application-appstore').value,
          google   = document.getElementById('application-googleplay').value;

      var scopesEl = document.forms['frmNewApplication'].elements[ 'scopes[]' ];

      if (Trim(name) !== '')     request['name']         = name;
      if (Trim(redirect) !== '') request['redirect_uri'] = redirect;
      if (Trim(homepage) !== '') request['homepage']     = homepage;
      if (Trim(github) !== '')   request['github']       = github;
      if (Trim(appstore) !== '') request['appstore']     = appstore;
      if (Trim(google) !== '')   request['googleplay']   = google;

      for (i = 0; i < scopesEl.length; i++) {
        if (scopesEl[i].checked) {
          request.scopes.push(scopesEl[i].value);
        }
      }

      api.sendRaw(JSON.stringify(request));
    });

    $('#scroll-to-bottom-btn').on('click', scrollConsoleToBottom);

    $console.on('scroll', function() {
        var shouldShow = consoleShouldScroll() && !$console.is(':animated');
        $('#scroll-to-bottom-btn').toggle(shouldShow);
    });

    $(window).on('hashchange', updateApiDisplayed);
    initConnection();
    showDemoForLanguage('javascript');
    updateApiDisplayed();
    $('#api-token').val(sessionStorage.getItem('token'));
});
