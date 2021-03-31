/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react'
import { Icon, Layout, Row, Col, Typography, Popover } from 'antd'
import TaskAnalysisGroupList from './TaskAnalysisGroupList'
import TaskQuartionView from './TaskQuartionView'
import PageHeader from './PageHeader'
import { leftDivStyle, rightDivStyle, assessmentCompletedBlockStyle, defaultDivStyle, leftListBoxStyle, recordResponseButtonStyle } from './customStyle'

const { Content } = Layout
const { Title, Text } = Typography

export default () => {
  const [selectedGroup, setSelectedGroup] = useState()
  const areaId = 'VmJtYXBwQXJlYTox' // use milestone area id for task analysis ans raj said
  const masterId = localStorage.getItem('vbMappMasterId')

  const handleGroupChange = group => {
    setSelectedGroup(group)
  }
  return (
    <Layout style={{ padding: '0px' }}>
      <Content
        style={{
          padding: '0px 20px',
          maxWidth: 1300,
          width: '100%',
          margin: '0px auto',
        }}
      >
        <Row>
          <Col sm={5}>
            <div style={leftDivStyle}>
              <TaskAnalysisGroupList
                areaId={areaId}
                selected={selectedGroup}
                handleGroupChange={handleGroupChange}
              />
            </div>
          </Col>
          <Col sm={19}>
            <div style={rightDivStyle}>
              <PageHeader pageTitle="VB-MAPP Task Analysis Assessment" />
              {selectedGroup && <TaskQuartionView group={selectedGroup} masterId={masterId} />}
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>

  )
}
