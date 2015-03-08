var React = require('react');
var _ = require('lodash');
var DATES = {
	compare: function(a, b) {
		if(!a || !b)
			return false;
		return a.getFullYear() == b.getFullYear() &&
			a.getMonth() == b.getMonth() &&
			a.getDate() == b.getDate();
	}
}
var Day = React.createClass({
	render: function() {
		var date = this.props.date;
		var today = new Date();
		var cls = "picker__day";
		if(this.props.week == 0 && date.getDate() > 7) 
			cls += " picker__day--outfocus";
		else if(this.props.week > 1 && date.getDate() < 7) 
			cls += " picker__day--outfocus";
		else
			cls += " picker__day--infocus";

		if(this.props.selected)
			cls += " picker__day--selected picker__day--highlighted";
		else if(DATES.compare(date, today))
			cls += " picker__day--today picker__day--highlighted";
		return <td onClick={this.props.onClick.bind(null, date)}><div className={cls}>{date.getDate()}</div></td>;
	}
});
var Week = React.createClass({
	render: function() {
		var weekDate = this.props.weekDate;
		var days = [];
		var selected = this.props.selected;
		for(var i = 0; i < 7; i++) {
			var theDate = new Date(weekDate.getTime() + 86400 * i * 1000)
			//var day = weekDate.getMonth() + 1 == this.props.month && weekDate.getDate();
			days.push(<Day selected={DATES.compare(theDate, selected)} onClick={this.props.onClick} week={this.props.week} month={weekDate.getMonth()} date={theDate}></Day>);
		}
		return <tr>{days}</tr>;
	}
});
var WeekHead = React.createClass({
	render: function() {
		return <thead>
					<tr>
						<th className="picker__weekday">日</th>
						<th className="picker__weekday">一</th>
						<th className="picker__weekday">二</th>
						<th className="picker__weekday">三</th>
						<th className="picker__weekday">四</th>
						<th className="picker__weekday">五</th>
						<th className="picker__weekday">六</th>
					</tr>
					</thead>;
	}
});
var WeekFoot = React.createClass({
	render: function() {
		return <tfoot style={{textAlign:"center"}}>
						<tr>
							<td colSpan="7">
								<button onClick={this.props.prev}>prev</button>
								<button onClick={this.props.next}>next</button>
							</td>
						</tr>
					</tfoot>;
	}
});
var Time = React.createClass({
	render: function() {
		var i = this.props.children;
		var deg = this.props.deg;
		var style = {position: "absolute", lineHeight: "1.5em", width: "1.5em", borderRadius: "1.5em", transform: "rotate(" + -deg + "deg)", textAlign: "center", transition: "all 0.3s ease"};
		if(this.props.selected) {
			style.background = "#b1dcfb";
			style.fontWeight = "bold";
		}
		return <div ref={i} itemProp={this.props.hour} key={i} style={{position: "absolute", top: "43%", left: "4%", width: "45%", transformOrigin: "right center", height: "1.5em", transform: "rotate(" + deg + "deg)"}}>
					<span style={style}>{i}</span>
			</div>
	}
});
var Times = React.createClass({
	hour: 0,
	minute: 0,
	setHour: function(h) {
		this.hour = h;
	},
	setMinute: function(m) {
		this.minute = m;
	},
	render: function() {
		var time = [];
		var hour = null;
		for(var i = 0; i< 12; i++) {
			if(this.hour > 12)
				hour = i == 0 ? 24: i + 12;
			else
				hour = i == 0 ? 12: i;
			if(this.props.mode == 'minute')
				hour = i * 5;
			
			var deg = i * 30 + 90;
			var selected = this.props.mode == 'hour' ? i == this.hour % 12: this.minute / 5 == i;
			time.push(<Time deg={deg} selected={selected} hour={hour} ref={hour}>{hour}</Time>);
		}
		return <div ref="time">{time}</div>;
	}
});
var Clock = React.createClass({
	getInitialState: function () {
		return {hour: 0, minute: 0, hourDeg: 90, minuteDeg: 90, mode: 'hour'};
	},
	setHour: function(h, check) {
		if(h == undefined)
			return;
 		var deg = h * 30 + 90
		if(deg + 360 - this.state.deg < 180)
			deg += 360;
		deg = deg % 360;
		if(this.state.hourDeg <= 90 && deg <= 180 && deg > 90)
			h = this.state.hour < 13 ? +h + 12 : +h - 12;
		else if(this.state.hourDeg <= 180 && deg <= 90 && this.state.hourDeg > 90)
			h = this.state.hour >= 13 ? +h - 12 : +h + 12;
		else
			h = +h;
		this.setState({hour: h, hourDeg: deg});
		this.refs.times.setHour(h);
		if(check)
			this.props.onChange((this.state.hour < 10 ? "0": "") + this.state.hour + ":" + (this.state.minute < 10 ? "0": "") + this.state.minute);
	},
	setMinute: function(m, check) {
		if(m == undefined)
			return;
		var deg = m / 5 * 30 + 90
		this.setState({minute: +m, minuteDeg: deg});
		this.refs.times.setMinute(+m);
		if(check)
			this.props.onChange((this.state.hour < 10 ? "0": "") + this.state.hour + ":" + (this.state.minute < 10 ? "0": "") + this.state.minute);
	},
	setTime: function(t, check) {
		if(this.state.mode == "hour") {
			this.setHour(t, check);
		}
		else {
			this.setMinute(t, check);
		}
	},
	end: function(e) {
		if(e.button == 2)
			return this.setState({mode: 'hour'});
		if(!this.state.drag) {
			this.setState({drag: true, mode: 'hour'});
		}
		else if(this.state.drag && this.state.mode == 'hour') {
			this.setTime(e.target.getAttribute('itemprop'), true);
			this.setState({mode: 'minute'});
		}
		else if(this.state.drag && this.state.mode == 'minute') {
			this.setTime(e.target.getAttribute('itemprop'), true);
			this.setState({drag: false, mode: null});
		}
	},
	move: function(e) {
		if(this.state.drag) 
			this.setTime(e.target.getAttribute('itemprop') || e.target.parentElement.getAttribute('itemprop'), false);
	},
	render: function() {
		var mode = {width: "150px", height: "150px", borderRadius: "150px", background: "", border: "1px solid gray", marginTop: "230px", position: "relative", cursor: "pointer", WebkitUserSelect: "none"};
		if(this.state.hour >= 18 || this.state.hour <= 6) {
			mode.background = "#a3a3a3";
			mode.color = "white";
		}
		else {
			mode.background = "white";
			mode.color = "black";
		}
		var h = this.state.hourDeg;
		var m = this.state.minuteDeg;
		return <div onContextMenu={function(e) { e.preventDefault(); }} onMouseMove={this.move} onMouseDown={this.end} style={mode}>
			<div className="point" style={{background: "#0095dd", borderRadius: 5, width: 5, height: 5, position: "absolute", top: "50%", left: "48.5%", zIndex: 2}}></div>
			<div className="line" style={{position: "absolute", background: this.state.mode =="hour" ? "#c0e5f7": "gray", height: "3px", borderRadius: "3px", marginTop: "50%", width: "20%", marginLeft: "30%", transform: "rotate(" + h + "deg)", transformOrigin: "right center", transition: "all 0.2s ease"}}>
			</div>
			<div className="line" style={{position: "absolute", background: this.state.mode == "minute" ? "#c0e5f7": "gray", height: "3px", borderRadius: "3px", marginTop: "50%", width: "35%", marginLeft: "15%", transform: "rotate(" + m + "deg)", transformOrigin: "right center", transition: "all 0.2s ease"}}>
			</div>
			<Times ref="times" mode={this.state.mode}/>
		</div>
	}
});
var Calendar = React.createClass({
	getMonthDay: function(m) {
		m = m || this.state.view.getMonth();
		var date = new Date();
		date.setMonth(m + 1);
		date.setDate(-1);
		return date.getDate() + 1;
	},
	getInitialState: function() {
		var state = {view: new Date(), selected: new Date(), time: "00:00"};
		state.selected = null;
		return state;
	},
	prev: function() {
		var date = this.state.view;
		date.setMonth(date.getMonth() - 1);
		this.setState({view: date});
	},
	next: function() {
		var date = this.state.view;
		date.setMonth(date.getMonth() + 1);
		this.setState({view: date});
	},
	firstDay: function() {
		var date = new Date(this.state.view.getTime());
		date.setDate(1);
		return date;
	},
	
	getMonthName: function(i) {
		var map = ["January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"];
		return map[i];
	},
	format: function(format) {
		var date = this.state.selected || new Date(); 
		var time = this.state.time.split(":");
		return format.replace("Y", date.getFullYear())
					.replace("m", (date.getMonth() < 11 ? "0" : "") + (+date.getMonth()+1))
					.replace("d", (date.getDate() < 10 ? "0": "") + date.getDate())
					.replace("H", time[0])
					.replace("i", time[1]);
	},
	setTime: function(h) {
		this.setState({time: h});
		setTimeout(this.setInput, 1);
	},
	select: function(date) {
		this.setState({selected: date});
		setTimeout(this.setInput, 1);
	},
	setInput: function() {
		this.refs.input.getDOMNode().value = this.format("Y-m-d H:i");
	},
	render: function() {
		var date = this.firstDay();
		day = this.getMonthDay() + date.getDay();
		weeks = [];
		for(var i =0; i < Math.ceil(day / 7); i++) {
			var weekDate = new Date(date.getTime());
			weekDate.setDate(weekDate.getDate() + i * 7 - date.getDay());
			weeks[i] = <Week onClick={this.select} selected={this.state.selected} week={i} weekDate={weekDate}></Week>;
		}
		return (
			<div>
				<div className="picker--focused picker--opened" style={{position: "relative", height: 10}}>
					<div className="picker__holder">
						<div className="picker__frame">
							<div className="picker__wrap">
								<div className="picker__box">
									<div className="picker__header">
										<div className="picker__month">{this.getMonthName(this.state.view.getMonth())}</div>
										<div className="picker__year">{this.state.view.getFullYear()}</div>
										<div className="picker__nav--prev" onClick={this.prev} role="button" title="Previous month"> </div>
										<div className="picker__nav--next" onClick={this.next} role="button" title="Next month"> </div>
									</div>
									<table className="picker__table">
										<WeekHead />
										<tbody>
										{weeks}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Clock onChange={this.setTime} />
				<input name="datetime" ref="input" />
			</div>
		);
	}
});
module.exports = Calendar;
