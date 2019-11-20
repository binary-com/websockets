(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["binary-live-api"] = factory();
	else
		root["binary-live-api"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LiveEvents = function () {
	    function LiveEvents() {
	        _classCallCheck(this, LiveEvents);
	
	        this.messageHandlers = {};
	    }
	
	    _createClass(LiveEvents, [{
	        key: 'emitSingle',
	        value: function emitSingle(msgType, msgData) {
	            var handlers = this.messageHandlers[msgType] || [];
	            handlers.forEach(function (handler) {
	                handler(msgData);
	            });
	        }
	    }, {
	        key: 'emitWildcard',
	        value: function emitWildcard(msgData) {
	            var handlers = this.messageHandlers['*'] || [];
	            handlers.forEach(function (handler) {
	                handler(msgData);
	            });
	        }
	    }, {
	        key: 'emit',
	        value: function emit(msgType, msgData) {
	            this.emitSingle(msgType, msgData);
	            this.emitWildcard(msgData);
	        }
	    }, {
	        key: 'on',
	        value: function on(msgType, callback) {
	            if (!this.messageHandlers[msgType]) {
	                this.messageHandlers[msgType] = [callback];
	            } else {
	                this.messageHandlers[msgType].push(callback);
	            }
	        }
	    }]);
	
	    return LiveEvents;
	}();
	
	exports.default = LiveEvents;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OAuth = exports.LiveApi = exports.LiveEvents = undefined;
	
	var _LiveEvents2 = __webpack_require__(0);
	
	var _LiveEvents3 = _interopRequireDefault(_LiveEvents2);
	
	var _LiveApi2 = __webpack_require__(2);
	
	var _LiveApi3 = _interopRequireDefault(_LiveApi2);
	
	var _OAuth2 = __webpack_require__(3);
	
	var _OAuth = _interopRequireWildcard(_OAuth2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.LiveEvents = _LiveEvents3.default;
	exports.LiveApi = _LiveApi3.default;
	exports.OAuth = _OAuth;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _getUniqueId = __webpack_require__(14);
	
	var _getUniqueId2 = _interopRequireDefault(_getUniqueId);
	
	var _LiveEvents = __webpack_require__(0);
	
	var _LiveEvents2 = _interopRequireDefault(_LiveEvents);
	
	var _ServerError = __webpack_require__(4);
	
	var _ServerError2 = _interopRequireDefault(_ServerError);
	
	var _calls = __webpack_require__(6);
	
	var calls = _interopRequireWildcard(_calls);
	
	var _stateful = __webpack_require__(12);
	
	var stateful = _interopRequireWildcard(_stateful);
	
	var _custom = __webpack_require__(11);
	
	var customCalls = _interopRequireWildcard(_custom);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	(0, _getUniqueId2.default)(); // skip 0 value
	var defaultApiUrl = 'wss://ws.binaryws.com/websockets/v3';
	var MockWebSocket = function MockWebSocket() {};
	var WebSocket = typeof window !== 'undefined' ? window.WebSocket : MockWebSocket;
	
	var shouldIgnoreError = function shouldIgnoreError(error) {
	    return error.message.includes('You are already subscribed to') || error.message.includes('Input validation failed: forget');
	};
	
	var LiveApi = function () {
	    function LiveApi() {
	        var _this = this;
	
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        var _ref$apiUrl = _ref.apiUrl;
	        var apiUrl = _ref$apiUrl === undefined ? defaultApiUrl : _ref$apiUrl;
	        var _ref$language = _ref.language;
	        var language = _ref$language === undefined ? 'en' : _ref$language;
	        var _ref$appId = _ref.appId;
	        var appId = _ref$appId === undefined ? 0 : _ref$appId;
	        var websocket = _ref.websocket;
	        var connection = _ref.connection;
	        var keepAlive = _ref.keepAlive;
	
	        _classCallCheck(this, LiveApi);
	
	        this.apiUrl = apiUrl;
	        this.language = language;
	        this.appId = appId;
	        if (keepAlive) {
	            setInterval(function () {
	                return _this.ping();
	            }, 60 * 1000);
	        }
	
	        if (websocket) {
	            WebSocket = websocket;
	        }
	
	        this.status = LiveApi.Status.Unknown;
	
	        this.bufferedSends = [];
	        this.bufferedExecutes = [];
	        this.unresolvedPromises = {};
	
	        this.events = new _LiveEvents2.default();
	
	        this.bindCallsAndStateMutators();
	
	        this.connect(connection);
	    }
	
	    _createClass(LiveApi, [{
	        key: 'bindCallsAndStateMutators',
	        value: function bindCallsAndStateMutators() {
	            var _this2 = this;
	
	            Object.keys(calls).forEach(function (callName) {
	                _this2[callName] = function () {
	                    if (stateful[callName]) {
	                        stateful[callName].apply(stateful, arguments);
	                    }
	                    return _this2.send(calls[callName].apply(calls, arguments));
	                };
	            });
	
	            Object.keys(customCalls).forEach(function (callName) {
	                _this2[callName] = function () {
	                    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	                        params[_key] = arguments[_key];
	                    }
	
	                    return customCalls[callName].apply(customCalls, [_this2].concat(params));
	                }; // seems to be a good place to do some simple cache
	            });
	        }
	    }, {
	        key: 'connect',
	        value: function connect(connection) {
	            var urlPlusParams = this.apiUrl + '?l=' + this.language + '&app_id=' + this.appId;
	
	            try {
	                this.socket = connection || new WebSocket(urlPlusParams);
	            } catch (err) {
	                // swallow connection error, we can't do anything about it
	            } finally {
	                this.socket.onopen = this.onOpen.bind(this);
	                this.socket.onclose = this.onClose.bind(this);
	                this.socket.onmessage = this.onMessage.bind(this);
	            }
	        }
	    }, {
	        key: 'disconnect',
	        value: function disconnect() {
	            this.token = '';
	            this.socket.onclose = undefined;
	            this.socket.close();
	        }
	    }, {
	        key: 'resubscribe',
	        value: function resubscribe() {
	            var _this3 = this;
	
	            var _stateful$getState = stateful.getState();
	
	            var token = _stateful$getState.token;
	            var balance = _stateful$getState.balance;
	            var portfolio = _stateful$getState.portfolio;
	            var transactions = _stateful$getState.transactions;
	            var ticks = _stateful$getState.ticks;
	            var proposals = _stateful$getState.proposals;
	
	
	            var delayedCallAfterAuthSuccess = function delayedCallAfterAuthSuccess() {
	                if (balance) {
	                    _this3.subscribeToBalance();
	                }
	
	                if (transactions) {
	                    _this3.subscribeToTransactions();
	                }
	
	                if (portfolio) {
	                    _this3.subscribeToAllOpenContracts();
	                }
	
	                _this3.onAuth = undefined;
	            };
	            this.onAuth = delayedCallAfterAuthSuccess;
	
	            if (token) {
	                this.authorize(token);
	            }
	
	            ticks.forEach(function (tick) {
	                return _this3.subscribeToTick(tick);
	            });
	
	            proposals.forEach(function (proposal) {
	                return _this3.subscribeToPriceForContractProposal(proposal);
	            });
	        }
	    }, {
	        key: 'changeLanguage',
	        value: function changeLanguage(ln) {
	            if (ln === this.language) {
	                return;
	            }
	            this.socket.onclose = undefined;
	            this.socket.close();
	            this.language = ln;
	            this.connect();
	            this.resubscribe();
	        }
	    }, {
	        key: 'isReady',
	        value: function isReady() {
	            return this.socket && this.socket.readyState === 1;
	        }
	    }, {
	        key: 'sendBufferedSends',
	        value: function sendBufferedSends() {
	            while (this.bufferedSends.length > 0) {
	                this.socket.send(JSON.stringify(this.bufferedSends.shift()));
	            }
	        }
	    }, {
	        key: 'executeBufferedExecutes',
	        value: function executeBufferedExecutes() {
	            while (this.bufferedExecutes.length > 0) {
	                this.bufferedExecutes.shift()();
	            }
	        }
	    }, {
	        key: 'onOpen',
	        value: function onOpen() {
	            this.sendBufferedSends();
	            this.executeBufferedExecutes();
	        }
	    }, {
	        key: 'onClose',
	        value: function onClose() {
	            this.reconnect();
	        }
	    }, {
	        key: 'reconnect',
	        value: function reconnect() {
	            this.connect();
	            this.resubscribe();
	        }
	    }, {
	        key: 'resolvePromiseForResponse',
	        value: function resolvePromiseForResponse(json) {
	            if (typeof json.req_id === 'undefined') {
	                return Promise.resolve();
	            }
	
	            var reqId = json.req_id.toString();
	            var promise = this.unresolvedPromises[reqId];
	
	            if (!promise) {
	                return Promise.resolve();
	            }
	
	            delete this.unresolvedPromises[reqId];
	            if (!json.error) {
	                return promise.resolve(json);
	            }
	
	            if (!shouldIgnoreError(json.error)) {
	                return promise.reject(new _ServerError2.default(json));
	            }
	
	            return Promise.resolve();
	        }
	    }, {
	        key: 'onMessage',
	        value: function onMessage(message) {
	            var json = JSON.parse(message.data);
	
	            if (!json.error) {
	                if (json.msg_type === 'authorize' && this.onAuth) {
	                    this.onAuth();
	                }
	                this.events.emit(json.msg_type, json);
	            } else {
	                this.events.emit('error', json);
	            }
	
	            return this.resolvePromiseForResponse(json);
	        }
	    }, {
	        key: 'generatePromiseForRequest',
	        value: function generatePromiseForRequest(json) {
	            var _this4 = this;
	
	            var reqId = json.req_id.toString();
	
	            return new Promise(function (resolve, reject) {
	                _this4.unresolvedPromises[reqId] = { resolve: resolve, reject: reject };
	            });
	        }
	    }, {
	        key: 'sendRaw',
	        value: function sendRaw(json) {
	            if (this.isReady()) {
	                this.socket.send(JSON.stringify(json));
	            } else {
	                this.bufferedSends.push(json);
	            }
	
	            if (typeof json.req_id !== 'undefined') {
	                return this.generatePromiseForRequest(json);
	            }
	        }
	    }, {
	        key: 'send',
	        value: function send(json) {
	            var reqId = (0, _getUniqueId2.default)();
	            return this.sendRaw(_extends({
	                req_id: reqId
	            }, json));
	        }
	    }, {
	        key: 'execute',
	        value: function execute(func) {
	            if (this.isReady()) {
	                func();
	            } else {
	                this.bufferedExecutes.push(func);
	            }
	        }
	    }]);
	
	    return LiveApi;
	}();
	
	LiveApi.Status = {
	    Unknown: 'unknown',
	    Connected: 'connected'
	};
	exports.default = LiveApi;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var oauthUrl = exports.oauthUrl = function oauthUrl(appId) {
	    return 'https://www.binary.com/oauth2/authorize?app_id=' + appId;
	};
	
	var oauthUrlWithLanguage = exports.oauthUrlWithLanguage = function oauthUrlWithLanguage(appId, langCode) {
	    return 'https://www.binary.com/oauth2/authorize?app_id=' + appId + '&l=' + langCode;
	};
	
	var parseOAuthResponse = exports.parseOAuthResponse = function parseOAuthResponse(responseUrl) {
	    var matcher = /acct\d=(\w+)&token\d=([\w-]+)/g;
	    var urlParts = responseUrl.split('/redirect?');
	    if (urlParts.length !== 2) throw new Error('Not a valid url');
	
	    var params = urlParts[1].split(matcher);
	
	    var accounts = [];
	
	    for (var i = 1; i < params.length; i += 3) {
	        accounts.push({
	            account: params[i],
	            token: params[i + 1]
	        });
	    }
	
	    return accounts;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ServerError = function (_Error) {
	    _inherits(ServerError, _Error);
	
	    function ServerError() {
	        var errorObj = arguments.length <= 0 || arguments[0] === undefined ? { error: {} } : arguments[0];
	
	        _classCallCheck(this, ServerError);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServerError).call(this, errorObj));
	
	        _this.stack = new Error().stack;
	        _this.error = errorObj;
	        _this.name = _this.constructor.name;
	
	        var message = errorObj.error.message;
	        var echo_req = errorObj.echo_req;
	
	        _this.message = "[ServerError] " + message + "\n" + JSON.stringify(echo_req, 2);
	        return _this;
	    }
	
	    return ServerError;
	}(Error);
	
	exports.default = ServerError;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var deleteApiToken = exports.deleteApiToken = function deleteApiToken(token) {
	    return {
	        api_token: 1,
	        delete_token: token
	    };
	};
	
	var getApiTokens = exports.getApiTokens = function getApiTokens() {
	    return {
	        api_token: 1
	    };
	};
	
	var createApiToken = exports.createApiToken = function createApiToken(token, scopes) {
	    return {
	        api_token: 1,
	        new_token: token,
	        new_token_scopes: scopes
	    };
	};
	
	var changePassword = exports.changePassword = function changePassword(oldPw, newPw) {
	    return {
	        change_password: 1,
	        old_password: oldPw,
	        new_password: newPw
	    };
	};
	
	var registerApplication = exports.registerApplication = function registerApplication(options) {
	    return _extends({
	        app_register: 1
	    }, options);
	};
	
	var getAllAppList = exports.getAllAppList = function getAllAppList() {
	    return {
	        app_list: 1
	    };
	};
	
	var getAppslistById = exports.getAppslistById = function getAppslistById(appid) {
	    return {
	        app_get: appid
	    };
	};
	
	var deleteApplication = exports.deleteApplication = function deleteApplication(appid) {
	    return {
	        app_delete: appid
	    };
	};
	
	var createRealAccountMaltaInvest = exports.createRealAccountMaltaInvest = function createRealAccountMaltaInvest(options) {
	    return _extends({
	        new_account_maltainvest: 1
	    }, options);
	};
	
	var createRealAccount = exports.createRealAccount = function createRealAccount(options) {
	    return _extends({
	        new_account_real: 1
	    }, options);
	};
	
	var setAccountCurrency = exports.setAccountCurrency = function setAccountCurrency(currency) {
	    return {
	        set_account_currency: currency
	    };
	};
	
	var setSelfExclusion = exports.setSelfExclusion = function setSelfExclusion(options) {
	    return _extends({
	        set_self_exclusion: 1
	    }, options);
	};
	
	var setAccountSettings = exports.setAccountSettings = function setAccountSettings(options) {
	    return _extends({
	        set_settings: 1
	    }, options);
	};
	
	var setTnCApproval = exports.setTnCApproval = function setTnCApproval() {
	    return {
	        tnc_approval: 1
	    };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _unauthenticated = __webpack_require__(10);
	
	Object.keys(_unauthenticated).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _unauthenticated[key];
	    }
	  });
	});
	
	var _read = __webpack_require__(8);
	
	Object.keys(_read).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _read[key];
	    }
	  });
	});
	
	var _trade = __webpack_require__(9);
	
	Object.keys(_trade).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _trade[key];
	    }
	  });
	});
	
	var _payments = __webpack_require__(7);
	
	Object.keys(_payments).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _payments[key];
	    }
	  });
	});
	
	var _admin = __webpack_require__(5);
	
	Object.keys(_admin).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _admin[key];
	    }
	  });
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var getCashierLockStatus = exports.getCashierLockStatus = function getCashierLockStatus() {
	    return {
	        cashier_password: 1
	    };
	};
	
	var setCashierLock = exports.setCashierLock = function setCashierLock(options) {
	    return _extends({
	        cashier_password: 1
	    }, options);
	};
	
	var withdrawToPaymentAgent = exports.withdrawToPaymentAgent = function withdrawToPaymentAgent(options) {
	    return _extends({
	        paymentagent_withdraw: 1
	    }, options);
	};
	
	var paymentAgentTransfer = exports.paymentAgentTransfer = function paymentAgentTransfer(options) {
	    return _extends({
	        paymentagent_transfer: 1
	    }, options);
	};
	
	var transferBetweenAccounts = exports.transferBetweenAccounts = function transferBetweenAccounts(options) {
	    return _extends({
	        transfer_between_accounts: 1
	    }, options);
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var getAccountLimits = exports.getAccountLimits = function getAccountLimits() {
	    return {
	        get_limits: 1
	    };
	};
	
	var getAccountSettings = exports.getAccountSettings = function getAccountSettings() {
	    return {
	        get_settings: 1
	    };
	};
	
	var getAccountStatus = exports.getAccountStatus = function getAccountStatus() {
	    return {
	        get_account_status: 1
	    };
	};
	
	var getSelfExclusion = exports.getSelfExclusion = function getSelfExclusion() {
	    return {
	        get_self_exclusion: 1
	    };
	};
	
	var logOut = exports.logOut = function logOut() {
	    return {
	        logout: 1
	    };
	};
	
	var getStatement = exports.getStatement = function getStatement(options) {
	    return _extends({
	        statement: 1
	    }, options);
	};
	
	var getPortfolio = exports.getPortfolio = function getPortfolio() {
	    return {
	        portfolio: 1
	    };
	};
	
	var getProfitTable = exports.getProfitTable = function getProfitTable(options) {
	    return _extends({
	        profit_table: 1
	    }, options);
	};
	
	var getRealityCheckSummary = exports.getRealityCheckSummary = function getRealityCheckSummary() {
	    return {
	        reality_check: 1
	    };
	};
	
	var subscribeToBalance = exports.subscribeToBalance = function subscribeToBalance() {
	    return {
	        balance: 1,
	        subscribe: 1
	    };
	};
	
	var unsubscribeFromBalance = exports.unsubscribeFromBalance = function unsubscribeFromBalance() {
	    return {
	        balance: 1,
	        subscribe: 0
	    };
	};
	
	var subscribeToOpenContract = exports.subscribeToOpenContract = function subscribeToOpenContract(contractId) {
	    return {
	        proposal_open_contract: 1,
	        subscribe: 1,
	        contract_id: contractId
	    };
	};
	
	var getContractInfo = exports.getContractInfo = function getContractInfo(contractId) {
	    return {
	        proposal_open_contract: 1,
	        contract_id: contractId
	    };
	};
	
	var subscribeToAllOpenContracts = exports.subscribeToAllOpenContracts = function subscribeToAllOpenContracts() {
	    return {
	        proposal_open_contract: 1,
	        subscribe: 1
	    };
	};
	
	var unsubscribeFromAllOpenContracts = exports.unsubscribeFromAllOpenContracts = function unsubscribeFromAllOpenContracts() {
	    return {
	        proposal_open_contract: 1,
	        subscribe: 0
	    };
	};
	
	var subscribeToTransactions = exports.subscribeToTransactions = function subscribeToTransactions() {
	    return {
	        transaction: 1,
	        subscribe: 1
	    };
	};
	
	var unsubscribeFromTransactions = exports.unsubscribeFromTransactions = function unsubscribeFromTransactions() {
	    return {
	        transaction: 1,
	        subscribe: 0
	    };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var buyContract = exports.buyContract = function buyContract(contractId, price) {
	    return {
	        buy: contractId,
	        price: price
	    };
	};
	
	var sellContract = exports.sellContract = function sellContract(contractId, price) {
	    return {
	        sell: contractId,
	        price: price
	    };
	};
	
	var sellExpiredContracts = exports.sellExpiredContracts = function sellExpiredContracts() {
	    return {
	        sell_expired: 1
	    };
	};
	
	var topUpVirtualAccount = exports.topUpVirtualAccount = function topUpVirtualAccount() {
	    return {
	        topup_virtual: 1
	    };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var getActiveSymbolsBrief = exports.getActiveSymbolsBrief = function getActiveSymbolsBrief() {
	    return {
	        active_symbols: 'brief'
	    };
	};
	
	var getActiveSymbolsFull = exports.getActiveSymbolsFull = function getActiveSymbolsFull() {
	    return {
	        active_symbols: 'full'
	    };
	};
	
	var getAssetIndex = exports.getAssetIndex = function getAssetIndex() {
	    return {
	        asset_index: 1
	    };
	};
	
	var authorize = exports.authorize = function authorize(token) {
	    return {
	        authorize: token
	    };
	};
	
	var getContractsForSymbol = exports.getContractsForSymbol = function getContractsForSymbol(symbol) {
	    return {
	        contracts_for: symbol
	    };
	};
	
	var unsubscribeFromTick = exports.unsubscribeFromTick = function unsubscribeFromTick(symbol) {
	    return {
	        forget: symbol
	    };
	};
	
	var unsubscribeFromTicks = exports.unsubscribeFromTicks = function unsubscribeFromTicks(symbols) {
	    return symbols.forEach(undefined.unsubscribeFromTick);
	};
	
	var unsubscribeByID = exports.unsubscribeByID = function unsubscribeByID(id) {
	    return {
	        forget: id
	    };
	};
	
	var unsubscribeFromAllTicks = exports.unsubscribeFromAllTicks = function unsubscribeFromAllTicks() {
	    return {
	        forget_all: 'ticks'
	    };
	};
	
	var unsubscribeFromAllProposals = exports.unsubscribeFromAllProposals = function unsubscribeFromAllProposals() {
	    return {
	        forget_all: 'proposal'
	    };
	};
	
	var unsubscribeFromAllPortfolios = exports.unsubscribeFromAllPortfolios = function unsubscribeFromAllPortfolios() {
	    return {
	        forget_all: 'portfolio'
	    };
	};
	
	var unsubscribeFromAlProposals = exports.unsubscribeFromAlProposals = function unsubscribeFromAlProposals() {
	    return {
	        forget_all: 'proposal_open_contract'
	    };
	};
	
	var getLandingCompany = exports.getLandingCompany = function getLandingCompany(landingCompany) {
	    return {
	        landing_company: landingCompany
	    };
	};
	
	var getLandingCompanyDetails = exports.getLandingCompanyDetails = function getLandingCompanyDetails(landingCompany) {
	    return {
	        landing_company_details: landingCompany
	    };
	};
	
	var createVirtualAccount = exports.createVirtualAccount = function createVirtualAccount(options) {
	    return _extends({
	        new_account_virtual: 1
	    }, options);
	};
	
	var ping = exports.ping = function ping() {
	    return {
	        ping: 1
	    };
	};
	
	var getPaymentAgentsForCountry = exports.getPaymentAgentsForCountry = function getPaymentAgentsForCountry(countryCode) {
	    return {
	        paymentagent_list: countryCode
	    };
	};
	
	var getPayoutCurrencies = exports.getPayoutCurrencies = function getPayoutCurrencies() {
	    return {
	        payout_currencies: 1
	    };
	};
	
	var getPriceProposalForContract = exports.getPriceProposalForContract = function getPriceProposalForContract(options) {
	    return _extends({
	        proposal: 1
	    }, options);
	};
	
	var subscribeToPriceForContractProposal = exports.subscribeToPriceForContractProposal = function subscribeToPriceForContractProposal(options) {
	    return _extends({
	        proposal: 1,
	        subscribe: 1
	    }, options);
	};
	
	var getResidences = exports.getResidences = function getResidences() {
	    return {
	        residence_list: 1
	    };
	};
	
	var getStatesForCountry = exports.getStatesForCountry = function getStatesForCountry(countryCode) {
	    return {
	        states_list: countryCode
	    };
	};
	
	var subscribeToTick = exports.subscribeToTick = function subscribeToTick(symbol) {
	    return {
	        ticks: symbol
	    };
	};
	
	var subscribeToTicks = exports.subscribeToTicks = function subscribeToTicks(symbols) {
	    return {
	        ticks: symbols
	    };
	};
	
	var getTickHistory = exports.getTickHistory = function getTickHistory(symbol, options) {
	    return _extends({
	        ticks_history: symbol
	    }, options || { end: 'latest' });
	};
	
	var getCandles = exports.getCandles = function getCandles(symbol, options) {
	    return _extends({
	        ticks_history: symbol,
	        style: 'candles'
	    }, options || { end: 'latest' });
	};
	
	var getCandlesForLastNDays = exports.getCandlesForLastNDays = function getCandlesForLastNDays(symbol, ndays) {
	    return {
	        ticks_history: symbol,
	        style: 'candles',
	        start: Math.floor(Date.now() / 1000) - (ndays - 1) * 60 * 60 * 24,
	        end: 'latest',
	        granularity: 60 * 60 * 24,
	        count: 30
	    };
	};
	
	var getServerTime = exports.getServerTime = function getServerTime() {
	    return {
	        time: 1
	    };
	};
	
	var getTradingTimes = exports.getTradingTimes = function getTradingTimes(date) {
	    return {
	        trading_times: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	    };
	};
	
	var verifyEmail = exports.verifyEmail = function verifyEmail(email, type) {
	    return {
	        verify_email: email,
	        type: type
	    };
	};
	
	var getWebsiteStatus = exports.getWebsiteStatus = function getWebsiteStatus() {
	    return {
	        website_status: 1
	    };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.getDataForSymbol = getDataForSymbol;
	exports.getDataForContract = getDataForContract;
	
	var _nowAsEpoch = __webpack_require__(15);
	
	var _nowAsEpoch2 = _interopRequireDefault(_nowAsEpoch);
	
	var _durationToSecs = __webpack_require__(13);
	
	var _durationToSecs2 = _interopRequireDefault(_durationToSecs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var responseSizeLimit = 700;
	
	var granularities = [60, 120, 180, 300, 600, 900, 1800, 3600, 7200, 14400, 28800, 86400];
	var ohlcDataToTicks = function ohlcDataToTicks(candles) {
	    return candles.map(function (data) {
	        return { quote: +data.open, epoch: +data.epoch };
	    });
	};
	var hcUnitConverter = function hcUnitConverter(type) {
	    switch (type) {
	        case 'second':
	            return 's';
	        case 'minute':
	            return 'm';
	        case 'hour':
	            return 'h';
	        case 'day':
	            return 'd';
	        default:
	            return 'd';
	    }
	};
	
	var autoAdjustGetData = function autoAdjustGetData(api, symbol, start, end) {
	    var style = arguments.length <= 4 || arguments[4] === undefined ? 'ticks' : arguments[4];
	    var subscribe = arguments[5];
	    var extra = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];
	
	    var secs = end - start;
	    var ticksCount = secs / 2;
	    if (ticksCount >= responseSizeLimit || style === 'candles') {
	        var _ret = function () {
	            var idealGranularity = secs / responseSizeLimit;
	            var finalGranularity = 60;
	            granularities.forEach(function (g, i) {
	                if (idealGranularity > g && idealGranularity <= granularities[i + 1]) {
	                    finalGranularity = granularities[i + 1];
	                }
	            });
	            finalGranularity = Math.min(86400, finalGranularity);
	            return {
	                v: api.getTickHistory(symbol, {
	                    start: start,
	                    end: end,
	                    adjust_start_time: 1,
	                    count: responseSizeLimit,
	                    style: 'candles',
	                    granularity: finalGranularity,
	                    subscribe: subscribe ? 1 : undefined
	                }).then(function (r) {
	                    if (style === 'ticks') {
	                        return _extends({}, extra, {
	                            ticks: ohlcDataToTicks(r.candles),
	                            symbol: symbol
	                        });
	                    }
	                    return _extends({}, extra, {
	                        candles: r.candles,
	                        symbol: symbol
	                    });
	                })
	            };
	        }();
	
	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	    return api.getTickHistory(symbol, {
	        start: start,
	        end: end,
	        adjust_start_time: 1,
	        count: responseSizeLimit,
	        style: 'ticks',
	        subscribe: subscribe ? 1 : undefined
	    }).then(function (r) {
	        var ticks = r.history.times.map(function (t, idx) {
	            var quote = r.history.prices[idx];
	            return { epoch: +t, quote: +quote };
	        });
	        return _extends({}, extra, {
	            ticks: ticks,
	            symbol: symbol
	        });
	    });
	};
	
	/**
	 *
	 * @param api
	 * @param symbol
	 * @param durationCount
	 * @param durationType
	 */
	function getDataForSymbol(api, symbol) {
	    var durationCount = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	    var durationType = arguments.length <= 3 || arguments[3] === undefined ? 'all' : arguments[3];
	    var style = arguments.length <= 4 || arguments[4] === undefined ? 'ticks' : arguments[4];
	    var subscribe = arguments[5];
	
	    var durationUnit = hcUnitConverter(durationType);
	    var end = (0, _nowAsEpoch2.default)();
	    var start = end - (0, _durationToSecs2.default)(durationCount, durationUnit);
	    return autoAdjustGetData(api, symbol, start, end, style, subscribe);
	}
	
	/**
	 * get data of contract
	 * @param api                      - will be injected by library
	 * @param getContract              - function that accept nothing and return a Promise containing contract
	 * @param durationCount            - number of duration
	 * @param durationType             - type of duration, check http://api.highcharts.com/highstock#rangeSelector.buttons
	 * @param style                    - one of ['ticks', 'candles'], this will affect the return data shape,
	 *                                   internally library might not always use this param when requesting, eg. when data is too large,
	 *                                   library will use `candles` instead of `ticks`, this is handle by library so user do not need to worry
	 * @param granularity              - default to 60, check https://developers.binary.com/api/#ticks_history
	 * @returns {*|Promise.<TResult>}
	 */
	function getDataForContract(api, getContract, durationCount) {
	    var durationType = arguments.length <= 3 || arguments[3] === undefined ? 'all' : arguments[3];
	    var style = arguments.length <= 4 || arguments[4] === undefined ? 'ticks' : arguments[4];
	    var subscribe = arguments[5];
	
	    var getAllData = function getAllData() {
	        return getContract().then(function (contract) {
	            var symbol = contract.underlying;
	            if (contract.tick_count) {
	                var _start = +contract.date_start - 5;
	                var exitTime = +contract.exit_tick_time + 5;
	                var _end = exitTime || (0, _nowAsEpoch2.default)();
	                return autoAdjustGetData(api, symbol, _start, _end, style, subscribe, { isSold: !!contract.sell_time });
	            }
	
	            var bufferSize = 0.05; // 5 % buffer
	            var contractStart = +contract.date_start;
	            var contractEnd = +contract.exit_tick_time || +contract.date_expiry;
	
	            // handle Contract not started yet
	            if (contractStart > (0, _nowAsEpoch2.default)()) {
	                return autoAdjustGetData(api, symbol, (0, _nowAsEpoch2.default)() - 600, (0, _nowAsEpoch2.default)(), style, subscribe);
	            }
	
	            var buffer = (contractEnd - contractStart) * bufferSize;
	            var start = buffer ? contractStart - buffer : contractStart;
	            var bufferedExitTime = contractEnd + buffer;
	            var end = contractEnd ? bufferedExitTime : (0, _nowAsEpoch2.default)();
	
	            return autoAdjustGetData(api, symbol, Math.round(start), Math.round(end), style, subscribe, { isSold: !!contract.sell_time });
	        });
	    };
	
	    if (durationType === 'all') {
	        return getAllData();
	    }
	
	    return getContract().then(function (contract) {
	        var symbol = contract.underlying;
	        var startTime = +contract.date_start;
	
	        // handle Contract not started yet
	        if (startTime > (0, _nowAsEpoch2.default)()) {
	            return autoAdjustGetData(api, symbol, (0, _nowAsEpoch2.default)() - 600, (0, _nowAsEpoch2.default)(), style, subscribe, { isSold: !!contract.sell_time });
	        }
	
	        var sellT = contract.sell_time;
	        var end = sellT || (0, _nowAsEpoch2.default)();
	
	        var buffer = (end - startTime) * 0.05;
	
	        var durationUnit = hcUnitConverter(durationType);
	        var start = Math.min(startTime - buffer, end - (0, _durationToSecs2.default)(durationCount, durationUnit));
	        return autoAdjustGetData(api, symbol, Math.round(start), Math.round(end), style, subscribe, { isSold: !!contract.sell_time });
	    });
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var getInitialState = function getInitialState() {
	    return {
	        token: '',
	        balance: false,
	        portfolio: false,
	        transactions: false,
	        ticks: new Set(),
	        proposals: new Set()
	    };
	};
	
	var state = getInitialState();
	
	var resetState = exports.resetState = function resetState() {
	    state = getInitialState();
	};
	
	var getState = exports.getState = function getState() {
	    return state;
	};
	
	var authorize = exports.authorize = function authorize(token) {
	    state.token = token;
	};
	
	var subscribeToBalance = exports.subscribeToBalance = function subscribeToBalance() {
	    state.balance = true;
	};
	
	var unsubscribeFromBalance = exports.unsubscribeFromBalance = function unsubscribeFromBalance() {
	    state.balance = false;
	};
	
	// export const subscribeToOpenContract = contractId => {
	//     state.portfolio.add(contractId);
	// };
	
	var subscribeToAllOpenContracts = exports.subscribeToAllOpenContracts = function subscribeToAllOpenContracts() {
	    state.portfolio = true;
	};
	
	var unsubscribeFromAllOpenContracts = exports.unsubscribeFromAllOpenContracts = function unsubscribeFromAllOpenContracts() {
	    state.portfolio = false;
	};
	
	var subscribeToTransactions = exports.subscribeToTransactions = function subscribeToTransactions() {
	    state.transactions = true;
	};
	
	var unsubscribeFromTransactions = exports.unsubscribeFromTransactions = function unsubscribeFromTransactions() {
	    state.transactions = false;
	};
	
	var subscribeToTick = exports.subscribeToTick = function subscribeToTick(symbol) {
	    state.ticks.add(symbol);
	};
	
	var subscribeToTicks = exports.subscribeToTicks = function subscribeToTicks(symbols) {
	    var _state$ticks;
	
	    (_state$ticks = state.ticks).add.apply(_state$ticks, _toConsumableArray(symbols));
	};
	
	var unsubscribeFromTick = exports.unsubscribeFromTick = function unsubscribeFromTick(symbol) {
	    state.ticks.delete(symbol);
	};
	
	var unsubscribeFromAllTicks = exports.unsubscribeFromAllTicks = function unsubscribeFromAllTicks() {
	    state.ticks.clear();
	};
	
	var subscribeToPriceForContractProposal = exports.subscribeToPriceForContractProposal = function subscribeToPriceForContractProposal(options) {
	    state.proposals.add(options);
	};
	
	var unsubscribeFromAllProposals = exports.unsubscribeFromAllProposals = function unsubscribeFromAllProposals() {
	    state.proposals.clear();
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (duration, unit) {
	    switch (unit) {
	        case 's':
	            return 1 * duration;
	        case 'm':
	            return 60 * duration;
	        case 'h':
	            return 3600 * duration;
	        case 'd':
	            return 86400 * duration;
	        default:
	            return undefined;
	    }
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var uniqueId = 0;
	
	exports.default = function () {
	  return uniqueId++;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    return Math.floor(Date.now() / 1000);
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }
/******/ ])
});
;
//# sourceMappingURL=binary-live-api.js.map