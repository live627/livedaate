# DateInput

Visual date picker script. Very compact at under 2KB minified and gzipped.

Developed and customized/optimized for inclusion with Wedge plugins by John "live627" Rayes.

## Usage
In your Wedge plugin, add the script file (obviously) and add some seperate JS like so:
```php
<?php

add_js('
	var
		days = ' . json_encode(array_values($txt['days'])) . ',
		daysShort = ' . json_encode(array_values($txt['days_short'])) . ',
		months = ' . json_encode(array_values($txt['months'])) . ',
		monthsShort = ' . json_encode(array_values($txt['months_short'])) . ';');

	?>
```
## Changelog
Filesizes were computed using Packer (in Wedge) and gzipping the file.

    0.2 (30 April 2012)
    ---
    * Optimise the code for an even smaller bytesize
    ! Combine two `unbind` statements into one
    - Remove references to `self`, as they were unnecessary

    0.1 (01 April 2012)
    ---
    * Down to 1.82 KB from the original ~3.5 KB.
    - Remove almost all public methods, and made the rest private (maybe three
      or four were necessary for successful operation).
    + Add some keyboard shortcuts, to resemble the UI widget somewhat.
    - Remove all callbacks.
    * Reformat functions to be variable declarations.
    ! Max and min did not limit the date selectors properly.
    * Use as few queries as possible, since querying the document all the time
      isn't the cheapest way to do things. We're all for speed here, right?

## Sources

This work is based on [jQuery Tools Dateinput](http://flowplayer.org/tools/form/dateinput/).

## Legal

This work is released under the [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/).

## TODO

* Use the scroll wheel to change months.