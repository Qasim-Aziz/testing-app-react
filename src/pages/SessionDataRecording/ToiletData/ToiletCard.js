import React from 'react'
import { Typography } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const MealCard = ({ style, urination, bowel, time, prompted }) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '20px 26px',
        width: '98%',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Title
          style={{
            fontSize: 24,
            lineHeight: '33px',
          }}
        >
          {urination && 'Urination'}
          {bowel && urination && ' & Bowel'}
          {bowel && !urination && 'Bowel'}
        </Title>
        <ClockCircleOutlined style={{ fontSize: 30, marginLeft: 'auto' }} />
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            marginRight: 19,
          }}
        >
          {time}
        </Text>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
        }}
      >
        {prompted && bowel && urination ? (
          <span style={{ color: 'green' }}>Independent Request</span>
        ) : (
          <span style={{ color: 'red' }}>Prompted to Request</span>
        )}
      </Text>
    </div>
  )
}

export default MealCard
