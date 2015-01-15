var React = require('react');
var _ = require('lodash');
var Day = React.createClass({
	render: function() {
		style = this.props.selected ? {background: 'red'}: {};
		return <td style={style}>{this.props.day}</td>;
	}
});
var Week = React.createClass({
	render: function() {
		var weekDate = new Date(this.props.year, this.props.month - 1, this.props.date - 1);
		var days = [];
		var selected = this.props.selected;
		for(var i = 0; i < 7; i++) {
			weekDate.setDate(weekDate.getDate() + 1);
			var day = weekDate.getMonth() + 1 == this.props.month && weekDate.getDate();
			if(selected.getFullYear() == weekDate.getFullYear() &&
				selected.getMonth() == weekDate.getMonth() &&
				selected.getDate() == weekDate.getDate())
				days.push(<Day selected month={this.props.month} day={day}></Day>);
			else
				days.push(<Day month={this.props.month} day={day}></Day>);
		}
		return <tr>{days}</tr>;
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
	render: function() {
		var date = this.firstDay();
		day = this.getMonthDay() + date.getDay();
		weeks = [];
		for(var i =0; i < Math.ceil(day / 7); i++) {
			weeks[i] = <Week selected={this.state.selected} week={i} date={date.getDate() + i * 7 - date.getDay()} year={date.getFullYear()} month={date.getMonth() + 1}></Week>;
		}
		return (
			<div>
				<table>
					<caption>{this.state.view.getFullYear() + ' 年 ' + (this.state.view.getMonth() + 1) + ' 月'}</caption>
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
					<tfoot style={{textAlign:"center"}}>
						<tr>
							<td colSpan="7">
								<button onClick={this.prev}>prev</button>
								<button onClick={this.next}>next</button>
							</td>
						</tr>
					</tfoot>
					<tbody>
					{weeks}
					</tbody>
					
				</table>
			</div>
		);
	}
});
module.exports = Calendar;
