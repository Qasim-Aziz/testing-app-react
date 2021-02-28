/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable import/order */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable dot-notation */

import React from 'react'
import { Row, Col, Card, Input, Form, Select, Calendar, Collapse, Spin, Table } from 'antd'
import { Helmet } from 'react-helmet'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { gql } from 'apollo-boost'
import client from '../../../apollo/config'
import am4themes_frozen from '@amcharts/amcharts4/themes/frozen'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

const { Panel } = Collapse
const { Search } = Input

const layout = {
  labelCol: {
    span: 6,
  },
}

am4core.useTheme(am4themes_animated)

const columns = [
  {
    title: 'target Name',
    dataIndex: 'targetName',
    key: 'targetName',
  },
]

class Orders extends React.Component {
  state = {
    isLoaded: false,
    TargetDetail: [],
    TableData: [],
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          {
            domainMastered(studentId: "U3R1ZGVudFR5cGU6NjEx") {
              id
              tarTime
              targetId {
                id
                domain {
                  id
                  domain
                }
              }
              targetAllcatedDetails {
                id
                dateBaseline
              }
            }
          }
        `,
      })
      .then(result => {
        console.log(result)
        let ChartDataList = []
        let chartDataDict = {}

        let resData = result.data.domainMastered

        for (var i in resData) {
          try {
            chartDataDict[resData[i].targetId.domain.domain] = 0
          } catch {
            chartDataDict['Manual'] = 0
          }
        }

        for (var i in resData) {
          const tarTime = new Date(resData[i].tarTime)
          const dateBaseline = new Date(resData[i].targetAllcatedDetails.dateBaseline)
          const diffTime = Math.abs(dateBaseline - tarTime)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          try {
            chartDataDict[resData[i].targetId.domain.domain] += diffDays
          } catch {
            chartDataDict['Manual'] += diffDays
          }
        }

        for (var key in chartDataDict) {
          ChartDataList.push({
            name: key,
            steps: chartDataDict[key],
            href: 'https://development.cogniable.us/media/domain/mand.jpg',
          })
        }

        let chart = am4core.create('chartdiv3', am4charts.XYChart)
        chart.hiddenState.properties.opacity = 0 // this creates initial fade-in

        chart.paddingBottom = 30

        chart.data = ChartDataList

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'name'
        categoryAxis.renderer.grid.template.strokeOpacity = 0
        categoryAxis.renderer.minGridDistance = 1
        categoryAxis.renderer.labels.template.dy = 35
        categoryAxis.renderer.tooltip.dy = 35
        categoryAxis.renderer.grid.template.location = 0.5
        categoryAxis.startLocation = -0.5
        categoryAxis.endLocation = -0.3

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.inside = true
        valueAxis.renderer.labels.template.fillOpacity = 1
        valueAxis.renderer.grid.template.strokeOpacity = 0
        valueAxis.min = 0
        valueAxis.cursorTooltipEnabled = false
        valueAxis.renderer.baseGrid.strokeOpacity = 0

        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = 'steps'
        series.dataFields.categoryX = 'name'
        series.tooltipText = '{valueY.value}'
        series.tooltip.pointerOrientation = 'vertical'
        series.tooltip.dy = -6
        series.columnsContainer.zIndex = 100
        series.columns.template.width = am4core.percent(10)

        let columnTemplate = series.columns.template
        columnTemplate.width = am4core.percent(50)
        columnTemplate.maxWidth = 66
        columnTemplate.column.cornerRadius(60, 60, 10, 10)
        columnTemplate.strokeOpacity = 0
        columnTemplate.events.on('hit', this.updateLines)

        series.heatRules.push({
          target: columnTemplate,
          property: 'fill',
          dataField: 'valueY',
          min: am4core.color('#e5dc36'),
          max: am4core.color('#5faa46'),
        })
        series.mainContainer.mask = undefined

        let cursor = new am4charts.XYCursor()
        chart.cursor = cursor
        cursor.lineX.disabled = true
        cursor.lineY.disabled = true
        cursor.behavior = 'none'

        let bullet = columnTemplate.createChild(am4charts.CircleBullet)
        bullet.circle.radius = 25
        bullet.valign = 'bottom'
        bullet.align = 'center'
        bullet.isMeasured = true
        bullet.mouseEnabled = false
        bullet.verticalCenter = 'bottom'
        bullet.interactionsEnabled = false

        let hoverState = bullet.states.create('hover')
        let outlineCircle = bullet.createChild(am4core.Circle)
        outlineCircle.adapter.add('radius', function(radius, target) {
          let circleBullet = target.parent
          return circleBullet.circle.pixelRadius + 4
        })

        let image = bullet.createChild(am4core.Image)
        image.width = 50
        image.height = 50
        image.horizontalCenter = 'middle'
        image.verticalCenter = 'middle'
        image.propertyFields.href = 'href'

        image.adapter.add('mask', function(mask, target) {
          let circleBullet = target.parent
          return circleBullet.circle
        })

        let previousBullet
        chart.cursor.events.on('cursorpositionchanged', function(event) {
          let dataItem = series.tooltipDataItem

          if (dataItem.column) {
            let bullet = dataItem.column.children.getIndex(1)

            if (previousBullet && previousBullet != bullet) {
              previousBullet.isHover = false
            }

            if (previousBullet != bullet) {
              let hs = bullet.states.getKey('hover')
              hs.properties.dy = -bullet.parent.pixelHeight + 30
              bullet.isHover = true

              previousBullet = bullet
            }
          }
        })
      })
  }

  updateLines = event => {
    var series = event.target.dataItem._dataContext
    console.log(series)
    client
      .query({
        query: gql` {
               targetAllocates(targetId_Domain_Domain:"${series.name}",studentId:"U3R1ZGVudFR5cGU6MTYz")
               {
                   edgeCount
                  edges {
                      node {
                          id
                          targetAllcatedDetails
                          {
                            id
                            targetName
                          }
                      }
                  }
               }
           }
              `,
      })
      .then(result => {
        let temp_table = []
        for (var i in result.data.targetAllocates.edges) {
          var targetname = ''
          if (result.data.targetAllocates.edges[i].node.targetAllcatedDetails) {
            targetname = result.data.targetAllocates.edges[i].node.targetAllcatedDetails.targetName
          }
          temp_table.push({
            key: result.data.targetAllocates.edges[i].node.id,
            targetName: targetname,
          })
        }
        this.setState({
          TableData: temp_table,
        })
      })
  }

  render() {
    const { isLoaded, TableData } = this.state
    return (
      <div>
        <Row>
          <Col>
            <Helmet title="Orders" />
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Orders</strong>
                </div>
              </div>
              <div className="card-body">
                {isLoaded ? <Spin /> : ''}
                <div id="chartdiv3" style={{ minHeight: 500 }} />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Table</strong>
                </div>
              </div>
              <div className="card-body">
                <Table dataSource={TableData} columns={columns} />;
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Orders
