import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Tabs, Typography } from 'antd'
import moment from 'moment'
import Calander from 'components/Calander'
import gql from 'graphql-tag'
import { useLazyQuery } from 'react-apollo'
import EmployesCard from './EmployesCard'
import TimeSheets from './TimeSheets'
import EmployeCard from './EmployeCard'
import Attendance from './Attendance'
import Appointments from './Appointments'

const { Content } = Layout
const { TabPane } = Tabs
const { Text } = Typography

const A_STAFF_DATA = gql`
  query staff($staffId: ID!) {
    staff(id: $staffId) {
      id
      name
      designation
    }
  }
`

const dateFormet = 'YYYY-MM-DD'

export default () => {
  const [activeEm, setActiveEm] = useState()
  const [date, setDate] = useState(moment().format(dateFormet))

  const [
    getSelectedStaff,
    { data: selectedStaffData, error: selectedStaffError, loading: selectedStaffLoading },
  ] = useLazyQuery(A_STAFF_DATA)

  // const [
  //   getTimeSheets,
  //   { data: timeSheetsData, error: timeSheetsError, loading: timeSheetsLoading },
  // ] = useLazyQuery(STAFF_TIME_SHEETS)

  useEffect(() => {
    if (activeEm) {
      getSelectedStaff({
        variables: {
          staffId: activeEm,
        },
      })
    }
  }, [activeEm, date, getSelectedStaff])

  return (
    <Layout>
      <Content
        style={{
          padding: '0px',
          maxWidth: 1300,
          width: '100%',
          margin: '0px auto',
        }}
      >
        <Row gutter={[21, 0]}>
          <Col span={8}>
            <EmployesCard activeEm={activeEm} setActiveEm={setActiveEm} />
          </Col>
          <Col span={16}>
            {selectedStaffLoading && 'Loading...'}
            {selectedStaffError && <Text type="error">Opps their is something wrong</Text>}
            {selectedStaffData && (
              <>
                {/* <pre>{JSON.stringify(selectedStaffData, null, 2)}</pre> */}
                <EmployeCard
                  name={selectedStaffData.staff.name}
                  designation={selectedStaffData.staff.designation}
                />

                <Calander
                  style={{
                    marginTop: 40,
                  }}
                  value={date}
                  handleOnChange={newDate => {
                    setDate(newDate)
                  }}
                />

                <Tabs defaultActiveKey="1" style={{ marginTop: 10 }}>
                  <TabPane tab="Timesheets" key="1">
                    <TimeSheets date={date} activeEm={activeEm} />
                  </TabPane>
                  <TabPane tab="Attendance" key="2">
                    <Attendance date={date} activeEm={activeEm} />
                  </TabPane>
                  <TabPane tab="Appointments" key="3">
                    <Appointments date={date} activeEm={activeEm} />
                  </TabPane>
                </Tabs>
              </>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
