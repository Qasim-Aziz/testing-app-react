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
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Empty } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import groupObj from '@hunters/group-object'
import { gql } from 'apollo-boost'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'
import client from '../../apollo/config'

var moment = require('moment')

const { Title, Text } = Typography

var line = [
  {
    type: 'line',
    mode: 'vertical',

    // ???
    scaleID: 'y-axis-0',
    value: -20000,

    borderColor: '#2984c5',
    borderWidth: 1,
  },
]

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

class LeftArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      GraphData: [],
      heighestCount: 1,
      statusselected: null,
      data: {
        datasets: [
          {
            label: 'Frequency',
            type: 'line',
            fill: false,
            borderColor: '#EC932F',
            backgroundColor: '#EC932F',
            pointBorderColor: '#EC932F',
            pointBackgroundColor: '#EC932F',
            pointHoverBackgroundColor: '#EC932F',
            pointHoverBorderColor: '#EC932F',
            yAxisID: 'y-axis-2',
          },
          {
            type: 'bar',
            label: 'Duration(In seconds)',
            fill: false,
            backgroundColor: '#a6cee3',
            borderColor: '#a6cee3',
            hoverBackgroundColor: '#a6cee3',
            hoverBorderColor: '#a6cee3',
            yAxisID: 'y-axis-1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'label',
        },
        annotation: {
          annotations: [
            {
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: 1,
              borderWidth: 5,
              borderColor: 'red',
              label: {
                content: 'Status Change',
                enabled: true,
                position: 'top',
              },
            },
          ],
        },
        elements: {
          line: {
            fill: false,
          },
        },
        scales: {
          xAxes: [
            {
              id: 'x-axis-0',
              display: true,
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-axis-1',
              gridLines: {
                display: true,
              },
              labels: {
                show: true,
              },
            },
            {
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-axis-2',
              gridLines: {
                display: false,
              },
              labels: {
                show: true,
              },
            },
          ],
        },
      },
      frequencyGraphData: [],
      durationGraphData: [],
      durationGraphLabels: [],
      durationFrequencyTable: [],
    }
  }

  componentWillMount() {
    let { selectedBehavior, startDate, endDate } = this.props
    startDate = moment(startDate).format('YYYY-MM-DD')
    endDate = moment(endDate).format('YYYY-MM-DD')
    if (selectedBehavior !== '') {
      client
        .query({
          query: gql`query{
                getDecelData(
                    template:"${selectedBehavior}"
                    date_Gte:"${startDate}", date_Lte: "${endDate}"
                ){
                    intherapyDate
                    edges{
                        node{
                            statusname
                            id,
                            irt,
                            intensity,
                            note,
                            date,
                            duration,
                            intherapyOn
                            session{
                                id
                                sessionDate
                            }
                            template{
                                id,
                                intherapyOn,
                                behaviorDef,
                                behaviorDescription,
                            },
                            environment{
                                id,
                                name
                            },
                            status{
                                id,
                                statusName
                            }
                            frequency{
                                edges{
                                    node{
                                        id,
                                        count,
                                        time
                                    }
                                }
                            }
                        }
                    }
                }
            }
          `,
        })
        .then(result => {
          // console.log(result)
          const nodeLessData = []
          let durationGraphDataObj = []
          let durationGraphLabelsObj = []
          let frequencyGraphDataObj = []
          let durationFrequencyTableObj = []
          if (result.data.getDecelData.edges && result.data.getDecelData.edges.length > 0) {
            result.data.getDecelData.edges.map(item => {
              nodeLessData.push(item.node)
            })

            const dateGroupData = groupObj.group(nodeLessData, 'date')
            const dates = Object.keys(dateGroupData)
            for (let i = 0; i < dates.length; i++) {
              let count = 0
              let itemObj = {}
              dateGroupData[dates[i]].map(item => {
                if (item.frequency.edges.length > 0) {
                  count += item.frequency.edges.length
                }
                if (item.duration) {
                  durationGraphDataObj.push(
                    Number.isNaN(Math.round(item.duration / 1000))
                      ? 0
                      : Math.round(item.duration / 1000),
                  )
                  itemObj['duration'] = Number.isNaN(Math.round(item.duration / 1000))
                    ? 0
                    : Math.round(item.duration / 1000)
                } else {
                  durationGraphDataObj.push(0)
                  itemObj['duration'] = 0
                }
              })
              durationGraphLabelsObj.push(dates[i])
              itemObj['date'] = dates[i]
              frequencyGraphDataObj.push(count)
              itemObj['frequency'] = count
              durationFrequencyTableObj.push(itemObj)
            }

            this.setState({
              durationGraphData: durationGraphDataObj,
              durationGraphLabels: durationGraphLabelsObj,
              frequencyGraphData: frequencyGraphDataObj,
              durationFrequencyTable: durationFrequencyTableObj,
              inTherapyDate: result.data.getDecelData.intherapyDate,
            })
          } else {
            this.setState({
              durationGraphData: [],
              durationGraphLabels: [],
              frequencyGraphData: [],
            })
          }
          // console.log(baselineData)
        })
      // client
      //   .query({
      //     query: gql`query{
      //           getDecelData(
      //               template:"${selectedBehavior}"
      //               date_Gte:"${startDate}", date_Lte: "${endDate}"
      //           ){
      //               intherapyDate
      //               edges{
      //                   node{
      //                       statusname
      //                       id,
      //                       irt,
      //                       intensity,
      //                       note,
      //                       date,
      //                       duration,
      //                       intherapyOn
      //                       session{
      //                           id
      //                           sessionDate
      //                       }
      //                       template{
      //                           id,
      //                           behaviorDef,
      //                           behaviorDescription,
      //                       },
      //                       environment{
      //                           id,
      //                           name
      //                       },
      //                       status{
      //                           id,
      //                           statusName
      //                       }
      //                       frequency{
      //                           edges{
      //                               node{
      //                                   id,
      //                                   count,
      //                                   time
      //                               }
      //                           }
      //                       }
      //                   }
      //               }
      //           }
      //       }
      //     `,
      //   })
      //   .then(result => {
      //     // console.log(result)
      //     const nodeLessData = []
      //     const baselineData = []
      //     const frequencylineData = []
      //     const inTherapyData = []
      //     console.log("results ************")
      //     if(result.data.getDecelData.edges && result.data.getDecelData.edges.length>0){
      //       result.data.getDecelData.edges.map(item => {
      //         nodeLessData.push(item.node)
      //       })
      //       let groupedData = groupObj.group(nodeLessData, 'statusname')
      //       console.log('Grouped data', groupedData)

      //       const graphData = []
      //       if (groupedData.Baseline) {
      //         const baselineDateGroupData = groupObj.group(groupedData.Baseline, 'date')
      //         console.log(baselineDateGroupData)
      //         const baselineDates = Object.keys(baselineDateGroupData)
      //         console.log(baselineDates)
      //         for (let i = 0; i < baselineDates.length; i++) {
      //           let totalDuration = 0
      //           baselineDateGroupData[baselineDates[i]].map(item => {
      //             if (item.duration) {
      //               if (isNaN(parseInt(item.duration, 10))) {
      //                 totalDuration += 0
      //               } else {
      //                 totalDuration += parseInt(item.duration, 10)
      //               }
      //             }
      //           })
      //           baselineData.push({ x: baselineDates[i], y: totalDuration })
      //           frequencylineData.push({ x: baselineDates[i], y: i })
      //         }
      //       }

      //       if (groupedData['In-Therapy']) {
      //         const inTherapyDateGroupData = groupObj.group(groupedData['In-Therapy'], 'date')
      //         console.log(inTherapyDateGroupData)
      //         const inTherapyDates = Object.keys(inTherapyDateGroupData)
      //         console.log(inTherapyDates)
      //         for (let i = 0; i < inTherapyDates.length; i++) {
      //           let totalDuration = 0
      //           inTherapyDateGroupData[inTherapyDates[i]].map(item => {
      //             if (item.duration) {
      //               if (isNaN(parseInt(item.duration, 10))) {
      //                 totalDuration += 0
      //               } else {
      //                 totalDuration += parseInt(item.duration, 10)
      //               }
      //             }
      //           })
      //           inTherapyData.push({ x: inTherapyDates[i], y: totalDuration })
      //         }
      //       }
      //     }
      //     console.log(baselineData, inTherapyData)

      //     this.setState({
      //       GraphData: [
      //         {
      //           id: 'Baseline',
      //           color: 'hsl(2, 70%, 50%)',
      //           data: baselineData,
      //         },
      //         {
      //           id: 'In-Therapy',
      //           color: 'hsl(2, 70%, 50%)',
      //           data: inTherapyData,
      //         },
      //         {
      //           id: 'Frequency',
      //           color: 'hsl(2, 70%, 50%)',
      //           data: frequencylineData,
      //         }
      //       ],
      //       inTherapyDate: result.data.getDecelData.intherapyDate,
      //     })
      //     // console.log(baselineData)
      //   })
    }
  }

  exportToCSV = studentName => {
    const filename = '_behavior_excel'
    console.log('data', this.state.data)
    let formattedData = this.state.durationFrequencyTable.map(function(e) {
      return {
        Date: e.date,
        Duration: e.duration,
        frequency: e.frequency,
      }
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }
    let ctlabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    let lineData = [51, 65, 40, 49, 60, 37, 40]
    let barData = [200, 185, 590, 621, 250, 400, 95]

    const {
      GraphData,
      inTherapyDate,
      heighestCount,
      data,
      options,
      durationGraphData,
      durationGraphLabels,
      frequencyGraphData,
    } = this.state
    const { selectedBehavior } = this.props
    options.scales.xAxes[0].labels = durationGraphLabels
    let indexVal = -1
    if (durationGraphLabels) {
      indexVal = durationGraphLabels.indexOf(inTherapyDate)
    }
    options.annotation.annotations[0].value = indexVal
    data.datasets[0].data = frequencyGraphData
    data.datasets[1].data = durationGraphData
    return (
      <>
        <div
          role="presentation"
          style={{
            borderRadius: 10,
            border: '2px solid #F9F9F9',
            // padding: '28px 27px 20px',
            display: 'block',
            // marginLeft: '10px',
            width: '100%',
            height: '350px',
            // overflowY: 'auto'
          }}
        >
          {durationGraphLabels && durationGraphLabels.length === 0 ? (
            <>
              <Empty style={{ marginTop: '100px' }} />
            </>
          ) : (
            <Bar data={data} options={options} width="50px" height="60px" />
          )}
          {/* {GraphData && GraphData.length === 0 ? (
            <>
              <Empty style={{ marginTop: '100px' }} />
            </>
          ) : (
            ''
          )}
          {GraphData && (
            <ResponsiveLine
              data={GraphData}
              margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
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
                legend: 'duration',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              colors={{ scheme: 'nivo' }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={true}
              markers={
                inTherapyDate
                  ? [
                      {
                        axis: 'x',
                        value: inTherapyDate,
                        lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
                        legend: 'Status Change',
                      },
                    ]
                  : []
              }
            />
          )} */}
        </div>
      </>
    )
  }
}

export default LeftArea
