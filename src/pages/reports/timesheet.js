/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/order */

import React, { useState, useEffect } from 'react'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tabs,
  Badge,
  Form,
  DatePicker,
  Menu,
  Dropdown,
  Table,
  Tooltip,
} from 'antd'
import { FaDownload } from 'react-icons/fa'
import { BiDollar } from 'react-icons/bi'
import { GoCheck, GoPrimitiveDot } from 'react-icons/go'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { gql } from 'apollo-boost'
import moment from 'moment'
import { useQuery, useLazyQuery } from 'react-apollo'
import FrequencyDurationGraph from './frequencyDuration'
import client from '../../apollo/config'
// import AttendanceBar from './AttendanceBar'
import DataTable from 'react-data-table-component'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { COLORS } from 'assets/styles/globalStyles'

const { Title, Text } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  minWidth: '210px',
  margin: '7px 10px 0 10px',
  maxHeight: 600,
  overflowY: 'scroll',
}

const filterCardStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: COLORS.palleteLight,
}

const parentDiv = { display: 'flex', margin: '5px 40px 5px 36px' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

const generalstyle = {
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '5px',
  alignItems: 'center',
  display: 'block',
  width: '100%',
  marginBottom: '4px',
  curser: 'pointer',
}

const TIMESHEETS = gql`
  query($dateGte: Date!, $dateLte: Date!, $staffId: ID!) {
    timesheets(dateGte: $dateGte, dateLte: $dateLte, staffId: $staffId) {
      edges {
        node {
          id
          title
          start
          end
        }
      }
    }
  }
`

const APPOINTMENTS = gql`
  query($dateFrom: Date!, $dateTo: Date!, $therapist: ID!) {
    appointments(dateFrom: $dateFrom, dateTo: $dateTo, therapist: $therapist) {
      edges {
        node {
          id
          title
          start
          end
          isApproved
          appointmentStatus {
            id
            appointmentStatus
          }
        }
      }
    }
  }
`

const STAFF_LIST = gql`
  query {
    staffs {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

const getDatesBetween = (startDate, endDate) => {
  const now = startDate.clone()
  const dates = []

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('YYYY-MM-DD'))
    now.add(1, 'days')
  }
  return dates
}

const dateFormat = 'YYYY-MM-DD'
function Att({ form, studentName, selectedStaff }) {
  const [therapistList, seTtherapistList] = useState([])
  const [currentTherapistId, setCurrentTherapistId] = useState()
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const userRole = localStorage.getItem('role')
  const [dateRR, setDateRR] = useState([
    moment()
      .startOf('week')
      .add(1, 'day'),
    moment().endOf('week'),
  ])
  const { data: staffData, loading: staffLoading, error: staffError, refetch } = useQuery(
    STAFF_LIST,
  )
  const [getTimeSheetData, { data: timeSheetData, loading: timeSheetLoading }] = useLazyQuery(
    TIMESHEETS,
  )
  const [getAppointmentData, { data: appointmentData, loading: appointmentLoading }] = useLazyQuery(
    APPOINTMENTS,
  )

  useEffect(() => {
    if (staffData) {
      seTtherapistList(staffData.staffs.edges)
      setCurrentTherapistId(
        userRole === 'therapist'
          ? localStorage.getItem('student_id')
          : staffData.staffs.edges[0].node.id,
      )
    }
  }, [staffData])

  useEffect(() => {
    if (timeSheetData && appointmentData && !appointmentLoading && !timeSheetLoading) {
      filterTableData(timeSheetData.timesheets.edges, appointmentData.appointments.edges)
    }
  }, [timeSheetData, appointmentData])

  useEffect(() => {
    if (dateRR[0] && dateRR[1] && selectedStaff.id) {
      let st
      let end
      if (dateRR[0].format(dateFormat) < dateRR[1].format(dateFormat)) {
        st = dateRR[0].format(dateFormat)
        end = dateRR[1].format(dateFormat)
      } else {
        st = dateRR[1].format(dateFormat)
        end = dateRR[0].format(dateFormat)
      }
      getTimeSheetData({
        variables: {
          dateGte: moment(st).format('YYYY-MM-DD'),
          dateLte: moment(end).format('YYYY-MM-DD'),
          staffId: selectedStaff.id,
          // therapist: currentTherapistId,
        },
      })
      getAppointmentData({
        variables: {
          dateFrom: moment(st).format('YYYY-MM-DD'),
          dateTo: moment(end).format('YYYY-MM-DD'),
          therapist: selectedStaff.id,
          // therapist: currentTherapistId,
        },
      })
    }
  }, [dateRR, currentTherapistId, selectedStaff])

  const filterTableData = (timesheets, appointments) => {
    const filteredData = []
    const newColumns = [
      {
        title: <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Title</span>,
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: '300px',
        render: (text, record) => (
          <Badge color={record.isAppointment ? 'lightpink' : 'lightblue'} text={text} />
        ),
      },
    ]

    timesheets.forEach(item => {
      const start = moment(item.node.start)
      const end = moment(item.node.end)
      const duration = moment.duration(end.diff(start)).minutes()

      filteredData.push({
        [moment(item.node.start).format('YYYY-MM-DD')]: duration,
        title: item.node.title,
        id: item.node.id,
        duration,
        badges: { approved: true, billable: false, overtime: false }, // ! Not Integrated
        isWorkLog: true,
      })
    })

    appointments.forEach(item => {
      const start = moment(item.node.start)
      const end = moment(item.node.end)
      const duration = moment.duration(end.diff(start)).as('minutes')

      filteredData.push({
        [moment(item.node.start).format('YYYY-MM-DD')]: duration,
        title: item.node.title,
        id: item.node.id,
        duration,
        badges: {
          approved: item.node.isApproved,
          billable: false,
          overtime: false,
        },
        isAppointment: true,
      })
    })

    const dates = getDatesBetween(dateRR[0], dateRR[1])

    dates.forEach((date, i) => {
      newColumns.push({
        title: (
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
            {moment(date).format('DD MMM, ddd')}
          </span>
        ),
        dataIndex: date,
        key: `${date}_${i}`,
        align: 'center',
        render: text => {
          let hrs = 0
          let min = 0
          if (text > 0) {
            hrs = Math.floor(text / 60)
            min = Math.floor(text % 60)
          }
          return hrs > 0 ? `${hrs} Hrs ${min} Min` : `${min} Min`
        },
      })
    })

    newColumns.push({
      title: <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Status</span>,
      dataIndex: 'badges',
      key: 'badges',
      fixed: 'right',
      width: '150px',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Tooltip placement="top" title="Approved">
              <Badge
                count={
                  <GoCheck
                    style={{
                      fontSize: '18px',
                      color: record.badges.approved ? 'limegreen' : 'darkgrey',
                      cursor: 'pointer',
                    }}
                  />
                }
              />
            </Tooltip>
            <Tooltip placement="top" title="Billable">
              <Badge
                count={<BiDollar />}
                style={{
                  fontSize: '18px',
                  color: record.badges.billable ? 'limegreen' : 'darkgrey',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title="">
              <Badge
                count={<GoPrimitiveDot />}
                style={{
                  fontSize: '18px',
                  color: record.badges.overtime ? 'limegreen' : 'darkgrey',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          </div>
        )
      },
    })
    setColumns(newColumns)
    setTableData(filteredData)
  }

  const setCurrentWeek = () => {
    setDateRR([
      moment()
        .startOf('week')
        .add(1, 'day'),
      moment().endOf('week'),
    ])
  }
  const setPreviousWeek = () => {
    setDateRR([dateRR[0].subtract(7, 'days'), dateRR[1].subtract(7, 'days')])
  }
  const setNextWeek = () => {
    setDateRR([dateRR[0].add(7, 'days'), dateRR[1].add(7, 'days')])
  }

  const exportToCSV = report => {
    console.log(report, 'asa') // this.report.exportToCSV(studentName)
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  if (staffLoading) {
    return <LoadingComponent />
  }

  console.log(currentTherapistId, 'therapist')

  return (
    <>
      <Row>
        <Col sm={24}>
          <Row>
            <Col span={26}>
              <div style={filterCardStyle}>
                <div style={parentDiv}>
                  <Tooltip placement="top" title="Previous Week">
                    <Button onClick={() => setPreviousWeek()}>
                      <LeftOutlined />
                    </Button>
                  </Tooltip>
                  <Button onClick={() => setCurrentWeek()}>This Week</Button>
                  <Tooltip placement="top" title="Next Week">
                    <Button onClick={() => setNextWeek()}>
                      <RightOutlined />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Col>
          </Row>
          <div style={{ margin: '10px 0 10px 10px' }}>
            {/* {!timeSheetData && ( */}
            <Table
              columns={columns}
              dataSource={tableData}
              bordered
              className="goal-table"
              size="middle"
              loading={appointmentLoading && timeSheetLoading}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Form.create()(Att)
