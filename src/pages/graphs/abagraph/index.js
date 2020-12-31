/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable react/no-unused-state */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable block-scoped-var */
/* eslint-disable radix */
/* eslint-disable vars-on-top */


import React from 'react';
import { Row, Col, Card , Input, Form, Select, Calendar, Collapse } from 'antd'
import {Helmet} from 'react-helmet';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { gql } from 'apollo-boost'
import client from '../../../apollo/config'
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

var groupBy = require('json-groupby')

const { Panel } = Collapse;
const { Search } = Input;

const layout = {
    labelCol: {
      span: 6,
    },
  };

  am4core.useTheme(am4themes_animated);

class Orders extends React.Component {
  state = {
    isLoaded: true,
    TargetDetail: [],
  }



  componentDidMount() {

    let temp_data = [];
    let legendData = [];

    client
      .query({
        query: gql`{
    getSessionRecordings(targets:"VGFyZ2V0QWxsb2NhdGVUeXBlOjc2NA==") {
         edges {
            node {
                 status
                 {
                     id
                     statusName
                     colorCode
                 }
                sessionDate
                sessionRecord
                {
                    totalCount
                }
                }
             }
            }
            targetStatus
                 {
                     id
                     statusName
                     colorCode
                 }
}
`,
      })
      .then(result => {
        temp_data = result.data.getSessionRecordings.edges


    let chart = am4core.create("chartdiv3", am4charts.XYChart);
    let data = []

    let previousValue;
    for(var i in temp_data)
    {
      var datetime = new Date(temp_data[i].node.sessionDate)

      // if(previousValue != parseInt(temp_data[i].node.status.colorCode))
      // {
      //   data.push({date:new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()), value:null, color:chart.colors.getIndex(parseInt(temp_data[i].node.status.colorCode))})
      // }

          data.push({date:new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()), value:temp_data[i].node.sessionRecord.totalCount, color:chart.colors.getIndex(parseInt(temp_data[i].node.status.colorCode)) })


      previousValue = parseInt(temp_data[i].node.status.colorCode)
    }


    for(i in result.data.targetStatus)
    {
      legendData.push({name:result.data.targetStatus[i].statusName, fill:chart.colors.getIndex(parseInt(result.data.targetStatus[i].colorCode))})
    }



    chart.paddingRight = 20;

    //
    // let visits = 10;
    // let previousValue;



    // for (var i = 0; i < 5; i++) {
    //     visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //
    //     if(i > 0){
    //         // add color to previous data item depending on whether current value is less or more than previous value
    //         if(previousValue <= visits){
    //             data[i - 1].color = chart.colors.getIndex(0);
    //         }
    //         else{
    //             data[i - 1].color = chart.colors.getIndex(5);
    //         }
    //     }
    //
    //     data.push({ date: new Date(2018, 0, i + 1), value: visits });
    //     previousValue = visits;
    // }

   console.log(data)

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;



    // axisBreak.fill

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;



    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.baseValue = 0;


    let legend = new am4charts.Legend();
    legend.position = "right";
    legend.scrollable = true;
    legend.valign = "top";
    legend.reverseOrder = true;

    chart.legend = legend;
    legend.data = legendData;



    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.strokeWidth = 2;
    series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";

    // 
    // let latitudeBullet = series.bullets.push(new am4charts.CircleBullet());
    // latitudeBullet.circle.fill = "color";
    // latitudeBullet.circle.strokeWidth = 2;
    // latitudeBullet.circle.propertyFields.fill = "color";

    // set stroke property field
    series.propertyFields.stroke = "color";

    var range = dateAxis.axisRanges.create();
    range.value = new Date('2019-11-12');;
    range.grid.stroke = am4core.color("#17202A");
    range.grid.strokeWidth = 1;
    range.label.inside = true;
    range.label.text = "Threshold";
    range.label.valign = "top";
    range.label.location = 1.8;


    range.grid.strokeOpacity = 1;

    // let range = dateAxis.createSeriesRange(series);
    // range.value =new Date('2019-11-12');
    // range.endValue = new Date('2020-01-15');
    // range.contents.stroke = chart.colors.getIndex(2);
    // range.contents.fill = range.contents.stroke;
    // range.grid.stroke = am4core.color("#A96478");
    // range.grid.strokeWidth = 2;
    // range.grid.strokeOpacity = 1;
    // range.contents.strokeOpacity = 0.7;
    // // range.contents.fillOpacity = 0.1;

    // let range2 = dateAxis.createSeriesRange(series);
    // range2.value =new Date('2020-02-12');
    // range2.endValue = new Date('2020-04-15');
    // range2.contents.stroke = chart.colors.getIndex(4);
    // range2.contents.fill = range.contents.stroke;
    // range2.contents.strokeOpacity = 0.7;
    // range2.contents.fillOpacity = 0.1;

    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX = scrollbarX;

    dateAxis.start = 0.7;
    dateAxis.keepSelection = true;
    })
  }

  render() {
    return (
      <div>
        <Row gutter={24}>
        <Col span={6}>
        <Card style={{height:"550px"}}>
          <div>
            <Collapse accordion>
              <Panel header="Filter" key="1">
                <Form.Item {...layout} label="Type">
                  <Select style={{width:'190px'}} defaultValue="all">
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
                    style={{ width: "190px" }}
                  />
                </Form.Item>
              </Panel>
              <Panel header="Filter by date" key="2">
                <div className="site-calendar-demo-card">
                  <Calendar fullscreen={false}/>
                </div>,

              </Panel>

            </Collapse>,

          </div>
        </Card>
        </Col>
          <Col span={18}>
            <Helmet title="Orders" />
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Orders22</strong>
                </div>
              </div>
              <div className="card-body">
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
