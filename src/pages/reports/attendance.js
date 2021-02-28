/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react'
import {
  Input,
  Menu,
  Collapse,
  Table,
  Row,
  Col,
  Button,
  Drawer,
  Form,
  Select,
  DatePicker,
  notification,
  Dropdown,
  Icon,
} from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import { gql } from 'apollo-boost'
import { useSelector } from 'react-redux'
import filterIcon from 'icons/filter.png'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaDownload } from 'react-icons/fa'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { LineChartOutlined, FilterOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import lodash from 'lodash'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { RESPONSE_RATE, RESPONSE_RATE_FILTER_OPT } from './query'
import './form.scss'
import './table.scss'

const { Option } = Select
const { RangePicker } = DatePicker
const { Panel } = Collapse

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
  background: '#F1F1F1',
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}

const tableFilterCardStyle = {
  borderRadius: 10,
  padding: '10px',
  margin: '0 0 -2px 10px',
  height: 35,
  overflow: 'hidden',
}

const parentDiv = { display: 'flex', margin: '5px 40px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

const CLINICS = gql`
  query {
    allClinics {
      edges {
        node {
          schoolName
          id
        }
      }
    }
  }
`

const ATTENDANCE = gql`
  query($dateGte: Date!, $dateLte: Date!, $clinic: ID!) {
    attendanceReportByClinic(dateGte: $dateGte, dateLte: $dateLte, clinic: $clinic) {
      staff {
        id
        name
        school {
          schoolName
        }
      }
      data {
        date
        hours
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

export default () => {
  const [date, setDate] = useState([moment().subtract(21, 'd'), moment()])
  const [columns, setColumns] = useState()
  const [groupedData, setGroupedData] = useState()
  const [filteredTableData, setFilteredTableData] = useState()
  const [yrs, setYrs] = useState([])
  const [months, setMonths] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    year: null,
    month: null,
  })
  const [getAttendance, { data: attendance, loading: attLoading, error: attError }] = useLazyQuery(
    ATTENDANCE,
  )
  const { data: clinics, loading: clinicsLoading, error: clinicsError } = useQuery(CLINICS)

  const clinicName = useSelector(state => state.user.clinicName)

  useEffect(() => {
    let clinicId = null

    if (clinics) {
      clinics?.allClinics?.edges?.forEach(item => {
        if (item.node.schoolName === clinicName) clinicId = item.node.id
      })
      getAttendance({
        variables: {
          dateGte: date[0].format('YYYY-MM-DD'),
          dateLte: date[1].format('YYYY-MM-DD'),
          clinic: clinicId,
        },
      })
    }
  }, [clinics, date])

  useEffect(() => {
    if (attendance) {
      formatTableData(attendance)
    }
  }, [attendance])

  useEffect(() => {
    if (selectedFilters.year && selectedFilters.month) {
      const filteredTableData = groupedData.map(item => {
        return {
          ...lodash.fromPairs(item.field[0][1]),
          ...lodash.fromPairs(
            item[selectedFilters.year].filter(data => data.includes(selectedFilters.month))[0][1],
          ),
        }
      })
      filterColumns(groupedData, { month: selectedFilters.month })
      setFilteredTableData(
        lodash.uniqBy(filteredTableData, item => {
          const { key, ...rest } = item
          return JSON.stringify(rest)
        }),
      )
    }
  }, [selectedFilters.month])

  useEffect(() => {
    if (selectedFilters.year && selectedFilters.month) {
      const months = groupedData[0][selectedFilters.year].map(item => item[0])
      setMonths(months)
      const filteredTableData = groupedData.map(item => {
        return {
          ...lodash.fromPairs(item.field[0][1]),
          ...lodash.fromPairs(item[selectedFilters.year][0][1]),
        }
      })
      setSelectedFilters({ ...selectedFilters, month: months[0] })
      filterColumns(groupedData, { year: selectedFilters.year })
      setFilteredTableData(
        lodash.uniqBy(filteredTableData, item => {
          const { key, ...rest } = item
          return JSON.stringify(rest)
        }),
      )
    }
  }, [selectedFilters.year])

  const onMonthClick = val => setSelectedFilters({ ...selectedFilters, month: val })
  const onYearClick = val => setSelectedFilters({ ...selectedFilters, year: val })

  const monthMenu = (
    <Menu>
      {months.map(val => {
        return <Menu.Item onClick={() => onMonthClick(val)}>{val}</Menu.Item>
      })}
    </Menu>
  )
  const yearMenu = (
    <Menu>
      {yrs.map(val => {
        return <Menu.Item onClick={() => onYearClick(val)}>{val}</Menu.Item>
      })}
    </Menu>
  )

  const formatTableData = ({ attendanceReportByClinic }) => {
    if (attendanceReportByClinic.length > 0) {
      const dates = getDatesBetween(date[0], date[1])
      const tableData = []
      attendanceReportByClinic.map((report, index) => {
        const rowData = {}
        rowData.key = index
        rowData.name = report.staff.name
        dates.forEach(date => {
          if (report.data.length > 0) {
            report.data.map(item => {
              if (item.date === date) rowData[item.date] = item.hours
            })
          }
          if (!(date in rowData)) rowData[date] = 0
        })
        tableData.push(rowData)
      })

      moment.updateLocale(moment.locale(), { invalidDate: 'field' })
      const finalGroup = tableData.map(item => {
        const groupedData = lodash.groupBy(
          Object.entries(
            lodash.groupBy(Object.entries(item), item => moment(item[0]).format('MMM')),
          ),
          item => moment(item[1][0][0]).format('YYYY'),
        )
        return groupedData
      })

      setGroupedData(finalGroup)
      moment.updateLocale(moment.locale(), { invalidDate: 'Invalid Date' })

      const yrs = Object.keys(finalGroup[0]).slice(0, -1)
      const months = finalGroup[0][yrs[0]].map(item => item[0])

      setYrs(yrs)
      setMonths(months)
      setSelectedFilters({
        year: yrs[0],
        month: months[0],
      })
      const filteredTableData = finalGroup.map(item => {
        return { ...lodash.fromPairs(item.field[0][1]), ...lodash.fromPairs(item[yrs[0]][0][1]) }
      })

      setFilteredTableData(
        lodash.uniqBy(filteredTableData, item => {
          const { key, ...rest } = item
          return JSON.stringify(rest)
        }),
      )

      filterColumns(finalGroup, { year: yrs[0] })
    }
  }

  const filterColumns = (groupedData, { year, month }) => {
    const columns = [
      {
        title: 'Name',
        width: 150,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
    ]

    let filteredDates

    if (month)
      filteredDates = Object.keys(
        lodash.fromPairs(
          groupedData[0][selectedFilters.year].filter(data => data.includes(month))[0][1],
        ),
      )
    else if (year) filteredDates = Object.keys(lodash.fromPairs(groupedData[0][year][0][1]))

    const columnLen = filteredDates.length

    filteredDates.forEach((date, index) => {
      columns.push({
        title: date.slice(-2),
        key: index,
        dataIndex: date,
        width: 80,
        height: 50,
        children: [
          {
            key: index,
            title: moment(date).format('ddd'),
            dataIndex: date,
            width: columnLen > 5 ? 60 : '',
            height: columnLen > 5 ? 40 : '',
          },
        ],
      })
    })
    setColumns(columns)
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = `Attendance_report_${selectedFilters.month}_${selectedFilters.year}`

    const ws = XLSX.utils.json_to_sheet(filteredTableData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, filename + fileExtension)
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

  return (
    <>
      <Row>
        <Col sm={24}>
          <Row>
            <Col span={26}>
              <div style={filterCardStyle}>
                <div style={parentDiv}>
                  <span style={parentLabel}>Date :</span>
                  <RangePicker
                    style={{
                      marginLeft: 'auto',
                      width: 250,
                    }}
                    size="default"
                    value={date}
                    onChange={val => setDate(val)}
                  />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Dropdown overlay={menu} trigger={['hover']}>
                    <Button type="link" size="large">
                      <FaDownload />{' '}
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <Row>
                <div style={tableFilterCardStyle}>
                  <Col span={1} style={{ display: 'block', width: '4%' }}>
                    {selectedFilters.year}
                  </Col>
                  <Col span={1} style={{ display: 'block', width: '3%' }}>
                    <div>
                      <Dropdown overlay={yearMenu}>
                        <a className="ant-dropdown-link">
                          <Icon type="caret-down" />
                        </a>
                      </Dropdown>
                    </div>
                  </Col>
                  <Col span={1} style={{ display: 'block', width: '3%' }}>
                    {selectedFilters.month}
                  </Col>
                  <Col span={1} style={{ display: 'block', width: '3%' }}>
                    <div>
                      <Dropdown overlay={monthMenu}>
                        <a className="ant-dropdown-link">
                          <Icon type="caret-down" />
                        </a>
                      </Dropdown>
                    </div>
                  </Col>
                </div>
              </Row>
              {attLoading || clinicsLoading ? (
                <LoadingComponent />
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredTableData}
                  bordered
                  loading={attLoading}
                  scroll={{ x: 'fit-content', y: 400 }}
                  pagination={{ pageSize: 50 }}
                  size="small"
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
