/* eslint-disable no-plusplus */

import groupObj from '@hunters/group-object'
import { Button, Empty, Modal, Table } from 'antd'
import { gql } from 'apollo-boost'
import 'chartjs-plugin-annotation'
import * as FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import moment from 'moment'
import LoadingComponent from 'pages/staffProfile/LoadingComponent'
import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import _ from 'lodash'
import client from '../../apollo/config'

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

class FrequencyDurationGraph extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        datasets: [
          {
            label: 'Frequency ',
            type: 'line',
            fill: false,
            borderColor: '#EC932F',
            backgroundColor: '#EC932F',
            pointBorderColor: '#EC932F',
            pointBackgroundColor: '#EC932F',
            pointHoverBackgroundColor: '#EC932F',
            pointHoverBorderColor: '#EC932F',
            lineTension: 0,
            yAxisID: 'y-axis-2',
          },
          {
            type: 'bar',
            label: 'Duration ',
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
              id: 'y-axis-2',
              gridLines: {
                display: true,
              },
              labels: {
                show: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Frequency',
              },
            },
            {
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-axis-1',
              gridLines: {
                display: false,
              },
              labels: {
                show: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Duration (in seconds)',
              },
            },
          ],
        },
      },
      frequencyGraphData: [],
      durationGraphData: [],
      durationGraphLabels: [],
      durationFrequencyTable: [],
      gridData: [],
      drilldownForChartData: null,
      isLoading: false,
    }
  }

  componentWillMount() {
    const { selectedBehavior, selectedStudentId } = this.props
    let { startDate, endDate } = this.props

    this.setState({ isLoading: true })

    startDate = moment(startDate).format('YYYY-MM-DD')
    endDate = moment(endDate).format('YYYY-MM-DD')
    if (selectedBehavior !== '') {
      client
        .query({
          query: gql`query{
								getDecelData(
										template:"${selectedBehavior}"
										date_Gte:"${startDate}", 
                    date_Lte: "${endDate}"
                    template_Student: "${selectedStudentId}"
								){
										intherapyDate
										edges{
												node{
														id,
														date,
														duration,
														template{
																id,
																behaviorDef,
                                behavior{
                                  id
                                  behaviorName
                                }
														},
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
          fetchPolicy: 'network-only',
        })
        .then(result => {
          console.log(result, 'result')
          const nodeLessData = []
          const durationGraphDataObj = []
          const durationGraphLabelsObj = []
          const frequencyGraphDataObj = []
          const durationFrequencyTableObj = []

          // For Main chart
          if (result.data.getDecelData.edges && result.data.getDecelData.edges.length > 0) {
            result.data.getDecelData.edges.forEach(item => {
              nodeLessData.push(item.node)
            })
            console.log(nodeLessData)
            const dateGroupData = groupObj.group(_.orderBy(nodeLessData, 'date'), 'date')
            const dates = Object.keys(dateGroupData)
            console.log(dateGroupData, 'group')
            for (let i = 0; i < dates.length; i++) {
              let count = 0
              const itemObj = {}
              let tempDuration = 0
              dateGroupData[dates[i]].forEach(item => {
                if (item.frequency.edges.length > 0 || item.duration) {
                  count += item.frequency.edges.length

                  if (item.duration) {
                    tempDuration += Number.isNaN(Math.round(item.duration / 1000))
                      ? 0
                      : Math.round(item.duration / 1000)
                  } else {
                    tempDuration += 0
                  }
                }
              })
              durationGraphLabelsObj.push(dates[i])
              frequencyGraphDataObj.push(count)
              durationGraphDataObj.push(tempDuration)
              itemObj.date = dates[i]
              itemObj.frequency = count
              itemObj.duration = tempDuration
              durationFrequencyTableObj.push(itemObj)
            }

            this.setState({
              durationGraphData: durationGraphDataObj,
              durationGraphLabels: durationGraphLabelsObj,
              frequencyGraphData: frequencyGraphDataObj,
              durationFrequencyTable: durationFrequencyTableObj,
              inTherapyDate: result.data.getDecelData.intherapyDate,
              isLoading: false,
            })
          } else {
            this.setState({
              durationGraphData: [],
              durationGraphLabels: [],
              frequencyGraphData: [],
              isLoading: false,
            })
          }

          // For Grid
          const allRows = []
          result.data.getDecelData.edges.forEach(({ node }) => {
            let mainRecord = allRows.find(x => x.date === node.date)
            if (!mainRecord) {
              mainRecord = {
                id: node.id,
                date: node.date,
                durationSum: 0,
                frequencyCount: 0,
                behaviorName: node.template.behavior.behaviorName,
                daywiseData: [],
              }

              allRows.push(mainRecord)
            }

            // Update values of mainRecord
            mainRecord.durationSum += Number(node.duration)
            mainRecord.frequencyCount += node.frequency.edges.length

            // Add Daywise Record
            mainRecord.daywiseData.push({
              id: node.id,
              date: node.date,
              duration: node.duration,
              frequencyCount: node.frequency.edges.length,
              behaviorName: node.template.behavior.behaviorName,
              frequencies: node.frequency.edges.map(({ node: { id, time, count } }) => ({
                id,
                time,
                count,
              })),
            })
          })
          this.setState({ gridData: _.orderBy(allRows, 'date') })
        })
    }
  }

  getGridColumns(isForNestedGrid) {
    if (isForNestedGrid)
      return [
        {
          title: 'Date',
          dataIndex: 'date',
        },
        {
          title: 'Behavior Name',
          dataIndex: 'behaviorName',
        },
        {
          title: 'Duration',
          dataIndex: 'duration',
          render: text => this.getDurationText(text),
          align: 'right',
        },
        {
          title: 'Frequency',
          dataIndex: 'frequencyCount',
          align: 'right',
        },
        {
          title: 'Drilldown',
          dataIndex: '',
          align: 'center',
          render: (text, record) => (
            <Button type="link" size="small" onClick={() => this.openDrilldownModal(record)}>
              View Drilldown
            </Button>
          ),
        },
      ]

    return [
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        title: 'Duration',
        dataIndex: 'durationSum',
        render: text => this.getDurationText(text),
        align: 'right',
      },
      {
        title: 'Frequency',
        dataIndex: 'frequencyCount',
        align: 'right',
      },
    ]
  }

  openDrilldownModal = record => {
    const { gridData } = this.state
    const dateRecord = gridData.find(x => x.date === record.date)
    const freqancyRecord = dateRecord.daywiseData.find(x => x.id === record.id)
    this.setState({ drilldownForChartData: freqancyRecord })
  }

  closeDrilldownModal = () => {
    this.setState({ drilldownForChartData: null })
  }

  getDurationText = miliseconds => {
    const duration = moment.duration(miliseconds)

    return (
      <div>
        <span className="valueText">{Number.isNaN(duration.hours()) ? 0 : duration.hours()}</span>
        <span className="labelText">H </span>
        <span className="valueText">
          {Number.isNaN(duration.minutes()) ? 0 : duration.minutes()}
        </span>
        <span className="labelText">M </span>
        <span className="valueText">
          {Number.isNaN(duration.seconds()) ? 0 : duration.seconds()}
        </span>
        <span className="labelText">S</span>
      </div>
    )
  }

  exportChart = studentName => {
    const input = document.getElementById('behaviorChart')
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPDF({
        orientation: 'l',
        format: 'a4',
      })
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
      pdf.save(`behavior_chart_${studentName}.pdf`)
    })
  }

  exportToCSV = studentName => {
    const filename = '_behavior_excel'
    const { durationFrequencyTable } = this.state
    const formattedData = durationFrequencyTable.map(e => ({
      Date: e.date,
      Duration: e.duration,
      frequency: e.frequency,
    }))

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  getExpandedRowRender = row => (
    <Table
      rowKey="id"
      dataSource={row.daywiseData}
      columns={this.getGridColumns(true)}
      bordered
      showHeader
      pagination={false}
      size="small"
    />
  )

  getDrildownChartData = () => {
    const { drilldownForChartData } = this.state
    const frequencies = drilldownForChartData.frequencies.map(x => x.count)
    const time = drilldownForChartData.frequencies.map(x => (x.time / 1000).toFixed(2))
    return {
      labels: time,
      datasets: [
        {
          label: 'Frequency',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointSize: 15,
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(75,192,192,1)',
          pointHoverBorderWidth: 5,
          pointRadius: 4,
          pointHitRadius: 0,
          data: frequencies,
        },
      ],
    }
  }

  render() {
    const {
      inTherapyDate,
      data,
      options,
      durationGraphData,
      durationGraphLabels,
      frequencyGraphData,
      drilldownForChartData,
      gridData,
      isLoading,
    } = this.state

    options.scales.xAxes[0].labels = durationGraphLabels
    let indexVal = -1

    if (durationGraphLabels) {
      indexVal = durationGraphLabels.indexOf(inTherapyDate)
    }

    options.annotation.annotations[0].value = indexVal
    data.datasets[0].data = frequencyGraphData
    data.datasets[1].data = durationGraphData

    const drillOptions = {
      tooltips: {
        mode: 'label',
      },
      scales: {
        xAxes: [
          {
            id: 'x-axis-0',
            display: true,
            // ticks: {
            //   suggestedMin: 0,
            //   suggestedMax: 20,
            // },
            scaleLabel: {
              display: true,
              labelString: 'Time (in seconds)',
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
            },
            display: true,
            id: 'y-axis-1',
            gridLines: {
              display: true,
            },
            labels: {
              show: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Frequency',
            },
          },
        ],
      },
    }

    return (
      <>
        {isLoading && <LoadingComponent />}
        {!isLoading && durationGraphLabels.length === 0 && (
          <Empty className="chart" style={{ padding: '50px' }} />
        )}
        {!isLoading && durationGraphLabels.length !== 0 && (
          <>
            <div className="chart" id="behaviorChart">
              <div className="panel">
                <Bar data={data} options={options} width={50} height={360} />
              </div>
            </div>
            <Table
              className="frequencyTable"
              rowKey="date"
              columns={this.getGridColumns()}
              dataSource={gridData}
              expandedRowRender={this.getExpandedRowRender}
              expandRowByClick
              pagination={{
                defaultPageSize: 25,
                position: 'top',
                showSizeChanger: true,
                pageSizeOptions: ['25', '50', '100', '250'],
              }}
              size="small"
              bordered
            />
          </>
        )}

        <Modal
          title="Drilldown"
          visible={!!drilldownForChartData}
          footer={null}
          width={800}
          height={400}
          onCancel={this.closeDrilldownModal}
        >
          {drilldownForChartData && (
            <Line options={drillOptions} data={this.getDrildownChartData()} />
          )}
        </Modal>
      </>
    )
  }
}

export default FrequencyDurationGraph
