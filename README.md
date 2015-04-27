# angular-piwik

*AngularJS service for Piwik open source web analytics platform API.*

Right now, you can use it to query the reporting API and to retrieve widgets easily, it's pretty usable. Tracking will be implemented before we reach 1.0.

It has been tested with AngularJS versions 1.2 to 1.4. It may work with previous ones, let me know.
Actually, the future 1.0 version of angular-piwik will undoubtedly require AngularJS 1.4 as it simplifies the code a lot (less code = less bugs).

Enough words, let's...

## Getting started

### Get the necessary files

#### Using CDN

##### Target version

* for production, add this snippet to your HTML file:
```html
<script src="https://cdn.rawgit.com/proximedia/angular-piwik/v0.2.2/build/angular-piwik.min.js" type="application/javascript"></script>
```
* for development, prefer this one:
```html
<script src="https://rawgit.com/proximedia/angular-piwik/v0.2.2/src/angular-piwik.js" type="application/javascript"></script>
```

##### On the edge

```html
<script src="https://rawgit.com/proximedia/angular-piwik/master/src/angular-piwik.js" type="application/javascript"></script>
```

#### Using NPM

Just run `npm i proximedia-angular-piwik` from your console in your project folder.

And add this snippet to your HTML file:
```html
<script src="node_modules/proximedia-angular-piwik/src/angular-piwik.js" type="application/javascript"></script>
```

### Add the dependency to your module

Add `"pxmPiwik"` to the list of dependencies of your module. It should look a bit like this:

```javascript
var app = angular.module("myApp", ["pxmPiwik"]);
```

## Setting things up

We provide for your pleasure 4 configuration constants with gently defaults:

* `piwikFormat` defaults to `json` ;
* `piwikLanguage` defaults to `en`: as some Piwik response elements are localized, we thought this could be useful ;
* `piwikToken` defaults to `anonymous` ;
* `piwikUrl` defaults to `http://demo.piwik.org/`: we're sure you're gonna change this one.

You can change them as easily as writing this:

```javascript
app.constant("piwikLanguage", "fr");
```

And you can always override these defaults at call time.

## Taming the beast

Here we are, at least. Let us introduce you the `$piwik` service. For the moment, it provides 2 methods:

* `promise $piwik.call(string method, object params)`
 * `method` is a string like _"Module.Action"_ ;
 * `params` is an object. You can override any of the configuration constants here ;
 * it returns a _Promise_ object, as it uses `$http.get()` ;
 * see http://developer.piwik.org/api-reference/reporting-api for a list of available methods ;
 * additionally, you can call multiple methods at once: `$piwik.call([[method1, params1], [method2, params2], ...])`.
* `string $piwik.widget(string method, object params)`
 * `method` is a string like _"Module.Action"_ ;
 * `params` is an object. You can override any of the configuration constants here ;
 * it returns a _string_ containing the full URL of the widget.

## Real life example

```javascript
var app = angular.module("myApp", ["pxmPiwik"]);

app.constant("piwikLanguage", "fr");

app.controller("MyCtrl", ["$piwik", function ($piwik)
{
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