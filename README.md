# verySuggester
A simple but handy email address completer.

## Dependencies
- jQuery core: you need to load jQuery before this plugin.

## Usage
First, you need to download this verySuggester plugin and jQuery into your document.
Second, just bind `verySuggester()` function on your target input.
```javascript
$('#targetInput').verySuggester();
```
Well, we're finished.

## Custom Settings
By check `index.html` page, you can see that I have passed some custom settings for second input.

- `searchList`: set your suggestion item, default is hotmail.com, gmail.com, yahoo.com.tw.
- `width`: you can set a width for it's hint window, or it will been set by plugin according to target input's width.
- `themeColor`: hint box have a border and a little triangle, `#26a4d8` by default, like the picture below, you can set your own, value can be hex, rbga, or color name.
- `pivotType`: accept `top` and `bottom`.
- `limitItem`: accept one number, if result item is more than this setting, a scrollbar will display. 0 means not enable this setting.

## To Be Done
[x] `pivotType` setting: it's actually not working yet.

## Recent update
20160819 - add a custom setting `limitItem`, and some style changes.
