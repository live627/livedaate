/**
 * DateInput
 *
 * Visual date picker script. Very compact at 1760 bytes minified and
 * gzipped. Based on jQuery Tools Dateinput
 *
 * Developed and customized/optimized for inclusion with Wedge plugins
 * by John "live627" Rayes.
 *
 * @version 0.3
 */

(function($)
{
	function Dateinput(input, uconf)
	{
		var
			conf = extend({
				yearRange: [-5, 10],
			}, uconf),
			now = new Date(),
			yearNow = now.getFullYear(),
			root,
			currYear, currMonth, currDay,
			value = input.attr('data-value') || conf.value || input.val() || now,
			min = input.attr('min') || conf.min,
			max = input.attr('max') || conf.max,
			opened,

			show = function(e) {
				if (input.attr('readonly') || input.attr('disabled') || opened)
					return;

				$('.cal').hide();
				opened = true;

				// set date
				setValue(value);

				root.animate(is_opera ? { opacity: 'show' } : { opacity: 'show', height: 'show' }, 150);
				onShow();
			},

			setValue = function(year, month, day, fromKey)
			{
				var date = integer(month) >= -1 ? new Date(integer(year), integer(month), integer(day == undefined || isNaN(day) ? 1 : day)) : year || value;

				if (date < min)
					date = min;
				else if (date > max)
					date = max;

				year = date.getFullYear();
				month = date.getMonth();
				day = date.getDate();

				// roll year & month
				if (month == -1) {
					month = 11;
					year--;
				} else if (month == 12) {
					month = 0;
					year++;
				}

				if (!opened)
					select(date);

				currMonth = month;
				currYear = year;
				currDay = day;

				var
					tmp = new Date(year, month, 1 - (conf.firstDay || 0)), begin = tmp.getDay(),
					days = dayAm(year, month),
					prevDays = dayAm(year, month - 1),
					myTable = document.createElement("table"),
					myHead = myTable.createTHead(),
					myRow = myHead.insertRow(-1);

				for (var d1 = 0; d1 < 7; d1++)
				{
					myCell = myRow.appendChild(document.createElement("th"));
					myCell.innerHTML = daysShort[(d1 + (conf.firstDay || 0)) % 7];
				}

				// !begin === 'sunday'
				for (var j = !begin ? -7 : 0, td, num; j < (!begin ? 35 : 42); j++) {

					if (j % 7 === 0)
						myRow = myTable.insertRow(-1);

					var cls = [];
					var myCell = myRow.insertCell(-1);

					if (j < begin)
					{
						cls[cls.length] = 'disabled';
						num = prevDays - begin + j + 1;
						thisDate = new Date(year, month - 1, num);
					}
					else if (j >= begin + days)
					{
						cls[cls.length] = 'disabled';
						num = j - days - begin + 1;
						thisDate = new Date(year, month + 1, num);
					}
					else
					{
						num = j - begin + 1;
						thisDate = new Date(year, month, num);

						// chosen date
						if (isSameDay(value, thisDate))
							cls[cls.length] = 'chosen';

						// today
						if (isSameDay(now, thisDate))
							cls[cls.length] = 'today';

						// current
						if (isSameDay(date, thisDate))
							cls[cls.length] = 'hove';
					}

					// disabled
					if ((min && thisDate < min) || (max && thisDate > max))
						cls[cls.length] = 'disabled';

					myCell.innerHTML = num;
					myCell.className = cls.join(' ');
					myCell.setAttribute('data-date', thisDate);

					myCell.onclick = function (e)
					{
						select(this.getAttribute('data-date'), e);
					}

					root.append(myTable);
				}
			},

			hide = function()
			{
				if (opened)
				{
					$(document).off('.d');

					// do the hide
					root.hide();
					opened = false;
				}
			},

			// @return amount of days in certain month
			dayAm = function (year, month)
			{
				return new Date(year, month + 1, 0).getDate();
			},

			integer = function (val)
			{
				return parseInt(val, 10);
			},

			isSameDay = function (d1, d2)
			{
				return d1.toDateString() == d2.toDateString();
			},

			parseDate = function (val)
			{
				if (val === undefined)
					return;

				if (val.constructor == Date)
					return val;

				if (typeof val == 'string')
				{

					// rfc3339?
					var els = val.split('-');
					if (els.length == 3)
						return new Date(integer(els[0]), integer(els[1]) - 1, integer(els[2]));

					// invalid offset
					if ( !(/^-?\d+$/).test(val) )
						return;

					// convert to integer
					val = integer(val);
				}

				var date = new Date;
				date.setDate(date.getDate() + val);
				return date;
			},

			select = function (date)
			{
				// current value
				value		= date;
				currYear	= date.getFullYear();
				currMonth	= date.getMonth();
				currDay		= date.getDate();

				// formatting
				input.val(date.getFullYear()
					+ '-' + pad(date.getMonth() + 1)
					+ '-' + pad(date.getDate()));

				// store value into input
				input.data('date', date);
				hide();
			},

			onShow = function (ev)
			{
				$(document).on('keydown.d', function(event)
				{
					if (opened)
						switch (event.keyCode)
						{
							case 9: case 27:
								hide();
								break; // hide on tab out // hide on escape
							case 13:
								var sel = $('td.hove:not(chosen)', root);
								if (sel[0])
									select(sel.data('date'));
								return false; // don't submit the form
								break; // select the value on enter
							case 33:
								addMonth(-1);
								break; // previous month/year on page up/+ ctrl
							case 34:
								addMonth(+1);
								break; // next month/year on page down/+ ctrl
							case 82: // r
								select(now);
								break; // current
							case 37: // left arrow
								addDay(-1);
								break;
							case 38: // up arrow
								addDay(-7);
								break; // -1 week
							case 39: // right arrow
								addDay(+1);
								break;
							case 40: // down arrow
								addDay(+7);
								break; // +1 week
						}
				});

				// click outside dateinput
				$(document).on('click.d', function(e)
				{
					var el = e.target;

					if ($(el).parents('.cal').length || el == input[0])
						return;

					hide(e);
				});
			},

			pad = function (number)
			{
				var r = String(number);
				if (r.length === 1)
					r = '0' + r;

				return r;
			};

		// use sane values for value, min & max
		value = parseDate(value);
		min = parseDate(min || new Date(yearNow + conf.yearRange[0], 1, 1));
		max = parseDate(max || new Date(yearNow + conf.yearRange[1] + 1, 1, -1));

		// root
		root = $('<div>')
			.addClass('cal');

		input.after(root).addClass('dateinput');

		if (value)
			select(value);

		if (!conf.editable)
		{
			input.on('focus.d click.d', show).keydown(function(e)
			{
				var key = e.keyCode;

				// open dateinput with navigation keys
				// h=72, j=74, k=75, l=76, down=40, left=37, up=38, right=39
				if (!opened && $([75, 76, 38, 39, 74, 72, 40, 37]).index(key) >= 0)
				{
					show();
					return e.preventDefault();
				}
				// clear value on backspace or delete
				else if (key == 8 || key == 46)
					input.val('');

				// allow tab
				return e.shiftKey || e.ctrlKey || e.altKey || key == 9 ? true : e.preventDefault();
			});
		}
	}

	$.fn.dateinput = function (conf)
	{
		return this.each(function ()
		{
			var $e = $(this), obj = $e.data('dateinput');

			if (!obj)
				$e.data('dateinput', new Dateinput($e, conf));
		});
	};

	function extend (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i]

			for (var key in source) {
				if (source.hasOwnProperty(key)) {
					target[key] = source[key]
				}
			}
		}

		return target
	}

}) (jQuery);
