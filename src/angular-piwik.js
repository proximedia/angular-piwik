'use strict';
angular.module("pxmPiwik", []).config(["$provide", "$httpProvider", function ($provide, $httpProvider)
    {
        $httpProvider.defaults.paramSerializer = "$httpParamSerializerJQLike";
        $provide.constant("piwikFormat", "json");
        $provide.constant("piwikLanguage", "en");
        $provide.constant("piwikToken", "anonymous");
        $provide.constant("piwikUrl", "http://demo.piwik.org/");
        $provide.factory("$piwik", ["$http", "$httpParamSerializerJQLike", "piwikFormat", "piwikLanguage", "piwikToken", "piwikUrl", function ($http, $httpParamSerializerJQLike, piwikFormat, piwikLanguage, piwikToken, piwikUrl)
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
                        this.push($httpParamSerializerJQLike(util.methodParams(arg)));
                    }, params.urls);

                    return util.apiCall(params);
                };
                piwik.widget = function (method, params)
                {
                    return  piwik.urlWidget
                            + (piwik.urlWidget.indexOf('?') === -1 ? '?' : '&')
                            + $httpParamSerializerJQLike(angular.extend({
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
                    return $http.get(piwik.urlApi, {params: angular.extend({
                            format: piwik.format,
                            language: piwik.language,
                            module: "API"
                        }, params)});
                };
                util.methodParams = function (arg)
                {
                    return angular.extend({
                        method: arg[0],
                        token_auth: piwik.token
                    }, arg[1]);
                };

                return piwik;
            }
        ]);
    }
]);