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
  Tooltip,
  Dropdown,
  Icon,
} from 'antd'
import { useQuery } from 'react-apollo'
import { useSelector } from 'react-redux'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined, FilterOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import { MAND_DATA, RESPONSE_RATE, RESPONSE_RATE_FILTER_OPT } from './query'
import './form.scss'
import './table.scss'

const { RangePicker } = DatePicker

const pstyle = { marginBottom: 0 }

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

const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  paddingTop: '0px',
  margin: '7px 0 10px 10px',
  height: 'fit-content',
  overflow: 'auto',
}

const tableFilterCardStyle = {
  borderRadius: 10,
  padding: '10px',
  margin: '0 0 -2px 10px',
  height: 35,
  overflow: 'hidden',
}

const antcol1 = {
  display: 'flex',
  width: '42%',
}

const antRow1 = {
  display: 'flex',
  justifyContent: 'space-between',
}

const dateFormat = 'YYYY-MM-DD'
export default Form.create()(({ showDrawerFilter }) => {
  const [selectMand, setSelectMand] = useState()
  const studentId = localStorage.getItem('studentId')
  const currUser = useSelector(state => state.student.StudentName)
  const [mydata, setMydata] = useState()
  const [dateRange, setDateRange] = useState([
    moment(Date.now()).subtract(21, 'days'),
    moment(Date.now()),
  ])
  const [lineDrawer, setLineDrawer] = useState(false)
  const [columns, setColumns] = useState([])
  const [graphData, setGraphData] = useState([
    {
      color: 'hsl(335, 70%, 50%)',
      data: [],
    },
  ])

  const { data, error, loading } = useQuery(MAND_DATA, {
    variables: {
      studentId,
      startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
      endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
    },
  })

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = '_daily_response_rate_excel'
    const formattedData = keyObjects.map(item => {
      const { isStimulusStepsAvailable, isStimulus, displayGraph, ...rest } = item
      return rest
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, currUser + filename + fileExtension)
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

  const start = dateRange[0]
  const end = dateRange[1]

  const days = []
  const [keyObjects, setKeyObjects] = useState([])
  let day = start

  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }
  const monthsList = []
  const yearList = []
  const daysList = []
  days.map(dateStr => {
    daysList.push({
      monthYear: moment(dateStr)
        .format('MMM')
        .concat(moment(dateStr).format('YYYY')),
      date: moment(dateStr).format('YYYY-MM-DD'),
      month: moment(dateStr).format('MMM'),
      dayDate: moment(dateStr).format('DD'),
      day: moment(dateStr).format('dddd'),
      year: moment(dateStr).format('YYYY'),
    })
    if (monthsList.indexOf(moment(dateStr).format('MMM')) === -1) {
      monthsList.push(moment(dateStr).format('MMM'))
    }
    if (yearList.indexOf(moment(dateStr).format('YYYY')) === -1) {
      yearList.push(moment(dateStr).format('YYYY'))
    }
  })

  const filterData = () => {
    if (data) loadData(data.mandReport)
  }

  useEffect(() => {
    filterData()
  }, [dateRange])

  useEffect(() => {
    if (data) {
      loadData(data.mandReport)
    }
    if (error) {
      notification.error({
        message: 'Opps something went wrong!',
      })
    }
  }, [data, error])

  const loadData = data => {
    if (data) {
      if (data.length > 0) {
        const groupedData = groupObj.group(data, 'measurments')
        let keys = []
        keys = Object.keys(groupedData)
        const objects = []
        keys.map((mand, index) => {
          const item = {
            key: index,
            mandName: mand,
            isStimulusStepsAvailable: false,
            isStimulus: false,
            displayGraph: false,
          }
          if (groupedData[mand]?.length > 0) {
            if (daysList.length === groupedData[mand][0].data.length)
              daysList.map((day, index) => {
                item[day.date] = groupedData[mand][0].data[index].count
              })
          }
          console.clear()
          objects.push(item)
        })
        setKeyObjects(objects)
        setMydata(groupedData)
      } else {
        const objects = []
        setKeyObjects(objects)
        setMydata({})
        setSelectMand(null)
      }
    } else {
      const objects = []
      setKeyObjects(objects)
      setMydata({})
      setSelectMand(null)
    }
  }

  useEffect(() => {
    if (mydata) {
      console.log('entired')
      const myColumns = [
        {
          key: 'mandName',
          title: 'Mand',
          fixed: 'left',
          width: '350px',
          render(obj) {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: '#80b8f0',
                }}
              >
                {obj.isStimulusStepsAvailable === false && obj.mandName}
                {obj.isStimulusStepsAvailable === true && obj.isStimulus === true && (
                  <div
                    style={{
                      color: '#f080b8',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {obj.mandName}
                  </div>
                )}
                {obj.isStimulusStepsAvailable === true && obj.isStimulus === false && (
                  <div
                    style={{
                      color: '#f0b880',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {obj.mandName}
                  </div>
                )}
                {obj.displayGraph === true && (
                  <Button type="link" onClick={() => handleSelectTarget(obj)}>
                    <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
                  </Button>
                )}
                {obj.displayGraph === false && (
                  <Button type="link" onClick={() => handleSelectTarget(obj)}>
                    <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
                  </Button>
                )}
              </div>
            )
          },
        },
      ]
      daysList.map(item => {
        myColumns.push({
          title: item.dayDate,
          align: 'center',
          children: [
            {
              title: item.day.substring(0, 3),
              dataIndex: item.date,
              align: 'right',
            },
          ],
        })
      })
      setColumns(myColumns)
      if (selectMand && mydata.length > 0) {
        getGraphData(selectMand)
      }
    }
  }, [dateRange, mydata])

  const getGraphData = mandName => {
    const graphAxixData = []
    const groupedData = groupObj.group(daysList, 'monthYear')
    let keys = []
    keys = Object.keys(groupedData)
    keys.map(monthYear => {
      const tempData = [
        {
          month: groupedData[monthYear][0].month,
          year: groupedData[monthYear][0].year,
          key: `MandReport ${groupedData[monthYear][0].month} ${groupedData[monthYear][0].year}`,
          color: 'hsl(335, 70%, 50%)',
          data: [],
        },
      ]
      groupedData[monthYear].map(item => {
        const targetPer = mandName[item.date] ? mandName[item.date] : 0
        tempData[0].data.push({
          x: item.dayDate,
          y: targetPer,
          key: item.dayDate,
        })
      })
      graphAxixData.push(tempData)
    })
    setGraphData(graphAxixData)
    setLineDrawer(true)
  }
  console.log(graphData, 'graphDAta')

  const handleSelectTarget = obj => {
    setSelectMand(obj.mandName)
    getGraphData(obj)
  }

  console.log(keyObjects, 'df')
  return (
    <div style={{ marginBottom: '100px' }}>
      <Drawer
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={900}
        title={`${currUser}'s Mand Graph for ${selectMand}`}
      >
        {graphData?.length > 0 &&
          graphData?.map(item => {
            console.log(item[0]?.month, 'item')
            return (
              <div style={{ height: 300, marginBottom: 30 }}>
                <ResponsiveLine
                  data={item}
                  margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                  animate={true}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: `Date (${item[0]?.month} ${item[0]?.year})`,
                    legendOffset: 40,
                    legendPosition: 'middle',
                  }}
                  axisLeft={{
                    tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'count',
                    legendOffset: -40,
                    legendPosition: 'middle',
                  }}
                  colors={{ scheme: 'nivo' }}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  useMesh
                />
              </div>
            )
          })}
      </Drawer>
      <Row>
        <div style={filterCardStyle}>
          <div style={parentDiv}>
            <span style={parentLabel}>Date:</span>
            <RangePicker
              style={{
                maxWidth: '240px',
              }}
              value={dateRange}
              onChange={v => setDateRange(v)}
            />
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Dropdown overlay={menu} trigger={['hover']}>
              <Button style={{ padding: '0 8px' }} type="link" size="large">
                <FaDownload />{' '}
              </Button>
            </Dropdown>
          </div>
        </div>
      </Row>
      <Col span={24}>
        <div style={{ margin: '4px 0 8px 8px' }} className="peak-block-report">
          <Table
            columns={columns}
            dataSource={keyObjects}
            bordered
            loading={loading}
            scroll={{ x: daysList.length * 70 }}
            size="middle"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30', '50'],
              position: 'top',
            }}
          />
        </div>
      </Col>
    </div>
  )
})
