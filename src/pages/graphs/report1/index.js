/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable eqeqeq */
/* eslint-disable vars-on-top */
/* eslint-disable import/newline-after-import */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */


import React from 'react';
import { Row, Col, Card , Input, Form, Select, Calendar, Collapse,Button, DatePicker, Spin, Table, Badge } from 'antd'
import {Helmet} from 'react-helmet';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { gql } from 'apollo-boost'
import * as WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";
import { FilterOutlined } from '@ant-design/icons'
import reqwest from 'reqwest';
import Moment from 'react-moment';
import client from '../../../apollo/config'

var groupBy = require('json-groupby')
const { Panel } = Collapse;
const { Search } = Input;

const { RangePicker } = DatePicker

const layout = {
    labelCol: {
      span: 6,
    },
  };

  const columns = [
  {
    title: 'Domain',
    dataIndex: 'node.targetId.domain.domain',
    sorter: true,
    width:"10%"

  },
  {
    title: 'Target Description',
    dataIndex: 'node.targetAllcatedDetails.targetName',
    width:"20%"

  },
  {
    title: 'Stimulus',
    dataIndex: 'node.sd.edges',
    width:"20%",
    render: record => (
      <>
      {record && record.map(tag => {
          return (
            tag.node.sd
          )
        })}
      </>
    ),
  },
  {
    title: 'Steps',
    dataIndex: 'node.steps.edges',
    width:"20%",
    render: record => (
      <>
      {record && record.map(tag => {
        return (
          tag.node.step
        )
        })}
      </>
    ),
  },
  {
    title: 'Baseline Date',
    dataIndex: 'node.targetAllcatedDetails.dateBaseline',
    width:"10%",
    render: record => (
      <>
      <Moment format="D MMM YYYY">{record}</Moment>
      </>
    )
  },
  {
    title: 'In-Therapy Date',
    width:"10%",
    dataIndex: 'node.targetStatusDateSet',
    render: record => (
      <>
      {record && record.edges.map(tag => {
           if(tag.node.targetStatusId.id == 'U3RhdHVzVHlwZToz')
           {
             return (
                 <Moment format="D MMM YYYY">{tag.node.time}</Moment>
             )
           }
        })}
      </>
    ),
  },
  {
    title: 'Mastery date',
    dataIndex: 'node.targetStatusDateSet',
    width:"10%",
    render: record => (
      <>
      {record && record.edges.map(tag => {
           if(tag.node.targetStatusId.id == 'U3RhdHVzVHlwZTo0')
           {
             return (
               <Moment format="D MMM YYYY">{tag.node.time}</Moment>
             )
           }
        })}
      </>
    ),
  }
];



class Orders extends React.Component {
  state = {
    data: [],
    loading: false,
    divShow: false,
    filterShow: false,
    targetStatus:[],
    filterStatus:null,
    start_date:null,
    end_date:null,
    isLoaded:true
  };

