/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable-next-line react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import {
  Table,
  Button,
  notification,
  Form,
  Select,
  DatePicker,
  Drawer,
  Menu,
  Radio,
  Dropdown,
  Row,
} from 'antd'
import gql from 'graphql-tag'
import { usePrevious } from 'react-delta'
import { ResponsivePie } from '@nivo/pie'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { LineChartOutlined } from '@ant-design/icons'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import SessionReportPdf from './sessionReportPdf'
import {
  SESSIONS_SUMMERY,
  GET_MAND,
  SESSION_TOILET_DATA,
  DECEL_DATA,
  SESSION_DATA,
  FREQUENCY_DIS_TARGET,
} from './query'
import './form.scss'
import './table.scss'

const { RangePicker } = DatePicker

const filterCardStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: COLORS.palleteLight,
}

const parentDiv = { display: 'flex', margin: 'auto 30px auto 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

export default Form.create()(({ studentName, showDrawerFilter }) => {
  const [selectSession, setSelectSession] = useState()
  const [range, setRange] = useState([moment().subtract(10, 'd'), moment(Date.now())])
  const [session, setSession] = useState('Morning')
  const studentId = localStorage.getItem('studentId')
  const prevSelectSession = usePrevious(selectSession)
  const [lineDrawer, setLineDrawer] = useState(false)
  const [tableData, setTableData] = useState([])
  const [barGraphData, setBarGraphData] = useState([])
  const [currentRow, setCurrentRow] = useState(null)
  const [reportPdfDrawer, setReportPdfDrawer] = useState(false)

  const [selectSessionId, setSelectSessionId] = useState()

  function compare(a, b) {
    if (a.sessionDate < b.sessionDate) {
      return -1
    }
    if (a.sessionDate > b.sessionDate) {
      return 1
    }
    return 0
  }

  // const { data, error, loading } = useQuery(SESSIONS_SUMMERY, {
  //   variables: {
  //     studentId,
  //     startDate: moment(range[0]).format('YYYY-MM-DD'),
  //     endDate: moment(range[1]).format('YYYY-MM-DD'),
  //   },
  // })

  const { data: dt, error: er, loading: ld } = useQuery(SESSION_DATA, {
    variables: {
      targets_StudentId: JSON.parse(studentId),
      date_Gte: moment(range[0]).format('YYYY-MM-DD'),
      date_Lte: moment(range[1]).format('YYYY-MM-DD'),
    },
  })
  const { data: decel, error: decelError, loading: decelLoading } = useQuery(DECEL_DATA, {
    variables: {
      targets_StudentId: JSON.parse(studentId),
      date_Gte: moment(range[0]).format('YYYY-MM-DD'),
      date_Lte: moment(range[1]).format('YYYY-MM-DD'),
    },
  })
  const { data: mand, error: mandError, loading: mandLoading } = useQuery(GET_MAND, {
    variables: {
      targets_StudentId: JSON.parse(studentId),
      date_Gte: moment(range[0]).format('YYYY-MM-DD'),
      date_Lte: moment(range[1]).format('YYYY-MM-DD'),
    },
  })
  const { data: toilet, error: toiletError, loading: toiletLoading } = useQuery(
    SESSION_TOILET_DATA,
    {
      variables: {
        targets_StudentId: JSON.parse(studentId),
        date_Gte: moment(range[0]).format('YYYY-MM-DD'),
        date_Lte: moment(range[1]).format('YYYY-MM-DD'),
      },
    },
  )

  useEffect(() => {
    const tempTable = []
    if (dt && toilet && mand && decel && session !== 'All') {
      dt.getSessionDataRecording.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.ChildSession.sessionDate
        const sessionObj = node.ChildSession.sessions.sessionName
        if (sessionObj.name === session) {
          for (let i = 0; i < tempTable.length; i++) {
            if (tempTable[i].sessionDate === objDate) {
              exist = true
              objIdx = i
              break
            }
          }
          if (exist) {
            tempTable[objIdx] = {
              ...tempTable[objIdx],
              duration: tempTable[objIdx].duration + node.ChildSession.duration,
              correctCount: tempTable[objIdx].correctCount + node.sessionRecord.totalCorrect,
              promptCount: tempTable[objIdx].promptCount + node.sessionRecord.totalPrompt,
              errorCount:
                tempTable[objIdx].errorCount +
                node.sessionRecord.totalIncorrect +
                node.sessionRecord.totalNr,
              peakCorrect: tempTable[objIdx].peakCorrect + node.peak.totalCorrect,
              peakError: tempTable[objIdx].peakError + node.peak.totalError,
              peakPrompt: tempTable[objIdx].peakPrompt + node.peak.totalPrompt,
              peakEquCorrect: tempTable[objIdx].peakEquCorrect + node.peakEquivalance.totalCorrect,
              peakEquError: tempTable[objIdx].peakEquError + node.peakEquivalance.totalError,
              peakEquPrompt: tempTable[objIdx].peakEquPrompt + node.peakEquivalance.totalPrompt,
            }
          } else {
            tempTable.push({
              sessionDate: objDate,
              sessions: node.ChildSession.sessions,
              id: node.ChildSession.id,
              key: node.ChildSession.id,
              duration: node.ChildSession.duration,
              correctCount: node.sessionRecord.totalCorrect,
              promptCount: node.sessionRecord.totalPrompt,
              errorCount: node.sessionRecord.totalIncorrect + node.sessionRecord.totalNr,
              peakCorrect: node.peak.totalCorrect,
              peakError: node.peak.totalError,
              peakPrompt: node.peak.totalPrompt,
              peakEquCorrect: node.peakEquivalance.totalCorrect,
              peakEquError: node.peakEquivalance.totalError,
              peakEquPrompt: node.peakEquivalance.totalPrompt,
              behCount: 0,
              behaviour: {},
              mand: {},
              toilet: 'No',
              toiletCount: 0,
            })
          }
        }
      })

      toilet.getToiletData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        if (sessionObj?.sessionName.name === session) {
          for (let i = 0; i < tempTable.length; i++) {
            if (tempTable[i].sessionDate === objDate) {
              exist = true
              objIdx = i
              break
            }
          }

          if (exist) {
            tempTable[objIdx] = {
              ...tempTable[objIdx],
              toiletCount: tempTable[objIdx].toiletCount + 1,
            }
          }
        }
      })

      mand.getMandData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        if (sessionObj?.sessionName.name === session) {
          for (let i = 0; i < tempTable.length; i++) {
            if (tempTable[i].sessionDate === objDate) {
              exist = true
              objIdx = i
              break
            }
          }

          const dailyClick = node.dailyClick.measurments
          const data = node.data

          if (exist) {
            if (tempTable[objIdx].mand[dailyClick]) {
              tempTable[objIdx].mand[dailyClick] += data
            } else {
              tempTable[objIdx].mand = {
                ...tempTable[objIdx].mand,
                [dailyClick]: data,
              }
            }
          }
        }
      })

      decel.getDecelData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        if (sessionObj?.sessionName.name === session) {
          for (let i = 0; i < tempTable.length; i++) {
            if (tempTable[i].sessionDate === objDate) {
              exist = true
              objIdx = i
              break
            }
          }

          const behav = node.template.behavior?.behaviorName
          const duration = Number(node.duration)

          if (exist) {
            if (tempTable[objIdx].behaviour[behav]) {
              tempTable[objIdx].behaviour[behav] += duration
            } else {
              tempTable[objIdx].behaviour = {
                ...tempTable[objIdx].behaviour,
                [behav]: duration,
              }
            }
          }
        }
      })
    } else if (dt && mand && decel && toilet && session) {
      dt.getSessionDataRecording.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.ChildSession.sessionDate
        const sessionObj = node.ChildSession.sessions.sessionName
        for (let i = 0; i < tempTable.length; i++) {
          if (tempTable[i].sessionDate === objDate) {
            exist = true
            objIdx = i
            break
          }
        }
        if (exist) {
          tempTable[objIdx] = {
            ...tempTable[objIdx],
            duration: tempTable[objIdx].duration + node.ChildSession.duration,
            correctCount: tempTable[objIdx].correctCount + node.sessionRecord.totalCorrect,
            promptCount: tempTable[objIdx].promptCount + node.sessionRecord.totalPrompt,
            errorCount:
              tempTable[objIdx].errorCount +
              node.sessionRecord.totalIncorrect +
              node.sessionRecord.totalNr,
            peakCorrect: tempTable[objIdx].peakCorrect + node.peak.totalCorrect,
            peakError: tempTable[objIdx].peakError + node.peak.totalError,
            peakPrompt: tempTable[objIdx].peakPrompt + node.peak.totalPrompt,
            peakEquCorrect: tempTable[objIdx].peakEquCorrect + node.peakEquivalance.totalCorrect,
            peakEquError: tempTable[objIdx].peakEquError + node.peakEquivalance.totalError,
            peakEquPrompt: tempTable[objIdx].peakEquPrompt + node.peakEquivalance.totalPrompt,
          }
        } else {
          tempTable.push({
            sessionDate: objDate,
            sessions: node.ChildSession.sessions,
            id: node.ChildSession.id,
            key: node.ChildSession.id,
            duration: node.ChildSession.duration,
            correctCount: node.sessionRecord.totalCorrect,
            promptCount: node.sessionRecord.totalPrompt,
            errorCount: node.sessionRecord.totalIncorrect + node.sessionRecord.totalNr,
            peakCorrect: node.peak.totalCorrect,
            peakError: node.peak.totalError,
            peakPrompt: node.peak.totalPrompt,
            peakEquCorrect: node.peakEquivalance.totalCorrect,
            peakEquError: node.peakEquivalance.totalError,
            peakEquPrompt: node.peakEquivalance.totalPrompt,
            behCount: 0,
            behaviour: {},
            mand: {},
            toilet: 'No',
            toiletCount: 0,
          })
        }
      })

      toilet.getToiletData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        for (let i = 0; i < tempTable.length; i++) {
          if (tempTable[i].sessionDate === objDate) {
            exist = true
            objIdx = i
            break
          }
        }

        if (exist) {
          tempTable[objIdx] = {
            ...tempTable[objIdx],
            toiletCount: tempTable[objIdx].toiletCount + 1,
          }
        }
      })

      mand.getMandData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        for (let i = 0; i < tempTable.length; i++) {
          if (tempTable[i].sessionDate === objDate) {
            exist = true
            objIdx = i
            break
          }
        }

        const dailyClick = node.dailyClick.measurments
        const data = node.data

        if (exist) {
          if (tempTable[objIdx].mand[dailyClick]) {
            tempTable[objIdx].mand[dailyClick] += data
          } else {
            tempTable[objIdx].mand = {
              ...tempTable[objIdx].mand,
              [dailyClick]: data,
            }
          }
        }
      })

      decel.getDecelData.edges.map(({ node }) => {
        let exist = false
        let objIdx = -1
        const objDate = node.session?.sessionDate
        const sessionObj = node.session?.sessions
        for (let i = 0; i < tempTable.length; i++) {
          if (tempTable[i].sessionDate === objDate) {
            exist = true
            objIdx = i
            break
          }
        }

        const behav = node.template.behavior?.behaviorName
        const duration = Number(node.duration)

        if (exist) {
          if (tempTable[objIdx].behaviour[behav]) {
            tempTable[objIdx].behaviour[behav] += duration
          } else {
            tempTable[objIdx].behaviour = {
              ...tempTable[objIdx].behaviour,
              [behav]: duration,
            }
          }
        }
      })
    }
    tempTable.sort(compare)
    setTableData(tempTable)
  }, [dt, session])

  const [
    getFreDisTarget,
    { data: freDisData, error: freDisError, loading: freDisLoading },
  ] = useLazyQuery(FREQUENCY_DIS_TARGET)

  useEffect(() => {
    if (freDisData) {
      const newGraphData = []
      freDisData.freqDistriTarget.map(({ duration, tarCount }) => {
        newGraphData.push({
          x: duration,
          y: tarCount,
        })
      })
    }
  }, [freDisData])

  useEffect(() => {
    if (er) {
      notification.error({
        message: 'Error to load sessions summery data',
      })
    }
  }, [er])

  useEffect(() => {
    if (freDisError) {
      notification.error({
        message: 'Error to load graph data',
      })
    }
  }, [freDisError])

  useEffect(() => {
    if (selectSession && selectSession !== prevSelectSession) {
      getFreDisTarget({
        variables: {
          session: selectSession?.id,
          student: studentId,
        },
      })
      setLineDrawer(true)
    }
  }, [selectSession])

  const generateGraphData = row => {
    let total =
      row.correctCount +
      row.errorCount +
      row.promptCount +
      row.peakCorrect +
      row.peakError +
      row.peakPrompt +
      row.peakEquCorrect +
      row.peakEquPrompt +
      row.peakEquError

    total = total === 0 ? 1 : total

    const gData = []
    gData.push({
      id: 'Correct',
      key: Math.random(),
      label: ' Correct',
      value: Number.isNaN(row.correctCount) ? 0 : Math.round((row.correctCount * 100) / total),
    })
    gData.push({
      id: 'Incorrect',
      key: Math.random(),
      label: ' Incorrect',
      value: Number.isNaN(row.errorCount) ? 0 : Math.round((row.errorCount * 100) / total),
    })
    gData.push({
      id: 'Prompt',
      key: Math.random(),
      label: ' Prompt',
      value: Number.isNaN(row.promptCount) ? 0 : Math.round((row.promptCount * 100) / total),
    })
    gData.push({
      id: 'Peak Correct',
      key: Math.random(),
      label: 'Peak  Correct',
      value: Number.isNaN(row.peakCorrect) ? 0 : Math.round((row.peakCorrect * 100) / total),
    })
    gData.push({
      id: 'Peak Incorrect',
      key: Math.random(),
      label: 'Peak  Incorrect',
      value: Number.isNaN(row.peakError) ? 0 : Math.round((row.peakError * 100) / total),
    })
    gData.push({
      id: 'Peak Prompt',
      key: Math.random(),
      label: 'Peak  Prompt',
      value: Number.isNaN(row.peakPrompt) ? 0 : Math.round((row.peakPrompt * 100) / total),
    })
    gData.push({
      id: 'Equ Correct',
      key: Math.random(),
      label: 'Peak Equ  Correct',
      value: Number.isNaN(row.peakEquCorrect) ? 0 : Math.round((row.peakEquCorrect * 100) / total),
    })
    gData.push({
      id: 'Equ Incorrect',
      key: Math.random(),
      label: 'Peak Equ Incorrect',
      value: Number.isNaN(row.peakEquError) ? 0 : Math.round((row.peakEquError * 100) / total),
    })
    gData.push({
      id: 'Equ Prompt',
      key: Math.random(),
      label: 'Peak Equ  Prompt',
      value: Number.isNaN(row.peakEquPrompt) ? 0 : Math.round((row.peakEquPrompt * 100) / total),
    })

    setBarGraphData(gData)
    setCurrentRow(row)
    setLineDrawer(true)
  }

  function formatDuration(ms) {
    const duration = moment.duration(ms)
    let returnVal = ''
    if (duration.asHours() > 1) {
      returnVal =
        Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(':mm:ss')
    } else {
      returnVal = '00:'.concat(moment.utc(duration.asMilliseconds()).format('mm:ss'))
    }
    return returnVal
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = '_sessions_excel'
    const formattedData = tableData.map(function(e) {
      return {
        Date: e.sessionDate ? e.sessionDate : '',
        Session: e.sessions.sessionName.name,
        Duration_in_HH_MM_SS: formatDuration(e.duration),
        Total: getTotal(e),
        Percentage_Correct: Number.isNaN((e.correctCount * 100) / getTotal(e))
          ? 0
          : Math.round((e.correctCount * 100) / getTotal(e)),
        Percentage_Incorrect: Number.isNaN((e.errorCount * 100) / getTotal(e))
          ? 0
          : Math.round((e.errorCount * 100) / getTotal(e)),
        Percentage_Prompt: Number.isNaN((e.promptCount * 100) / getTotal(e))
          ? 0
          : Math.round((e.promptCount * 100) / getTotal(e)),
        Percentage_Peak_Correct: Number.isNaN((e.peakCorrect * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakCorrect * 100) / getTotal(e)),
        Percentage_Peak_Incorrect: Number.isNaN((e.peakError * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakError * 100) / getTotal(e)),
        Percentage_Peak_Prompt: Number.isNaN((e.peakPrompt * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakPrompt * 100) / getTotal(e)),
        Percentage_Equ_Correct: Number.isNaN((e.peakEquCorrect * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakEquCorrect * 100) / getTotal(e)),
        Percentage_Equ_Incorrect: Number.isNaN((e.peakEquError * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakEquError * 100) / getTotal(e)),
        Percentage_Equ_Prompt: Number.isNaN((e.peakEquPrompt * 100) / getTotal(e))
          ? 0
          : Math.round((e.peakEquPrompt * 100) / getTotal(e)),
        Behavior_count: e.behaviour,
        Mand_Count: 5,
        Toilet_Count: e.toilet,
      }
    })
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  const getTotal = row => {
    return (
      row.correctCount +
      row.errorCount +
      row.promptCount +
      row.peakCorrect +
      row.peakPrompt +
      row.peakError +
      row.peakEquCorrect +
      row.peakEquError +
      row.peakEquPrompt
    )
  }

  const setAndOpenPDFDrawer = id => {
    setSelectSessionId(id)
    setReportPdfDrawer(true)
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'sessionDate',
      width: '100px',
      render: (text, row) => <span>{row.sessionDate ? row.sessionDate : ''}</span>,
    },
    {
      title: 'Session',
      dataIndex: 'sessions',
      render: (text, row) => <span>{row.sessions?.sessionName.name}</span>,
      width: '100px',
    },
    {
      title: 'Duration (HH:MM:SS)',
      dataIndex: 'duration',
      width: '100px',
      render: (text, row) => <span>{formatDuration(row.duration)}</span>,
    },
    {
      title: 'Total Trials',
      width: '100px',
      align: 'center',
      render: (text, row) => <span>{getTotal(row)}</span>,
    },
    {
      title: 'Correct',
      dataIndex: 'correctCount',
      render: (text, row) => (
        <span>
          {row.correctCount} Trials - &nbsp;
          {Number.isNaN((row.correctCount * 100) / getTotal(row))
            ? 0
            : Math.round((row.correctCount * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Incorrect',
      dataIndex: 'errorCount',
      render: (text, row) => (
        <span>
          {row.errorCount} Trials - &nbsp;
          {Number.isNaN((row.errorCount * 100) / getTotal(row))
            ? 0
            : Math.round((row.errorCount * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Prompt',
      dataIndex: 'promptCount',
      render: (text, row) => (
        <span>
          {row.promptCount} Trials - &nbsp;
          {Number.isNaN((row.promptCount * 100) / getTotal(row))
            ? 0
            : Math.round((row.promptCount * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Correct',
      dataIndex: 'peakCorrect',
      render: (text, row) => (
        <span>
          {row.peakCorrect} Trials - &nbsp;
          {Number.isNaN((row.peakCorrect * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakCorrect * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Incorrect',
      dataIndex: 'peakError',
      render: (text, row) => (
        <span>
          {row.peakError} Trials - &nbsp;
          {Number.isNaN((row.peakError * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakError * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Prompt',
      dataIndex: 'peakPrompt',
      render: (text, row) => (
        <span>
          {row.peakPrompt} Trials - &nbsp;
          {Number.isNaN((row.peakPrompt * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakPrompt * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Equ Correct',
      dataIndex: 'peakEquCorrect',
      render: (text, row) => (
        <span>
          {row.peakEquCorrect} Trials - &nbsp;
          {Number.isNaN((row.peakEquCorrect * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakEquCorrect * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Equ Incorrect',
      dataIndex: 'peakEquError',
      width: 140,
      render: (text, row) => (
        <span>
          {row.peakEquError} Trials - &nbsp;
          {Number.isNaN((row.peakEquError * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakEquError * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Peak Equ Prompt',
      dataIndex: 'peakEquPrompt',
      render: (text, row) => (
        <span>
          {row.peakEquPrompt} Trials - &nbsp;
          {Number.isNaN((row.peakEquPrompt * 100) / getTotal(row))
            ? 0
            : Math.round((row.peakEquPrompt * 100) / getTotal(row))}
          %
        </span>
      ),
    },
    {
      title: 'Behavior',
      dataIndex: 'behaviour',
      render: behav => {
        if (Object.keys(behav).length === 0 && behav.constructor === Object) {
          return 'None'
        } else {
          return Object.entries(behav).map(item => {
            return (
              <div>
                <span>
                  {item[0]}: {Number(item[1] / 1000).toFixed(2)}
                </span>
              </div>
            )
          })
        }
      },
    },
    {
      title: 'Mand',
      dataIndex: 'mand',
      render: md => {
        if (Object.keys(md).length === 0 && md.constructor === Object) {
          return 'None'
        } else {
          return Object.entries(md).map(item => {
            return (
              <div>
                <span>
                  {item[0]}: {Number(item[1])}
                </span>
              </div>
            )
          })
        }
      },
    },
    {
      title: 'Toilet Count',
      dataIndex: 'toiletCount',
      align: 'center',
      width: 100,
    },
    {
      title: 'Actions',
      render: (text, row) => (
        <span>
          <Button
            type="link"
            onClick={() => generateGraphData(row)}
            loading={freDisLoading && selectSession.id === row.id}
          >
            <LineChartOutlined style={{ fontSize: 26, color: COLORS.graph }} />
          </Button>

          <Button type="link" onClick={() => setAndOpenPDFDrawer(row.id)}>
            PDF
          </Button>
        </span>
      ),
    },
  ]

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  console.log(tableData, 'tableDta')
  return (
    <div>
      <div style={filterCardStyle}>
        <div style={parentDiv}>
          <span style={parentLabel}>Date :</span>
          <RangePicker
            style={{
              marginLeft: 'auto',
              width: 250,
            }}
            size="default"
            value={range}
            onChange={v => setRange(v)}
          />
        </div>
        <div style={parentDiv}>
          <span style={parentLabel}>Session:</span>
          <Radio.Group
            size="small"
            value={session}
            onChange={v => setSession(v.target.value)}
            style={{ margin: 'auto 0' }}
            buttonStyle="solid"
          >
            <Radio.Button value="All">All</Radio.Button>
            <Radio.Button value="Morning">Morning</Radio.Button>
            <Radio.Button value="Afternoon">Afternoon</Radio.Button>
            <Radio.Button value="Evening">Evening</Radio.Button>
            <Radio.Button value="Default">Default</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={menu} trigger={['hover']}>
            <Button type="link" size="large" style={{ padding: '0 8px' }}>
              <FaDownload fontSize={22} />{' '}
            </Button>
          </Dropdown>
        </div>
      </div>
      {/* <Button onClick={() => setReportPdfDrawer(true)}>Click me</Button> */}
      <div style={{ margin: '10px 0 10px 10px' }} className="session-table">
        <Table
          columns={columns}
          dataSource={tableData}
          loading={ld || toiletLoading || decelLoading || mandLoading}
          bordered
          rowKey="id"
          scroll={{ x: 1950 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            position: 'top',
          }}
        />
      </div>

      <Drawer
        closable
        width="80%"
        title="Report Pdf"
        onClose={() => setReportPdfDrawer(false)}
        visible={reportPdfDrawer}
      >
        <SessionReportPdf selectSessionId={selectSessionId} />
      </Drawer>

      <Drawer
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={DRAWER.widthL2}
        title={`${currentRow?.sessionDate}: ${currentRow?.sessions.sessionName.name} Session - Response Percentage  Graph`}
      >
        <div style={{ height: 480, marginBottom: 0 }}>
          <ResponsivePie
            data={barGraphData}
            margin={{ top: 40, right: 100, bottom: 80, left: 20 }}
            innerRadius={0.5}
            padAngle={0.9}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={3}
            radialLabelsTextColor="#333333"
            radialLabelsLinkColor={{ from: 'color' }}
            sliceLabelsSkipAngle={2}
            sliceLabelsTextColor="#333333"
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            legends={[
              {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 70,
                translateY: 56,
                itemsSpacing: 7,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </Drawer>
    </div>
  )
})
