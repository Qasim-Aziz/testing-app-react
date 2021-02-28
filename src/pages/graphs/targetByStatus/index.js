/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable import/order */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable import/order */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-tag-spacing */
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

import React from 'react'
import { Row, Col, Card, Input, Form, Select, Calendar, Collapse, Spin, Table } from 'antd'
import { Helmet } from 'react-helmet'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { gql } from 'apollo-boost'
import client from '../../../apollo/config'
import am4themes_frozen from '@amcharts/amcharts4/themes/frozen'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

var groupBy = require('json-groupby')

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
    isLoaded: true,
    TargetDetail: [],
    TableData: [],
  }

  componentDidMount() {
    alert('vfdb')
    client
      .query({
        query: gql`
          {
            domain {
              edges {
                node {
                  id
                  domain
                  targetsSet {
                    edges {
                      node {
                        targetAllocateSet(studentId: "U3R1ZGVudFR5cGU6MTYz") {
                          edgeCount
                        }
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
        let chart_data = []

        for (var i in result.data.domain.edges) {
          var temp_count = 0
          for (var i2 in result.data.domain.edges[i].node.targetsSet.edges) {
            temp_count +=
              result.data.domain.edges[i].node.targetsSet.edges[i2].node.targetAllocateSet.edgeCount
          }
          if (temp_count > 0) {
            chart_data.push({
              id: result.data.domain.edges[i].node.id,
              domain: result.data.domain.edges[i].node.domain,
              value: temp_count,
            })
          }
        }

        let chart = am4core.create('chartdiv3', am4charts.PieChart)
        chart.data = chart_data
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries())
        pieSeries.dataFields.value = 'value'
        pieSeries.dataFields.category = 'domain'
        pieSeries.dataFields.id = 'id'
        pieSeries.slices.template.stroke = am4core.color('#fff')
        pieSeries.slices.template.strokeWidth = 2
        pieSeries.slices.template.strokeOpacity = 1
        pieSeries.slices.template.events.on('hit', this.updateLines)
        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1
        pieSeries.hiddenState.properties.endAngle = -90
        pieSeries.hiddenState.properties.startAngle = -90

        this.setState({
          isLoaded: false,
        })
      })
  }

  updateLines = event => {
    var series = event.target.dataItem._dataContext
    console.log(series.id)
    client
      .query({
        query: gql`
        {
          domainMastered(studentId:"U3R1ZGVudFR5cGU6MTYz", domainId:"${series.id}")
          {
              id
              tarTime
              targetAllcatedDetails
                  {
                      id
                      dateBaseline
                      targetName
                  }

              }
          } `,
      })
      .then(result => {
        let temp_table = []
        for (var i in result.data.domainMastered) {
          var targetname = ''
          if (result.data.domainMastered[i].targetAllcatedDetails) {
            targetname = result.data.domainMastered[i].targetAllcatedDetails.targetName
          }
          temp_table.push({ key: result.data.domainMastered[i].id, targetName: targetname })
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
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{ height: '550px' }}>
              <div>
                <Collapse accordion>
                  <Panel header="Filter" key="1">
                    <Form.Item {...layout} label="Type">
                      <Select style={{ width: '190px' }} defaultValue="all">
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="Breakfast">Breakfast</Select.Option>
                        <Select.Option value="Lunch">Lunch</Select.Option>
                        <Select.Option value="Snacks">Snacks</Select.Option>
                        <Select.Option value="Dinner">Dinner</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item {...layout} label="Search">
                      <Search
                        placeholder="Search Food Name..."
                        // onSearch={this.handleSearch}
                        style={{ width: '190px' }}
                      />
                    </Form.Item>
                  </Panel>
                  <Panel header="Filter by date" key="2">
                    <div className="site-calendar-demo-card">
                      <Calendar fullscreen={false} />
                    </div>
                    ,
                  </Panel>
                </Collapse>
                ,
              </div>
            </Card>
          </Col>
          <Col span={18}>
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
