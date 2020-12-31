import React from 'react'
import { Card, Typography, Timeline } from 'antd'

const { Title, Text } = Typography

export default ({ style, title, location, startTime, endTime }) => {
  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        height: 199,
        overflow: 'hidden',
        ...style,
      }}
      bodyStyle={{
        padding: '17px 35px',
      }}
    >
      <Title
        style={{
          fontSize: 24,
          lineHeight: '33px',
          margin: '0 0 6px',
        }}
      >
        {title}
      </Title>
      <Text
        style={{
          fontSize: 18,
          lineHeight: '26px',
          margin: 0,
          marginBottom: 17,
          display: 'block',
        }}
      >
        {location}
      </Text>
      <Timeline>
        <Timeline.Item color="#E58425">{startTime}</Timeline.Item>
        <Timeline.Item color="#E58425">{endTime}</Timeline.Item>
      </Timeline>
    </Card>
  )
}
