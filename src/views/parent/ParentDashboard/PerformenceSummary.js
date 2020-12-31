/* eslint-disable no-unused-vars */
import React from 'react'
import { Row, Col, Typography, Select } from 'antd'
import './PerformenceSummary.scss'
import targetIcon from 'icons/target.png'
import startIcon from 'icons/start.png'

const { Title, Text } = Typography
const { Option } = Select

function PerformenceCard({ title, icon, target }) {
  return (
    <div className="performenceCard">
      <img className="perCardIcon" src={icon} alt="" />
      <div className="perCardMainContent">
        <Title
          level={4}
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 20,
            lineHeight: '27px',
            color: '#000',
          }}
        >
          {title}
        </Title>
        <Title
          level={3}
          style={{
            margin: '0',
            fontWeight: 'bold',
            fontSize: 36,
            lineHeight: '49px',
            color: '#E58425',
          }}
        >
          {target}
        </Title>
      </div>
    </div>
  )
}

function PerformenceSummary({
  style,
  totalTarget,
  masteredTarget,
  inTherapyTargets,
  targetCountBy,
  handleTargetCountBy,
}) {
  return (
    <Row style={{ ...style }}>
      <Col style={{ backgroundColor: 'transparent' }} xs={24} lg={24}>
        <div style={{ backgroundColor: '#fff' }}>
          <Text className="performenchSummaryTitle">Summary Of This </Text>
          <Select
            value={targetCountBy}
            onChange={handleTargetCountBy}
            style={{
              marginLeft: 5,
            }}
          >
            <Option value="week" key="1">
              Week
            </Option>
            <Option value="month" key="2">
              Month
            </Option>
            <Option value="year" key="3">
              Year
            </Option>
          </Select>
          <Row gutter={[39, 0]} className="summaryCardsBox">
            <Col xs={24} lg={8}>
              <PerformenceCard icon={startIcon} title="Total Targets" target={totalTarget} />
            </Col>

            <Col xs={24} lg={8}>
              <PerformenceCard target={masteredTarget} icon={targetIcon} title="Mastered Targets" />
            </Col>

            <Col xs={24} lg={8}>
              <PerformenceCard target={inTherapyTargets} icon={targetIcon} title="In Therapy" />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default PerformenceSummary
