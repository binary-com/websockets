var DEFAULT_APP_ID   = 1089;
var DEFAULT_API_URL  = 'frontend.binaryws.com';
var DEFAULT_LANGUAGE = 'EN';

var api;
var $console;

// Add paths with same names as keys for fallback
require.config({
    baseUrl: getBaseUrl(),
    path: {
        '/docson/docson'      : '/docson/docson.js',
        '/lib/binary-live-api': '/lib/binary-live-api.js',
        '/lib/handlebars'     : '/lib/handlebars.js',
        '/lib/highlight'      : '/lib/highlight.js',
        '/lib/jquery'         : '/lib/jquery.js',
        '/lib/jsonpointer'    : '/lib/jsonpointer.js',
        '/lib/marked'         : '/lib/marked.js',
        '/lib/rainbow'        : '/lib/rainbow.js',
        '/lib/select2.min'    : '/lib/select2.min.js',
        '/lib/traverse'       : '/lib/traverse.js',
    }
});

require(["/lib/jquery.js"], function() {
    require(["/docson/docson.js", "/lib/select2.min.js"], init);
});

function init(docson) {
    $console = $('#playground-console');

    docson.templateBaseUrl = '/docson';

    $('#conn-error').hide();
    $('#connected').hide();

    $('[data-schema]').each(function() {
        var $this = $(this);
        loadAndDisplaySchema($this, $this.attr('data-schema'));
    });

    addEventListeners();
    initConnection();
    showDemoForLanguage('javascript');
    updateApiDisplayed();
    $('#api-token').val(sessionStorage.getItem('token'));
}

// -------------------------------
// ===== Connection Handling =====
// -------------------------------
function initConnection(language) {
    $('#connected').hide();
    $('#connecting').show();
    if (api && api.disconnect) {
        api.disconnect();
    }
    var LiveApi = window['binary-live-api'].LiveApi;
    api = new LiveApi({
        apiUrl  : 'wss://' + getServerUrl() + '/websockets/v3',
        language: language || DEFAULT_LANGUAGE,
        appId   : getAppId()
    });
    api.socket.onopen = function(e) {
        api.onOpen.apply(api, e);
        $('#connecting').hide();
        $('#connected').show();
        $('#api-url').text(api.apiUrl);
        endpointNotification();
    };
    api.events.on('*', incomingMessageHandler);
}

function resetEndpoint() {
    localStorage.removeItem('config.app_id');
    localStorage.removeItem('config.server_url');
    $('#endpoint-input').val(getServerUrl());
    $('#appid-input').val(getAppId());
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

// --------------------------
// ===== API Playground =====
// --------------------------
function updateApiDisplayed() {
    $('.sidebar-left a[href="' + window.location.pathname + '"]').parent().addClass('selected');
    var $apiCallSelector = $('#api-call-selector');
    if ($apiCallSelector.length === 0) return;

    var apiToDisplay = getCurrentApi();
    if (apiToDisplay) {
        $apiCallSelector.val(apiToDisplay).change();
    }
}

function getCurrentApi() {
    var apiPageStrIdx = window.location.href.indexOf('/#');

    if (!~apiPageStrIdx) return '';

    return window.location.href.substr(apiPageStrIdx + 2);
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

function getJsonPaths(method_name) {
    url_path = getBaseUrl() + 'config/v3/' + method_name + '/';
    return {
        send   : url_path + 'send.json',
        receive: url_path + 'receive.json',
        example: url_path + 'example.json',
    };
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

function sortRequiredFirst(schema, method_name) {
    if ((schema.required || []).length) {
        var req_obj = {};

        // Method name first, then Required properties
        if (schema.properties[method_name]) {
            req_obj[method_name] = schema.properties[method_name];
        }

        schema.required
            .filter(function(prop) {
                return prop !== method_name;
            })
            .sort(function(a, b) {
                return a.localeCompare(b);
            })
            .forEach(function(prop) {
                req_obj[prop] = schema.properties[prop];
            });

        schema.properties = Object.assign(req_obj, schema.properties);
    }
}

function loadAndDisplaySchema($node, schema_url, method_name, required_first) {
    $.get(schema_url, function(schema) {
        if (required_first) sortRequiredFirst(schema, method_name);

        docson.doc($node, schema, null, getBaseUrl());

        setTimeout(function() {
            $node[schema.deprecated ? 'addClass' : 'removeClass']('deprecated');
        }, 100);
    });
}

function loadAndEditJson($node, jsonUrl) {
    $.get(jsonUrl, function(exampleJson) {
        $node.val(JSON.stringify(exampleJson, null, 2));
    });
}

function customMatcher(params, data) {
    var search_term = (params.term || '').trim();

    if (!search_term) {
        return data;
    }

    if (typeof data.children === 'undefined') {
        return null;
    }

    var regexp = new RegExp(search_term, 'i');
    var filtered_children = data.children.filter(function(child) {
        return regexp.test([child.text, child.id]);
    });

    if (filtered_children.length) {
        var modified_data = $.extend({}, data, true);
        modified_data.children = filtered_children;
        return modified_data;
    }

    return null;
}

// ----------------------------------
// ===== Application Management =====
// ----------------------------------
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
        '<td class="flex-tr-child verification_uri" style="display:none">' + (application.verification_uri || '') + '</td>' +
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

        [
            'name',
            'redirect_uri',
            'verification_uri',
            'homepage',
            'github',
            'googleplay',
            'appstore',
            'app_markup_percentage',
        ].forEach(function(field) {
            $('#application-' + field).val($('#' + e.target.id + ' .' + field).text());
        });

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
                sendApplicationRequest(trim($('#placeholder_app_id').text()));
            });
        }
        $("html, body").animate({ scrollTop: 280 }, "slow");
    });
}

