require.config({
    baseUrl: '/'
});

var LiveApi = window['binary-live-api'].LiveApi;

var defaultAppId = 1089;
var defaultApiUrl = 'wss://ws.binaryws.com/websockets/v3';

var appId = localStorage.getItem('appId') || defaultAppId;
var apiUrl = localStorage.getItem('apiUrl') || defaultApiUrl;
var langCode = 'en';
var pathname = document.location.pathname;
// handle deploying to forks as well as production route
pathname = /\.github\.io$/i.test(window.location.hostname) ? 'websockets/' : '';

var getPath = function(path) {
    return pathname + path;
};

require([getPath("docson/docson"), getPath("lib/jquery"), getPath("lib/select2.min")], function(docson) {

    var api,
        $console = $('#playground-console');

    docson.templateBaseUrl = '/' + getPath('docson');

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
        api = new LiveApi({
            apiUrl: apiUrl,
            language: langCode,
            appId: appId
        });
        api.socket.onopen = function(e) {
            api.onOpen.apply(api, e);
            $('#connecting').hide();
            $('#connected').show();
            $('#api-url').text(apiUrl);
        };
        api.events.on('*', incomingMessageHandler);
    }

    function resetEndpoint() {
        appId = defaultAppId;
        apiUrl = defaultApiUrl;
        localStorage.removeItem('appId');
        localStorage.removeItem('apiUrl');
        $('#endpoint-input').val('');
        $('#appid-input').val('');
        initConnection();
    }

    function incomingMessageHandler(json) {
        var authorizationError = !!(json.error && json.error.code === "AuthorizationRequired"),
            prettyJson = getFormattedJsonStr(json);
        console.log(json); // intended to help developers, not for debugging, do not remove
        $('.progress').remove();
        appendToConsoleAndScrollIntoView(prettyJson);
        $('#unauthorized-error').toggle(authorizationError);
        if (!json.error) handleApplicationsResponse(json);
    }

    function handleApplicationsResponse(response) {
      if (response.msg_type === 'authorize' && $('#applications-table').length !== 0) {
        api.sendRaw({"app_list": 1});
      } else if (response.msg_type === 'app_list' && response.app_list.length !== 0) {
        listAllApplications(response);
      } else if (response.msg_type === 'app_register') {
        addApplication(response);
      } else if (response.msg_type === 'app_delete') {
        $('tr[id=' + response.echo_req.app_delete + ']').fadeOut(700).remove();
      } else if (response.msg_type === 'app_update') {
        updateApplication(response);
      }
    }

    function listAllApplications(response) {
      var applications = response.app_list;
      for (i = 0; i < applications.length; i++) {
        if ($('#' + applications[i].app_id).length === 0) {
          applicationsTableRow(applications[i]);
        }
      }
      $('#applications-table').show();
    }

    function addApplication(response) {
        var application = response.app_register;
        applicationsTableRow(application);
    }

    function applicationsTableRow(application) {
      $('#applications-table').find('tbody').append(
        '<tr class="flex-tr" id="' + application.app_id + '">' +
          '<td class="flex-tr-child name">' + application.name + '</td>' +
          '<td class="flex-tr-child app_id">' + application.app_id + '</td>' +
          '<td class="flex-tr-child scopes">' + application.scopes.join(', ') + '</td>' +
          '<td class="flex-tr-child redirect_uri">' + application.redirect_uri + '</td>' +
          '<td class="flex-tr-child homepage" style="display:none">' + application.homepage + '</td>' +
          '<td class="flex-tr-child github" style="display:none">' + application.github + '</td>' +
          '<td class="flex-tr-child googleplay" style="display:none">' + application.googleplay + '</td>' +
          '<td class="flex-tr-child appstore" style="display:none">' + application.appstore + '</td>' +
          '<td class="flex-tr-child app_markup_percentage" style="display:none">' + application.app_markup_percentage + '</td>' +
          '<td class="action flex-tr-child"><button class="delete" id="' + application.app_id + '">Delete</button></td>' +
          '<td class="action flex-tr-child"><button class="update" id="' + application.app_id + '">Update</button></td>' +
        '</tr>'
      ).end().show();
      $('button[id=' + application.app_id + '][class="delete"]').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        api.sendRaw({'app_delete':e.target.id});
      });
      $('button[id=' + application.app_id + '][class="update"]').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $legend = $('#frmNewApplication').find('legend');
        $legend.html($legend.html().replace('Register an', 'Update'));
        $('#placeholder_app_id').text(' ' + e.target.id + ' ').attr('style', 'background:#ffffe0');
        $('#application-name').val($('#' + e.target.id + ' .name').text());
        $('#application-redirect').val($('#' + e.target.id + ' .redirect_uri').text());
        $('#application-homepage').val($('#' + e.target.id + ' .homepage').text());
        $('#application-github').val($('#' + e.target.id + ' .github').text());
        $('#application-googleplay').val($('#' + e.target.id + ' .googleplay').text());
        $('#application-appstore').val($('#' + e.target.id + ' .appstore').text());
        $('#application-markup').val($('#' + e.target.id + ' .app_markup_percentage').text());
        var array = $('#' + e.target.id + ' .scopes').text().split(', '),
            $scopes = $('.scopes input'),
            i;
        for (i = 0; i < array.length; i++) {
          array[i] = array[i] + '-scope';
        }
        for (i = 0; i < $scopes.length; i++) {
          if ($.inArray($scopes[i].id, array) > -1) {
            $('.scopes input[id="' + $scopes[i].id + '"').prop('checked', true);
          } else {
            $('.scopes input[id="' + $scopes[i].id + '"').prop('checked', false);
          }
        }
          // can't store btnupdate in a variable since it won't exist first
          if ($('#btnUpdate').length === 0) {
          $('.application_buttons').prepend('<button id="btnUpdate">Update</button> Or');
          $('#btnRegister').text('Register as New Application');
          $('#btnUpdate').on('click', function(e) {
            e.preventDefault();
            send_application_request(Trim($('#placeholder_app_id').text()));
          });
        }
        $("html, body").animate({ scrollTop: 280 }, "slow");
      });
    }

    function send_application_request(update) {
      var request;
      if (update) {
        request = {'app_update': update, 'scopes':[]};
      } else {
        request = {'app_register': 1, 'scopes':[]};
      }

      var name     = Trim($('#application-name').val()),
          redirect = Trim($('#application-redirect').val()),
          homepage = Trim($('#application-homepage').val()),
          github   = Trim($('#application-github').val()),
          appstore = Trim($('#application-appstore').val()),
          google   = Trim($('#application-googleplay').val()),
          markup   = Trim($('#application-markup').val());

      var scopesEl = $("form:first :input[type='checkbox']");

      if (name !== '')     request['name']                  = name;
      if (redirect !== '') request['redirect_uri']          = redirect;
      if (homepage !== '') request['homepage']              = homepage;
      if (github !== '')   request['github']                = github;
      if (appstore !== '') request['appstore']              = appstore;
      if (google !== '')   request['googleplay']            = google;
      if (markup !== '')   request['app_markup_percentage'] = markup;

      for (i = 0; i < scopesEl.length; i++) {
        if (scopesEl[i].checked) {
          request.scopes.push(scopesEl[i].value);
        }
      }
      $('#playground-request').val(JSON.stringify(request, null, 2));
      api.sendRaw(request);
    }

    function updateApplication(response) {
      var application = response.app_update;
      $('#' + application.app_id + ' .name').text(application.name);
      $('#' + application.app_id + ' .app_id').text(application.app_id);
      $('#' + application.app_id + ' .scopes').text(application.scopes.join(', '));
      $('#' + application.app_id + ' .redirect_uri').text(application.redirect_uri);
    }

    function getCurrentApi() {
        var apiPageStrIdx = window.location.href.indexOf('/#');

        if (!~apiPageStrIdx) return '';

        return window.location.href.substr(apiPageStrIdx + 2);
    }

    function jsonToPretty(json, offset) {

        var spaces = function(n) {
            return new Array(n + 1).join(" ");
        };

        var span = function(val, className) {
            return '<span class="' + className + '">' + escapeHtml(val) + '</span>';
        };

        var valToStr = function(val, offset) {
            if (typeof val === 'string') {
                return span('"' + val + '"', 'string');
            } else if (typeof val === 'number') {
                return span(val, 'number');
            } else if (Array.isArray(val)) {
                var elements = val.map(function(val) {
                    return spaces(offset + 2) + valToStr(val, offset + 2);
                }).join(',\n');
                return '[\n' + elements + '\n' + spaces(offset) + ']';
            } else if (typeof val === 'boolean') {
                return span(val, 'boolean');
            } else {
                return objToStr(val, offset);
            }
        };

        var propsToStr = function(obj, offset) {
            var keyStr = Object.keys(obj).map(function(key) {
                return spaces(offset) + span('"' + key + '"', 'key') + ': ' + valToStr(obj[key], offset);
            });
            return keyStr.join(',\n');
        };

        var objToStr = function(obj, offset) {
            if (!obj || Object.keys(obj).length === 0) return '{}';
            return (
                '{\n' +
                propsToStr(obj, offset + 2) + '\n' +
                spaces(offset) + '}'
            )
        };

        return objToStr(json, offset || 0);
    }

    function getFormattedJsonStr(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return (json.error ? '<pre class="error">' : '<pre>') +
            jsonToPretty(json) +
            '</pre>';
    }

    function loadAndDisplaySchema($node, schemaUrl) {
        $.get(schemaUrl, function(schema) {
            docson.doc($node, schema);
        });
    }

    function loadAndEditJson($node, jsonUrl) {
        $.get(jsonUrl, function(exampleJson) {
            $node.val(JSON.stringify(exampleJson, null, 2));
        });
    }

    function scrollConsoleToBottom() {
        $console.stop(false, true);
        $console.animate({
            scrollTop: $console[0].scrollHeight
        }, 500);
    }

    function consoleShouldScroll() {
        return Math.abs($console[0].scrollHeight - $console.scrollTop() - $console.outerHeight()) > 10;
    }

    function appendToConsoleAndScrollIntoView(html) {
        $console.stop(false, true);

        setTimeout(function() {
            $console.append(html);

            if (consoleShouldScroll()) {
                scrollConsoleToBottom();
                setTimeout(function() {
                    if (consoleShouldScroll()) {
                        $console.animate({
                            scrollTop: $console[0].scrollHeight
                        }, 500);
                    }
                }, 1500);
            }
        }, 0);
    }

    function updatePlaygroundWithRequestAndResponse() {

        try {
            var json = JSON.parse($('#playground-request').val());
        } catch (err) {
            alert('Invalid JSON!');
            return;
        }

        appendToConsoleAndScrollIntoView('<pre class="req">' + jsonToPretty(json) + '</pre>' + '<div class="progress"></div>');
        api.sendRaw(json);
    }

    // trim leading and trailing white space
    function Trim(str) {
        while (str.charAt(0) === (" ")) {
            str = str.substring(1);
        }
        while (str.charAt(str.length - 1) === " ") {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }

    $('[data-schema]').each(function() {
        var $this = $(this);
        loadAndDisplaySchema($this, $this.attr('data-schema'));
    });

    $('#api-call-selector').select2().on('change', function() {
        var verStr = 'v3',
            apiStr = $('#api-call-selector').val(),
            urlPath = '/' + getPath('config/' + verStr + '/' + apiStr + '/'),
            requestSchemaUrl = urlPath + 'send.json',
            responseSchemaUrl = urlPath + 'receive.json',
            exampleJsonUrl = urlPath + 'example.json';
        loadAndDisplaySchema($('#playground-req-schema'), requestSchemaUrl);
        loadAndDisplaySchema($('#playground-res-schema'), responseSchemaUrl);
        loadAndEditJson($('#playground-request'), exampleJsonUrl);
        window.location.hash = apiStr;
    });

    $('#api-language-selector').on('change', function() {
        langCode = $('#api-language-selector').val();
        initConnection();
    });

    // $('#api-version-selector').on('change', function() {
    //     $('#endpoint-input').val('');
    //     apiUrl = 'wss://ws.binaryws.com/websockets/' + $('#api-version-selector').val();
    //     initConnection();
    // });

    $('#endpoint-button').on('click', function() {
        apiUrl = 'wss://' + $('#endpoint-input').val() + '/websockets/v3';
        appId = $('#appid-input').val();

        localStorage.setItem('apiUrl', apiUrl);
        localStorage.setItem('appId', appId);

        $('#conn-error').hide();
        initConnection();
        api.socket.onerror = function() {
            $('#conn-error').show();
            localStorage.removeItem('apiUrl');
            localStorage.removeItem('appId');
            apiUrl = defaultApiUrl;
            appId = defaultAppId;
            initConnection();
            $('#endpoint-input').val('');
        };
    });

    $('#use-default-button').on('click', function() {
        $('#conn-error').hide();
        resetEndpoint();
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

    var $apiToken = $('#api-token');
    $apiToken.on('change', function() {
        sessionStorage.setItem('token', $apiToken.val());
        console.log($apiToken.val())
    });

    function showDemoForLanguage(lang) {
        $('[data-language]').hide();
        $('[data-language="' + lang + '"]').show();
    }

    $('#demo-language').on('change', function() {
        showDemoForLanguage($(this).val());
    });

    $('#mobile-page-selector')
        .val(window.location.pathname + window.location.hash)
        .on('change', function(event) {
            if (!event.originalEvent) return;

            window.location.href = $(this).val();
            console.log('going to ', $(this).val());
        });

    function updateApiDisplayed() {
        $('.sidebar-left a[href="' + window.location.pathname + '"]').parent().addClass('selected');
        var $apiCallSelector = $('#api-call-selector');
        if ($apiCallSelector.length === 0) return;

        var apiToDisplay = getCurrentApi();
        if (apiToDisplay) {
            $apiCallSelector.val(apiToDisplay).change();
        }
    }

    $('#send-auth-manually-btn').on('click', function() {
        var token = sessionStorage.getItem('token');
        authReqStr = JSON.stringify({
            authorize: token || ''
        }, null, 2);

        var $playgroundRequest = $('#playground-request');
        $playgroundRequest.val(authReqStr);
        if (token) {
            $('#playground-send-btn').click();
        } else {
            $playgroundRequest.focus();
        }
    });

    $('#btnRegister').on('click', function(e) {
      e.preventDefault();
      send_application_request();
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
    $apiToken.val(sessionStorage.getItem('token'));

});
