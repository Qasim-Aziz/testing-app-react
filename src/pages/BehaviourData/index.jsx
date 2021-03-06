import React, { useState } from 'react'
import { Tabs, DatePicker, Input, Select, Button, Icon } from 'antd'
import RecordTab from 'components/BehaviourData/RecordTab'
import TemplateTab from 'components/BehaviourData/TemplateTab'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { DANCLE_STATUS } from './query'
import './styles.scss'

const container = {
  background: 'rgb(241 241 241)',
  position: 'relative',
  display: 'flex',
  height: '50px',
  padding: '2px 8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
}
const Headstyle = {
  fontSize: '16px',
  paddingTop: '7px',
  marginRight: '10px',
}
const BehaviorDataPage = () => {
  const studentId = localStorage.getItem('studentId')
  const [activeTab, setactiveTab] = useState('templates')
  const [startDate, setStartDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment().subtract(10, 'd'))

  const { data: statusData, loading: statusLoading, error: statusError } = useQuery(DANCLE_STATUS)

  console.log(statusData, 'std')
  return (
    <div>
      <div style={container}>
        <span>
          <span style={Headstyle}>Date: </span>
          <DatePicker.RangePicker
            style={{ width: '250px', marginRight: 40 }}
            defaultValue={[moment(startDate), moment(endDate)]}
          />
        </span>
        <span>
          <span style={Headstyle}>Behaviour: </span>
          <Input.Search allowClear style={{ width: '240px' }} placeholder="Search..." />
        </span>
        <span>
          <span style={Headstyle}>Status: </span>
          {/* <Select></Select> */}
        </span>

        <Button
          type="primary"
          style={{ marginLeft: 'auto' }}
          // onClick={() => setCreatingNewTemplate(true)}
        >
          <Icon type="plus" /> Create new Template
        </Button>
      </div>
      <Tabs
        type="card"
        className="behaviorData"
        onChange={setactiveTab}
        defaultActiveKey="templates"
      >
        <Tabs.TabPane tab="Templates" key="templates">
          <TemplateTab studentId={studentId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Records" key="records">
          <RecordTab studentId={studentId} activeTab={activeTab} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default BehaviorDataPage
