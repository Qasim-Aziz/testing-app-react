import React from 'react'
import { Avatar, Col, Icon, Typography } from 'antd'
import dawn from '../../icons/dawn.png'

const TimeSpend = ({ image, daySlot, time, onDecrement, onIncrement }) => {
  const font14 = {
    fontSize: '14px',
  }
  const colorBlue = {
    color: 'blue',
  }
  const { Text } = Typography

  return (
    <Col className="time-card">
      <div>
        <Text style={font14}>
          <Avatar shape="square" src={image} style={{ opacity: '0.5' }} />
          &nbsp;
        </Text>
        <Text>{daySlot}</Text>
      </div>
      <div style={{ margin: 'auto 0px' }}>
        <Icon type="minus" style={colorBlue} onClick={onDecrement} />
        <Text style={font14}>&nbsp;&nbsp;{time}&nbsp;hr&nbsp;&nbsp;</Text>
        <Icon type="plus" style={colorBlue} onClick={onIncrement} />
      </div>
    </Col>
  )
}

export default TimeSpend
