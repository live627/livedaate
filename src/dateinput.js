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
				ranges: [],
				values: [],
				value: undefined,
				min: undefined,
				max: undefined,
			}, uconf),
			now = new Date(),
			yearNow = now.getFullYear(),
			root, currRange = '',
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
				root.animate({opacity: 'show', height: 'show'}, 150);
				onShow();
				r();
			},

			r = function(e) {
				root.empty();
				setValue(conf.values[0]);
				setValue(conf.values[1]);
				ranges();
			},

			ranges = function(e) {
				var div = $('<div>').addClass('btn-group-vertical');
				for (range in conf.ranges) {
					div.append($('<a>').addClass('btn btn-primary').text(range).addClass(function( index ) {
						return currRange == range ? 'active' : '';
					}).click(function (e) {
						var $this = $(this);
						$this.parent().find('a').removeClass('active');
						$this.addClass('active');
						currRange = $this.text();
						conf.values = conf.ranges[currRange];
						setTimeout(function () {
							r();
						}, 50);
					}));
				}
				div.appendTo(root);
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

				// elements
				var
					$table = $('<table><tbody><tr/><tr/></tbody></table>'),
					$c = $table.eq(0).children(),
					s = $c.eq(0).children().eq(0),
					d = s.next(),
					monthSelector = $('<select/>').change(function() {
						setValue(yearSelector.val(), $(this).val());
					}),
					yearSelector = $('<select/>').change(function() {
						setValue($(this).val(), monthSelector.val());
					}),
					tmp = new Date(year, month, 1 - (conf.firstDay || 0)), begin = tmp.getDay(),
					days = dayAm(year, month),
					prevDays = dayAm(year, month - 1),
					week;

				s.append($('<td/>').attr('colspan', 7).append(monthSelector.add(yearSelector)));
				root.append($table);

				for (var d1 = 0; d1 < 7; d1++)
					d.append($('<th/>').addClass('right').text(daysShort[(d1 + (conf.firstDay || 0)) % 7]));

				if (!fromKey)
				{
					monthSelector.empty();
					$.each(months, function(i, m) {
						if ((min && min < new Date(year, i + 1, 1)) && (max && max > new Date(year, i, 0)))
							monthSelector.append($('<option/>').text(m).attr('value', i));
					});

					yearSelector.empty();

					for (var i = yearNow + conf.yearRange[0]; i < yearNow + conf.yearRange[1]; i++)
						if ((min && min < new Date(i + 1, 0, 1)) && (max && max > new Date(i, 0, 0)))
							yearSelector.append($('<option/>').text(i).val(i));

					monthSelector.val(month);
					yearSelector.val(year);
				}

				// !begin === 'sunday'
				for (var j = !begin ? -7 : 0, td, num; j < (!begin ? 35 : 42); j++) {

					td = $('<td/>').addClass('right');

					if (j % 7 === 0)
						week = $('<tr/>').appendTo($c);

					if (j < begin)
					{
						td.addClass('disabled');
						num = prevDays - begin + j + 1;
						thisDate = new Date(year, month - 1, num);
					}
					else if (j >= begin + days)
					{
						td.addClass('disabled');
						num = j - days - begin + 1;
						thisDate = new Date(year, month + 1, num);
					}
					else
					{
						num = j - begin + 1;
						thisDate = new Date(year, month, num);

						// chosen date
						if (isSameDay(value, thisDate))
							td.addClass('chosen');

						// today
						if (isSameDay(now, thisDate))
							td.addClass('today');

						// current
						if (isSameDay(date, thisDate))
							td.addClass('hove');

						// current
						if (!(thisDate < conf.values[0] || thisDate > conf.values[1]))
							td.addClass('hove2');
					}

					// disabled
					if ((min && thisDate < min) || (max && thisDate > max))
						td.addClass('disabled');

					td.appendTo(week).text(num).filter(':not(.disabled)').data('date', thisDate).click(function (e)
					{
						select($(this).data('date'), e);
					});
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
			.addClass('cal ');

		input.after(root).addClass('dateinput');

		if (value)
			select(value);

		if (!conf.editable)
		{
			input.on('focus.d click.d', show).keydown(function(e)
			{
				// allow tab
				return e.shiftKey || e.ctrlKey || e.altKey || e.keyCode == 9 ? true : e.preventDefault();
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
