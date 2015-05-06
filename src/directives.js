angular.module("pxmPiwik")
.directive("pxmPiwik", ["$piwik", function ($piwik)
{
    return {
        link: function (scope)
        {
            $piwik.addTracker(scope.site, scope.url);
        },
        restrict: "E",
        scope: {
            site: "=?",
            url: "@?"
        }
    };
}]);
