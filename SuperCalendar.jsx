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
		return <div itemProp={this.props.deg} key={i} style={{position: "absolute", top: "45%", left: "3%", width: "47%", transformOrigin: "right center", height: "1em", transform: "rotate(" + this.props.deg + "deg)"}}>
					<span style={{position: "absolute", transform: "rotate(" + -this.props.deg + "deg)"}}>{i> 0? i: 12}</span>
			</div>
	}
});
var Times = React.createClass({
	render: function() {
		var time = [];
		for(var i = 0; i< 12; i++) {
			var deg = i * 30 + 90;
			time.push(<Time deg={deg}>{i}</Time>);
		}
		return <div>{time}</div>;
	}
});
var Clock = React.createClass({
	getInitialState: function () {
		return {deg: 0};
	},
	start: function(e) {
		this.setState({drag: true});
		this.setState({deg: +e.target.getAttribute('itemprop')});
	},
	end: function() {
		this.setState({drag: false});
	},
	move: function(e) {
		if(this.state.drag)
			this.setState({deg: +e.target.getAttribute('itemprop')});
	},
	render: function() {
		return <div onMouseUp={this.end} onMouseMove={this.move} onMouseDown={this.start} style={{width: "150px", height: "150px", borderRadius: "150px", background: "#eee", border: "1px solid gray", marginTop: "300px", position: "relative", cursor: "pointer", WebkitUserSelect: "none"}}>
			<div className="point" style={{background: "#0095dd", borderRadius: 3, width: 3, height: 3, position: "absolute", top: "50%", left: "50%"}}></div>
			<div className="line" style={{border: "1px #c0e5f7 solid", marginTop: "50%", width: "45%", marginLeft: "5%", transform: "rotate(" + this.state.deg + "deg)", transformOrigin: "right center"}}></div>
			<Times />
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
		var state = {view: new Date(), selected: new Date()};
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
	select: function(date) {
		this.setState({selected: date});
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
				<Clock />
			</div>
		);
	}
});
module.exports = Calendar;
