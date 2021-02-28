/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

import React, { useState, useEffect } from 'react'
import {
  Menu,
  Collapse,
  Table,
  Button,
  Drawer,
  Select,
  Radio,
  DatePicker,
  notification,
  Dropdown,
} from 'antd'
import { useQuery, useLazyQuery } from 'react-apollo'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import groupObj from '@hunters/group-object'
import { FaDownload } from 'react-icons/fa'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import gql from 'graphql-tag'
import { TARGET_RESPONSE_RATE } from './query'
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
  margin: '5px 7px',
  height: 700,
  overflow: 'auto',
}
const tableFilterCardStyle = {
  ...filterCardStyle,
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
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

function compare(a, b) {
  if (a.date === b.date) {
    if (a.durationStart < b.durationStart) {
      return -1
    }
    if (a.durationStart > b.durationStart) {
      return 1
    }
  }

  if (a.date < b.date) {
    return -1
  }
  if (a.date > b.date) {
    return 1
  }
  return 0
}

const dateFormat = 'YYYY-MM-DD'
const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

function ResponseTimeRate({ studentName }) {
  const studentId = localStorage.getItem('studentId')
  const [dateRange, setDateRange] = useState([
    moment(Date.now()).subtract(14, 'days'),
    moment(Date.now()),
  ])

  const [targetResponseData, setTargetResponseData] = useState(null)
  const [lineDrawer, setLineDrawer] = useState(false)
  const [promptLineDrawer, setPromptLineDrawer] = useState(false)
  const [promptBarGraphData, setPromptBarGraphData] = useState(null)
  const [barGraphData, setBarGraphData] = useState([])
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState([])
  const [sessionName, setSessionName] = useState('U2Vzc2lvbk5hbWVUeXBlOjE=')
  const [getResponseRate, { data: dt, loading: ld, error: er }] = useLazyQuery(TARGET_RESPONSE_RATE)

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = '_daily_response_rate_excel'
    const formattedData = []
    console.log(daysList, 'lsi')

    // for (let i = 0; i < tableData.length; i += 1) {
    //   const obj = tableData[i]
    //   const tempObj = getFormattedObj(obj)
    //   formattedData.push(tempObj)
    //   if (obj.children) {
    //     obj.children.map(child => {
    //       formattedData.push(getFormattedObj(child, obj.target))
    //     })
    //   }
    // }

    // console.log(formattedData, 'formatted')
    // const ws = XLSX.utils.json_to_sheet(formattedData)
    // console.log(ws, 'ws')
    // const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    // const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    // const excelData = new Blob([excelBuffer], { type: fileType })
    // FileSaver.saveAs(excelData, studentName + filename + fileExtension)
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

      console.log(sessionName, 'sessionName')
      getResponseRate({
        variables: {
          student: studentId,
          start,
          end,
          sessionName,
        },
      })
    }
  }, [dateRange, studentId, sessionName])

  // function formatDuration(ms) {
  //   console.log(ms, (ms / 1000).toFixed(0))
  //   const duration = moment.duration(ms)
  //   console.log(duration)
  // }

  useEffect(() => {
    if (dt) {
      console.log(dt, 'sdkshdfdhfs')
      let tempData = []
      const tempBlockId = []
      console.log(dt)
      tempData = dt.targetWiseReportDatewise.filter(item => {
        if (item.trials?.length > 0) {
          for (let i = 0; i < tempBlockId.length; i += 1) {
            if (item.trials[0]?.id === tempBlockId[i]) {
              return false
            }
          }
        }
        tempBlockId.push(item.trials[0]?.id)
        return true
      })
      console.log(tempData)
      setTargetResponseData(tempData)
      loadData(tempData)
    }
    if (er) {
      notification.error({
        message: 'Opps their are something wrong to load the data',
      })
    }
  }, [dt, er])

  const loadData = data => {
    if (data) {
      const tempTable = []
      const tempBlockId = []
      const set1 = new Set()
      let sessionTotal = {
        target: 'All',
        timeSpent: 0,
        correct: 0,
        prompt: 0,
        incorrect: 0,
        total: 0,
        noResponse: 0,
        children: [],
        promptCodesCount: {
          'Gestural Prompt': 0,
          'Textual Prompt': 0,
          'Verbal Prompt': 0,
          'Physical Prompt': 0,
        },
      }
      let lastDate = data[0].date

      data.map(item => {
        const targetName = item.target?.targetAllcatedDetails.targetName
        const lastIdx = tempTable.length - 1
        set1.add(targetName)
        let tarExist = false
        let tarIdx = -1
        for (let i = 0; i < tempTable.length; i += 1) {
          if (targetName === tempTable[i].target && item.date === tempTable[i].date) {
            tarExist = true
            tarIdx = i
          }
        }

        if (item.date !== lastDate) {
          tempTable.push({
            ...sessionTotal,
            date: lastDate,
            key: Math.random(),
          })
          sessionTotal = {
            target: 'All',
            timeSpent: 0,
            correct: 0,
            prompt: 0,
            incorrect: 0,
            noResponse: 0,
            total: 0,
            children: [],
            promptCodesCount: {
              'Gestural Prompt': 0,
              'Textual Prompt': 0,
              'Verbal Prompt': 0,
              'Physical Prompt': 0,
            },
          }
          lastDate = item.date
        }
        console.log(item.date, 'item date')
        if (tarExist) {
          tempTable[tarIdx].durationStart +=
            item.trials.length > 0 ? item.trials[0].durationStart : null
          tempTable[tarIdx].durationEnd +=
            item.trials.length > 0 ? item.trials[item.trials.length - 1].durationEnd : null

          item.trials.map((tt, ttIdx) => {
            let ssExist = false
            let ssIdx = -1
            let type = 'None'
            set1.add(tt.trial)
            if (tt.sd) {
              for (let k = 0; k < tempTable[tarIdx].children.length; k++) {
                if (tt.sd.sd === tempTable[tarIdx].children[k].target) {
                  ssExist = true
                  ssIdx = k
                }
              }
              type = 'sd'
            } else if (tt.step) {
              for (let k = 0; k < tempTable[tarIdx].children.length; k++) {
                if (tt.step?.step === tempTable[tarIdx].children[k].target) {
                  ssExist = true
                  ssIdx = k
                }
              }
              type = 'step'
            } else {
              for (let k = 0; k < tempTable[tarIdx].children.length; k++) {
                if (tempTable[tarIdx].children[k].target === null) {
                  ssExist = true
                  ssIdx = k
                }
              }
            }

            let scoreType = null
            if (tt.trial === 'CORRECT') {
              scoreType = 'correct'
            } else if (tt.trial === 'PROMPT') {
              scoreType = 'prompt'
            } else if (tt.trial === 'INCORRECT') {
              scoreType = 'incorrect'
            } else if (tt.trial === 'ERROR' || tt.trial === 'NORESPONSE') {
              scoreType = 'noResponse'
            }

            if (ssExist) {
              tempTable[tarIdx].children[ssIdx][scoreType] += 1
              tempTable[tarIdx].children[ssIdx].total += 1
              tempTable[tarIdx].children[ssIdx].timeSpent += Math.abs(
                tt.durationStart - tt.durationEnd,
              )

              if (tt.trial === 'PROMPT') {
                tempTable[tempTable.length - 1].children[ssIdx].promptCodesCount[
                  tt?.promptCode?.promptName
                ] += 1
              }
            } else {
              tempTable[tarIdx].children.push({
                key: tt.id,
                target: tt[type] ? tt[type][type] : null,
                correct: tt.trial === 'CORRECT' ? 1 : 0,
                prompt: tt.trial === 'PROMPT' ? 1 : 0,
                incorrect: tt.trial === 'INCORRECT' ? 1 : 0,
                noResponse: tt.trial === 'ERROR' || tt.trial === 'NORESPONSE' ? 1 : 0,
                total: 1,
                type,
                promptCodesCount: {
                  'Gestural Prompt': 0,
                  'Textual Prompt': 0,
                  'Verbal Prompt': 0,
                  'Physical Prompt': 0,
                },
                date: item.date,
                timeSpent: Math.abs(tt.durationStart - tt.durationEnd),
              })

              if (tt.trial === 'PROMPT') {
                tempTable[tempTable.length - 1].children[
                  tempTable[tempTable.length - 1].children.length - 1
                ].promptCodesCount[tt.promptCode?.promptName] = 1
              }
            }

            if (tt.trial === 'PROMPT') {
              tempTable[tarIdx].promptCodesCount[tt.promptCode?.promptName] += 1
              sessionTotal.promptCodesCount[tt.promptCode?.promptName] += 1
            }

            sessionTotal[scoreType] += 1
            sessionTotal.total += 1
            sessionTotal.timeSpent += Math.abs(tt.durationStart - tt.durationEnd)

            tempTable[tarIdx][scoreType] += 1
            tempTable[tarIdx].total += 1
            tempTable[tarIdx].timeSpent += Math.abs(tt.durationStart - tt.durationEnd)
          })
        } else {
          // Gestural Prompt Textual Prompt Verbal Prompt Physical Prompt
          tempTable.push({
            date: item.date,
            target: targetName,
            correct: 0,
            incorrect: 0,
            prompt: 0,
            noResponse: 0,
            total: 0,
            durationStart: item.trials.length > 0 ? item.trials[0].durationStart : null,
            durationEnd:
              item.trials.length > 0 ? item.trials[item.trials.length - 1].durationEnd : null,
            timeSpent: 0,
            type: 'target',
            promptCodesCount: {
              'Gestural Prompt': 0,
              'Textual Prompt': 0,
              'Verbal Prompt': 0,
              'Physical Prompt': 0,
            },
            key: `${item.date} ${targetName}`,
            children: [],
          })

          item.trials.map((tt, ttIdx) => {
            let ssExist = false
            let ssIdx = -1
            let type = 'None'
            set1.add(tt.trial)

            if (tt.sd) {
              for (let k = 0; k < tempTable[tempTable.length - 1].children.length; k++) {
                if (tt.sd?.sd === tempTable[tempTable.length - 1].children[k].target) {
                  ssExist = true
                  ssIdx = k
                }
              }
              type = 'sd'
            } else if (tt.step) {
              for (let k = 0; k < tempTable[tempTable.length - 1].children.length; k++) {
                if (tt.step?.step === tempTable[tempTable.length - 1].children[k].target) {
                  ssExist = true
                  ssIdx = k
                }
              }
              type = 'step'
            } else {
              for (let k = 0; k < tempTable[tempTable.length - 1].children.length; k++) {
                if (tempTable[tempTable.length - 1].children[k].target === null) {
                  ssExist = true
                  ssIdx = k
                }
              }
            }

            let scoreType = null
            if (tt.trial === 'CORRECT') {
              scoreType = 'correct'
            } else if (tt.trial === 'PROMPT') {
              scoreType = 'prompt'
            } else if (tt.trial === 'INCORRECT') {
              scoreType = 'incorrect'
            } else if (tt.trial === 'ERROR' || tt.trial === 'NORESPONSE') {
              scoreType = 'noResponse'
            }

            if (ssExist) {
              tempTable[tempTable.length - 1].children[ssIdx][scoreType] += 1
              tempTable[tempTable.length - 1].children[ssIdx].total += 1
              tempTable[tempTable.length - 1].children[ssIdx].timeSpent += Math.abs(
                tt.durationStart - tt.durationEnd,
              )

              if (tt.trial === 'PROMPT') {
                tempTable[tempTable.length - 1].children[ssIdx].promptCodesCount[
                  tt?.promptCode?.promptName
                ] += 1
              }
            } else {
              tempTable[tempTable.length - 1].children.push({
                key: tt.id,
                target: tt[type] ? tt[type][type] : null,
                correct: tt.trial === 'CORRECT' ? 1 : 0,
                prompt: tt.trial === 'PROMPT' ? 1 : 0,
                incorrect: tt.trial === 'INCORRECT' ? 1 : 0,
                noResponse: tt.trial === 'ERROR' || tt.trial === 'NORESPONSE' ? 1 : 0,
                total: 1,
                type,
                tempDate: item.date,
                timeSpent: Math.abs(tt.durationStart - tt.durationEnd),
                promptCodesCount: {
                  'Gestural Prompt': 0,
                  'Textual Prompt': 0,
                  'Verbal Prompt': 0,
                  'Physical Prompt': 0,
                },
                date: item.date,
              })
              if (tt.trial === 'PROMPT') {
                const childLen = tempTable[tempTable.length - 1].children.length - 1
                tempTable[tempTable.length - 1].children[childLen].promptCodesCount[
                  tt?.promptCode?.promptName
                ] = 1
              }
            }

            sessionTotal[scoreType] += 1
            sessionTotal.total += 1
            sessionTotal.timeSpent += Math.abs(tt.durationStart - tt.durationEnd)

            if (tt.trial === 'PROMPT') {
              tempTable[tempTable.length - 1].promptCodesCount[tt.promptCode?.promptName] += 1
              sessionTotal.promptCodesCount[tt.promptCode?.promptName] += 1
            }
            tempTable[tempTable.length - 1][scoreType] += 1
            tempTable[tempTable.length - 1].total += 1
            tempTable[tempTable.length - 1].timeSpent += Math.abs(tt.durationStart - tt.durationEnd)
          })
        }
      })
      tempTable.map(item => {
        if (
          item.children.length === 0 ||
          (item.children.length === 1 && item.children[0].target === null)
        ) {
          delete item.children
        }
      })
      console.log(tempTable, 'tempTable')
      console.log(set1)
      // tempTable.sort(compare)
      let count = 1
      for (let i = 0; i < tempTable.length; i++) {
        if (tempTable[i].target === 'All') {
          count = 1
          continue
        }
        tempTable[i] = {
          ...tempTable[i],
          count,
        }
        count += 1
      }
      console.log(tempTable, 'tempTable')
      setTableData(tempTable)
    }
  }

  const generateGraphData = row => {
    const total = row.total
    const gData = []
    gData.push({
      id: 'Correct',
      key: Math.random(),
      'Percentage Correct': Number.isNaN(row.correct) ? 0 : row.correct,
    })
    gData.push({
      id: 'Prompt',
      key: Math.random(),

      'Percentage Prompt': Number.isNaN(row.prompt) ? 0 : row.prompt,
    })
    gData.push({
      id: 'Incorrect',
      key: Math.random(),

      'Percentage Incorrect': Number.isNaN(row.incorrect) ? 0 : row.incorrect,
    })
    gData.push({
      id: 'noResponse',
      key: Math.random(),

      'No Response': Number.isNaN(row.noResponse) ? 0 : row.noResponse,
    })

    setBarGraphData(gData)
    setCurrentRow(row)
    setLineDrawer(true)
  }

  const generatePromptGraphData = row => {
    const total = row.prompt
    const gData = []
    gData.push({
      id: 'Physical',
      key: Math.random(),
      'Physical Prompt': Number.isNaN(row.promptCodesCount['Physical Prompt'])
        ? 0
        : row.promptCodesCount['Physical Prompt'],
    })
    gData.push({
      id: 'Gestural',
      key: Math.random(),

      'Gestural Prompt': Number.isNaN(row.promptCodesCount['Gestural Prompt'])
        ? 0
        : row.promptCodesCount['Gestural Prompt'],
    })
    gData.push({
      id: 'Verbal',
      key: Math.random(),

      'Verbal Prompt': Number.isNaN(row.promptCodesCount['Verbal Prompt'])
        ? 0
        : row.promptCodesCount['Verbal Prompt'],
    })
    gData.push({
      id: 'Textual',
      key: Math.random(),

      'Textual Prompt': Number.isNaN(row.promptCodesCount['Textual Prompt'])
        ? 0
        : row.promptCodesCount['Textual Prompt'],
    })
    console.log(gData, 'gData in graph')
    setPromptBarGraphData(gData)
    setCurrentRow(row)
    setPromptLineDrawer(true)
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text, row) => (row.type === 'target' ? text : null),
    },
    {
      key: 'targetName',
      title: 'Target',
      width: '350px',
      dataIndex: 'target',
      render: (text, row) => {
        let tempColor = '#2874A6'
        if (row.type === 'sd') {
          tempColor = '#F080B8'
        } else if (row.type === 'step') {
          tempColor = '#F0B880'
        }
        return (
          <span style={{ color: tempColor }}>
            {row.count ? `${row.count} - ` : null}
            {text}
          </span>
        )
      },
    },
    {
      title: 'Time Spent (in sec)',
      dataIndex: 'timeSpent',
      render: text => <span>{(text / 1000).toFixed(0)}</span>,
    },
    {
      title: 'Correct',
      dataIndex: 'correct',
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      render: (text, row) => (
        <Button
          onClick={() => generatePromptGraphData(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Incorrect',
      dataIndex: 'incorrect',
    },
    {
      title: 'No response',
      dataIndex: 'noResponse',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: '80px',
    },
    {
      title: 'Action',
      render: (text, row) => {
        return (
          <span>
            <Button type="link" onClick={() => generateGraphData(row)}>
              <LineChartOutlined style={{ fontSize: 30, color: 'rgb(229, 132, 37)' }} />
            </Button>
          </span>
        )
      },
    },
  ]

  console.log(dt, 'api data')
  return (
    <div>
      <div style={filterCardStyle}>
        <div style={parentDiv}>
          <span style={parentLabel}>Date:</span>
          <RangePicker
            style={{
              marginLeft: 'auto',
              width: 250,
              marginRight: 31,
            }}
            value={dateRange}
            onChange={v => setDateRange(v)}
          />
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Session: </span>
          <Radio.Group
            size="small"
            style={{ margin: 'auto 0' }}
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjE=">Mor</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjI=">After</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjM=">Eve</Radio.Button>
            <Radio.Button value="U2Vzc2lvbk5hbWVUeXBlOjQ=">Def</Radio.Button>
          </Radio.Group>
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Target</span>
          <div
            style={{
              background: '#2874A6',
              borderRadius: 10,
              width: '40px',
              margin: 'auto 0',
              marginRight: '20px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Stimulus</span>
          <div
            style={{
              background: '#f080b8',
              borderRadius: 10,
              width: '40px',
              margin: 'auto 0',
              marginRight: '20px',
              height: 20,
            }}
          />
          <span style={parentLabel}>Steps</span>
          <div
            style={{
              background: '#f0b880',
              borderRadius: 10,
              width: '40px',
              margin: 'auto 0',
              marginRight: '20px',
              height: 20,
            }}
          />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ padding: '0 8px' }} type="link" size="large">
              <FaDownload />{' '}
            </Button>
          </Dropdown>
        </div>
      </div>
      <Drawer
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={900}
        title={`${currentRow?.date}: ${
          currentRow?.type === 'target' ? 'Target' : currentRow?.type === 'sd' ? 'Stimulus' : 'Step'
        } - ${currentRow?.target}`}
      >
        <div style={{ height: 550, marginBottom: 20 }}>
          <ResponsiveBar
            data={barGraphData}
            keys={[
              'No Response',
              'Percentage Incorrect',
              'Percentage Prompt',
              'Percentage Correct',
            ]}
            margin={{ top: 40, right: 20, bottom: 200, left: 60 }}
            padding={0.15}
            colors={{ scheme: 'set2' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Count',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-left',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 200,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </Drawer>

      <Drawer
        visible={promptLineDrawer}
        onClose={() => setPromptLineDrawer(false)}
        width={900}
        title={`${currentRow?.date}: ${
          currentRow?.type === 'target'
            ? 'Target - '
            : currentRow?.type === 'sd'
            ? 'Stimulus - '
            : 'Step - '
        } ${currentRow?.target}`}
      >
        <div style={{ height: 550, marginBottom: 20 }}>
          <ResponsiveBar
            data={promptBarGraphData}
            keys={['Textual Prompt', 'Verbal Prompt', 'Gestural Prompt', 'Physical Prompt']}
            margin={{ top: 40, right: 20, bottom: 200, left: 60 }}
            padding={0.15}
            colors={{ scheme: 'set2' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Count',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-left',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 200,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </Drawer>

      {ld || !tableData ? (
        <LoadingComponent />
      ) : (
        <div style={{ margin: '5px 0 10px 5px' }}>
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            size="middle"
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['20', '50', '100', '200', '500'],
              position: 'top',
            }}
          />{' '}
        </div>
      )}
    </div>
  )
}

export default ResponseTimeRate
