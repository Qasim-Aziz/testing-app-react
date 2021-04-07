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

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Table, Button, Drawer } from 'antd'
import { ResponsiveBar } from '@nivo/bar'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined } from '@ant-design/icons'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import './form.scss'
import './table.scss'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'

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

export const TargetResponsePeakBlock = forwardRef((props, ref) => {
  const { studentName, dates, data, dataLoading } = props
  const [lineDrawer, setLineDrawer] = useState(false)
  const [promptLineDrawer, setPromptLineDrawer] = useState(false)
  const [promptBarGraphData, setPromptBarGraphData] = useState(null)
  const [promptGraphKeys, setPromptGraphKeys] = useState(null)
  const [barGraphData, setBarGraphData] = useState([])
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState([])

  const iterateTrials = (tarIdx, tempTable, sessionTotal, item) => {
    item.trials.map((tt, ttIdx) => {
      let ssExist = false
      let ssIdx = -1
      let type = 'None'

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
        tempTable[tarIdx].children[ssIdx].timeSpent += Math.abs(tt.durationStart - tt.durationEnd)

        if (tt.trial === 'PROMPT') {
          if (tt.promptCode === null) {
            tempTable[tarIdx].children[ssIdx].promptCodesCount.None += 1
          } else {
            tempTable[tarIdx].children[ssIdx].promptCodesCount[tt.promptCode?.promptName] += 1
          }
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
          timeSpent: Math.abs(tt.durationStart - tt.durationEnd),
          promptCodesCount: {
            'Gestural Prompt': tt.promptCode?.promptName === 'Gestural Prompt' ? 1 : 0,
            'Textual Prompt': tt.promptCode?.promptName === 'Textual Prompt' ? 1 : 0,
            'Verbal Prompt': tt.promptCode?.promptName === 'Verbal Prompt' ? 1 : 0,
            'Physical Prompt': tt.promptCode?.promptName === 'Physical Prompt' ? 1 : 0,
            None: tt.trial === 'PROMPT' && tt.promptCode === null ? 1 : 0,
          },
          date: item.date,
        })
      }

      if (tt.trial === 'PROMPT') {
        if (tt.promptCode === null) {
          tempTable[tarIdx].promptCodesCount.None += 1
          sessionTotal.promptCodesCount.None += 1
        } else {
          tempTable[tarIdx].promptCodesCount[tt.promptCode?.promptName] += 1
          sessionTotal.promptCodesCount[tt.promptCode?.promptName] += 1
        }
      }

      sessionTotal[scoreType] += 1
      sessionTotal.total += 1
      sessionTotal.timeSpent += Math.abs(tt.durationStart - tt.durationEnd)

      tempTable[tarIdx][scoreType] += 1
      tempTable[tarIdx].total += 1
      tempTable[tarIdx].timeSpent += Math.abs(tt.durationStart - tt.durationEnd)
    })

    return tempTable
  }

  const iterateBlocks = (tempTable, tarIdx, sessionTotal, item) => {
    item.blocks.map(block => {
      block.trial.edges.map(tt => {
        let sdExist = false
        let sdIdx = -1
        for (let i = 0; i < tempTable[tarIdx].children.length; i++) {
          if (tempTable[tarIdx].children[i].target === tt.node.sd.sd) {
            sdExist = true
            sdIdx = i
          }
        }

        const tempTimeSpent = Math.abs(
          (Number.isNaN(tt.node.start) ? 0 : tt.node.start) -
            (Number.isNaN(tt.node.end) ? 0 : tt.node.end),
        )

        let scoreType = null
        if (tt.node.marks === 10) {
          scoreType = 'correct'
        } else if (tt.node.marks === 2 || tt.node.marks === 4 || tt.node.marks === 8) {
          scoreType = 'prompt'
        } else if (tt.node.marks === 0) {
          scoreType = 'incorrect'
        }

        if (sdExist) {
          tempTable[tarIdx].children[sdIdx][scoreType] += 1
          tempTable[tarIdx].children[sdIdx].total += 1
          tempTable[tarIdx].children[sdIdx].timeSpent += tempTimeSpent

          if (scoreType === 'prompt') {
            tempTable[tarIdx].children[sdIdx].promptCodesCount[tt.node.marks] += 1
          }
        } else {
          tempTable[tarIdx].children.push({
            key: tt.node.id,
            target: tt.node.sd.sd,
            correct: tt.node.marks === 10 ? 1 : 0,
            prompt: tt.node.marks === 2 || tt.node.marks === 4 || tt.node.marks === 8 ? 1 : 0,
            incorrect: tt.node.marks === 0 ? 1 : 0,
            total: 1,
            type: 'sd',
            timeSpent: tempTimeSpent,
            promptCodesCount: {
              '2': tt.node.marks === 2 ? 1 : 0,
              '4': tt.node.marks === 4 ? 1 : 0,
              '8': tt.node.marks === 8 ? 1 : 0,
            },
            date: item.date,
          })
        }

        if (scoreType === 'prompt') {
          tempTable[tarIdx].promptCodesCount[tt.node.marks] += 1

          sessionTotal.promptCodesCount = {
            ...sessionTotal.promptCodesCount,
            [tt.node.marks]: sessionTotal.promptCodesCount[tt.node.marks]
              ? sessionTotal.promptCodesCount[tt.node.marks] + 1
              : 1,
          }
        }

        sessionTotal[scoreType] += 1
        sessionTotal.total += 1
        sessionTotal.timeSpent += tempTimeSpent

        tempTable[tarIdx][scoreType] += 1
        tempTable[tarIdx].total += 1
        tempTable[tempTable.length - 1].timeSpent += tempTimeSpent
      })
    })

    return tempTable
  }

  useEffect(() => {
    if (data && data.length > 0) {
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
        promptCodesCount: {
          'Gestural Prompt': 0,
          'Textual Prompt': 0,
          'Verbal Prompt': 0,
          'Physical Prompt': 0,
          None: 0,
        },
      }

      let lastDate = data[0].date

      data.map(item => {
        const targetName = item.target?.targetAllcatedDetails.targetName
        const targetType = item.target?.targetAllcatedDetails.targetType.typeTar
        const dtLocation = targetType === 'Peak' ? 'blocks' : 'trials'

        if (item.target && item[dtLocation]?.length > 0) {
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
              promptCodesCount: {
                'Gestural Prompt': 0,
                'Textual Prompt': 0,
                'Verbal Prompt': 0,
                'Physical Prompt': 0,
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

          if (targetType === 'Peak' && tarExist) {
            // target already exist
            iterateBlocks(tempTable, tarIdx, sessionTotal, item)
          } else if (targetType === 'Peak') {
            // new entry
            tempTable.push({
              date: item.date,
              target: targetName,
              correct: 0,
              incorrect: 0,
              prompt: 0,
              noResponse: 0,
              total: 0,
              durationStart: Number.isNaN(item.blocks[0].durationStart)
                ? 0
                : item.blocks[0].durationStart,
              durationEnd: 0,
              timeSpent: 0,
              type: 'target',
              promptCodesCount: {
                '2': 0,
                '4': 0,
                '8': 0,
              },
              key: `${item.date} ${targetName}`,
              children: [],
            })
            iterateBlocks(tempTable, tempTable.length - 1, sessionTotal, item)
          } else if (tarExist) {
            // old target
            iterateTrials(tarIdx, tempTable, sessionTotal, item)
          } else {
            // New target
            tempTable.push({
              date: item.date,
              target: targetName,
              correct: 0,
              incorrect: 0,
              prompt: 0,
              noResponse: 0,
              total: 0,
              durationStart: item.trials[0].durationStart,
              durationEnd: item.trials[item.trials.length - 1].durationEnd,
              timeSpent: 0,
              type: 'target',
              promptCodesCount: {
                'Gestural Prompt': 0,
                'Textual Prompt': 0,
                'Verbal Prompt': 0,
                'Physical Prompt': 0,
                None: 0,
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

      setTableData(tempTable)
    }
  }, [data])

  const generateGraphData = row => {
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
    setPromptGraphKeys(promptKeys.reverse())
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
        let tempColor = COLORS.target
        if (row.type === 'sd') {
          tempColor = COLORS.stimulus
        } else if (row.type === 'step') {
          tempColor = COLORS.steps
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
    },
    {
      title: 'Action',
      render: (text, row) => {
        return (
          <span>
            <Button type="link" onClick={() => generateGraphData(row)}>
              <LineChartOutlined style={{ fontSize: 26, color: COLORS.graph }} />
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
      if (reportType === 'Block') {
        const filename = `${studentName?.trim()}_tar_resBlock_report`
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
        width={DRAWER.widthL2}
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
        width={DRAWER.widthL2}
        title={`${currentRow?.date} ${
          currentRow?.type === 'target'
            ? ': Target - '
            : currentRow?.type === 'sd'
            ? ': Stimulus - '
            : currentRow?.type === 'step'
            ? ': Step - '
            : ''
        } ${currentRow?.target}`}
      >
        <div style={{ height: 550, marginBottom: 20 }}>
          <ResponsiveBar
            data={promptBarGraphData}
            keys={promptGraphKeys}
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
                translateY: promptGraphKeys?.length > 6 ? 230 : 160,
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

      {dataLoading || !tableData ? (
        <LoadingComponent />
      ) : (
        <div style={{ margin: '10px 0 10px 10px' }}>
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            className="target-response-report"
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
