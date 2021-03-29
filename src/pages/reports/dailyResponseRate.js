/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import React, { useState, useEffect, useRef } from 'react'
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
  Radio,
  Tooltip,
  Select,
  Badge,
  DatePicker,
  notification,
  Dropdown,
} from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import groupObj from '@hunters/group-object'
import { FaDownload } from 'react-icons/fa'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { ResponseRateEqui } from './dailyResponseRateEqui'
import ResponseRateGraph from './dailyResponseRateGraph'
import {
  RESPONSE_RATE,
  RESPONSE_RATE_EQUI,
  RESPONSE_RATE_FILTER_OPT,
  PEAK_BLOCKWISE,
  PEAK_EQUIVALENCE,
} from './query'
import './form.scss'
import './table.scss'

const { Option } = Select
const { RangePicker } = DatePicker
const { Panel } = Collapse

const filterCardStyle = {
  backgroundColor: COLORS.palleteLight,
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
}

const tableFilterCardStyle = {
  ...filterCardStyle,
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
}

const statusColor = {
  'In-Therapy': 'blue',
  Deleted: 'red',
  'In-Maintenance': 'orange',
  BaseLine: 'green',
}

const dateFormat = 'YYYY-MM-DD'
const parentDiv = { display: 'flex', margin: '5px 20px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

export default Form.create()(({ studentName, showDrawerFilter }) => {
  const [selectTarget, setSelectTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [dateRange, setDateRange] = useState([
    moment(Date.now()).subtract(11, 'days'),
    moment(Date.now()),
  ])
  const [lineDrawer, setLineDrawer] = useState(false)
  const [status, setStatus] = useState()
  const [type, setType] = useState()
  const [graphData, setGraphData] = useState([])
  const [tableData, setTableData] = useState([])
  const [peakType, setpeakType] = useState('dir/gen')
  const [peakEquiFilData, setPeakEquiFilData] = useState(null)
  const downloadCsvRef = useRef()

  const { data: filterOptions, error: filterOptErr, loading: filterOptLoading } = useQuery(
    RESPONSE_RATE_FILTER_OPT,
  )

  const [getResponseRate, { data, error, loading }] = useLazyQuery(RESPONSE_RATE)
  const [getPeakBlockData, { data: peakBlockData, loading: peakBlockLoading }] = useLazyQuery(
    PEAK_BLOCKWISE,
  )
  const [
    getResponseRateEqui,
    { data: equiData, error: equiError, loading: equiLoading },
  ] = useLazyQuery(RESPONSE_RATE_EQUI)

  const [
    getPeakEquiData,
    { data: peakEqui, error: peakEquiError, loading: peakEquiLoading },
  ] = useLazyQuery(PEAK_EQUIVALENCE)
  const start = dateRange[0]
  const end = dateRange[1]

  const days = []
  let day = start
  while (day <= end) {
    days.push(day.toDate())
    day = day.clone().add(1, 'd')
  }

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
  })

  useEffect(() => {
    getResponseRate({
      variables: {
        startDate: dateRange[0].format(dateFormat),
        endDate: dateRange[1].format(dateFormat),
        studentId,
      },
    })
    getPeakBlockData({
      variables: {
        start: dateRange[0].format(dateFormat),
        end: dateRange[1].format(dateFormat),
        student: studentId,
        sessionName: '',
      },
    })
    getResponseRateEqui({
      variables: {
        startDate: dateRange[0].format(dateFormat),
        endDate: dateRange[1].format(dateFormat),
        studentId,
        equivalence: true,
      },
    })
    getPeakEquiData({
      variables: {
        start: dateRange[0].format(dateFormat),
        end: dateRange[1].format(dateFormat),
        student: studentId,
        sessionName: '',
        equivalence: true,
      },
    })
  }, [])

  useEffect(() => {
    setTableData([])
    if (dateRange[0] && dateRange[1]) {
      let start
      let end
      if (dateRange[0].format(dateFormat) < dateRange[1].format(dateFormat)) {
        start = dateRange[0].format(dateFormat)
        end = dateRange[1].format(dateFormat)
      } else {
        start = dateRange[1].format(dateFormat)
        end = dateRange[0].format(dateFormat)
      }
      getResponseRate({
        variables: {
          startDate: start,
          endDate: end,
          studentId,
        },
      })
      getPeakBlockData({
        variables: {
          start,
          end,
          student: studentId,
          sessionName: '',
        },
      })
      getResponseRateEqui({
        variables: {
          startDate: start,
          endDate: end,
          studentId,
          equivalence: true,
        },
      })
      getPeakEquiData({
        variables: {
          start,
          end,
          student: studentId,
          sessionName: '',
          equivalence: true,
        },
      })
    }
  }, [dateRange, studentId])

  useEffect(() => {
    if (peakEqui) {
      let tempData = []
      const tempClassId = []
      peakEqui.peakBlockWiseReport.map(item => {
        tempData.push({
          date: item.date,
          equBlocks: item.equBlocks,
          targetName: item.target?.targetAllcatedDetails.targetName,
          targetId: item.target?.targetAllcatedDetails.id,
          peakType: item.target?.peakType,
        })
      })

      tempData = tempData.filter(item => {
        if (item.targetName === undefined || item.targetName === null || item.equBlocks === null) {
          return false
        }

        if (item.equBlocks.length === 0) {
          return true
        }
        for (let i = 0; i < tempClassId.length; i++) {
          if (item.equBlocks[0].id === tempClassId[i]) {
            return false
          }
        }

        tempClassId.push(item.equBlocks[0].id)
        return true
      })

      setPeakEquiFilData(tempData)
    } else if (peakEquiError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch equivalence targets details',
      })
    }
  }, [peakEqui, peakEquiError])

  useEffect(() => {
    if (data && peakBlockData) {
      loadData(data.responseRate)
    }
    if (error) {
      error.graphQLErrors.map(item => {
        return notification.error({
          message: 'Somthing went wrong',
          description: item.message,
        })
      })
    }
  }, [data, peakBlockData, error])

  useEffect(() => {
    if (data) {
      filterData()
    }
  }, [type, status])

  const loadData = data => {
    let tempPeakStimulus = []
    const tempBlockId = []

    peakBlockData.peakBlockWiseReport.map(item => {
      tempPeakStimulus.push({
        date: item.date,
        blocks: item.blocks,
        target: item.target?.targetAllcatedDetails.targetName,
        peakType: item.target?.peakType,
      })
    })

    tempPeakStimulus = tempPeakStimulus.filter(item => item.peakType !== 'EQUIVALENCE')
    tempPeakStimulus = tempPeakStimulus.filter(item => {
      if (item.blocks?.length > 0) {
        const tempBlock = item.blocks[0].id
        for (let i = 0; i < tempBlockId.length; i += 1) {
          if (tempBlockId[i] === tempBlock) {
            return false
          }
        }
        tempBlockId.push(tempBlock)
      }
      return true
    })

    if (data) {
      const tempData = []
      if (data.length > 0) {
        const groupedData = groupObj.group(data, 'targetName')
        const peakGroup = groupObj.group(tempPeakStimulus, 'target')
        const keys = Object.keys(groupedData)
        keys.map((target, index) => {
          if (groupedData[target].length > 0) {
            tempData.push({
              target,
              key: target,
              parent: true,
              children: [],
            })
            const lastIdx = tempData.length - 1
            groupedData[target]?.map(data => {
              // console.log(data, 'data')
              tempData[lastIdx] = {
                ...tempData[lastIdx],
                targetStatusName: data.targetStatusName,
                targetType: data.targetType,

                [`${data.sessionDate}`]:
                  data.targetType === 'Peak' ? data.perPeakCorrect : data.perTar,
              }
              if (data.targetType === 'Peak') {
                target = target.trim()
                const childrenObj = []

                for (let k = 0; k < peakGroup[target]?.length; k += 1) {
                  if (peakGroup[target][k].date === data.sessionDate) {
                    peakGroup[target][k].blocks?.map(blockItem => {
                      blockItem.trial?.edges.map(trialObj => {
                        let stimulusIdx = -1
                        let stimulusExist = false
                        for (let w = 0; w < childrenObj.length; w += 1) {
                          if (childrenObj[w].sd === trialObj?.node.sd.sd) {
                            stimulusExist = true
                            stimulusIdx = w
                          }
                        }
                        if (stimulusExist) {
                          childrenObj[stimulusIdx].trialCount += 1
                          childrenObj[stimulusIdx].marks += trialObj?.node.marks === 10 ? 1 : 0
                        } else {
                          childrenObj.push({
                            key: trialObj?.node.id,
                            sd: trialObj?.node.sd.sd,
                            targetStatusName:
                              trialObj?.node.sd.sdstepsmasterySet?.edges[0].node.status.statusName,
                            trialCount: 1,
                            marks: trialObj?.node.marks === 10 ? 1 : 0,
                          })
                        }
                      })
                    })
                  }
                }
                childrenObj.map(cc => {
                  let childIndex = -1
                  let childExist = false
                  for (let bb = 0; bb < tempData[lastIdx].children.length; bb += 1) {
                    if (cc.sd === tempData[lastIdx].children[bb].target) {
                      childExist = true
                      childIndex = bb
                    }
                  }
                  if (childExist) {
                    tempData[lastIdx].children[childIndex] = {
                      ...tempData[lastIdx].children[childIndex],
                      [`${data.sessionDate}`]: Number(
                        Number((cc.marks / cc.trialCount) * 100).toFixed(0),
                      ),
                    }
                  } else {
                    tempData[lastIdx].children.push({
                      key: cc.key,
                      target: cc.sd,
                      type: 'sd',
                      targetStatusName: cc.targetStatusName,
                      parentTarget: target,
                      [`${data.sessionDate}`]: Number(
                        Number((cc.marks / cc.trialCount) * 100).toFixed(0),
                      ),
                    })
                  }
                })
              }
              if (data.sessionRecord?.length > 0) {
                const sessionRecord = data.sessionRecord
                sessionRecord.map(sessionData => {
                  let type = 'sd'
                  if (sessionData.sd && sessionData.sd !== '') {
                    type = 'sd'
                  } else if (sessionData.step && sessionData.step !== '') {
                    type = 'step'
                  }
                  let isExist = false
                  let childIdx = -1

                  for (let i = 0; i < tempData[lastIdx].children.length; i += 1) {
                    if (tempData[lastIdx].children[i].target === sessionData[type]) {
                      isExist = true
                      childIdx = i
                      break
                    }
                  }
                  if (isExist) {
                    tempData[lastIdx].children[childIdx] = {
                      ...tempData[lastIdx].children[childIdx],
                      [`${data.sessionDate}`]:
                        type === 'sd' ? sessionData.perSd : sessionData.perStep,
                    }
                  } else {
                    tempData[lastIdx].children.push({
                      target: sessionData[type],
                      key: Math.random(),
                      targetStatusName: data.targetStatusName,
                      type,
                      parentTarget: target,
                      [`${data.sessionDate}`]:
                        type === 'sd' ? sessionData.perSd : sessionData.perStep,
                    })
                  }
                })
              }
            })
          }
        })
      }
      tempData.map(item => {
        if (item.children.length === 0) {
          delete item.children
        }
      })
      setTableData(tempData)
    }
  }

  const columns = [
    {
      key: 'targetName',
      title: 'Target',
      fixed: 'left',
      width: '350px',
      dataIndex: 'target',
      render: (text, row) => {
        if (row.parent) {
          if (row.children) {
            return (
              <div
                style={{
                  height: '26px',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  margin: 'auto 0',
                  width: '100%',
                  color: COLORS.target,
                  fontWeight: '600',
                }}
              >
                {text}
              </div>
            )
          }
          return (
            <div
              style={{
                fontSize: '13px',
                height: '26px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: '600',
                color: COLORS.target,
              }}
            >
              <div style={{ margin: 'auto 0', padding: 0 }}>{text}</div>

              <Button type="link" onClick={() => handleSelectTarget(row)}>
                <LineChartOutlined
                  style={{ margin: 'auto 0', fontSize: '26px', color: COLORS.graph }}
                />
              </Button>
            </div>
          )
        }

        return (
          <div
            style={{
              display: 'flex',
              height: '26px',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              paddingLeft: '20px',
              color: row.type === 'sd' ? COLORS.stimulus : COLORS.steps,
            }}
          >
            <div style={{ margin: 'auto 0', padding: 0 }}>{text}</div>
            {row.parent ? null : (
              <Button type="link" onClick={() => handleSelectTarget(row)}>
                <LineChartOutlined
                  style={{ fontSize: '26px', margin: 'auto 0', color: COLORS.graph }}
                />
              </Button>
            )}
          </div>
        )
      },
    },
    {
      title: 'Target Status',
      dataIndex: 'targetStatusName',
      width: '120px',
      render: text => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Target Type',
      dataIndex: 'targetType',
      width: '170px',
      render: text => {
        if (text && text.length > 20) {
          return (
            <Tooltip title={text}>
              <span>{text.slice(0, 20)}...</span>
            </Tooltip>
          )
        }
        return <span>{text}</span>
      },
    },
    ...daysList.map(item => {
      return {
        title: `${item.dayDate} ${item.month}`,
        align: 'center',
        children: [
          {
            title: item.day.substring(0, 3),
            align: 'center',
            dataIndex: item.date,
            render: (text, row) => {
              if (row.parent) {
                return <span style={{ fontWeight: '600' }}>{text}</span>
              }
              return <span>{text}</span>
            },
          },
        ],
      }
    }),
  ]

  const filterData = () => {
    const typeFilterDataList = []
    const statusFilterDataList = []
    if ((type && type.length > 0) || (status && status.length > 0)) {
      if (type && type.length > 0) {
        type.map(targetTypeVal => {
          const filterData = data.responseRate.filter(item => item.targetType === targetTypeVal)
          typeFilterDataList.push(...filterData)
        })
        loadData(typeFilterDataList)
      }
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
            const filterData = data.responseRate.filter(item => item.targetStatusName === statusVal)
            statusFilterDataList.push(...filterData)
          })
        }
        loadData(statusFilterDataList)
      }
    } else {
      loadData(data.responseRate)
    }
  }

  const getGraphData = targetName => {
    const graphAxixData = []
    const groupedData = groupObj.group(daysList, 'monthYear')
    let keys = []
    keys = Object.keys(groupedData)

    keys.map(monthYear => {
      const tempData = [
        {
          month: groupedData[monthYear][0].month,
          year: groupedData[monthYear][0].year,
          key: `DailyResponseRate ${groupedData[monthYear][0].month} ${groupedData[monthYear][0].year}`,
          color: 'hsl(335, 70%, 50%)',
          data: [],
        },
      ]

      groupedData[monthYear].map(item => {
        const targetPer = targetName[item.date] ? targetName[item.date] : 0
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

  const handleSelectTarget = targetName => {
    setSelectTarget(targetName)
    getGraphData(targetName)
  }

  const getFormattedObj = (data, parentTarget) => {
    let tempObj = {
      target: data.parent
        ? data.target
        : data.type === 'sd'
        ? `${parentTarget}-Stimulus-${data.target}`
        : `${parentTarget}-Step-${data.target}`,
    }
    daysList.map(item => {
      if (data[item.date]) {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: data[item.date],
        }
      } else {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: null,
        }
      }
    })

    return tempObj
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = '_daily_response_rate_excel'
    const formattedData = []

    for (let i = 0; i < tableData.length; i += 1) {
      const obj = tableData[i]
      const tempObj = getFormattedObj(obj)
      formattedData.push(tempObj)
      if (obj.children) {
        obj.children.map(child => {
          formattedData.push(getFormattedObj(child, obj.target))
        })
      }
    }

    // console.log(formattedData, 'fdff')
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          onClick={() => {
            if (peakType === 'dir/gen') {
              exportToCSV()
            } else {
              downloadCsvRef.current?.exportToCSV('Equivalence')
            }
          }}
          type="link"
          size="small"
        >
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div style={filterCardStyle}>
        <div style={parentDiv}>
          <span style={parentLabel}>Date:</span>
          <RangePicker
            style={{
              marginLeft: 'auto',
              width: 230,
              marginRight: 10,
            }}
            value={dateRange}
            onChange={v => setDateRange(v)}
          />
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Report Type: </span>
          <Radio.Group
            size="small"
            value={peakType}
            style={{ margin: 'auto 0' }}
            onChange={e => {
              setpeakType(e.target.value)
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="dir/gen">DIR/GEN</Radio.Button>
            <Radio.Button value="equi">EQUI</Radio.Button>
          </Radio.Group>
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Type:</span>
          <Select
            mode="multiple"
            style={{
              width: 170,
              borderRadius: 4,
              height: 35,
              overflow: 'auto',
            }}
            disabled={loading || peakBlockLoading}
            allowClear
            onChange={v => {
              setType(v)
            }}
            placeholder="ALL"
          >
            {filterOptions &&
              filterOptions.types.map(({ id, typeTar }) => (
                <Option key={id} value={typeTar}>
                  {typeTar}
                </Option>
              ))}
          </Select>
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Target Status:</span>

          <Select
            style={{
              width: 170,
              borderRadius: 4,
              height: 35,
              overflow: 'auto',
            }}
            value={status}
            disabled={loading || peakBlockLoading}
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
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ padding: '0 8px' }} type="link" size="large">
              <FaDownload fontSize="22" />{' '}
            </Button>
          </Dropdown>
        </div>
      </div>
      <Row>
        <div style={{ ...parentDiv, margin: '10px 5px 5px 10px' }}>
          <span style={parentLabel}>Target</span>
          <div
            style={{
              background: COLORS.target,
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Stimulus</span>
          <div
            style={{
              background: COLORS.stimulus,
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              marginRight: '10px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Steps</span>
          <div
            style={{
              background: COLORS.steps,
              borderRadius: 10,
              width: '20px',
              margin: 'auto 0',
              height: 20,
            }}
          />
        </div>
      </Row>
      <Drawer
        title={`${studentName}'s  -  
                ${
                  selectTarget?.parent
                    ? `Target: ${selectTarget?.target}`
                    : `Target: ${selectTarget?.parentTarget} - ${
                        selectTarget?.type === 'sd' ? 'Stimulus: ' : 'Step: '
                      } ${selectTarget?.target}`
                }`}
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={DRAWER.widthL2}
      >
        <ResponseRateGraph graphData={graphData} />
      </Drawer>

      <Row>
        <Col span={24}>
          {peakType === 'dir/gen' ? (
            loading || peakBlockLoading || !tableData ? (
              <LoadingComponent />
            ) : tableData.length > 0 ? (
              <div
                key={Math.random()}
                className="response-rate-table"
                style={{ margin: '10px 0px 10px 10px' }}
              >
                <Table
                  columns={columns}
                  dataSource={tableData}
                  bordered
                  expandIcon={record => {
                    return null
                  }}
                  pagination={false}
                  defaultExpandAllRows={true}
                  loading={loading}
                  scroll={{ x: daysList.length * 100 + 300, y: '1000px' }}
                />
              </div>
            ) : (
              <div style={{ margin: '20px auto', textAlign: 'center' }}>
                No data found, try to remove filter or change date range
              </div>
            )
          ) : (
            <ResponseRateEqui
              studentName={studentName}
              peakEqui={peakEqui}
              peakEquiFilData={peakEquiFilData}
              equiData={equiData}
              equiError={equiError}
              peakEquiError={peakEquiError}
              type={type}
              status={status}
              peakEquiLoading={peakEquiLoading}
              daysList={daysList}
              ref={downloadCsvRef}
            />
          )}
        </Col>
      </Row>
    </div>
  )
})
