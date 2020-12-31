import React from 'react'
import { DatePicker } from 'antd'

const FilterComp = props => {
  const { handleSelectDate } = props
  const continer = {
    background: 'rgb(241 241 241)',
    border: '1px solid #E4E9F0',
    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
    borderRadius: 10,
    padding: '10px 35px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    width: '1108px',
  }
  const Headstyle = {
    fontSize: '16px',
    paddingTop: '7px',
    marginRight: '10px',
  }
  const CalanderWidth = {
    width: '300px',
  }

  return (
    <div style={continer}>
      <span style={Headstyle}>Filter By Date</span>
      <DatePicker style={CalanderWidth} onChange={handleSelectDate} />
    </div>
  )
}

export default FilterComp
