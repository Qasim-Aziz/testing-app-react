/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react'
import { Typography, DatePicker } from 'antd'
import moment from 'moment'
import './Calander.scss'

const { Text } = Typography

const dateFormat = 'YYYY-MM-DD'

const getDates = selectDate => {
  const returnValue = []
  for (let i = 0; i <= 6; ++i) {
    returnValue.push(
      moment(selectDate)
        .weekday(i)
        .format(dateFormat),
    )
  }
  return returnValue
}

const Calander = ({ value, handleOnChange, style }) => {
  const [selectDate, setSelectDate] = useState(moment(value).format(dateFormat))
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  const [dates, setDates] = useState(getDates(value))

  useEffect(() => {
    setSelectDate(moment(value).format(dateFormat))
    setDates(getDates(value))
  }, [value])

  return (
    <div
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '15px 30px',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
          maxWidth: 640,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text style={{ fontSize: 20, color: '#000', fontWeight: 600 }}>Select By Date</Text>
        <DatePicker
          defaultValue={moment(value, dateFormat)}
          style={{
            width: '190px',
          }}
          size="large"
          value={moment(value)}
          onChange={newDate => {
            handleOnChange(moment(newDate))
          }}
          allowClear={false}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((day, index) => {
          return (
            <button
              key={day}
              type="button"
              className="calEle"
              style={{
                background: dates[index] === selectDate ? '#1890ff' : '#fff',
                borderRadius: 10,
                width: 90,
                height: 65,
                paddingTop: 0,
                paddingLeft: 15,
                paddingRight: 15,
                display: 'fex',
                flexDirection: 'column',
                alignItems: 'center',
                border: 'none',
                cursor: 'pointer',
                margin: 5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important',
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              }}
              onClick={() => {
                const newDate = dates[index]
                handleOnChange(moment(newDate).format(dateFormat))
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: '25px',
                  display: 'block',
                  textAlign: 'center',
                  color: dates[index] === selectDate ? '#fff' : '#1890ff',
                }}
              >
                {day}
              </Text>
              <Text
                style={{
                  fontSize: 26,
                  lineHeight: '41px',
                  textAlign: 'center',
                  display: 'block',
                  fontWeight: 600,
                  color: dates[index] === selectDate ? '#fff' : '#1890ff',
                }}
              >
                {moment(dates[index]).format('DD')}
              </Text>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calander
