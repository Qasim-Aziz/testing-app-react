import React from 'react'
import { Card, Typography, Timeline, Row, Col, Layout, DatePicker } from 'antd'
import moment from 'moment'
import {
  EditOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'

const { Title, Text } = Typography

export default ({ style, title, location, startTime, endTime, note, isApproved, isBillable }) => {
  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        height: 164,
        marginBottom: 10,
        overflow: 'hidden',
        ...style,
      }}
      bodyStyle={{
        padding: '17px 35px',
      }}
    >
      <Row>
        <Col sm={5} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginTop: '8px' }}>
            <Timeline key={Math.random()}>
              <Timeline.Item dot={<ClockCircleOutlined className="Timeline-Icon" />}>
                From {startTime}
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </Timeline.Item>
              <Timeline.Item dot={<ClockCircleOutlined className="Timeline-Icon" />}>
                To {endTime}{' '}
              </Timeline.Item>
            </Timeline>
          </div>
        </Col>
        <Col sm={15}>
          <Title style={{ fontSize: 24, lineHeight: '33px', margin: '0 0 6px' }}>{title}</Title>
          <Text style={{ fontSize: 18, marginBottom: '15px' }}>{location}</Text>
          <p>{note}</p>
        </Col>
        <Col sm={4} style={{ paddingLeft: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 80, fontWeight: 600, fontSize: 16 }}>Aproved:</div>
            {isApproved ? (
              <CheckCircleOutlined style={{ fontSize: 18, color: COLORS.success }} />
            ) : (
              <CloseCircleOutlined style={{ fontSize: 18, color: COLORS.danger }} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 80, fontWeight: 600, fontSize: 16 }}>Billable:</div>
            {isBillable ? (
              <CheckCircleOutlined style={{ fontSize: 18, color: COLORS.success }} />
            ) : (
              <CloseCircleOutlined style={{ fontSize: 18, color: COLORS.danger }} />
            )}
          </div>
        </Col>
      </Row>
    </Card>
  )
}
