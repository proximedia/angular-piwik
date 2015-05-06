angular.module("pxmPiwik")
.config(["$provide", function ($provide)
    {
        function PiwikProvider()
        {
            var
                piwikFormat = "json",
                piwikId = 1,
                piwikLanguage = "en",
                piwikToken = "anonymous",
                piwikUrlApi = "http://demo.piwik.org/",
                piwikUrlTracker = "http://demo.piwik.org/",
                piwikUrlWidget = "http://demo.piwik.org/";

            this.setFormat = function (value)
            {
                piwikFormat = value;
            };

            this.setId = function (value)
            {
                piwikId = value;
            };

            this.setLanguage = function (value)
            {
                piwikLanguage = value;
            };

            this.setToken = function (value)
            {
                piwikToken = value;
            };

            this.setUrl = function (value)
            {
                piwikUrlApi = value;
                piwikUrlTracker = value;
                piwikUrlWidget = value;
            };

            this.setUrlApi = function (value)
            {
                piwikUrlApi = value;
            };

            this.setUrlTracker = function (value)
            {
                piwikUrlTracker = value;
            };

            this.setUrlWidget = function (value)
            {
                piwikUrlWidget = value;
            };
            
            this.$get = ["$document", "$http", "$window", function ($document, $http, $window)
            {
                var piwik = {}, paq = {}, util = {};

                piwik.addTracker = function (site, url)
                {
                    var g = $document[0].createElement("script"),
                        s = $document[0].getElementsByTagName("script")[0];

                    g.async = true;
                    g.defer = true;
                    g.src = (url || piwikUrlTracker) + "piwik.js";
                    g.type = "application/javascript";

                    s.parentNode.insertBefore(g,s);

                    piwik.track("trackPageView");
                    piwik.track("enableLinkTracking");
                    piwik.track("setTrackerUrl", [(url || piwikUrlTracker) + "piwik.php"]);
                    piwik.track("setSiteId", [(site || piwikId)]);
                };
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
                piwik.track = function (method, params)
                {
                    params = params || [];

                    if (!angular.isString(method) || !angular.isArray(params)) {
                        return;
                    }

                    var index = -1;
                    params.unshift(method);
                    $window._paq = $window._paq || [];

                    angular.forEach($window._paq, function (value, key)
                    {
                        if (value[0] === params[0]) {
                            this = key;
                            return;
                        }
                    }, index);

                    if (index === -1) {
                        $window._paq.push(params);
                    } else {
                        $window._paq[index] = params;
                    }
                };
                piwik.widget = function (method, params)
                {
                    return util.buildUrl(piwikUrlWidget, angular.extend({
                        action: "iframe",
                        actionToWidgetize: method.split(".")[1],
                        disableLink: 1,
                        language: piwikLanguage,
                        module: "Widgetize",
                        moduleToWidgetize: method.split(".")[0],
                        token_auth: piwikToken,
                        widget: 1
                    }, params));
                };
                util.apiCall = function (params)
                {
                    return $http.get(util.buildUrl(piwikUrlApi, angular.extend({
                        format: piwikFormat,
                        language: piwikLanguage,
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
                        token_auth: piwikToken
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
                };

                return piwik;
            }];
        }

        $provide.provider("$piwik", PiwikProvider);
    }
]);
