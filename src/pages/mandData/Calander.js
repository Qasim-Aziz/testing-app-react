import React, { useState, useEffect, useRef } from 'react'
import { Typography } from 'antd'
import { range } from 'ramda'
import moment from 'moment'
import { usePrevious } from 'react-delta'
import './Calander.scss'

const { Text } = Typography

function inRange(day, date) {
  let firstDate
  let lastdate
  switch (day) {
    case 0:
      firstDate = date
      lastdate = date + 7
      break
    case 1:
      firstDate = date - 1
      lastdate = date + 6
      break
    case 2:
      firstDate = date - 2
      lastdate = date + 5
      break
    case 3:
      firstDate = date - 3
      lastdate = date + 4
      break
    case 4:
      firstDate = date - 4
      lastdate = date + 3
      break
    case 5:
      firstDate = date - 5
      lastdate = date + 2
      break
    case 6:
      firstDate = date - 6
      lastdate = date + 1
      break
    default:
  }
  return range(firstDate, lastdate)
}

const constructDate = (mainDateStr, day) => {
  const year = moment(mainDateStr).year()
  const month = moment(mainDateStr).month() + 1
  const newDate = moment(`${year}-${month}-${day}`).format('YYYY-MM-DD')
  return newDate
}

const Calander = ({ value, handleOnChange }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  const [selectDate, setSelectDate] = useState(moment(value).date())
  const thisWeekDate = useRef(inRange(moment(value).day(), moment(value).date()))
  const [week, setWeek] = useState(moment(value).week())
  const prevWeek = usePrevious(week)

  useEffect(() => {
    setSelectDate(moment(value).date())
    setWeek(moment(value).week())
    if (week !== prevWeek) {
      thisWeekDate.current = inRange(moment(value).day(), moment(value).date())
    }
  }, [value, prevWeek, week])

  return (
    <div
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {days.map((day, index) => {
        const date = thisWeekDate.current[index]
        return (
          <button
            key={day}
            type="button"
            className="calEle"
            style={{
              background: date === selectDate ? '#E58425' : 'none',
              borderRadius: 10,
              width: 100,
              height: 100,
              paddingTop: 10,
              display: 'fex',
              flexDirection: 'column',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              const newDate = constructDate(value, date)
              handleOnChange(newDate)
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: '25px',
                display: 'block',
                textAlign: 'center',
                color: date === selectDate ? '#fff' : '#000',
              }}
            >
              {day}
            </Text>
            <Text
              style={{
                fontSize: 30,
                lineHeight: '41px',
                textAlign: 'center',
                display: 'block',
                fontWeight: 600,
                color: date === selectDate ? '#fff' : '#000',
                marginTop: 14,
              }}
            >
              {date}
            </Text>
          </button>
        )
      })}
    </div>
  )
}

export default Calander
