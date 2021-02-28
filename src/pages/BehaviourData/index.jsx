import React, { useState } from 'react'
import { Tabs } from 'antd'
import RecordTab from 'components/BehaviourData/RecordTab'
import TemplateTab from 'components/BehaviourData/TemplateTab'
import './styles.scss'

const BehaviorDataPage = () => {
  const studentId = localStorage.getItem('studentId')
  const [activeTab, setactiveTab] = useState('templates')

  return (
    <Tabs type="card" className="behaviorData" onChange={setactiveTab} defaultActiveKey="templates">
      <Tabs.TabPane tab="Templates" key="templates">
        <TemplateTab studentId={studentId} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Records" key="records">
        <RecordTab studentId={studentId} activeTab={activeTab} />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default BehaviorDataPage
