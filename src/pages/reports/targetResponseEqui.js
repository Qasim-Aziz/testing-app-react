/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-const */
/* eslint-disable import/prefer-default-export */

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Table, Button, Drawer } from 'antd'
import { ResponsiveBar } from '@nivo/bar'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined } from '@ant-design/icons'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import './form.scss'
import './table.scss'

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

export const TargetResponseEqui = forwardRef((props, ref) => {
  const { studentName, dates, peakEquiData, peakEquiLoading, expandType } = props
  const [lineDrawer, setLineDrawer] = useState(false)
  const [promptLineDrawer, setPromptLineDrawer] = useState(false)
  const [trainTestLineDrawer, setTrainTestLineDrawer] = useState(false)
  const [promptBarGraphData, setPromptBarGraphData] = useState(null)
  const [barGraphData, setBarGraphData] = useState([])
  const [trainTestGraphData, setTrainTestGraphData] = useState(null)
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState([])

  const iterateTrials = (tarIdx, tempTable, sessionTotal, item) => {
    item.equBlocks.map((block, ttIdx) => {
      let stimExist = false
      let stimIdx = -1
      let tempStimulus = block.codeClass.name
      if (expandType === 'Stimulus') {
        if (
          block.recType === 'TRAIN' &&
          block.relationTrain.stimulus1 &&
          block.relationTrain.stimulus2
        ) {
          tempStimulus = `${block.relationTrain.stimulus1}${block.relationTrain.sign12}${block.relationTrain.stimulus2}`
        } else if (
          block.recType === 'TRAIN' &&
          block.relationTrain.stimulus2 &&
          block.relationTrain.stimulus3
        ) {
          tempStimulus = `${block.relationTrain.stimulus2}${block.relationTrain.sign23}${block.relationTrain.stimulus3}`
        } else if (
          block.recType === 'TEST' &&
          block.relationTest.stimulus1 &&
          block.relationTest.stimulus2
        ) {
          tempStimulus = `${block.relationTest.stimulus1}${block.relationTest.sign12}${block.relationTest.stimulus2}`
        } else if (
          block.recType === 'TEST' &&
          block.relationTest.stimulus2 &&
          block.relationTest.stimulus3
        ) {
          tempStimulus = `${block.relationTest.stimulus2}${block.relationTest.sign23}${block.relationTest.stimulus3}`
        }
      }

      for (let i = 0; i < tempTable[tarIdx].children.length; i++) {
        if (tempTable[tarIdx].children[i].target === tempStimulus) {
          stimExist = true
          stimIdx = i
        }
      }

      let scoreType = null
      if (block.score === 0) {
        scoreType = 'incorrect'
      } else if (block.score === 2 || block.score === 4 || block.score === 8) {
        scoreType = 'prompt'
      } else if (block.score === 10) {
        scoreType = 'correct'
      }

      if (stimExist) {
        tempTable[tarIdx].children[stimIdx][scoreType] += 1
        tempTable[tarIdx].children[stimIdx].total += 1
        tempTable[tarIdx].children[stimIdx].timeSpent += Math.abs(
          block.durationStart - block.durationEnd,
        )
        tempTable[tarIdx].children[stimIdx].recType[block.recType] += 1
        if (scoreType === 'prompt') {
          tempTable[tarIdx].children[stimIdx].promptCodesCount[block.score] += 1
        }
      } else {
        tempTable[tarIdx].children.push({
          key: block.id,
          target: tempStimulus,
          correct: block.score === 10 ? 1 : 0,
          prompt: block.score === 8 || block.score === 4 || block.score === 2 ? 1 : 0,
          incorrect: block.trial === 0 ? 1 : 0,
          noResponse: 0,
          total: 1,
          type: expandType,
          timeSpent: Math.abs(block.durationStart - block.durationEnd),
          promptCodesCount: {
            '2': block.score === 2 ? 1 : 0,
            '4': block.score === 4 ? 1 : 0,
            '8': block.score === 8 ? 1 : 0,
          },
          recType: {
            TRAIN: block.recType === 'TRAIN' ? 1 : 0,
            TEST: block.recType === 'TEST' ? 1 : 0,
          },
          date: item.date,
        })
      }

      if (scoreType === 'prompt') {
        sessionTotal.promptCodesCount[block.score] += 1
        tempTable[tarIdx].promptCodesCount[block.score] += 1
      }

      sessionTotal[scoreType] += 1
      sessionTotal.total += 1
      sessionTotal.recType[block.recType] += 1
      sessionTotal.timeSpent += Math.abs(block.durationStart - block.durationEnd)

      tempTable[tarIdx][scoreType] += 1
      tempTable[tarIdx].total += 1
      tempTable[tarIdx].recType[block.recType] += 1
      tempTable[tarIdx].timeSpent += Math.abs(block.durationStart - block.durationEnd)
    })

    return tempTable
  }

  useEffect(() => {
    if (peakEquiData && peakEquiData.length > 0) {
      const tempTable = []
      let sessionTotal = {
        target: '',
        type: 'total',
        timeSpent: 0,
        correct: 0,
        prompt: 0,
        incorrect: 0,
        noResponse: 0,
        total: 0,
        children: [],
        recType: {
          TRAIN: 0,
          TEST: 0,
        },
        promptCodesCount: {
          '2': 0,
          '4': 0,
          '8': 0,
          None: 0,
        },
      }

      let lastDate = peakEquiData[0].date

      peakEquiData.map(item => {
        const targetName = item.targetName
        if (targetName) {
          if (item.date !== lastDate) {
            tempTable.push({
              ...sessionTotal,
              date: lastDate,
              key: Math.random(),
            })
            sessionTotal = {
              target: '',
              type: 'total',
              timeSpent: 0,
              correct: 0,
              prompt: 0,
              incorrect: 0,
              noResponse: 0,
              total: 0,
              children: [],
              recType: {
                TRAIN: 0,
                TEST: 0,
              },
              promptCodesCount: {
                '2': 0,
                '4': 0,
                '8': 0,
                None: 0,
              },
            }
            lastDate = item.date
          }

          let tarExist = false
          let tarIdx = -1
          for (let i = 0; i < tempTable.length; i += 1) {
            if (targetName === tempTable[i].target && item.date === tempTable[i].date) {
              tarExist = true
              tarIdx = i
            }
          }

          if (tarExist) {
            // target already exist
            iterateTrials(tarIdx, tempTable, sessionTotal, item)
          } else {
            // new entry
            tempTable.push({
              date: item.date,
              target: targetName,
              correct: 0,
              incorrect: 0,
              prompt: 0,
              noResponse: 0,
              total: 0,
              durationStart: Number.isNaN(item.equBlocks[0]?.durationStart)
                ? 0
                : item.equBlocks[0]?.durationStart,
              durationEnd: 0,
              timeSpent: 0,
              type: 'target',
              recType: {
                TRAIN: 0,
                TEST: 0,
              },
              promptCodesCount: {
                '2': 0,
                '4': 0,
                '8': 0,
              },
              key: `${item.date} ${targetName}`,
              children: [],
            })
            iterateTrials(tempTable.length - 1, tempTable, sessionTotal, item)
          }
        }
      })

      tempTable.push({
        ...sessionTotal,
        date: lastDate,
        key: Math.random(),
      })

      tempTable.map(item => {
        if (
          item.children.length === 0 ||
          (item.children.length === 1 && item.children[0].target === null)
        ) {
          delete item.children
        }
      })
      tempTable.sort(compare)

      let count = 1
      for (let i = 0; i < tempTable.length; i++) {
        if (tempTable[i].type === 'total') {
          count = 1
          continue
        }
        tempTable[i] = {
          ...tempTable[i],
          count,
        }
        count += 1
      }
      // console.log(tempTable, 'tempTable')
      setTableData(tempTable)
    }
  }, [peakEquiData])

  const generateGraphData = row => {
    const gData = []
    gData.push({
      id: 'Correct',
      key: Math.random(),
      Correct: Number.isNaN(row.correct) ? 0 : row.correct,
    })
    gData.push({
      id: 'Prompt',
      key: Math.random(),

      Prompt: Number.isNaN(row.prompt) ? 0 : row.prompt,
    })
    gData.push({
      id: 'Incorrect',
      key: Math.random(),

      Incorrect: Number.isNaN(row.incorrect) ? 0 : row.incorrect,
    })
    gData.push({
      id: 'noResponse',
      key: Math.random(),

      'No Response': Number.isNaN(row.noResponse) ? 0 : row.noResponse ? row.noResponse : 0,
    })

    setBarGraphData(gData)
    setCurrentRow(row)
    setLineDrawer(true)
  }

  const generatePromptGraphData = row => {
    const gData = []

    if (row.promptCodesCount.None === 0) {
      delete row.promptCodesCount.None
    }
    const promptKeys = Object.keys(row.promptCodesCount)

    promptKeys.map(pk => {
      gData.push({
        id: pk.split(' ')[0],
        key: Math.random(),
        [pk]: Number.isNaN(row.promptCodesCount[pk]) ? 0 : row.promptCodesCount[pk],
      })
    })

    setPromptBarGraphData(gData)
    setCurrentRow(row)
    setPromptLineDrawer(true)
  }

  const generateTrainTestGraphData = row => {
    const gData = []
    gData.push({
      id: 'Train',
      key: Math.random(),
      Train: Number.isNaN(row.recType.TRAIN) ? 0 : row.recType.TRAIN,
    })
    gData.push({
      id: 'Test',
      key: Math.random(),

      Test: Number.isNaN(row.recType.TEST) ? 0 : row.recType.TEST,
    })

    setTrainTestGraphData(gData)
    setCurrentRow(row)
    setTrainTestLineDrawer(true)
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
        if (row.type === 'Stimulus') {
          tempColor = '#f080b8'
        } else if (row.type === 'Class') {
          tempColor = '#ff8080'
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
      align: 'center',
    },
    {
      title: 'Correct',
      dataIndex: 'correct',
      align: 'center',
      width: '90px',
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      align: 'center',
      width: '90px',
      render: (text, row) => (
        <Button
          onClick={() => generatePromptGraphData(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Incorrect',
      dataIndex: 'incorrect',
      width: '90px',
      align: 'center',
    },
    {
      title: 'No response',
      dataIndex: 'noResponse',
      align: 'center',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: '90px',
      align: 'center',
      render: (text, row) => (
        <Button
          onClick={() => generateTrainTestGraphData(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {text}
        </Button>
      ),
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
      align: 'center',
    },
  ]

  const getFormattedObj = (data, parentTarget) => {
    let tempObj = null
    if (data) {
      tempObj = {
        Date: data.date,
        Target:
          data.type === 'target'
            ? data.target
            : data.type === 'total'
            ? 'Total'
            : `${parentTarget}-${data.target}`,
        'Time Spent': data.timeSpent,
        Correct: data.correct,
        Prompt: data.prompt,
        Incorrect: data.incorrect,
        'No response': data.noResponse,
        Total: data.total,
      }
    }
    return tempObj
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  useImperativeHandle(ref, () => ({
    exportToCSV(reportType) {
      if (reportType === 'Class' || reportType === 'Stimulus') {
        const filename = `${studentName?.trim()}_tar_resEqui_report`
        const formattedData = []

        for (let i = 0; i < tableData.length; i += 1) {
          const obj = tableData[i]
          const tempObj = getFormattedObj(obj)
          console.log(tempObj)
          formattedData.push(tempObj)
          if (obj.children) {
            obj.children.map(child => {
              formattedData.push(getFormattedObj(child, obj.target))
            })
          }
        }
        console.log(formattedData, filename, 'dt')
        const ws = XLSX.utils.json_to_sheet(formattedData)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const excelData = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(excelData, filename + fileExtension)
      }
    },
  }))

  return (
    <div>
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
            keys={['No Response', 'Incorrect', 'Prompt', 'Correct']}
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
        title={`${currentRow?.date} ${
          currentRow?.type === 'target'
            ? ': Target - '
            : currentRow?.type === 'Stimulus'
            ? `: ${expandType} - `
            : ''
        } ${currentRow?.target}`}
      >
        <div style={{ height: 550, marginBottom: 20 }}>
          <ResponsiveBar
            data={promptBarGraphData}
            keys={[2, 4, 8]}
            margin={{ top: 30, right: 20, bottom: 240, left: 60 }}
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
                translateY: 160,
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
        visible={trainTestLineDrawer}
        onClose={() => setTrainTestLineDrawer(false)}
        width={900}
        title={`${currentRow?.date} ${
          currentRow?.type === 'target'
            ? ': Target - '
            : currentRow?.type === 'Class'
            ? ': Class - '
            : ''
        } ${currentRow?.target}`}
      >
        <div style={{ height: 550, marginBottom: 20 }}>
          <ResponsiveBar
            data={trainTestGraphData}
            keys={['Train', 'Test']}
            margin={{ top: 30, right: 20, bottom: 240, left: 60 }}
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
                translateY: 160,
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

      {peakEquiLoading || !tableData ? (
        <LoadingComponent />
      ) : (
        <div style={{ margin: '10px 0 0px 10px' }}>
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
})
