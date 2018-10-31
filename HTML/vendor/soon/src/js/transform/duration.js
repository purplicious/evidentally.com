transform.duration = (function(Utils){

    var formats = Utils.FORMATS;
    var l = formats.length;

    // add x amount of months to certain date
    function addMonths(date,months) {
        date.setMonth(date.getMonth() + months);
        return date;
    }

    function clone(date) {
        return new Date(date.valueOf());
    }

    function isPresented(key,format) {
        return format.indexOf(key) !== -1;
    }

    // momentjs month diff rewritten to use classic js date object
    function diffInMonths(a, b) {

        // difference in months
        var wholeMonthDiff = ((b.getFullYear() - a.getFullYear()) * 12) + (b.getMonth() - a.getMonth());

        // b is in (anchor - 1 month, anchor + 1 month)
        var anchor = addMonths(clone(a),wholeMonthDiff);
        var anchor2;
        var adjust;

        if (b - anchor < 0) {
            anchor2 = addMonths(clone(a),wholeMonthDiff - 1);
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = addMonths(clone(a),wholeMonthDiff + 1);
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);

    }

    var monthFactor = {
        'M':1,
        'y':12
    };

    return function(from,till,format,cascade) {

        var presentsMonths = isPresented('M',format);
        var presentsYears = isPresented('y',format);

        return function(millisecondsRemaining){

            var i=0;
            var result = [];
            var anchor,monthsRemaining,used,key,required,months;

            if ((presentsMonths || presentsYears) || !cascade) {

                anchor = new Date(from.valueOf() + millisecondsRemaining);

                monthsRemaining = diffInMonths(anchor,from);

                months = presentsMonths ? Math.floor(monthsRemaining) : Math.floor(monthsRemaining / 12) * 12;

                millisecondsRemaining = anchor.valueOf() - addMonths(clone(from),months).valueOf();

            }

            for(;i<l;i++) {

                key = formats[i];

                // years & months
                if (i<2) {

                    used = Math.floor(monthsRemaining / monthFactor[key]);

                    if (isPresented(key,format)) {

                        monthsRemaining -= used * monthFactor[key];

                        result.push(Math.max(0,used));
                    }
                    else if (!cascade) {

                        monthsRemaining -= used * monthFactor[key];

                    }

                }
                // rest
                else {

                    required = Utils.AMOUNT[key];

                    // how much is used by this format type
                    used = Math.floor(millisecondsRemaining / required);

                    // is this format type is used in a slot calculate what's left
                    if (isPresented(key,format)) {

                        // subtract
                        millisecondsRemaining = millisecondsRemaining % required;

                        // and add results
                        result.push(Math.max(0,used));

                    }
                    else if (!cascade) {

                        // if we're not cascading act as if we used up the value
                        millisecondsRemaining = millisecondsRemaining % required;
                    }

                }

            }

            return result;

        }

    };

}(utils));
