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
import filterIcon from 'icons/filter.png'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { LineChartOutlined, FilterOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import { RESPONSE_RATE, RESPONSE_RATE_FILTER_OPT } from './query'
import './form.scss'
import './table.scss'

const { Option } = Select
const { RangePicker } = DatePicker
const { Panel } = Collapse

const pstyle = { marginBottom: 0 }

const parentCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '7px 10px 0 10px',
  height: 500,
  overflow: 'auto',
}

const filterCardStyle = {
  background: '#F1F1F1',
  padding: 10,
  margin: 0,
  height: 50,
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

const learnerFilterCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '9px',
  margin: '0px 0px 9px 10px',
}

const learnerCardStyle = {
  background: '#FFFFFF',
  height: 20,
}

const cardStyle = {
  background: '#F9F9F9',
  height: 500,
  overflow: 'auto',
}

const filterDataCardStyle = {
  height: 500,
  overflow: 'auto',
}

const tableCardStyle = {
  background: '#F9F9F9',
  height: 400,
  overflow: 'auto',
}

const antcol1 = {
  display: 'block',
  width: '6%',
}

const antcol2 = {
  display: 'block',
  width: '11%',
}

const antcol3 = {
  display: 'block',
  width: '36%',
}

export default Form.create()(({ studentName, showDrawerFilter }) => {
  const [selectTarget, setSelectTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [mydata, setMydata] = useState()
  const [dateRange, setDateRange] = useState([
    moment(Date.now()).subtract(21, 'days'),
    moment(Date.now()),
  ])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [lineDrawer, setLineDrawer] = useState(false)
  const [learnerFilterDrawer, setLearnerFilterDrawer] = useState(false)
  const [columns, setColumns] = useState([])
  const [selectedYear, setSelectedYear] = useState(moment(dateRange[0]).format('YYYY'))
  const [selectedMonth, setSelectedMonth] = useState(moment(dateRange[0]).format('MMM'))
  const [status, setStatus] = useState(['In-Therapy'])
  const [type, setType] = useState()
  const [graphData, setGraphData] = useState([
    {
      color: 'hsl(335, 70%, 50%)',
      data: [],
    },
  ])

  const { data, error, loading } = useQuery(RESPONSE_RATE, {
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
    const formattedData = keyObjects.map(function (e) {
      return {}
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  const menu = (
    <Menu>
      {/* <Menu.Item key="0">
        <Button onClick={() => exportPDF()} type="link" size="small">
          PDF
        </Button>
      </Menu.Item> */}
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

  const onMonthClick = val => {
    setSelectedMonth(val)
    filterData()
  }

  const onYearClick = val => {
    setSelectedYear(val)
    filterData()
  }

  const filterData = () => {
    const typeFilterDataList = []
    const statusFilterDataList = []
    if ((type && type.length > 0) || (status && status.length > 0)) {
      if (data) {
        if (type && type.length > 0) {
          type.map(targetTypeVal => {
            const filterData = data.responseRate.filter(item => item.targetType === targetTypeVal)
            typeFilterDataList.push(...filterData)
          })
          loadData(typeFilterDataList)
        }
        console.log(status)
        if (status && status.length > 0) {
          if (type && type.length > 0) {
            status.map(statusVal => {
              const filterData = typeFilterDataList.filter(
                item => item.targetStatusName === statusVal,
              )
              statusFilterDataList.push(...filterData)
            })
          } else {
            status.map(statusVal => {
              const filterData = data.responseRate.filter(
                item => item.targetStatusName === statusVal,
              )
              statusFilterDataList.push(...filterData)
            })
          }
          loadData(statusFilterDataList)
        }
      }
    } else if (data) {
      loadData(data.responseRate)
    }
  }
  const monthMenu = (
    <Menu>
      {monthsList.map(val => {
        return <Menu.Item onClick={() => onMonthClick(val)}>{val}</Menu.Item>
      })}
    </Menu>
  )
  const yearMenu = (
    <Menu>
      {yearList.map(val => {
        return <Menu.Item onClick={() => onYearClick(val)}>{val}</Menu.Item>
      })}
    </Menu>
  )

  useEffect(() => {
    setSelectedYear(moment(dateRange[0]).format('YYYY'))
    setSelectedMonth(moment(dateRange[0]).format('MMM'))
    filterData()
  }, [dateRange])

  useEffect(() => {
    filterData()
  }, [type, status])

  useEffect(() => {
    if (data) {
      console.log('data data -----', data)
      loadData(data.responseRate)
    }
    if (error) {
      notification.error({
        message: 'Opps their are something wrong to load the data',
      })
    }
  }, [data, error])

  const loadData = data => {
    if (data) {
      console.log('daily response rate data', data)
      if (data.length > 0) {
        const groupedData = groupObj.group(data, 'targetName')
        let keys = []
        keys = Object.keys(groupedData)
        const objects = []
        keys.map((target, index) => {
          const targetStimulus = []
          if (groupedData[target]?.length > 0) {
            groupedData[target].map(data => {
              if (data.sessionRecord?.length > 0) {
                data.sessionRecord.map(sr => {
                  if (sr.sd !== '' && sr.step === '') {
                    if (targetStimulus.indexOf(sr.sd) === -1) {
                      targetStimulus.push(sr.sd)
                    }
                  } else if (sr.sd === '' && sr.step !== '') {
                    if (targetStimulus.indexOf(sr.step) === -1) {
                      targetStimulus.push(sr.step)
                    }
                  }
                })
              }
            })
          }
          console.log('targetStimulus', targetStimulus)
          let item = {
            key: index,
            targetName: target,
            isStimulusStepsAvailable: false,
            isStimulus: false,
            displayGraph: false,
          }
          if (targetStimulus.length === 0) {
            item = {
              key: index,
              targetName: target,
              isStimulusStepsAvailable: false,
              isStimulus: false,
              displayGraph: true,
            }
            daysList.map(itemObj => {
              let targetPer = 0
              if (groupedData[target]?.length > 0) {
                let present = false
                groupedData[target].map(data => {
                  if (data.sessionDate === itemObj.date) {
                    console.log('item.date', itemObj.date)
                    console.log('data.sessionDate', data.sessionDate)
                    present = true
                    targetPer = data.perTar ? data.perTar : 0
                    item[itemObj.date] = targetPer
                  }
                })
                if (!present) {
                  item[itemObj.date] = 0
                }
              } else {
                item[itemObj.date] = 0
              }
            })
          } else {
            daysList.map(itemObj => {
              item[itemObj.date] = ''
            })
          }
          objects.push(item)
          if (targetStimulus && targetStimulus.length > 0) {
            targetStimulus.map(sdStr => {
              const sdItem = {
                key: index,
                targetName: sdStr,
                isStimulusStepsAvailable: true,
                displayGraph: true,
              }
              daysList.map(item => {
                let targetSDPer = 0
                let targetStepPer = 0
                if (groupedData[target]?.length > 0) {
                  let present = false
                  groupedData[target].map(data => {
                    if (data.sessionDate === item.date) {
                      present = true
                      if (data.sessionRecord?.length > 0) {
                        data.sessionRecord.map(sr => {
                          if (sr.sd !== '' && sr.step === '') {
                            if (sr.sd === sdStr) {
                              targetSDPer = sr.perSd ? sr.perSd : 0
                              sdItem[item.date] = targetSDPer
                              sdItem.isStimulus = true
                            }
                          } else if (sr.sd === '' && sr.step !== '') {
                            if (sr.step === sdStr) {
                              targetStepPer = sr.perStep ? sr.perStep : 0
                              sdItem[item.date] = targetStepPer
                              sdItem.isStimulus = false
                            }
                          }
                        })
                      }
                    }
                  })
                  if (!present) {
                    sdItem[item.date] = 0
                  }
                }
              })
              objects.push(sdItem)
            })
          }
        })
        console.log('keyObjects', objects)
        setKeyObjects(objects)
        setMydata(groupedData)
      } else {
        const objects = []
        setKeyObjects(objects)
        setMydata({})
        setSelectTarget(null)
      }
    } else {
      const objects = []
      setKeyObjects(objects)
      setMydata({})
      setSelectTarget(null)
    }
  }
  const { data: filterOptions, error: filterOptErr, loading: filterOptLoading } = useQuery(
    RESPONSE_RATE_FILTER_OPT,
  )

  useEffect(() => {
    console.log('use effect', mydata)
    console.log('use effect dateRange', dateRange)
    if (mydata) {
      console.log('entired')
      const myColumns = [
        {
          key: 'targetName',
          title: 'Skills',
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
                {obj.isStimulusStepsAvailable === false && obj.targetName}
                {obj.isStimulusStepsAvailable === true && obj.isStimulus === true && (
                  <div
                    style={{
                      color: '#f080b8',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {obj.targetName}
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
                    {obj.targetName}
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
      const monthYear = selectedMonth.concat(selectedYear)
      console.log('monthYear', monthYear)
      console.log('daysList', daysList)
      const daysListFiltered = daysList.filter(item => item.monthYear === monthYear)
      console.log('daysListFiltered', daysListFiltered)
      daysListFiltered.map(item => {
        myColumns.push({
          title: item.dayDate,
          children: [
            {
              // key: dateStr,
              title: item.day.substring(0, 3),
              width: '50px',
              height: '5px',
              dataIndex: item.date,
            },
          ],
        })
      })
      setColumns(myColumns)
      console.log(myColumns)
      if (selectTarget && mydata.length > 0) {
        getGraphData(selectTarget)
      }
    }
  }, [dateRange, mydata])

  const getGraphData = targetName => {
    const monthYear = selectedMonth.concat(selectedYear)
    const daysListFiltered = daysList.filter(item => item.monthYear === monthYear)
    const graphAxixData = []
    console.log('keyObjects', keyObjects)
    let filterKeyObjects = []
    if (keyObjects) {
      filterKeyObjects = keyObjects.filter(item => item.targetName === targetName)
    }
    if (filterKeyObjects) {
      daysListFiltered.map(item => {
        const targetPer = filterKeyObjects[0][item.date] ? filterKeyObjects[item.date] : 0
        graphAxixData.push({
          x: item.dayDate,
          y: targetPer,
        })
      })
    }
    console.log('graphAxixData', graphAxixData)
    console.log('targetName', targetName)
    setGraphData(state => {
      state[0].data = graphAxixData
      return state
    })
    console.log('graphData', graphData)
    setLineDrawer(true)
  }

  const handleSelectTarget = ({ targetName }) => {
    setSelectTarget(targetName)
    getGraphData(targetName)
  }

  const reduxUser = useSelector(state => state.user)
  return (
    <div>
      <Drawer
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={900}
        title="Session Graph"
      >
        {graphData && (
          <div style={{ height: 300, marginBottom: 30 }}>
            <ResponsiveLine
              data={graphData}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              axisTop={null}
              axisRight={null}
              colors={{ scheme: 'nivo' }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh
            />
          </div>
        )}
      </Drawer>
      <Row>
        <Col sm={24}>

          <Row>
            <Col span={26}>
              <div style={filterCardStyle}>

                <Row>
                  
                  <Col span={1} style={antcol2}>
                    <span style={{ fontSize: '15px', color: '#000' }}>Target Status:</span>
                  </Col>
                  <Col span={4} style={{ marginRight: 10 }}>
                    <Select
                      size="small"
                      style={{
                        width: 180,
                        borderRadius: 4,
                        height: 35,
                        overflow: 'auto',
                      }}
                      value={status}
                      onChange={v => setStatus(v)}
                      allowClear
                      mode="multiple"
                      placeholder="ALL"
                    >
                      {filterOptions &&
                        filterOptions.targetStatus.map(({ id, statusName }) => (
                          <Option key={id} value={statusName}>
                            {statusName}
                          </Option>
                        ))}
                    </Select>
                  </Col>
                  <Col span={1} style={antcol1}>
                    <span style={{ fontSize: '15px', color: '#000' }}>Date:</span>
                  </Col>
                  <Col span={4} style={antcol3}>
                    <RangePicker
                      size="small"
                      style={{
                        marginLeft: 'auto',
                        width: 250,
                        marginRight: 31,
                      }}
                      value={dateRange}
                      onChange={v => setDateRange(v)}
                    />
                  </Col>
                  <Col span={1}>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Button style={{ marginRight: '10px' }} type="link" size="large">
                        <CloudDownloadOutlined />{' '}
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>

              </div>
            </Col>
          </Row>
          <Row>
            <div style={tableFilterCardStyle}>

              <Col span={1} style={{ display: 'block', width: '3%' }}>
                {selectedMonth}
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
              <Col span={1} style={{ display: 'block', width: '3%' }}>
                {selectedYear}
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


              <Col span={1} style={antcol1}>
                <div
                  style={{
                    background: '#2874A6',
                    borderRadius: 10,
                    width: '100%',
                    height: 18,
                  }}
                />
              </Col>
              <Col span={1} style={antcol1}>
                <span style={{ fontSize: '15px', color: '#000' }}>Target</span>
              </Col>
              <Col span={1} style={antcol1}>
                <div
                  style={{
                    background: '#f080b8',
                    borderRadius: 10,
                    width: '100%',
                    height: 18,
                  }}
                />
              </Col>
              <Col span={3} style={{ display: 'block', width: '7%' }}>
                <span style={{ fontSize: '15px', color: '#000' }}>Stimulus</span>
              </Col>
              <Col span={1} style={antcol1}>
                <div
                  style={{
                    background: '#f0b880',
                    borderRadius: 10,
                    width: '100%',
                    height: 18,
                  }}
                />
              </Col>
              <Col span={1} style={antcol1}>
                <span style={{ fontSize: '15px', color: '#000' }}>Steps</span>
              </Col>

            </div>
          </Row>
          <Row>
            <Col span={24}>
              <div style={parentCardStyle}>
                <Table
                  columns={columns}
                  dataSource={keyObjects}
                  bordered
                  loading={loading}
                  scroll={{ x: 'max-content', y: 240 }}
                  pagination={{ pageSize: 50 }}
                  size="small"
                />

              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
})
