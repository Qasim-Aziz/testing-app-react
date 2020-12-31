import React from 'react'
import { Typography, Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import './taskHeader.scss'

const { Text } = Typography

const TaskHeader = ({ duration, sessionName, targetsCount, hostList, status }) => {
  return (
    <div className="taskHeader">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '70%',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '27px',
          }}
        >
          {sessionName} Sessions
        </Text>
        <Text
          type="secondary"
          style={{
            fontSize: '14px',
            lineHeight: '19px',
            color: '#2E2E2E',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ClockCircleOutlined style={{ marginRight: 6, fontSize: 30, color: '#2E2E2E' }} />
          {duration}
        </Text>
        <div className="boxText">{targetsCount} Targets</div>
        <div className="boxText">
          {hostList.map(({ node }, index) => {
            return node.relationship.name + (index < hostList.length - 1 ? ', ' : '')
          })}
        </div>
        {status && <div className="boxText">{status}</div>}
      </div>
      <Button
        type="primary"
        style={{
          marginLeft: 'auto',
          color: '#fff',
          width: 140,
          background: '#0B35B3',
          height: 40,
          fontSize: 14,
          lineHeight: '22px',
        }}
      >
        Start Session
      </Button>
    </div>
  )
}

export default TaskHeader
