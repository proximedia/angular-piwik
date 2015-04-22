'use strict';
angular.module("pxmPiwik", [], ["$provide", function ($provide)
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
                piwik.url = piwikUrl;

                piwik.call = function ()
                {
                    var args;

                    if (arguments.length === 1 && arguments[0][0].constructor === Array) {
                        args = arguments[0];
                    } else if (arguments.length === 2 && arguments[0].constructor === String) {
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
                        this.push(util.buildQuery(util.methodParams(arg)));
                    }, params.urls);

                    return util.apiCall(params);
                };
                util.apiCall = function (params)
                {
                    return $http.get(piwik.url, {params: angular.extend({
                            format: piwik.format,
                            module: "API"
                        }, util.tidyParams(params))});
                };
                util.buildQuery = function (params)
                {
                    var string_params = [];

                    angular.forEach(util.tidyParams(params), function (value, key)
                    {
                        this.push(key + "=" + value);
                    }, string_params);

                    return string_params.join("&");
                };
                util.methodParams = function (arg)
                {
                    return angular.extend({
                        language: piwik.language,
                        method: arg[0],
                        token_auth: piwik.token
                    }, arg[1]);
                };
                util.tidyParams = function (params)
                {
                    angular.forEach(params, function (value, key)
                    {
                        if (value.constructor !== Array) {
                            this[key] = value;
                            return;
                        }

                        delete this[key];

                        for (var index in value) {
                            this[key + "[" + index + "]"] = value[index];
                        }
                    }, params);

                    return params;
                };

                return piwik;
            }
        ]);
    }
]);