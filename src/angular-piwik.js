'use strict';
angular.module("pxmPiwik", []).config(["$provide", function ($provide)
    {
        $provide.constant("piwikFormat", "json");
        $provide.constant("piwikLanguage", "en");
        $provide.constant("piwikToken", "anonymous");
        $provide.constant("piwikUrl", "http://demo.piwik.org/");
        $provide.factory("$piwik", ["$http", "piwikFormat", "piwikLanguage", "piwikToken", "piwikUrl", function ($http, piwikFormat, piwikLanguage, piwikToken, piwikUrl)
            {
                var piwik = {}, util = {};

                piwik.format = piwikFormat;
                piwik.language = piwikLanguage;
                piwik.token = piwikToken;
                piwik.urlApi = piwikUrl;
                piwik.urlWidget = piwikUrl;

                piwik.call = function ()
                {
                    var args;

                    if (arguments.length === 1 && angular.isArray(arguments[0][0])) {
                        args = arguments[0];
                    } else if (arguments.length === 2 && angular.isString(arguments[0])) {
                        args = [[arguments[0], arguments[1]]];
                    } else {
                        args = Array.prototype.slice.call(arguments);
                    }

                    if (args.length < 1) {
                        return;
                    }

                    if (args.length === 1) {
                        return util.apiCall(util.methodParams(args[0]));
                    }

                    var params = {
                        method: "API.getBulkRequest",
                        urls: []
                    };

                    angular.forEach(args, function (arg)
                    {
                        this.push(util.paramSerializer(util.methodParams(arg)));
                    }, params.urls);

                    return util.apiCall(params);
                };
                piwik.widget = function (method, params)
                {
                    return util.buildUrl(piwik.urlWidget, angular.extend({
                        action: "iframe",
                        actionToWidgetize: method.split(".")[1],
                        disableLink: 1,
                        language: piwik.language,
                        module: "Widgetize",
                        moduleToWidgetize: method.split(".")[0],
                        token_auth: piwik.token,
                        widget: 1
                    }, params));
                };
                util.apiCall = function (params)
                {
                    return $http.get(util.buildUrl(piwik.urlApi, angular.extend({
                        format: piwik.format,
                        language: piwik.language,
                        module: "API"
                    }, params)));
                };
                util.buildUrl = function (url, params)
                {
                    return url
                            + (url.indexOf("?") === -1 ? "?" : "&")
                            + util.paramSerializer(params);
                };
                util.methodParams = function (arg)
                {
                    return angular.extend({
                        method: arg[0],
                        token_auth: piwik.token
                    }, arg[1]);
                };
                util.paramSerializer = function (params) {
                    if (!params) {
                        return "";
                    }

                    var parts = [];

                    angular.forEach(params, function (value, key)
                    {
                        if (value === null || angular.isUndefined(value)) {
                            return;
                        }

                        if (!angular.isArray(value) && !angular.isObject(value)) {
                            parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(util.serializeValue(value)));
                            return;
                        }

                        angular.forEach(value, function (v, k)
                        {
                            parts.push(encodeURIComponent(key + "[" + k + "]") + "=" + encodeURIComponent(util.serializeValue(v)));
                        });
                    });

                    return parts.length > 0 ? parts.join("&") : "";
                };
                util.serializeValue = function (v)
                {
                    if (angular.isObject(v)) {
                        return angular.isDate(v) ? v.toISOString() : angular.toJson(v);
                    }
                    return v;
                }

                return piwik;
            }
        ]);
    }
]);