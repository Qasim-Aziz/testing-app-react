import React from 'react';
import { Row, Col, Card , Input, Form, Select, Calendar, Collapse } from 'antd'
import {Helmet} from 'react-helmet';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const { Panel } = Collapse;
const { Search } = Input;

const layout = {
    labelCol: {
      span: 6,
    },
  };

  am4core.useTheme(am4themes_animated);

class Orders extends React.Component {
  componentDidMount() {
    let chart = am4core.create('chartdiv', am4charts.PieChart);
    let chart2 = am4core.create("chartdiv2", am4charts.XYChart);


    chart2.data = [{
  "country": "USA",
  "visits": 2025
}, {
  "country": "China",
  "visits": 1882
}, {
  "country": "Japan",
  "visits": 1809
}, {
  "country": "Germany",
  "visits": 1322
}, {
  "country": "UK",
  "visits": 1122
}, {
  "country": "France",
  "visits": 1114
}, {
  "country": "India",
  "visits": 984
}, {
  "country": "Spain",
  "visits": 711
}, {
  "country": "Netherlands",
  "visits": 665
}, {
  "country": "Russia",
  "visits": 580
}, {
  "country": "South Korea",
  "visits": 443
}, {
  "country": "Canada",
  "visits": 441
}, {
  "country": "Brazil",
  "visits": 395
}];

// Create axes

let categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;

categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
  if (target.dataItem && target.dataItem.index & 2 == 2) {
    return dy + 25;
  }
  return dy;
});

let valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart2.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "visits";
series.dataFields.categoryX = "country";
series.name = "Visits";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;

let columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;

    // Add data
    chart.data = [
      {
        country: 'Lithuania',
        litres: 501.9,
      },
      {
        country: 'Czechia',
        litres: 301.9,
      },
      {
        country: 'Ireland',
        litres: 201.1,
      },
      {
        country: 'Germany',
        litres: 165.8,
      },
      {
        country: 'Australia',
        litres: 139.9,
      },
      {
        country: 'Austria',
        litres: 128.3,
      },
      {
        country: 'UK',
        litres: 99,
      },
      {
        country: 'Belgium',
        litres: 60,
      },
      {
        country: 'The Netherlands',
        litres: 50,
      },
    ];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
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
                  <strong>Orders222</strong>
                </div>
              </div>
              <div className="card-body">
                <div id="chartdiv" style={{minHeight: 400}} />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Orders</strong>
                </div>
              </div>
              <div className="card-body">
                <div id="chartdiv2" style={{minHeight: 400}} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Orders;
