/* eslint-disable */
import React from 'react'
import { DatePicker, Input } from 'antd'
import moment from 'moment'
import { COLORS } from 'assets/styles/globalStyles'

const FilterComp = props => {
  const {
    handleSelectDate,
    rangePicker,
    searchLabel,
    searchText,
    onTextChange,
    startDate,
    endDate,
  } = props

  const continer = {
    background: COLORS.palleteLight,
    position: 'relative',
    display: 'flex',
    height: '50px',
    padding: '2px 8px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  }
  const Headstyle = {
    fontSize: '16px',
    paddingTop: '7px',
    color: 'black',
    marginRight: '10px',
  }

  return (
    <div style={continer}>
      <span>
        <span style={Headstyle}>Date: </span>
        {rangePicker ? (
          <>
            <DatePicker.RangePicker
              style={{ width: '250px', marginRight: 40 }}
              defaultValue={[moment(startDate), moment(endDate)]}
              onChange={handleSelectDate}
            />
          </>
        ) : (
          <DatePicker style={{ width: '250px' }} onChange={handleSelectDate} />
        )}
      </span>
      {onTextChange && (
        <span>
          <span style={Headstyle}>{searchLabel ? searchLabel : 'Name'}: </span>
          <Input.Search
            value={searchText}
            onChange={onTextChange}
            allowClear
            style={{ width: '240px' }}
            placeholder="Search..."
          />
        </span>
      )}
    </div>
  )
}

export default FilterComp
