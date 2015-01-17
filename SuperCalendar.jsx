var React = require('react');
var _ = require('lodash');
var DATES = {
	compare: function(a, b) {
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
		if(DATES.compare(date, today))
			cls += " picker__day--today";
		return <td onClick={this.props.onClick.bind(this, date)}><div className={cls}>{date.getDate()}</div></td>;
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
			if(DATES.compare(theDate, selected))
				days.push(<Day onClick={this.props.onClick} week={this.props.week} month={weekDate.getMonth()} selected date={theDate}></Day>);
			else
				days.push(<Day onClick={this.props.onClick} week={this.props.week} month={weekDate.getMonth()} date={theDate}></Day>);
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
var Calendar = React.createClass({
	getMonthDay: function(m) {
		m = m || this.state.view.getMonth();
		var date = new Date();
		date.setMonth(m + 1);
		date.setDate(-1);
		return date.getDate() + 1;
	},
	getInitialState: function() {
		return {view: new Date(), selected: new Date()};
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
			<div className="picker--focused picker--opened">
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
		);
	}
});
module.exports = Calendar;
