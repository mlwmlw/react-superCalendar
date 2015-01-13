var React = require('react');
var _ = require('lodash');
var Day = React.createClass({
	render: function() {
		return <td>{this.props.day}</td>;
	}
});
var Week = React.createClass({
	render: function() {
		var weekDate = new Date(this.props.year, this.props.month - 1, this.props.date - 1);
		var days = [];
		for(var i = 0; i < 7; i++) {
			weekDate.setDate(weekDate.getDate() + 1);
			var day = weekDate.getMonth() + 1 == this.props.month && weekDate.getDate();
			days.push(<Day day={day}></Day>);
		}
		return <tr>{days}</tr>;
	}
});


var Calendar = React.createClass({
	getMonthDay: function(m) {
		m = m || this.state.date.getMonth();
		var date = new Date();
		date.setMonth(m + 1);
		date.setDate(-1);
		return date.getDate() + 1;
	},
	getInitialState: function() {
		var now = new Date();
		return {date: now};
	},
	row: function(start, end, day, max) {
		var days = [];
		for(var i = start; i < end; i++) {
			var d = i - day >= 0 && i - day < max && i - day + 1;
			var style = {}
			if(d == this.state.date.getDate())
				style.background = 'red';
			days[i] = <td style={style}>{d}</td>;
		}
		return days;
	},
	prev: function() {
		var date = this.state.date;
		date.setMonth(date.getMonth() - 1);
		this.setState({date: date});
	},
	next: function() {
		var date = this.state.date;
		date.setMonth(date.getMonth() + 1);
		this.setState({date: date});
	},
	firstDay: function() {
		var date = new Date(this.state.date.getTime());
		date.setDate(1);
		return date;
	},
	render: function() {
		var date = this.firstDay();
		day = this.getMonthDay();
		weeks = [];
		for(var i =0; i <= Math.ceil(day / 7); i++) {
			//var row = this.row(i*7, (i + 1)* 7, date.getDay() , day);
			weeks[i] = <Week week={i} date={date.getDate() + i * 7 - date.getDay()} year={date.getFullYear()} month={date.getMonth() + 1}></Week>;
		}
		return (
			<div>
				<table>
					<caption>{this.state.date.getFullYear() + ' 年 ' + (this.state.date.getMonth() + 1) + ' 月'}</caption>
					<thead>
					<tr>
						<th>日</th>
						<th>一</th>
						<th>二</th>
						<th>三</th>
						<th>四</th>
						<th>五</th>
						<th>六</th>
					</tr>
					</thead>
					<tbody>
					{weeks}
					</tbody>
				</table>
				<button onClick={this.prev}>prev</button>
				<button onClick={this.next}>next</button>
			</div>
		);
	}
});
module.exports = Calendar;