function sendApplicationRequest(app_id) {
    var request = app_id
        ? { 'app_update'  : app_id, 'scopes': [] }
        : { 'app_register': 1,      'scopes': [] };

    var fields = [
        'name',
        'redirect_uri',
        'verification_uri',
        'homepage',
        'github',
        'appstore',
        'googleplay',
        'app_markup_percentage',
    ];
    fields.forEach(function(fld) {
        var value = trim($('#application-' + fld).val());
        if (value) {
            request[fld] = value;
        }
    });

    var scopesEl = $("form:first :input[type='checkbox']");
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

    var columns = [
        'name',
        'app_id',
        'redirect_uri',
        'verification_uri',
    ];
    columns.forEach(function(col) {
        $('#' + application.app_id + ' .' + col).text(application[col]);
    });

    $('#' + application.app_id + ' .scopes').text(application.scopes.join(', '));
}

// -----------------------------
// ===== General Functions =====
// -----------------------------
function isProduction(url) {
    return url && /(developers\.binary\.com|binary\.sx)/i.test(url);
}

function isLocal(url) {
    return url && url.indexOf('//localhost') > 0;
}

function getBaseUrl(url) {
    url = url || document.location.href;
    return (isProduction(url) || isLocal(url) ? '' : '/' + url.split('/')[3]) + '/';
}

function getServerUrl() {
    return window.localStorage.getItem('config.server_url') || DEFAULT_API_URL;
}

function getAppId() {
    return window.localStorage.getItem("config.app_id") || DEFAULT_APP_ID;
}

function escapeHtml(unsafe) {
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function trim(str) {
    return (str || '').trim();
}

function endpointNotification() {
    var end_note = document.getElementById('end-note');
    if (end_note) {
        var server = getServerUrl();
        if (server && server !== DEFAULT_API_URL) {
            end_note.innerHTML = 'The server <a href="https://developers.binary.com/endpoint/">endpoint</a> is: ' + server;
            end_note.classList.remove('invisible');
        } else {
            end_note.innerHTML = '';
            end_note.classList.add('invisible');
        }
    }
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

function showDemoForLanguage(lang) {
    $('[data-language]').hide();
    $('[data-language="' + lang + '"]').show();
}

function addEventListeners() {
    $('#api-call-selector').select2({
        matcher: customMatcher,
    }).on('change', function() {
        var method_name = $('#api-call-selector').val();
        var json_paths  = getJsonPaths(method_name);

        loadAndDisplaySchema($('#playground-req-schema'), json_paths.send,    method_name, true);
        loadAndDisplaySchema($('#playground-res-schema'), json_paths.receive, method_name, false);
        loadAndEditJson(     $('#playground-request'),    json_paths.example);

        window.location.hash = method_name;
    });

    $('#api-language-selector').on('change', function() {
        initConnection($(this).val());
    });

    $('#endpoint-button').on('click', function() {
        localStorage.setItem('config.server_url', $('#endpoint-input').val());
        localStorage.setItem('config.app_id',     $('#appid-input').val());
        $('#conn-error').hide();

        initConnection();

        api.socket.onerror = function() {
            $('#conn-error').show();
            localStorage.removeItem('config.server_url');
            localStorage.removeItem('config.app_id');
            initConnection();
            $('#endpoint-input').val('');
            $('#appid-input').val('');
        };
    });

    $('#use-default-button').on('click', function() {
        $('#conn-error').hide();
        resetEndpoint();
    });

    $('#playground-send-btn').on('click', function() {
        updatePlaygroundWithRequestAndResponse();
    });

    $('#playground-reset-btn').on('click', function() {
        $('#playground-console').html('');
        initConnection();
    });

    $('#api-token').on('change', function() {
        sessionStorage.setItem('token', $(this).val());
    });

    $('#demo-language').on('change', function() {
        showDemoForLanguage($(this).val());
    });

    $('#mobile-page-selector')
        .val(window.location.pathname + window.location.hash)
        .on('change', function(event) {
            if (!event.originalEvent) return;
            window.location.href = $(this).val();
        });

    $('#send-auth-manually-btn').on('click', function() {
        var token = sessionStorage.getItem('token');
        authReqStr = JSON.stringify({
            authorize: token || ''
        }, null, 2);

        var $playgroundRequest = $('#playground-request');
        var lastContents = $playgroundRequest.val();
        $playgroundRequest.val(authReqStr);
        if (token) {
            $('#playground-send-btn').click();
            $playgroundRequest.val(lastContents);
        } else {
            window.location.hash = 'authorize';
            $playgroundRequest.focus();
        }
    });

    $('#btnRegister').on('click', function(e) {
        e.preventDefault();
        sendApplicationRequest();
    });

    $('#scroll-to-bottom-btn').on('click', scrollConsoleToBottom);

    $console.on('scroll', function() {
        var shouldShow = consoleShouldScroll() && !$console.is(':animated');
        $('#scroll-to-bottom-btn').toggle(shouldShow);
    });

    $(window).on('hashchange', updateApiDisplayed);
}
