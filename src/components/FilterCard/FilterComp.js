import React from 'react'
import { DatePicker, Input } from 'antd'
import moment from 'moment'

const FilterComp = props => {
  const { handleSelectDate, rangePicker, searchVal, searchValHandler, startDate, endDate } = props

  const continer = {
    background: 'rgb(241 241 241)',
    border: '1px solid #E4E9F0',
    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
    borderRadius: 10,
    padding: '10px 35px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '10px',
    width: '1108px',
  }
  const Headstyle = {
    fontSize: '16px',
    paddingTop: '7px',
    marginRight: '10px',
  }
  const FieldWidth = {
    width: '300px',
  }

  return (
    <div style={continer}>
      <span>
        <span style={Headstyle}>Filter By Date</span>
        {rangePicker ? (
          <>
            <DatePicker.RangePicker
              style={FieldWidth}
              defaultValue={[moment(startDate), moment(endDate)]}
              onChange={handleSelectDate}
            />
          </>
        ) : (
          <DatePicker style={FieldWidth} onChange={handleSelectDate} />
        )}
      </span>
      {searchValHandler && (
        <span>
          <span style={Headstyle}>Search</span>
          <Input.Search
            size="small"
            value={searchVal}
            onChange={searchValHandler}
            allowClear
            style={FieldWidth}
            placeholder="search..."
          />
        </span>
      )}
    </div>
  )
}

export default FilterComp
