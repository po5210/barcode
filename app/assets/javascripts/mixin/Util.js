Ext.define('mixin.Util', function() {
	
	/**
	 * toDate와 fromDate의 차이의 일수 차이를 계산
	 */
	function calDateRange(fromDate, toDate) {
		if(toDate == null || fromDate == null)
			return -1;
			
		if(getClassName(fromDate) != 'Date') {
			var fromDtStr = fromDate.split('-');
			fromDate = new Date(fromDtStr[0], (Number(fromDtStr[1]) - 1) + "", fromDtStr[2]);
		} 
		
		if(getClassName(toDate) != 'Date') {
			var toDtStr = toDate.split('-');
			toDate = new Date(toDtStr[0], (Number(toDtStr[1]) - 1) + "", toDtStr[2]);
		}
		
		return (toDate.getTime() - fromDate.getTime()) / 1000 / 60 / 60 / 24;
	}
	
	function getClassName(obj) {
		if (typeof obj != "object" || obj === null) return false;
		return /(\w+)\(/.exec(obj.constructor.toString())[1];
	}
	
	/**
	 * Shift를 고려한 현재 날짜 : Current Date에서 Shift1 시작 시간을 뺀 Date값을 넘겨준다. 
	 */
	function getCurrentShiftDate() {
		var date = new Date();
		var shift1TimeArr = SHIFT1_START.split(/\:|\-/g);
		date.setHours(date.getHours() - shift1TimeArr[0]);
		date.setMinutes(date.getMinutes() - shift1TimeArr[1]);
		return date;
	}
	
	/**
	 * Shift를 고려한 현재 날짜에서 addCount만큼을 더한 날짜를 넘겨준다.
	 */
	function getShiftDate(addCount) {
		var date = getCurrentShiftDate();
		date.setDate(date.getDate() + addCount);
		return date;
	}
	
	/**
	 * 현재 날짜에 addCount만큼을 더한 날짜를 계산해서 Date 객체로 리턴
	 */
	function getDate(addCount) {
		var date = new Date();
		date.setDate(date.getDate() + addCount);
		return date;
	}
	
	/**
	 * date 객체를 기본 format으로 변경하여 문자열로 리턴 
	 */
	function getFormattedDate(date) {
		return Ext.util.Format.date(date, T('format.date'));
	}
	
	/**
	 * date 객체를 기본 format으로 변경하여 문자열로 리턴 
	 */
	function getFormattedTime(date) {
		return Ext.util.Format.date(date, T('format.datetime'));
	}
	
	/**
	 * date 객체를 format으로 변경하여 문자열로 리턴 
	 */
	function formattedDate(date, format) {
		return Ext.util.Format.date(date, format);
	}
	
	/**
	 * date 객체를 format으로 변경하여 문자열로 리턴 
	 */
	function formattedTime(date, format) {
		return Ext.util.Format.date(date, format);
	}
	
	/**
	 * workDate, timeStr으로 실제 시간을 계산해서 Date 객체로 리턴한다. 
	 */
	function getSysTime(workDate, shift, timeStr) {
		if(timeStr && timeStr.length == 5) {
			timeStr += ":00";
		}
		
		var newDate = Ext.Date.parse((workDate + ' ' + timeStr), T('format.submitDatetime'));

		if(shift == '2' && timeStr.indexOf('0') == 0) {
			newDate.setDate(newDate.getDate() + 1);
		}

		return newDate;
	}
	
	/**
	 * 현재 WorkDate, 현재 shift 시작 시간을 systime으로 리턴 
	 */
	function getCurrentShiftStartTime() {
		return getSysTime(WORK_DATE, SHIFT, SHIFT_START);
	}
	
	/**
	 * 현재 WorkDate, 현재 shift 종료 시간을 systime으로 리턴 
	 */
	function getCurrentShiftEndTime() {
		return getSysTime(WORK_DATE, SHIFT, SHIFT_END);
	}
	
	function camelize(src) {
		var lowers = src.toLowerCase();
		return lowers.replace(/[A-Z]([A-Z]+)|(?:^|[-_])(\w)/g, function(x, c) {
			var x0 = x.charAt(0);

			if (x0 == '-' || x0 == '_')
				return x.substr(1).toUpperCase();
			return x;
		});
	}
	
	/**
	 * Id에서 도메인 아이디를 제거한 이름을 리턴한다.
	 */
	function idToName (value) {
		return value ? value.replace((login.current_domain_id + '-'), '') : '';
	}
	
	function humanize(src) {
		var lowers = src.toLowerCase();
		var result = lowers.replace(/[A-Z]([A-Z]+)|(?:^|[-_])(\w)/g, function(x, c) {
			var x0 = x.charAt(0);

			if (x0 == '-' || x0 == '_') {
				return ' ' + x.substr(1).toUpperCase();
			}
			return x;
		});
		return result.substring(0, 1).toUpperCase() + result.substring(1);
	}
	
	function elapsedTime(from, to, unit) {
		var diff = to - from;

		// strip the miliseconds
		diff /= 1000;

		var seconds = Math.round(diff % 60);
		// remove seconds from the date
		diff = Math.round(diff / 60);
		// get minutes
		var minutes = Math.round(diff % 60);
		// remove minutes from the date
		diff = Math.round(diff / 60);
		// get hours
		var hours = Math.round(diff % 24);
		// remove hours from the date
		diff = Math.round(diff / 24);

		// the rest of Time Diff is number of days
		var days = diff;
		
		var text = 'Text.Elapsed Hours';
		
		if(unit) {
			switch(unit.charAt(0)) {
			case 's' :
				text = 'text.Elapsed Seconds';
				break; 
			case 'm' :
				text = 'text.Elapsed Minutes';
				break; 
			case 'h' :
				text = 'text.Elapsed Hours';
				break; 
			case 'd' :
				text = 'text.Elapsed Days';
				break; 
			}
		}
		
		return T(text, {
			days : days,
			hours : hours,
			minutes : minutes,
			seconds : seconds
		});
	}
	
	return {
		getClassName : getClassName,
		calDateRange : calDateRange,
		getCurrentShiftDate : getCurrentShiftDate,
		getShiftDate : getShiftDate,
		getDate : getDate,
		getSysTime : getSysTime,
		getCurrentShiftStartTime : getCurrentShiftStartTime,
		getCurrentShiftEndTime : getCurrentShiftEndTime,
		getFormattedDate : getFormattedDate,
		getFormattedTime : getFormattedTime,
		formattedDate : formattedDate,
		formattedTime : formattedTime,
		camelize : camelize,
		humanize : humanize,
		elapsedTime : elapsedTime,
		idToName : idToName
	};
}());
