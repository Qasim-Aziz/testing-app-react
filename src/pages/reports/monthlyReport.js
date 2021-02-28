/* eslint-disable  */
import React, { useState, useEffect } from 'react'
import {
  Layout,
  Row,
  Col,
  Button,
  Form,
  notification,
  Select,
  DatePicker,
  Empty,
  Input,
  Drawer,
} from 'antd'
import html2canvas from 'html2canvas'
import { gql } from 'graphql-tag'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import moment from 'moment'
import { ResponsivePie } from '@nivo/pie'
import groupObj from '@hunters/group-object'
import './table.scss'
import {
  STUDENT_QUERY,
  GOALS_DETAILS,
  GET_MAND_REPORT,
  GET_TEMPLATE_REPORT,
  GET_TARGET_DAILY_RESPONSE,
  DOMAIN,
} from './monthlyReport.query'
import BehaviorGraph from './monthlyBehaviorGraph'
import ReportPdf from './monthlyReportPdf'
import client from '../../apollo/config'
import { calculateAge } from '../../utilities'

const { RangePicker, MonthPicker } = DatePicker
const { TextArea } = Input

const filterCardStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: '10px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}
const parentLabel = { fontSize: '15px', color: '#000', marginRight: '6px' }

const dateFormat = 'YYYY-MM-DD'
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
function Goals({ selectedStudentId, studentName }) {
  const localStudentId = localStorage.getItem('studentId')
  const [learnerDetails, setLearnerDetails] = useState(null)
  const [goalsDetails, setGoalsDetails] = useState(null)
  const [overViewGraphData, setOverViewGraphData] = useState([])
  const [targetGraphData, setTargetGraphData] = useState({})
  const [mandGraphData, setMandGraphData] = useState([])
  const [progressivePieData, setProgrssivePieData] = useState(null)
  const [behaviorTemplates, setbehaviorTemplates] = useState([])
  const [loadingPdf, setloadingPdf] = useState(false)
  const [textBoxObj, setTextBoxObj] = useState({
    progressOverview:
      "Progress Overview provides a snapshot of XYZ's development. Listed are the mastered and in- progress long term and short term goals with targets under each short term goal for this month.",
    goals: 'This section depicts the status of goals in therapy and mastered.',
    behaviour:
      'This section shows the maladaptive behaviours that XYZ engages in and the graphical representation of these behaviours. ',
    mand:
      'This section depicts the number and frequency of mands - requests XYZ has acquired over the month.',
  })
  const [pdfDrawer, setPdfDrawer] = useState(false)
  const [goalsImages, setGoalsImages] = useState({})
  const [start, setStart] = useState(
    moment()
      .subtract(1, 'M')
      .startOf('M')
      .format('YYYY-MM-DD'),
  )
  const [end, setEnd] = useState(
    moment()
      .subtract(1, 'M')
      .endOf('M')
      .format('YYYY-MM-DD'),
  )
  const [pdfDataStatus, setPdfDataStatus] = useState({
    progress: false,
    goals: false,
    mand: false,
    behavior: false,
  })

  useEffect(() => {
    fetchStudentDetails(localStudentId)
    fetchStudentData(localStudentId)
  }, [])

  useEffect(() => {
    fetchStudentDetails(selectedStudentId)
    fetchStudentData(selectedStudentId)
  }, [selectedStudentId])

  useEffect(() => {
    fetchStudentData(localStudentId)
  }, [start])

  useEffect(() => {
    if (localStudentId && learnerDetails) {
      fetchProgressDetails(localStudentId)
    }
  }, [start, localStudentId, learnerDetails])

  const fetchStudentDetails = studentId => {
    // GET STUDENT DETAILS
    if (studentId) {
      client
        .query({
          query: STUDENT_QUERY,
          variables: {
            studentId,
          },
        })
        .then(result => {
          if (result && result.data) {
            setLearnerDetails(result.data.student)
          }
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })
    }
  }

  const fetchStudentData = studentId => {
    // GET GOALS DETAILS
    if (studentId) {
      client
        .query({
          query: GOALS_DETAILS,
          variables: {
            studentId,
            status: [
              'R29hbFN0YXR1c1R5cGU6Mg==',
              'R29hbFN0YXR1c1R5cGU6Mw==',
              'R29hbFN0YXR1c1R5cGU6NQ==',
              'R29hbFN0YXR1c1R5cGU6Ng==',
              'R29hbFN0YXR1c1R5cGU6NA==',
            ],
            start,
            end: moment().format(dateFormat),
          },
        })
        .then(result => {
          if (result && result.data) {
            let gData = []
            console.log(result.data, 'result goals Data')
            let targetGraphResponse = {}
            result.data.goalsLongProgressReport.map(item => {
              gData.push({ goal: item.goal.goalName, count: item.masteryDays })
            })

            result.data.goalsLongProgressReport.map(item =>
              item.goal.shorttermgoalSet.edges.map(shortItem =>
                shortItem.node.targetAllocateSet.edges.map(targetNode => {
                  // console.log(targetNode.node.targetStatus.statusName, 'dfhdkgjdfgdfg')
                  // if (
                  //   targetNode.node.targetStatus.statusName === 'Mastered' ||
                  //   targetNode.node.targetStatus.statusName === 'In-Therapy'
                  // ) {
                  generateGraph(targetNode.node.id)
                  // }
                }),
              ),
            ),
              setGoalsDetails(result.data.goalsLongProgressReport)
            setOverViewGraphData(gData)
          }
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })

      // GET MAND REPORT DETAILS
      client
        .query({
          query: GET_MAND_REPORT,
          variables: {
            studentId,
            start,
            end,
          },
        })
        .then(result => {
          if (result && result.data) {
            const mandGData = []
            result.data.mandReport.map(mandItem => {
              const gData = []
              mandItem.data.map(dateItem => {
                gData.push({ x: moment(dateItem.formattedDate).format('DD'), y: dateItem.count })
              })
              mandGData.push({ id: mandItem.measurments, data: gData })
            })
            setMandGraphData(mandGData)
          }
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })

      // GET BEHAVIOR TEMPLATES
      client
        .query({
          query: GET_TEMPLATE_REPORT,
          variables: {
            studentId,
            start,
            end,
          },
        })
        .then(result => {
          if (result && result.data) {
            setbehaviorTemplates(result.data.getTemplateForReports)
          }
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })
      // PROGRESS OVERVIEW
    }
  }

  const fetchProgressDetails = studentId => {
    const createdAt = moment(learnerDetails.createdAt).format(dateFormat)
    client
      .query({
        query: DOMAIN,
        variables: {
          studentId,
          createdAt,
          end,
        },
      })
      .then(result => {
        const domainData = []
        const data = []
        if (result.data.domainMastered.target) {
          result.data.domainMastered.target.map(item => {
            return domainData.push({
              domain: item.targetId ? item.targetId.domain.domain : 'Others',
              target: item.targetId ? item.targetId.domain.domain : 'Others',
            })
          })
          let groupedData = groupObj.group(domainData, 'domain')
          let keys = Object.keys(groupedData)
          for (let k = 0; k < keys.length; k++) {
            if (groupedData[keys[k]]?.length > 0) {
              data.push({
                id: keys[k],
                label: keys[k],
                value: groupedData[keys[k]].length,
              })
            }
          }
        }
        setProgrssivePieData(data)
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  const handleMonthChange = val => {
    if (val) {
      const month = moment(val, 'YYYY-MM-DD').format('YYYY-MM')
      const currentMonth = moment().format('YYYY-MM')
      if (month === currentMonth) {
        setStart(val.format('YYYY-MM-DD'))
        setEnd(moment().format('YYYY-MM-DD'))
      } else {
        setStart(val.format('YYYY-MM-DD'))
        setEnd(
          moment(val)
            .endOf('M')
            .format('YYYY-MM-DD'),
        )
      }
      setGoalsImages({})
      setPdfDataStatus({ progress: false, goals: false, mand: false, behavior: false })
    }
  }

  const generateGraph = targetId => {
    // GET TARGET DAILY RESPONSE
    const targetGData = []
    client
      .query({
        query: GET_TARGET_DAILY_RESPONSE,
        variables: {
          targetId,
          start,
          end,
        },
      })
      .then(result => {
        if (result && result.data) {
          let dataIsPresent = false
          result.data.getCorrectPercentage?.map(item => {
            if (item.correctPercent > 0) {
              dataIsPresent = true
            }
            targetGData.push({
              date: moment(item.date).format('DD'),
              percentage: item.correctPercent,
            })
          })
          setTargetGraphData(temp => {
            return {
              ...temp,
              [targetId]: { data: targetGData, status: dataIsPresent },
            }
          })
        }
      })
      .catch(error => console.log(error))
  }

  const generatePdf = () => {
    let tempPdfStatus = pdfDataStatus
    if (!pdfDataStatus.goals) {
      goalsDetails.map((item, itemIndex) => {
        item.goal.shorttermgoalSet.edges.map(shortItem => {
          shortItem.node.targetAllocateSet.edges.map(targetItem => {
            const element = document.getElementById(targetItem.node.id)
            if (element) {
              const ff = html2canvas(element).then(canvas => {
                return canvas.toDataURL('image/png')
              })
              ff.then(res => {
                setGoalsImages(temp => {
                  return {
                    ...temp,
                    [targetItem.node.id]: res,
                  }
                })
              })
            }
          })
        })
      })
      tempPdfStatus.goals = true
    }
    if (!pdfDataStatus.behavior) {
      behaviorTemplates.map(templateItem => {
        const element = document.getElementById(templateItem.template.id)
        if (element) {
          const ff = html2canvas(element).then(canvas => {
            return canvas.toDataURL('image/png')
          })
          ff.then(res => {
            setGoalsImages(temp => {
              return {
                ...temp,
                [templateItem.template.id]: res,
              }
            })
          })
        }
      })
      tempPdfStatus.behavior = true
    }
    if (!pdfDataStatus.mand) {
      let element = document.getElementById('mandGraph')
      if (element) {
        const ff = html2canvas(element).then(canvas => {
          return canvas.toDataURL('image/png')
        })
        ff.then(res => {
          setGoalsImages(temp => {
            return {
              ...temp,
              mandGraph: res,
            }
          })
        })
        tempPdfStatus.mand = true
      }
    }
    if (!pdfDataStatus.progress) {
      let element = document.getElementById('progressGraph')
      if (element) {
        const ff = html2canvas(element).then(canvas => {
          return canvas.toDataURL('image/png')
        })
        ff.then(res => {
          setGoalsImages(temp => {
            return {
              ...temp,
              progressGraph: res,
            }
          })
        })
        tempPdfStatus.progress = true
      }
    }
    setPdfDrawer(true)
    setPdfDataStatus(tempPdfStatus)
  }

  function disabledDate(current) {
    return current && current >= moment().endOf('M')
  }

  const handleTextbox = e => {
    let tempTextBox = textBoxObj
    tempTextBox[e.target.name] = e.target.value
    setTextBoxObj(tempTextBox)
  }

  console.log(overViewGraphData, 'goalsdetails')
  return (
    <div style={{ marginBottom: '100px' }}>
      <Row>
        <Col sm={24}>
          <div style={filterCardStyle}>
            <span style={{ float: 'left' }}>
              <span style={parentLabel}>Month: </span>
              <MonthPicker
                defaultValue={moment(start)}
                disabledDate={disabledDate}
                onChange={handleMonthChange}
              />
            </span>
            <Button
              loading={loadingPdf}
              onClick={() => {
                setloadingPdf(val => {
                  return !val
                })
                generatePdf()
              }}
            >
              Download Pdf{' '}
            </Button>
          </div>
        </Col>
        <Drawer
          title={`${studentName}'s Monthly report - ${
            monthNames[moment(start).format('MM') - 1]
          } ${moment(start).format('YYYY')}`}
          placement="right"
          closable="true"
          onClose={() => {
            setloadingPdf(false)
            setPdfDrawer(false)
          }}
          visible={pdfDrawer}
          width={1000}
        >
          <ReportPdf
            textBoxObj={textBoxObj}
            goalsDetails={goalsDetails}
            behaviorTemplates={behaviorTemplates}
            goalsImages={goalsImages}
            learnerDetails={learnerDetails}
            start={start}
          />
        </Drawer>

        <Col sm={24}>
          <div
            id="HTMLtoPDF"
            style={{
              border: '1px solid #f2f2f2',
              padding: 10,
              width: '850px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>
              Monthly Report
            </p>

            {learnerDetails && (
              <div>
                <p style={{ marginBottom: 0 }}>
                  Name:{' '}
                  <b>
                    {learnerDetails?.firstname} {learnerDetails?.lastname}
                  </b>
                </p>

                <p style={{ marginBottom: 0 }}>
                  DOB: <b>{learnerDetails?.dob}</b>
                </p>
                <p style={{ marginBottom: 0 }}>
                  Age: <b>{learnerDetails?.dob && calculateAge(learnerDetails?.dob)}</b>
                </p>
                <p style={{ marginBottom: 0 }}>
                  Location: <b>{learnerDetails?.currentAddress}</b>
                </p>

                <p style={{ marginBottom: 5 }}>
                  Month:{' '}
                  <b>
                    {monthNames[moment(start).format('MM') - 1]} {moment(start).format('YYYY')}
                  </b>
                </p>
              </div>
            )}

            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>
              Progress Overview
            </p>
            <TextArea
              name="progressOverview"
              defaultValue={textBoxObj['progressOverview']}
              onPressEnter={handleTextbox}
              onBlur={handleTextbox}
              rows={4}
              spellCheck={false}
              style={{ border: 'none' }}
            />
            <div
              role="presentation"
              id="progressGraph"
              style={{
                width: '100%',
                height: '250px',
              }}
            >
              {progressivePieData && progressivePieData.length === 0 ? (
                <>
                  <Empty style={{ margin: '80px auto' }} />
                </>
              ) : (
                ''
              )}
              {progressivePieData && (
                <ResponsivePie
                  data={progressivePieData}
                  margin={{ top: 30, right: 0, bottom: 50, left: 0 }}
                  innerRadius={0.5}
                  padAngle={2}
                  cornerRadius={3}
                  colors={{ scheme: 'paired' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  radialLabel={function(e) {
                    return e.label + ' (' + e.value + ')'
                  }}
                  radialLabelsSkipAngle={10}
                  radialLabelsTextXOffset={6}
                  radialLabelsTextColor="#333333"
                  radialLabelsLinkOffset={0}
                  radialLabelsLinkDiagonalLength={16}
                  radialLabelsLinkHorizontalLength={24}
                  radialLabelsLinkStrokeWidth={1}
                  radialLabelsLinkColor={{ from: 'color' }}
                  slicesLabelsSkipAngle={10}
                  slicesLabelsTextColor="#333333"
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
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
                      translateY: 10,
                      translateX: -1,
                      itemWidth: 100,
                      itemHeight: 25,
                      itemTextColor: '#999',
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
              )}
            </div>
            <hr />

            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>
              Goals Graph
            </p>

            <TextArea
              name="goals"
              defaultValue={textBoxObj['goals']}
              onPressEnter={handleTextbox}
              onBlur={handleTextbox}
              spellCheck={false}
              rows={4}
              style={{ border: 'none' }}
            />
            {overViewGraphData.length === 0 ? (
              <>
                <Empty style={{ margin: '80px auto' }} />
              </>
            ) : (
              <div style={{ height: 450 }}>
                <ResponsiveBar
                  data={overViewGraphData}
                  keys={['count']}
                  indexBy="goal"
                  margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={{ scheme: 'nivo' }}
                  defs={[
                    {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: '#38bcb2',
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: '#eed312',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  fill={[
                    {
                      match: {
                        id: 'fries',
                      },
                      id: 'dots',
                    },
                    {
                      match: {
                        id: 'sandwich',
                      },
                      id: 'lines',
                    },
                  ]}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Goals',
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
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
                />
              </div>
            )}

            {goalsDetails &&
              goalsDetails.map((item, itemIndex) => (
                <>
                  <div style={{ padding: 5, backgroundColor: '#f9f9f9' }}>
                    <p>
                      Long Term Goals {itemIndex + 1}: {item.goal.goalName}
                    </p>
                    <p>
                      Status: {item.goal.goalStatus.status}, Initiated Date:{' '}
                      {moment(item.goal.dateInitialted).format(dateFormat)}, Mastered Date:{' '}
                      {item.dateMastered}
                    </p>
                  </div>

                  <hr />
                  {item.goal.shorttermgoalSet.edges.map((shortItem, shortItemIdx) => (
                    <div style={{ paddingLeft: 20 }}>
                      <p>
                        Short Term Goals {itemIndex + 1}.{shortItemIdx + 1}:{' '}
                        {shortItem.node.goalName}
                      </p>
                      <p>
                        Status: {shortItem.node.goalStatus.status}, Initiated Date:{' '}
                        {moment(shortItem.node.dateInitialted).format(dateFormat)}, Mastered Date:{' '}
                        {shortItem.node.masterDate}
                      </p>
                      <hr />
                      {shortItem.node.targetAllocateSet.edges.map(targetItem => {
                        return (
                          <div style={{ paddingLeft: 20 }}>
                            {targetItem.node && (
                              <div>
                                <p>Target: {targetItem.node.targetAllcatedDetails?.targetName}</p>
                                <p>
                                  Status: {targetItem.node.targetStatus?.statusName}, Initiated
                                  Date:{' '}
                                  {moment(
                                    targetItem.node.targetAllcatedDetails?.dateBaseline,
                                  ).format(dateFormat)}
                                </p>
                                {targetGraphData[targetItem.node.id] ? (
                                  targetGraphData[targetItem.node.id].status ? (
                                    <div id={targetItem.node.id} style={{ height: 300 }}>
                                      <ResponsiveBar
                                        key={targetItem.node.id}
                                        data={
                                          targetGraphData[targetItem.node.id]
                                            ? targetGraphData[targetItem.node.id].data
                                            : []
                                        }
                                        keys={['percentage']}
                                        indexBy="date"
                                        margin={{ top: 15, right: 20, bottom: 50, left: 60 }}
                                        padding={0.3}
                                        valueScale={{ type: 'linear' }}
                                        indexScale={{ type: 'band', round: true }}
                                        colors={{ scheme: 'nivo' }}
                                        defs={[
                                          {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: '#38bcb2',
                                            size: 4,
                                            padding: 1,
                                            stagger: true,
                                          },
                                          {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: '#eed312',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10,
                                          },
                                        ]}
                                        fill={[
                                          {
                                            match: {
                                              id: 'fries',
                                            },
                                            id: 'dots',
                                          },
                                          {
                                            match: {
                                              id: 'sandwich',
                                            },
                                            id: 'lines',
                                          },
                                        ]}
                                        borderColor={{
                                          from: 'color',
                                          modifiers: [['darker', 1.6]],
                                        }}
                                        axisTop={null}
                                        axisRight={null}
                                        axisBottom={{
                                          tickSize: 5,
                                          tickPadding: 5,
                                          tickRotation: 0,
                                          legend: 'Dates',
                                          legendPosition: 'middle',
                                          legendOffset: 32,
                                        }}
                                        axisLeft={{
                                          tickSize: 5,
                                          tickPadding: 5,
                                          tickRotation: 0,
                                          legend: 'Percentage (%)',
                                          legendPosition: 'middle',
                                          legendOffset: -50,
                                        }}
                                        labelSkipWidth={12}
                                        labelSkipHeight={12}
                                        labelTextColor={{
                                          from: 'color',
                                          modifiers: [['darker', 1.6]],
                                        }}
                                        animate={true}
                                        motionStiffness={90}
                                        motionDamping={15}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        height: 60,
                                        fontWeight: 'bold',
                                        width: '100%',
                                        textAlign: 'center',
                                      }}
                                    />
                                  )
                                ) : null}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </>
              ))}
            <hr />

            <p style={{ textAlign: 'center', padding: 5, backgroundColor: '#f9f9f9' }}>
              Behaviour Report
            </p>
            <TextArea
              name="behaviour"
              defaultValue={textBoxObj['behaviour']}
              onPressEnter={handleTextbox}
              onBlur={handleTextbox}
              spellCheck={false}
              rows={4}
              style={{ border: 'none' }}
            />
            {behaviorTemplates.length === 0 ? (
              <div id="behaviorEmpty">
                <Empty style={{ margin: '80px auto' }} />
              </div>
            ) : (
              <div>
                {behaviorTemplates.map(templateItem => (
                  <>
                    <div id={templateItem.template.id} style={{ height: 300 }}>
                      {templateItem.template.behavior?.behaviorName}
                      <BehaviorGraph
                        key={templateItem.template.id}
                        startDate={start}
                        endDate={end}
                        selectedBehavior={templateItem.template.id}
                      />
                    </div>
                  </>
                ))}
              </div>
            )}

            <hr />

            <p
              style={{
                textAlign: 'center',
                padding: 5,
                backgroundColor: '#f9f9f9',
                marginTop: 20,
              }}
            >
              Mand Progress
            </p>
            <TextArea
              name="mand"
              defaultValue={textBoxObj['mand']}
              onPressEnter={handleTextbox}
              onBlur={handleTextbox}
              spellCheck={false}
              rows={4}
              style={{ border: 'none' }}
            />
            <div id="mandGraph">
              {mandGraphData.length === 0 ? (
                <>
                  <Empty style={{ margin: '80px auto' }} />
                </>
              ) : (
                <div style={{ height: 400 }}>
                  <ResponsiveLine
                    key="mand"
                    data={mandGraphData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto',
                      stacked: true,
                      reverse: false,
                    }}
                    yFormat=" >-.2f"
                    curve="cardinal"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: 'bottom',
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Date',
                      legendOffset: 36,
                      legendPosition: 'middle',
                    }}
                    axisLeft={{
                      orient: 'left',
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'count',
                      legendOffset: -40,
                      legendPosition: 'middle',
                    }}
                    colors={{ scheme: 'paired' }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 50,
                        itemsSpacing: 0,
                        itemDirection: 'right-to-left',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(Goals)
