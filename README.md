# DateInput [![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Visual date picker script. Very compact at under 2KB minified and gzipped.

## Usage
```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <title>Livedate by live627</title>
    <link rel="stylesheet" href="dateinput.css">
  </head>
  <body>
    <input type="text" id="date">

    <script src="dateinput.min.js"></script>
    <script>
      var
        days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        daysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
        monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      $('#date').dateinput();
    </script>

  </body>
</html>
```
## Build

`npm install` to grab all the dependenceies<br>
`npm run build` uglify and minify JS, compile SASS into CSS and minify it


## Goals
My goals with this script are:
- to keep it as lean and readable as possible
- to NOT have jQuery as a dependency

## Sources

This work is based on [jQuery Tools Dateinput](http://jquerytools.github.io/documentation/dateinput/index.html).


## TODO

* Use the scroll wheel to change months.
