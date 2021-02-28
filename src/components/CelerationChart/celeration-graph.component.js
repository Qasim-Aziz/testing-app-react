import { ExportOutlined, LeftOutlined } from '@ant-design/icons'
import { Badge, Button, Col, DatePicker, Modal, Row, Select, Table, Icon, notification } from 'antd'
import domtoimage from 'dom-to-image'
import { jsPDF } from 'jspdf'
import moment from 'moment'
import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import _ from 'lodash'
import { chartPointType, chartSessionPointsFields } from 'redux/celerationchart/chart.constant'
import AddUpdatePoint from './add-update-point.component'
import GraphConfig from './graph.config'

const { RangePicker } = DatePicker
const { Option } = Select

class CelerationGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pointToAdd: {},
      pointToEdit: {},
      isAddOrEditModalOpen: false,
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
    const { pointToAdd, pointToEdit, isAddOrEditModalOpen, behaviorTypes } = this.state
    const {
      chart,
      behaviorTypesSelected,
      addPoint,
      updatePoint,
      onCelerationChartChange,
      onBehaviorTypesChange,
      resetCelerationChartAction,
    } = this.props
    const categoryName = chart.category.name

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
          list = groupDataForSessionType(chartSelected.points).filter(p => p[type] > 0)

          return sortedPoints(
            list.map(p => {
              const startDate = moment(chartSelected.startDate)
              const latestDate = moment(p.date)
              const diff = startDate.diff(latestDate, 'days')
              return {
                x: diff,
                y: p[type],
              }
            }),
          )
        }

        case 'Behaviour':
          list = groupDataForBehaviourType(chartSelected.points).filter(p => p.frequency > 0)

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
            groupDataForOtherType(chartSelected.points)
              .filter(p => p.dataType === pointType)
              .map(p => {
                return {
                  x: p.day,
                  y: (onlyTime ? 1 / p.time : p.count / p.time).toFixed(2),
                }
              }),
          )
      }
    }

    const renderPointTypeBadge = value => {
      switch (value) {
        case 0:
          return <Badge count={chart.pointsTypeLables.type1} style={{ background: '#52c41a' }} />
        case 1:
          return <Badge count={chart.pointsTypeLables.type2} />
        case 2:
          return <Badge count={chart.pointsTypeLables.type3} style={{ background: '#faad14' }} />
        default:
          return ''
      }
    }

    const groupDataForBehaviourType = flatData => {
      let records = []
      let index = 0
      if (flatData) {
        flatData.forEach(item => {
          let existingRecord = records.find(x => x.day === item.day && x.dataType === item.dataType)

          // If not exist then create Main Record
          if (!existingRecord) {
            existingRecord = {
              id: index++, // eslint-disable-line no-plusplus
              date: item.date,
              day: item.day,
              frequency: 0,
              time: 0,
              behaviour: item.behaviour,
              child: [],
            }
            records.push(existingRecord)
          }

          // Update Main Record
          existingRecord.frequency += item.frequency
          existingRecord.time += item.time

          // Create Child Record
          existingRecord.child.push({
            id: item.id,
            date: item.date,
            day: item.day,
            frequency: item.frequency,
            time: item.time ?? 0,
            behaviour: item.behaviour,
            countPerMinute: item.count / item.time ?? 0,
          })
        })
      }

      records = _.orderBy(records, ['date', 'behaviour'])

      return records
    }

    const groupDataForOtherType = flatData => {
      let records = []
      let index = 0
      if (flatData) {
        flatData.forEach(item => {
          let existingRecord = records.find(x => x.day === item.day && x.dataType === item.dataType)

          // If not exist then create Main Record
          if (!existingRecord) {
            existingRecord = {
              id: index++, // eslint-disable-line no-plusplus
              day: item.day,
              count: 0,
              time: 0,
              dataType: item.dataType,
              child: [],
            }
            records.push(existingRecord)
          }

          // Update Main Record
          existingRecord.count += item.count
          existingRecord.time += item.time

          // Create Child Record
          existingRecord.child.push({
            id: item.id,
            day: item.day,
            count: item.count,
            time: item.time,
            dataType: item.dataType,
            countPerMinute: item.count / item.time,
          })
        })
      }

      records = _.orderBy(records, ['day', 'dataType'])

      return records
    }

    const groupDataForSessionType = flatData => {
      const allData = []

      flatData.forEach(row => {
        let existingRecord = allData.find(x => x.date === row.date)
        if (!existingRecord) {
          existingRecord = {
            id: allData.length + 1,
            date: row.date,
            correct: 0,
            error: 0,
            prompt: 0,
            child: [],
          }

          allData.push(existingRecord)
        }

        existingRecord.correct += row.correct
        existingRecord.error += row.error
        existingRecord.prompt += row.prompt

        existingRecord.child.push({
          attempt: existingRecord.child.length + 1,
          correct: row.correct,
          error: row.error,
          prompt: row.prompt,
        })
      })

      return allData
    }

    // define data of the chart component used from react-chartjs-2
    const chartData = {
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

    const getDatesForChart = () => {
      let startDate = moment().startOf('week')
      let endDate = moment().endOf('week')

      if (chart.range) [startDate, endDate] = chart.range
      if (categoryName === 'Others')
        endDate = moment()
          .startOf('week')
          .add(49, 'days')

      const totalDays = moment.duration(endDate.diff(startDate)).asDays()

      console.log({
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        totalDays,
        totalWeeks: totalDays / 7,
      })

      return {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        totalDays,
        totalWeeks: totalDays / 7,
      }
    }

    const options = {
      onClick(event, element) {
        // Allow editing for Other type only
        if (viewMode) return

        // calculate x and y of clicked point
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

        const warningMsg =
          'Mutiple points were present for that date. ' +
          'For editing individual point open edit window from below grid.'

        // Find nodes for that day
        const nodesOnThatPoint = chart.points.filter(p => p.day === newX)
        if (nodesOnThatPoint.length === 0)
          openAddPointModal({
            day: newX,
            count: Math.round(10 ** (newY / 142.86 - 4) * 10) / 10,
          })
        else if (nodesOnThatPoint.length === 1) openEditPointModal(nodesOnThatPoint[0])
        else notification.warning({ message: warningMsg })
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
              labelString: chart.labelX ? chart.labelX : 'SUCCESSIVE CALENDAR DAYS',
            },
            ticks: {
              min: 0,
              max: getDatesForChart().totalDays,
              stepSize: 1,
              callback(value) {
                if (value === 0) {
                  return `${getDatesForChart().startDate} / ${value}`
                }
                if (value === getDatesForChart().totalDays) {
                  return `${getDatesForChart().endDate} / ${Math.ceil(value)}`
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
              max: getDatesForChart().totalWeeks,
              stepSize: 1,
              callback(value) {
                const date = new Date(getDatesForChart().startDate)
                date.setDate(date.getDate() + value * 7)
                return `${Math.ceil(value)} / ${moment(date).format('YYYY-MM-DD')}`
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
              labelString: chart.labelY ? chart.labelY : 'COUNT PER MINUTE',
            },
            ticks: {
              min: 0.0001,
              max: 1000,
              callback(value) {
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
              callback(value) {
                return Number(value.toString())
              },
            },
            afterBuildTicks: GraphConfig.afterBuildTicks,
          },
        ],
      },
    }

    const openAddPointModal = pointDetails => {
      this.setState({
        pointToAdd: pointDetails ?? {},
        pointToEdit: null,
        isAddOrEditModalOpen: true,
      })
    }

    const openEditPointModal = row => {
      this.setState({ pointToAdd: null, pointToEdit: row, isAddOrEditModalOpen: true })
    }

    const closeAddOrEditPointModal = () => {
      this.setState({ pointToAdd: null, pointToEdit: null, isAddOrEditModalOpen: false })
    }

    const exportChartPDF = () => {
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

    const getGridColumns = isForNestedGrid => {
      const columnsForSessionType = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Correct',
          dataIndex: 'correct',
          key: 'correct',
          align: 'right',
        },
        {
          title: 'Incorrect',
          dataIndex: 'error',
          key: 'error',
          align: 'right',
        },
        {
          title: 'Prompt',
          dataIndex: 'prompt',
          key: 'prompt',
          align: 'right',
        },
      ]

      const columnsForBehaviorType = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Count',
          dataIndex: 'frequency',
          key: 'frequency',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: 'Behavior Name',
          dataIndex: 'behaviour',
          key: 'behaviour',
        },
      ]

      const columnsForOtherType = [
        {
          title: 'Day',
          dataIndex: 'day',
          key: 'day',
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          align: 'right',
          render: value => value.toFixed(2),
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          align: 'right',
        },
        {
          title: 'Type',
          dataIndex: 'dataType',
          key: 'dataType',
          render: value => renderPointTypeBadge(value),
        },
      ]

      const columnsForNestedSessionType = [
        {
          title: 'Attempt',
          dataIndex: 'attempt',
          key: 'attempt',
        },
        {
          title: 'Correct',
          dataIndex: 'correct',
          key: 'correct',
          align: 'right',
        },
        {
          title: 'Incorrect',
          dataIndex: 'error',
          key: 'error',
          align: 'right',
        },
        {
          title: 'Prompt',
          dataIndex: 'prompt',
          key: 'prompt',
          align: 'right',
        },
      ]

      const columnsForNestedOtherType = [
        {
          title: 'Day',
          dataIndex: 'day',
          key: 'day',
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          align: 'right',
          render: value => value.toFixed(2),
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          align: 'right',
        },
        {
          title: 'Count/Minute',
          dataIndex: 'countPerMinute',
          key: 'countPerMinute',
          align: 'right',
          render: value => value.toFixed(2),
        },
        {
          title: 'Type',
          dataIndex: 'dataType',
          key: 'dataType',
          render: value => renderPointTypeBadge(value),
        },
        {
          title: 'Action',
          key: 'operation',
          render: row => (
            <Button type="link" icon="edit" onClick={() => openEditPointModal(row)}>
              Edit
            </Button>
          ),
          align: 'center',
        },
      ]

      const columnsForNestedBehaviorType = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
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
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: 'Behavior Name',
          dataIndex: 'behaviour',
          key: 'behaviour',
        },
      ]

      if (isForNestedGrid) {
        if (categoryName === 'Others') return columnsForNestedOtherType
        if (categoryName === 'Session') return columnsForNestedSessionType
        if (categoryName === 'Behaviour') return columnsForNestedBehaviorType
      }

      if (categoryName === 'Others') return columnsForOtherType
      if (categoryName === 'Session') return columnsForSessionType
      if (categoryName === 'Behaviour') return columnsForBehaviorType
      return []
    }

    const getGridDataSource = () => {
      if (categoryName === 'Session') return groupDataForSessionType(chart.points)
      if (categoryName === 'Others') return groupDataForOtherType(chart.points)
      if (categoryName === 'Behaviour') return groupDataForBehaviourType(chart.points)
      return []
    }

    // whether to render component in view mode
    const viewMode = categoryName !== 'Others'

    // Generate list of columns based on type of grid

    const expandedRowRender = row => (
      <Table
        rowKey="id"
        dataSource={row.child}
        columns={getGridColumns(true)}
        bordered
        showHeader
        pagination={false}
        size="small"
      />
    )

    return (
      <>
        <Row className="filterCard">
          {/* Back button */}
          <Col span={2}>
            <Button type="primary" htmlType="button" onClick={resetCelerationChartAction}>
              <LeftOutlined />
              Back
            </Button>
          </Col>

          {/* Date - Date picker */}
          {categoryName !== 'Others' && (
            <>
              <Col span={1} offset={1}>
                <span className="label">Date:</span>
              </Col>
              <Col span={7}>
                <RangePicker
                  value={chart.range}
                  onChange={e => onCelerationChartChange(e, 'range')}
                  size="default"
                  className="datePaicker"
                />
              </Col>
            </>
          )}

          {/* Behaviour - Picker */}
          {categoryName === 'Behaviour' && (
            <>
              <Col span={2}>
                <span className="label">Behaviour:</span>
              </Col>
              <Col span={4}>
                <Select
                  mode="multiple"
                  placeholder="Behavior Types"
                  optionFilterProp="children"
                  style={{
                    width: 180,
                    borderRadius: 4,
                    overflow: 'auto',
                  }}
                  value={behaviorTypesSelected}
                  onChange={value => onBehaviorTypesChange(value)}
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
            </>
          )}

          {/* Export to PDF */}
          <Col span={4} style={{ float: 'right' }}>
            <Button
              type="primary"
              htmlType="button"
              onClick={exportChartPDF}
              style={{ float: 'right' }}
            >
              <ExportOutlined />
              Export to PDF
            </Button>
          </Col>
        </Row>

        <div id="celeration-chart-parent">
          <h2 style={{ textAlign: 'center', margin: '10px' }}>{chart.title}</h2>
          <div style={{ margin: '10px', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.5)' }}>
            <Line data={chartData} options={options} />
          </div>
        </div>

        {!viewMode && (
          <Row>
            <Col span={4} offset={20}>
              <div style={{ margin: '10px', float: 'right' }}>
                <Button type="primary" htmlType="button" onClick={openAddPointModal}>
                  Add a New Point
                </Button>
              </div>
            </Col>
          </Row>
        )}

        <Table
          dataSource={getGridDataSource()}
          columns={getGridColumns()}
          expandedRowRender={expandedRowRender}
          expandRowByClick
          rowKey="id"
          bordered
          size="small"
          style={{ margin: '10px' }}
        />

        {/* Add/Update Model */}
        <Modal
          title={pointToEdit ? 'Update Point' : ' Create A New Point'}
          visible={isAddOrEditModalOpen}
          onCancel={closeAddOrEditPointModal}
          footer={false}
          closable
          destroyOnClose
        >
          <AddUpdatePoint
            chart={chart}
            addPointAction={addPoint}
            updatePointAction={updatePoint}
            pointToEdit={pointToEdit}
            pointToAdd={pointToAdd}
            onClose={closeAddOrEditPointModal}
          />
        </Modal>
      </>
    )
  }
}

export default CelerationGraph
