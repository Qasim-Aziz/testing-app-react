import React, { useState, useEffect } from 'react'
import { Tabs, DatePicker, notification, Input, Select, Button, Icon } from 'antd'
import RecordTab from 'components/BehaviourData/RecordTab'
import TemplateTab from 'components/BehaviourData/TemplateTab'
import { COLORS } from 'assets/styles/globalStyles'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { DANCLE_STATUS } from './query'
import './styles.scss'

const container = {
  background: COLORS.palleteLight,
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
  color: 'blaxk',
  marginRight: '10px',
}
const BehaviorDataPage = ({ openRightdrawer, openDrawer, closeDrawer }) => {
  const studentId = localStorage.getItem('studentId')
  const [activeTab, setactiveTab] = useState('templates')
  const [date, setDate] = useState({
    gte: moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
    lte: moment().format('YYYY-MM-DD'),
  })
  const [searchText, setSearchText] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  const { data: statusData, loading: statusLoading, error: statusError } = useQuery(DANCLE_STATUS)

  useEffect(() => {
    if (statusError) {
      notification.error({
        message: 'Unable to fetch decel status',
      })
    }
  }, [statusError])

  const handleDateSelectionChange = (newDate, value) => {
    setDate({
      gte: moment(value[0]).format('YYYY-MM-DD'),
      lte: moment(value[1]).format('YYYY-MM-DD'),
    })
  }

  return (
    <div>
      <div style={container}>
        <span>
          <span style={Headstyle}>Date: </span>
          <DatePicker.RangePicker
            style={{ width: '240px', marginRight: 40 }}
            defaultValue={[moment(date.gte), moment(date.lte)]}
            onChange={handleDateSelectionChange}
          />
        </span>
        <span>
          <span style={Headstyle}>Behaviour: </span>
          <Input.Search
            allowClear
            style={{ width: '200px', marginRight: 40 }}
            placeholder="Search..."
            onChange={e => setSearchText(e.target.value)}
          />
        </span>
        <span>
          <span style={Headstyle}>Status: </span>
          <Select
            placeholder="Select Behavior"
            loading={statusLoading}
            showSearch
            allowClear
            style={{ width: '200px' }}
            value={searchStatus}
            onChange={e => setSearchStatus(e)}
          >
            <Select.Option value="">All</Select.Option>
            {statusData?.getDecelStatus.map(item => {
              return (
                <Select.Option value={item.statusName} key={item.id}>
                  {item.statusName}
                </Select.Option>
              )
            })}
          </Select>
        </span>
      </div>
      <Tabs
        type="card"
        className="behaviorData"
        onChange={setactiveTab}
        defaultActiveKey="templates"
      >
        <Tabs.TabPane tab="Templates" key="templates">
          <TemplateTab
            studentId={studentId}
            date={date}
            searchText={searchText}
            searchStatus={searchStatus}
            openRightdrawer={openRightdrawer}
            openDrawer={openDrawer}
            closeDrawer={closeDrawer}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Records" key="records">
          <RecordTab
            studentId={studentId}
            activeTab={activeTab}
            date={date}
            searchText={searchText}
            searchStatus={searchStatus}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default BehaviorDataPage
