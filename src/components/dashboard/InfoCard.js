/* eslint-disable no-unused-vars */
import React from 'react'
import { Row, Col, Typography, Button } from 'antd'

const { Text, Paragraph } = Typography

const InfoCard = ({ title, icon, style }) => {

  return (
    <div
      style={{
        margin: '10px 10px 10px 0',
        padding: '22px 31px',
        height: '180px',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        maxWidth: 400,
        ...style,
      }}
    >

      <Row type="flex" justify="space-between" style={{ color: '#000' }}>
        <Col span={20}>
          <Text style={{ fontSize: '20px', lineHeight: '27px', color: '#000' }}>{title}</Text>
        </Col>
        <Col span={4}>
          <img style={{ width: 60, height: 60 }} src={icon} alt="" />
        </Col>
      </Row>
      <Paragraph style={{ fontSize: '14px', color: '#000' }}>
        Lorem ipsum dolor sit amet consectetur.
      </Paragraph>

    </div>
  )
}

export default InfoCard