    componentDidMount() {
      this.fetch();
      client
        .query({
          query: gql` {
               domain
               {
                  edges {
                      node {
                          id
                          domain
                           targetsSet
                           {
                               edges {
                                  node {
                               targetAllocateSet(studentId:"U3R1ZGVudFR5cGU6NjEx")
                               {
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

                  for(var i in result.data.domain.edges)
                  {
                     var temp_count = 0
                     for(var i2 in result.data.domain.edges[i].node.targetsSet.edges)
                       {
                         temp_count += result.data.domain.edges[i].node.targetsSet.edges[i2].node.targetAllocateSet.edgeCount
                       }
                       if(temp_count > 0)
                       {
                          chart_data.push({id:result.data.domain.edges[i].node.id, domain:result.data.domain.edges[i].node.domain, value:temp_count})
                       }

                  }

              let chart = am4core.create("chartdiv3", am4charts.PieChart);
              chart.data =chart_data;
             // Add and configure Series
             let pieSeries = chart.series.push(new am4charts.PieSeries());
             pieSeries.dataFields.value = "value";
             pieSeries.dataFields.category = "domain";
             pieSeries.dataFields.id = "id";
             pieSeries.slices.template.stroke = am4core.color("#fff");
             pieSeries.slices.template.strokeWidth = 2;
             pieSeries.slices.template.strokeOpacity = 1;
             pieSeries.slices.template.events.on("hit", this.updateLines);
             // This creates initial animation
             pieSeries.hiddenState.properties.opacity = 1;
             pieSeries.hiddenState.properties.endAngle = -90;
             pieSeries.hiddenState.properties.startAngle = -90;

             this.setState({
               isLoaded : false
             })
            })

    }

    filterToggle = (toggle) => {
      if (toggle) {
        this.setState({
          filterShow: false,
        })
      } else {
        this.setState({
          filterShow: true,
        })
      }
    }


    fetch = ( ) => {
      this.setState({ loading: true });

      client
          .query({
            query: gql`{
                        targetAllocates(studentId:"U3R1ZGVudFR5cGU6NjEx" )
                            {
                                edges {
                                    node {
                                            id
                                            time
                                            targetId
                                            {
                                                domain
                                                {
                                                    id
                                                    domain
                                                }
                                            }
                                            sd
                                            {
                                                edges {
                                                    node {
                                                        id
                                                        sd
                                                    }
                                                }
                                            }
                                            steps
                                            {
                                                edges {
                                                    node {
                                                        id
                                                        step
                                                    }
                                                }
                                            }
                                            targetStatus
                                            {
                                                id
                                                statusName
                                            }
                                            targetAllcatedDetails
                                            {
                                                targetName
                                                dateBaseline
                                            }
                                            targetStatusDateSet
                                            {
                                                edges {
                                                    node {
                                                        time
                                                        targetStatusId
                                                        {
                                                        id
                                                        statusName
                                                        }
                                                    }
                                                }
                                            }
                                }
                                }
                            }
                            targetStatus
                            {
                                id
                                statusName
                            }
                    }`,
          })
          .then(result => {
            var result_data = result.data.targetAllocates;
            var targetStatus = result.data.targetStatus;

            this.setState({
              loading: false,
              data: result_data.edges,
              targetStatus:targetStatus
            });
          })
    };



  render() {
    const { data, loading, targetStatus, isLoaded } = this.state;
    const { divShow, filterShow } = this.state;

    const filterDiv = filterShow
      ? {
          display: 'block',
          padding: '0',
          marginBottom: '0',
          backgroundColor: 'inherit',
        }
      : { display: 'none' }

    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
    const dateFormat = 'YYYY-MM-DD';

    return (
      <div>
        <Row gutter={24}>
        <Helmet title="Overall Progress" />
        <Col span={24}>
          <div className="card" style={{ backgroundColor: 'inherit', marginBottom: '0' }}>
            <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
              <Button onClick={() => this.filterToggle(filterShow)}>
                Filter <FilterOutlined />
              </Button>
            </div>
          </div>
          <div className="card" style={filterDiv}>
            <div className="card-body" style={{ padding: '0', marginBottom: '0' }}>
              <Form.Item label="" style={filterOptionStyle}>
                <Select
                  style={{ width: '120px' }}
                  defaultValue="all"
                  onChange={this.filterStatusList}
                >
                {targetStatus.map((todo) => (
                    <Select.Option value={todo.id}>{todo.statusName}</Select.Option>
                  )
                )}
                </Select>
              </Form.Item>
              <Form.Item label="" style={filterOptionStyle}>
                <RangePicker  style={{ marginTop: '3px' }} />
              </Form.Item>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>Overall Progress</strong>
              </div>
            </div>
              <div className="card-body">
                <Table
                  columns={columns}
                  rowKey={record => record.node.id}
                  dataSource={data}
                  loading={loading}
                />
              </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>Overall Progress</strong>
              </div>
            </div>
              <div className="card-body">
              {isLoaded ? <Spin /> : "" }
              <div id="chartdiv3" style={{minHeight: 500}} />
              </div>
          </div>
        </Col>
      </Row>
    </div>
    );
  }
}

export default Orders;
