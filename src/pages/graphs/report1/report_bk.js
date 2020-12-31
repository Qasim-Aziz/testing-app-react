import React from 'react';
import { Row, Col, Card , Input, Form, Select, Calendar, Collapse, Spin, Table } from 'antd'
import {Helmet} from 'react-helmet';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { gql } from 'apollo-boost'
var groupBy = require('json-groupby')
import * as WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";
const { Panel } = Collapse;
const { Search } = Input;
import client from '../../../apollo/config'

const layout = {
    labelCol: {
      span: 6,
    },
  };

  const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

class Orders extends React.Component {

    componentDidMount() {
        client
            .query({
              query: gql`{
                      targetStatusReport(studentId:"U3R1ZGVudFR5cGU6NjEx")
                      {
                          date
                          targetStatusId
                          {
                          id
                          statusName
                          }
                          targetAllocateId {
                              id
                              targetStatus
                              {
                                  id
                                  statusName
                              }
                              targetAllcatedDetails
                              {
                                  targetName
                                  DailyTrials
                              }
                          }
                      }
                  }`,
            })
            .then(result => {
              var resultData = []
              resultData.push({
                "date_allocated": {
                    type: "date"
                }
              }
            )
              var result_data = result.data.targetStatusReport
              for(var i in result_data)
              {
                var tar_name = "";
                var status_name= "";
                if(result_data[i].targetAllocateId.targetAllcatedDetails)
                {
                  tar_name = result_data[i].targetAllocateId.targetAllcatedDetails.targetName
                }
                if(result_data[i].targetAllocateId)
                {
                  status_name = result_data[i].targetAllocateId.targetStatus.statusName
                }

                 resultData.push({
                   "targetName":tar_name,
                   "statusName":status_name,
                   "date_allocated":result_data[i].date
                 })
              }
              console.log(resultData)
                  var pivot = new WebDataRocks({
                      container: "#pivotContainer",
                      toolbar: true,
                      height:700,
                      report: {
                          dataSource: {
                              data: resultData
                          },
                          "slice": {
                            "rows": [
                      							{
                      								"uniqueName": "targetName",
                      								"sort": "asc"
                      							}
                      						],
                      						"columns": [
                      							{
                      								"uniqueName": "statusName",
                      								"sort": "asc"
                      							},
                                    {
                                      "uniqueName": "date_allocated",
                                      "sort": "asc"
                                    }
                      						]
                              }
                      },
                      reportcomplete: function() {
                          // createPolarChart();
                      }
                  });

                  am4core.useTheme(am4themes_animated);

                  // creating chart instance
                  var chart;


                  function createPolarChart() {
                      webdatarocks.getData({
                          "slice": {
                              "rows": [{
                                  "uniqueName": "Country",
                                  "sort": "asc"
                              }],
                              "columns": [{
                                  "uniqueName": "Measures"
                              }],
                              "measures": [{
                                  "uniqueName": "Profit",
                                  "aggregation": "sum"
                              }]
                          },
                      }, drawChart, updateChart);
                  }

                  function prepareDataFunction(rawData) {
                      var result = [];
                      var labels = [];
                      var data = [];
                      for (var i = 0; i < rawData.data.length; i++) {
                          var record = rawData.data[i];
                          if (record.c0 == undefined && record.r0 !== undefined) {
                              var _record = record.r0;
                              labels.push(_record);
                          }
                          if (record.c0 == undefined & record.r0 == undefined) continue;
                          if (record.v0 != undefined) {
                              data.push(!isNaN(record.v0) ? record.v0 : null);
                          }
                      }
                      var rowName = rawData.meta.r0Name;
                      var measureName = rawData.meta.v0Name;
                      for (var i = 0; i < labels.length; i++) {
                          var item = {};
                          item[rowName] = labels[i];
                          item[measureName] = data[i];
                          result.push(item);
                      }
                    console.log(result);
                      return result;
                  }

                  function drawChart(rawData) {
                      var data = prepareDataFunction(rawData);
                      chart = am4core.create("donutChartContainer", am4charts.PieChart);
                      chart.data = data;
                      chart.innerRadius = am4core.percent(50);
                      // Add and configure Series
                      var pieSeries = chart.series.push(new am4charts.PieSeries());
                      pieSeries.dataFields.category = Object.keys(data[0])[0];
                      pieSeries.dataFields.value = Object.keys(data[0])[1];
                      pieSeries.slices.template.stroke = am4core.color("#fff");
                      pieSeries.slices.template.strokeWidth = 2;
                      pieSeries.slices.template.strokeOpacity = 1;

                      // This creates initial animation
                      pieSeries.hiddenState.properties.opacity = 1;
                      pieSeries.hiddenState.properties.endAngle = -90;
                      pieSeries.hiddenState.properties.startAngle = -90;

                  }

                  function updateChart(rawData) {
                      chart = null;
                      drawChart(rawData);
                  }

      })

}


  CreateChart = () => {
    var pivot = new WebDataRocks(
      {
        container: "#pivotContainer",
        toolbar: true,
        height: 580,
        width: "100%",
        report: {
          // the report is the same as in the Step 1
        },
        reportcomplete: function()
        {
          pivot.off("reportcomplete");
          createChart();
        }
      });
  }

  render() {
    return (
      <div>
        <Row gutter={24}>

        <Col span={24}>
          <Helmet title="Orders" />
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>Orders</strong>
              </div>
            </div>
              <div className="card-body">
                <div id="pivotContainer"></div>
              </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="utils__title">
                <strong>Orders</strong>
              </div>
            </div>
              <div className="card-body">
                <div id="donutChartContainer"></div>
              </div>
          </div>
        </Col>
      </Row>
    </div>
    );
  }
}

export default Orders;
