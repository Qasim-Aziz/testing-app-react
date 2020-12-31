import React, { useState, useEffect } from 'react'
import { Row, Col, Tabs, Typography } from 'antd'
import { createUseStyles } from 'react-jss'
import { useQuery } from 'react-apollo'
import Scrollbar from 'react-custom-scrollbars'
import { STAFFS } from './query'
import AttendanceReport from './AttendanceReport'
import TimeSheetReport from './TimeSheetReport'

const { TabPane } = Tabs
const { Text, Title } = Typography

const useSideBarStyles = createUseStyles(() => ({
  sideBarButtom: {
    display: 'flex',
    width: '100%',
    height: 66,
    textAlign: 'left',
    '&:hover, &:focus': {
      outline: 'none',
    },
    border: '1px solid rgb(228, 233, 240)',
    boxShadow: 'rgba(53, 53, 53, 0.1) 0px 0px 4px',
    borderRadius: 10,
    padding: '16px 12px',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default () => {
  const { data, error, loading } = useQuery(STAFFS)
  const classes = useSideBarStyles()
  const [selectStaff, setSelectStaff] = useState()
  const [selectTab, setSelectTab] = useState('0')
  const [selectStaffName, setSelectStaffName] = useState('')

  useEffect(() => {
    if (data && !selectStaff) {
      setSelectStaffName(data.staffs.edges[0].node.name)
      setSelectStaff(data.staffs.edges[0].node.id)
    }
  }, [data, selectStaff])

  if (loading) {
    return <h3>Loading...</h3>
  }

  if (error) {
    return <h4 style={{ color: 'red' }}>Opps their are something wrong</h4>
  }

  const StaffList = () => {
    return (
      <Scrollbar style={{ height: 'calc(100vh - 200px)' }} autoHide>
        {data.staffs.edges.map(({ node }) => {
          return (
            <button
              key={node.key}
              type="button"
              onClick={() => {
                setSelectStaff(node.id)
                setSelectStaffName(node.name)
              }}
              className={classes.sideBarButtom}
              style={{
                background: selectStaff === node.id ? '#E58425' : '#FFF',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: selectStaff === node.id ? '#FFF' : '#E58425',
                  display: 'block',
                }}
              >
                {node.name}
              </Text>
            </button>
          )
        })}
      </Scrollbar>
    )
  }

  return (
    <div>
      <Row gutter={[38, 0]}>
        <Col sm={10} md={9} lg={8}>
          <div
            style={{
              padding: '28px 27px 20px',
              background: '#F9F9F9',
              borderRadius: 10,
              minHeight: 'calc(100vh - 100px)',
            }}
          >
            <Tabs type="card" style={{ minWidth: 200 }} onChange={key => setSelectTab(key)}>
              <TabPane tab="Attendance" key="0">
                <StaffList />
              </TabPane>
              <TabPane tab="Time Sheet" key="1">
                <StaffList />
              </TabPane>
            </Tabs>
          </div>
        </Col>
        <Col sm={14} md={15} lg={16}>
          {selectStaffName && (
            <Title style={{ fontSize: 24, marginTop: 20 }}>{selectStaffName} Reports</Title>
          )}
          <hr />
          {selectTab === '0' && selectStaff ? (
            <AttendanceReport therapist={selectStaff} />
          ) : (
            <TimeSheetReport therapist={selectStaff} />
          )}
        </Col>
      </Row>
    </div>
  )
}
