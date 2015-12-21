# angular-piwik

*AngularJS service for Piwik open source web analytics platform API.*

You can enjoy the power of the Piwik reporting, tracking and widget API, the AngularJS way.
It also provides a more seamless experience with the different API.

It has been tested with AngularJS versions 1.2 to 1.4. It may work with previous ones, let me know.
Actually, the future 1.0 version of angular-piwik will undoubtedly require AngularJS 1.4 as it simplifies the code a lot (less code = less bugs).

Enough words, let's...

## Getting started

### Get the necessary files

#### Using CDN

##### Target version

* for production, add this snippet to your HTML file:
```html
<script src="https://cdn.rawgit.com/proximedia/angular-piwik/v0.4.2/build/angular-piwik.min.js" type="application/javascript"></script>
```
* for development, prefer this one:
```html
<script src="https://cdn.rawgit.com/proximedia/angular-piwik/v0.4.2/build/angular-piwik.js" type="application/javascript"></script>
```

##### On the edge

```html
<script src="https://rawgit.com/proximedia/angular-piwik/master/build/angular-piwik.js" type="application/javascript"></script>
```

#### Using Bower

Just run `bower install proximedia-angular-piwik` from your console in your project folder.

And add this snippet to your HTML file:
```html
<script src="bower_components/proximedia-angular-piwik/build/angular-piwik.js" type="application/javascript"></script>
```

#### Using NPM

Just run `npm i proximedia-angular-piwik` from your console in your project folder.

And add this snippet to your HTML file:
```html
<script src="node_modules/proximedia-angular-piwik/build/angular-piwik.js" type="application/javascript"></script>
```

### Add the dependency to your module

Add `"pxmPiwik"` to the list of dependencies of your module. It should look a bit like this:

```javascript
var app = angular.module("myApp", ["pxmPiwik"]);
```

## Setting things up

We provide $piwikProvider for your pleasure with 8 methods with gently defaults:

* `setFormat`. Sets the data format returned by the reporting API, default is `json` ;
* `setId`. Sets the site ID for the tracking, default is `1` ;
* `setLanguage`. Sets the language used by Piwik in some localized response elements of the reporting and widget API, default is `en` ;
* `setToken`. Set the auth token used to query the reporting and widget API, default is `anonymous` ;
* `setUrl`. Use this one if you use only one Piwik instance. Default is `http://demo.piwik.org/` ;
* `setUrlApi`. Default is `http://demo.piwik.org/` ;
* `setUrlTracker`. Default is `http://demo.piwik.org/` ;
* `setUrlWidget`. Default is `http://demo.piwik.org/`.

You can change them as easily as writing this:

```javascript
app.config(["$piwikProvider", function ($piwikProvider)
{
  $piwikProvider.setLanguage("fr");
}]);
```

And you can always override these defaults at call time.

## Taming the beast

Here we are, at least. Let us introduce you the `$piwik` service. It provides 4 methods:

* `promise $piwik.addTracker(integer site, string url)`
 * `site` is the site ID (optional). It takes precedence over the one you can configure with `$piwikProvider.setId()` ;
 * `url` is url of the tracker instance (optional). It takes precedence over the one you can configure with `$piwikProvider.setUrl()` or `$piwikProvider.setUrlTracker()` ;
 * note that you can use the directive instead ;
 * you can't track multiple sites for the moment
* `promise $piwik.call(string method, object params)`
 * `method` is a string like _"Module.Action"_ ;
 * `params` is an object. You can override any of the configuration constants here ;
 * it returns a _Promise_ object, as it uses `$http.get()` ;
 * see http://developer.piwik.org/api-reference/reporting-api for a list of available methods ;
 * additionally, you can call multiple methods at once: `$piwik.call([[method1, params1], [method2, params2], ...])`.
* `string $piwik.track(string method, array params)`
 * see http://developer.piwik.org/api-reference/tracking-javascript for a list of available methods ;
* `string $piwik.widget(string method, object params)`
 * `method` is a string like _"Module.Action"_ ;
 * `params` is an object. You can override any of the configuration constants here ;
 * it returns a _string_ containing the full URL of the widget.

And now, the `pxm-piwik` directive which is the markup twin of the `$piwik.addTracker()` method:

```html
<pxm-piwik site="1" url="http://demo.piwik.org/"></pxm-piwik>
```

As for the `$piwik.addTracker()` method, `site` and `url` are optional if you set them up with `$piwikProvider` before.

## Real life example

```javascript
var app = angular.module("myApp", ["pxmPiwik"]);

app.config(["$piwikProvider", function ($piwikProvider)
{
  $piwikProvider.setLanguage("fr");
}]);

app.controller("MyCtrl", ["$piwik", "$scope", function ($piwik, $scope)
{
  $scope.track = $piwik.track;

  $piwik.call("Actions.getPageUrls", {
    idSite: 1,
    period: "day",
    date: "today"
  }).success(function (data)
  {
    console.log(data);
  });

  angular.element("iframe:first").attr("src", $piwik.widget("UserCountryMap.visitorMap", {
    idSite: 1,
    period: "day",
    date: "today"
  }));
});
```

```html
<!DOCTYPE html>
<html ng-app="myApp">
  <head>...</head>
  <body ng-controller="MyCtrl">
    ...
    <button ng-click="track('trackEvent', ['Test', 'Clicked']);">Track this!</button>
    ...
    <pxm-piwik site="1" url="http://demo.piwik.org/"></pxm-piwik>
  </body>
</html>
```
