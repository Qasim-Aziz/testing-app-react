/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import moment from "moment";
import Header from "./Header";
import "./styles.css";


export default function Calendar({ value, onChange, appointments }) {
    const [calendar, setCalendar] = useState([]);
    const [week, setWeek] = useState([]);
    const [view, setView] = useState('week');


    useEffect(() => {
        setCalendar(buildCalendar(value));
        setWeek(buildWeek(value));
    }, [value]);

    function buildWeek(date) {
        const a = [];

        const weekStartDay = date.clone().startOf("week");
        const weekEndDay = date.clone().endOf("week");

        console.log("start-end-----", weekStartDay, weekEndDay);

        const _date = weekStartDay.clone().subtract(1, "day");

        while (_date.isBefore(weekEndDay, "day")) {
            a.push(
                Array(7)
                    .fill(0)
                    .map(() => _date.add(1, "day").clone())
            );
        }
        return a;
    }

    function buildCalendar(date) {
        const a = [];

        const startDay = date.clone().startOf("month").startOf("week");
        const endDay = date.clone().endOf("month").endOf("week");

        const _date = startDay.clone().subtract(1, "day");

        while (_date.isBefore(endDay, "day")) {
            a.push(
                Array(7)
                    .fill(0)
                    .map(() => _date.add(1, "day").clone())
            );
        }
        return a;
    }

    function isSelected(day) {
        return value.isSame(day, "day");
    }

    function beforeToday(day) {
        return moment(day).isBefore(new Date(), "day");
    }

    function isToday(day) {
        return moment(new Date()).isSame(day, "day");
    }

    function dayStyles(day) {
        if (beforeToday(day)) return "before";
        if (isSelected(day)) return "selected";
        if (isToday(day)) return "today";
        return "";
    }

    const Month = () => {
        return (
            calendar.map((week1, wi) => (
                <div key={wi}>
                    {week1.map((day, di) => (
                        <div
                            key={di}
                            className="day"
                            onClick={() => {
                                if (day < moment(new Date()).startOf("day")) return;
                                onChange(day);
                            }}
                        >
                            <Day day={day} />

                        </div>
                    ))}
                </div>
            ))
        )
    }

    const Week = () => {
        console.log("start-end-----", week);
        return (
            week.map((week2, wi) => (
                <div key={wi}>
                    {week2.map((day, di) => (
                        <div
                            key={di}
                            className="day"
                            onClick={() => {
                                if (day < moment(new Date()).startOf("day")) return;
                                onChange(day);
                            }}
                        >
                            <Day day={day} />

                        </div>
                    ))}
                </div>
            ))
        )
    }


    const Day = ({ day }) => {
        const filter = appointments &&
            appointments.filter(({ node }, index) => {
                return moment(node.start).format('YYYY-MM-DD') === day.format('YYYY-MM-DD');
            });
        return (
            <div className={dayStyles(day)}>
                {day.format("D").toString()}
                <div className='cal-event-div'>
                    {filter && filter.map(({ node }, index) => {
                        return <span key={index} className='cal-event-item'>{node.title}</span>
                    })}
                </div>
            </div>
        )
    }

    function currMonthName() {
        return value.format("MMMM");
    }

    function currYear() {
        return value.format("YYYY");
    }

    return (
        <div className="calendar">
            <div>
                <Button onClick={() => setView('day')}>Day</Button>
                <Button onClick={() => setView('week')}>Week</Button>
                <Button onClick={() => setView('month')}>Month</Button>
            </div>
            <Header value={value} onChange={onChange} />

            <div className="body">
                <div className="day-names">
                    {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => (
                        <div className="week">{d}</div>
                    ))}
                </div>
                {view === 'week' ? <Week /> : null}
                {view === 'month' ? <Month /> : null}
            </div>
        </div>
    );
}

