import React, { Component } from 'react'

import { Line } from 'react-chartjs-2'

import { Row, Col, Button, Drawer, Modal, Table, DatePicker, Select } from 'antd'
import { LeftOutlined, ExportOutlined } from '@ant-design/icons'

import Moment from 'moment'
import domtoimage from 'dom-to-image'
import { jsPDF } from 'jspdf'
import { chartPointType, chartSessionPointsFields } from 'redux/celerationchart/chart.constant'

import AddUpdatePoint from './add-update-point.component'

import GraphConfig from './graph.config'

const { RangePicker } = DatePicker

const filterCardStyle = {
  background: '#F9F9F9',
  borderRadius: 10,
  padding: '10px',
  margin: '0 0 9px 10px',
  height: 50,
  overflow: 'hidden',
}

const cardStyle = {
  background: '#F9F9F9',
  height: 500,
  overflow: 'auto',
}

const antcol1 = {
  display: 'block',
  width: '6%',
}

class CelerationGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      point: {},
      pointIndex: 0,
      open: false,
      pointsDrawer: false,
      behaviorTypes: [],
    }
  }

  componentDidMount() {
    const { chart } = this.props

    if (chart.category.name === 'Behaviour' && chart.points) {
      this.transformBehaviorTypes(chart.points)
    }
  }

  componentDidUpdate(prevProps) {
    const { chart } = this.props
    if (
      chart.category.name === 'Behaviour' &&
      chart.points &&
      chart.points !== prevProps.chart.points
    ) {
      this.transformBehaviorTypes(chart.points)
    }
  }

  transformBehaviorTypes(points) {
    this.setState({ behaviorTypes: [...new Set(points.map(p => p.behaviour))] })
  }

  render() {
    const { Option } = Select

    const { point, pointIndex, open, pointsDrawer, behaviorTypes } = this.state
    const { chart, behaviorTypesSelected } = this.props
    const {
      addPoint,
      updatePoint,
      onCelerationChartChange,
      onBehaviorTypesChange,
      resetCelerationChartAction,
    } = this.props

    /**
     * Filters the input array based on the chart point type.
     * Then, maps it to only x and y values to be shown on the chart.
     * @param {*} array
     * @param {*} pointType
     * @param {*} onlyTime
     */
    const getDataPointsOnChart = (chartSelected, pointType, onlyTime) => {
      if (!chartSelected.points) {
        return []
      }

      let type
      let list

      switch (chartSelected.category.name) {
        case 'Session': {
          type = chartSessionPointsFields[pointType]
          list = chartSelected.points.filter(p => p[type] > 0)

          return sortedPoints(
            list.map(p => {
              const startDate = Moment(chartSelected.startDate)
              const latestDate = Moment(p.date)
              const diff = startDate.diff(latestDate, 'days')
              return {
                x: diff,
                y: p[type],
              }
            }),
          )
        }

        case 'Behaviour':
          list = chartSelected.points.filter(p => p.frequency > 0)

          if (behaviorTypesSelected.length > pointType) {
            list = list.filter(p => p.behaviour === behaviorTypesSelected[pointType])
          } else {
            return []
          }

          return sortedPoints(
            list.map(p => {
              return {
                x: p.day,
                y: p.frequency,
              }
            }),
          )

        default:
          return sortedPoints(
            chartSelected.points
              .filter(p => p.dataType === pointType)
              .map(p => {
                return {
                  x: p.day,
                  y: onlyTime ? 1 / p.time : p.count / p.time,
                }
              }),
          )
      }
    }

    const pointTypeInternalToExternal = value => {
      switch (value) {
        case 0:
          return 'Correct'
        case 1:
          return 'Incorrect'
        case 2:
          return 'Prompt'
        default:
          return ''
      }
    }

    const dataColumnsOthers = [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: 'Type',
        dataIndex: 'dataType',
        key: 'dataType',
        render: value => pointTypeInternalToExternal(value),
      },
    ]
    const dataColumnsSession = [
      {
        title: 'Correct',
        dataIndex: 'correct',
        key: 'correct',
      },
      {
        title: 'Incorrect',
        dataIndex: 'error',
        key: 'error',
      },
      {
        title: 'Prompt',
        dataIndex: 'prompt',
        key: 'prompt',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
    ]
    const dataColumnsBehavior = [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
      },
      {
        title: 'Count',
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: 'Type',
        dataIndex: 'behaviour',
        key: 'behaviour',
      },
    ]

    // define data of the chart component used from react-chartjs-2
    const data = {
      labels: ['line'],
      datasets: [
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type1} - Count/Minute`,
          pointStyle: 'circle',
          borderColor: '#6f6f73',
          data: getDataPointsOnChart(chart, chartPointType[0], false),
        },
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type1} - Minute`,
          pointStyle: 'dash',
          borderColor: '#6f6f73',
          showLine: false,
          data: getDataPointsOnChart(chart, chartPointType[0], true),
        },
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type2} - Count/Minute`,
          pointStyle: 'crossRot',
          borderColor: '#700723',
          data: getDataPointsOnChart(chart, chartPointType[1], false),
        },
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type2} - Minute`,
          pointStyle: 'dash',
          borderColor: '#700723',
          showLine: false,
          data: getDataPointsOnChart(chart, chartPointType[1], true),
        },
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type3} - Count/Minute`,
          pointStyle: 'triangle',
          borderColor: '#62c722',
          data: getDataPointsOnChart(chart, chartPointType[2], false),
        },
        {
          ...GraphConfig.dataset,
          label: `${chart.pointsTypeLables.type3} - Minute`,
          pointStyle: 'dash',
          borderColor: '#62c722',
          showLine: false,
          data: getDataPointsOnChart(chart, chartPointType[2], true),
        },
      ],
    }

    const storePoint = (pointFoundInSameColumn, newX, newY) => {
      this.setState({
        point: {
          ...pointFoundInSameColumn,
          day: newX,
          count: Math.round(10 ** (newY / 142.86 - 4) * 10) / 10,
        },
      })
      this.setState({ pointIndex: chart.points.findIndex(p => p === pointFoundInSameColumn) })
    }

    /**
     * Sort given points according to the x-value (days)
     * @param {*} points
     */
    function sortedPoints(points) {
      if (!points) {
        return []
      }
      return points.sort((a, b) => {
        return a.x - b.x
      })
    }

    const options = {
      // onClick action on the graph
      onClick(event, element) {
        if (viewMode) {
          return
        }

        /*
         * 1. calculate x and y of clicked point
         */

        const yTop = this.chart.chartArea.top
        const yBottom = this.chart.chartArea.bottom

        const yMin = this.chart.scales['y-axis-primary'].min
        const yMax = this.chart.scales['y-axis-primary'].max
        let newY = 0

        if (event.offsetY <= yBottom && event.offsetY >= yTop) {
          newY = Math.abs((event.offsetY - yTop) / (yBottom - yTop))
          newY = (newY - 1) * -1
          newY = newY * Math.abs(yMax - yMin) + yMin
        }

        const xTop = this.chart.chartArea.left
        const xBottom = this.chart.chartArea.right
        const xMin = this.chart.scales['x-axis-primary'].min
        const xMax = this.chart.scales['x-axis-primary'].max
        let newX = 0

        if (event.offsetX <= xBottom && event.offsetX >= xTop) {
          newX = Math.abs((event.offsetX - xTop) / (xBottom - xTop))
          newX = newX * Math.abs(xMax - xMin) + xMin
        }

        // x-axis represents date values so it has to be rounded to the nearest integer
        newX = Math.round(newX)

        // y-axis represents rounded to 1 decimal point
        newY = Math.round(newY * 10) / 10

        /*
         * 2. check all points that have the same x-axis value as the clicked point (same column on graph).
         * If found, the point found need to be updated because there can't be more than one point in the same column.
         */
        const pointFoundInSameColumn = chart.points.find(p => p.day === newX)

        // y-axis is logarithmic, but the value is read as linear so we need to apply the following equation to map it
        storePoint(pointFoundInSameColumn, newX, newY)

        /*
         * 3. open dialog for the user to add/update point
         */
        handleClickOpen()
      },
      scales: {
        xAxes: [
          {
            display: true,
            id: 'x-axis-primary',
            type: 'linear',
            position: 'bottom',
            gridLines: {
              color: 'rgba(75,192,192,1)',
            },
            scaleLabel: {
              display: true,
              labelString: 'SUCCESSIVE CALENDAR DAYS',
            },
            ticks: {
              min: 0,
              max: 140,
              stepSize: 7,
              callback(value, index, values) {
                if (value === 0) {
                  return `${Moment(chart.date).format('YYYY-MM-DD')} / ${value}`
                }
                if (value === 140) {
                  const date = new Date(chart.date)
                  date.setDate(date.getDate() + 140)
                  return `${Moment(date).format('YYYY-MM-DD')} / ${value}`
                }
                return value
              },
            },
          },

          {
            display: true,
            id: 'x-axis-secondary',
            type: 'linear',
            position: 'top',
            gridLines: {
              color: 'rgba(75,192,192,1)',
            },
            scaleLabel: {
              display: true,
              labelString: 'SUCCESSIVE CALENDAR WEEKS',
            },
            ticks: {
              min: 0,
              max: 20,
              stepSize: 4,
              callback(value, index, values) {
                const date = new Date(chart.date)
                date.setDate(date.getDate() + value * 7)
                return `${value} / ${Moment(date).format('YYYY-MM-DD')}`
              },
            },
          },
        ],
        yAxes: [
          {
            display: true,
            id: 'y-axis-primary',
            type: 'logarithmic',
            position: 'left',
            gridLines: {
              color: 'rgba(75,192,192,1)',
            },
            scaleLabel: {
              display: true,
              labelString: chart.yAxisLabel ? chart.yAxisLabel : 'COUNT PER MINUTE',
            },
            ticks: {
              min: 0.0001,
              max: 1000,
              callback(value, index, values) {
                return Number(value.toString())
              },
            },
            afterBuildTicks: GraphConfig.afterBuildTicks,
          },
          {
            display: true,
            id: 'y-axis-secondary',
            type: 'logarithmic',
            position: 'right',
            gridLines: {
              color: 'rgba(75,192,192,1)',
            },
            scaleLabel: {
              display: true,
              labelString: 'COUNTING TIMES',
            },
            ticks: {
              reverse: true,
              min: 0.001,
              max: 10000,
              callback(value, index, values) {
                return Number(value.toString())
              },
            },
            afterBuildTicks: GraphConfig.afterBuildTicks,
          },
        ],
      },
    }

    const handleClickOpen = () => {
      this.setState({ open: true })
    }

    const handleClose = () => {
      this.setState({ open: false })
    }

    const pointDrawerOpen = () => {
      this.setState({ pointsDrawer: true })
    }

    const pointDrawerClose = () => {
      this.setState({ pointsDrawer: false })
    }

    const exportChartPDF = e => {
      const input = window.document.getElementById('celeration-chart-parent')

      /* eslint new-cap: [0, {capIsNewExceptions: ["S"]}] */
      const pdf = new jsPDF('l', 'pt')
      if (pdf) {
        domtoimage.toPng(input).then(imgData => {
          pdf.addImage(imgData, 'PNG', 15, 110, 800, 350)
          pdf.save('download.pdf')
        })
      }
    }

    // whether to render component in view mode
    const viewMode = chart.category.name !== 'Others'

    return (
      <div>
        <br />

        <Row>
          <Col sm={24}>
            <Row>
              <Col span={26}>
                <div style={filterCardStyle}>
                  <div style={cardStyle}>
                    <Row>
                      <Col span={2}>
                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={resetCelerationChartAction}
                        >
                          <LeftOutlined />
                          Back
                        </Button>
                      </Col>
                      {chart.category.name !== 'Others' && (
                        <>
                          <Col span={1} style={antcol1}>
                            <span style={{ fontSize: '15px', color: '#000' }}>Date :</span>
                          </Col>
                          <Col span={4} style={{ width: 265 }}>
                            <RangePicker
                              value={chart.range}
                              onChange={e => onCelerationChartChange(e, 'range')}
                              size="default"
                              style={{
                                marginLeft: 'auto',
                                width: 250,
                                marginRight: 31,
                              }}
                            />
                          </Col>
                        </>
                      )}
                      <Col span={1} style={antcol1}>
                        {chart.category.name === 'Behaviour' ? (
                          <span style={{ fontSize: '15px', color: '#000' }}>Behaviour:</span>
                        ) : null}
                      </Col>
                      <Col span={8} style={{ marginRight: 10 }}>
                        {chart.category.name === 'Behaviour' ? (
                          <Col span={12}>
                            <Select
                              mode="multiple"
                              id="behaviorTypes"
                              placeholder="Behavior Types"
                              optionFilterProp="children"
                              size="small"
                              style={{
                                width: 180,
                                borderRadius: 4,
                                height: 35,
                                overflow: 'auto',
                              }}
                              value={behaviorTypesSelected}
                              onChange={value => {
                                onBehaviorTypesChange(value)
                              }}
                            >
                              {behaviorTypes.map(type => {
                                return (
                                  <Option key={type} value={type}>
                                    {type}
                                  </Option>
                                )
                              })}
                            </Select>
                          </Col>
                        ) : null}
                      </Col>
                      <Col span={4}>
                        <Button type="primary" htmlType="button" onClick={() => exportChartPDF()}>
                          <ExportOutlined />
                          Export to PDF
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <br />
        <div id="celeration-chart-parent">
          <h2>{chart.title}</h2>
          <Line data={data} options={options} />
        </div>

        {viewMode ? null : (
          <>
            <Modal
              title="Create A New Point"
              visible={open}
              onCancel={handleClose}
              footer={false}
              closable={false}
              afterClose={handleClose}
              destroyOnClose
            >
              <AddUpdatePoint
                chart={chart}
                addPoint={addPoint}
                updatePoint={updatePoint}
                handleClose={handleClose}
                pointInput={point}
                pointIndex={pointIndex}
              />
            </Modal>

            <Button type="primary" htmlType="button" onClick={pointDrawerOpen}>
              Add a New Point
            </Button>
          </>
        )}

        {chart.category.name === 'Others' ? (
          <Table dataSource={chart.points} columns={dataColumnsOthers} />
        ) : null}
        {chart.category.name === 'Session' ? (
          <Table dataSource={chart.points} columns={dataColumnsSession} />
        ) : null}
        {chart.category.name === 'Behaviour' ? (
          <Table dataSource={chart.points} columns={dataColumnsBehavior} />
        ) : null}

        <Drawer
          placement="right"
          width="40%"
          closable
          onClose={pointDrawerClose}
          visible={pointsDrawer}
          destroyOnClose
        >
          <div>
            <h2>Add a New Point</h2>
            <AddUpdatePoint chart={chart} addPoint={addPoint} />
          </div>
        </Drawer>
      </div>
    )
  }
}

export default CelerationGraph
