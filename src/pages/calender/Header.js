/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'

export default function CalendarHeader({ value, onChange }) {
  function currMonthName() {
    return value.format('MMM')
  }

  function currYear() {
    return value.format('YYYY')
  }

  function prevMonth() {
    return value.clone().subtract(1, 'month')
  }

  function nextMonth() {
    return value.clone().add(1, 'month')
  }

  function thisMonth() {
    return value.isSame(new Date(), 'month')
  }

  return (
    <div className="header">
      <div className="previous" onClick={() => onChange(prevMonth())}>
        {String.fromCharCode(171)}
        {/* {!thisMonth() ? String.fromCharCode(171) : null} */}
      </div>
      <div className="current">
        {currMonthName()} - {currYear()}
      </div>
      <div className="next" onClick={() => onChange(nextMonth())}>
        {String.fromCharCode(187)}
      </div>
    </div>
  )
}
