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
          width: '70%',
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
        <div
          style={{
            display: 'flex',
            width: '70%',
            marginTop: 10,
            alignItems: 'center',
          }}
        >
          <Text
            type="secondary"
            style={{
              fontSize: '14px',
              lineHeight: '19px',
              color: '#2E2E2E',
              display: 'flex',
              alignItems: 'center',
              marginRight: 34,
            }}
          >
            {duration}
          </Text>
          <div style={{ marginRight: 34 }}>{targetsCount} Targets</div>
          <div style={{ marginRight: 34 }}>
            {hostList.map(({ node }, index) => {
              return node.memberName + (index < hostList.length - 1 ? ', ' : '')
            })}
          </div>
          {status ? <div className="boxText">{status}</div> : <div className="boxText">PENDING</div>}
        </div>
      </div>
    </div>
  )
}

export default TaskHeader
