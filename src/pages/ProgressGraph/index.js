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
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable radix */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable prefer-const */


import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Affix,
  Drawer,
  Icon,
  Collapse,
  DatePicker,
  Form, Select, Tabs
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { ResponsivePie } from '@nivo/pie'
import { connect } from 'react-redux'
import RightArea from './rightArea'
import LeftArea from './leftArea'
import Report from './Report'
import './style.scss'
import BarChart from './BarChart'
import client from '../../apollo/config'

var moment = require('moment');

const { Option } = Select
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography
const { Content } = Layout
const { Panel } = Collapse

@connect(({ user }) => ({ user }))
class Screeing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      programArea: [],
      domainObj: [],
      defaultprogram: "",
      start_date: moment().subtract(30, 'days'),
      end_date: moment(),
      selectedprogram: null,
      statusselected: null,
      domainSelected: null,
      report_key: 40,
      key: 0,
      bar_key: 20,
      selectedGraph: 'PIE'
    }
  }

  componentDidMount() {

    const { dispatch } = this.props
    dispatch({
      type: 'user/GET_STUDENT_NAME',
    })

    client.query({
      query: gql`{
            programArea {
               edges {
                  node {
                      id
                      name
                    }
                  }
                }
              domain {
                  edges {
                      node {
                          id
                          domain
                        }
                      }
                    }
                }`,
    })
      .then(result => {
        var programArea = result.data.programArea.edges;
        var domain = result.data.domain.edges;

        var defaultprogram = programArea.filter(area => area.node.name == 'ABA');

        this.setState({
          programArea: programArea,
          domainObj: domain,
          defaultprogram: defaultprogram[0].node.id,
          selectedprogram: defaultprogram[0].node.id
        })
      })
  }

  dateChange = (start_date) => {
    let { key, bar_key, report_key } = this.state;
    this.setState({
      start_date: start_date[0],
      end_date: start_date[1],
      key: parseInt(key) + 1,
      bar_key: parseInt(bar_key) + 1,
      report_key: parseInt(report_key) + 1
    })
  }

  ProgramSelected = (program) => {
    let { key, report_key, bar_key } = this.state;
    this.setState({
      selectedprogram: program,
      key: parseInt(key) + 1,
      bar_key: parseInt(bar_key) + 1,
      report_key: parseInt(report_key) + 1
    })
  }

  DomainChange = (domain) => {
    let { key, bar_key, report_key } = this.state;
    this.setState({
      domainSelected: domain,
      key: parseInt(key) + 1,
      bar_key: parseInt(bar_key) + 1,
      report_key: parseInt(report_key) + 1
    })
  }

  StatusCallback = (status) => {
    let { key, bar_key, report_key } = this.state;

    this.setState({
      statusselected: status,
      key: parseInt(key) + 1,
      bar_key: parseInt(bar_key) + 1,
      report_key: parseInt(report_key) + 1
    });

  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  graphOptions = () => (
    <div style={{ width: '142px' }} onClick={e => { e.stopPropagation() }}>
      <Select
        style={{ width: '140px' }}
        defaultValue="PIE"
        onSelect={(val) => {
          this.setState({
            selectedGraph: val
          })
        }

        }
      >
        <Select.Option value="PIE">Pie Chart</Select.Option>
        <Select.Option value="BAR">Bar Chart</Select.Option>
      </Select>
    </div>
  )

  reportActions = () => (
    <div style={{ width: '150px', textAlign: 'right' }} onClick={e => { e.stopPropagation() }}>
      <Button style={{ padding: 0, marginLeft: 10, fontSize: '20px', color: '#111' }} type="link"><Icon type="file-pdf" /></Button>
      <Button style={{ padding: 0, marginLeft: 10, fontSize: '20px', color: '#111' }} type="link"><Icon type="printer" /></Button>
      <Button style={{ padding: 0, marginLeft: 10, fontSize: '20px', color: '#111' }} type="link"><Icon type="file-excel" /></Button>
    </div>
  )

  render() {

    const { programArea, domainObj, selectedGraph, defaultprogram, start_date, end_date, report_key, key, selectedprogram, bar_key, domainSelected, statusselected } = this.state;
    const { form, user: { studentName }, } = this.props;

    return (
      <>
        <Helmet title="Progress Overview" />
        <Layout style={{ padding: '0px' }}>
          <span style={{ float: 'right' }}>
            <Affix offsetTop={100} offsetRight={100} style={{ position: 'absolute', right: 0 }}>
              <Button
                type="primary"
                onClick={this.showDrawer}
                style={{ borderRadius: 0 }}
              >
                <Icon type="double-left" />
              </Button>
            </Affix>
          </span>
          <Content
            style={{
              padding: '0px 20px',
              maxWidth: 1500,
              width: '100%',
              margin: '0px auto',
            }}
          >
            <Title style={{ fontSize: '18px', lineHeight: '29px' }}>{studentName}&apos;s Progress Overview</Title>
            <Row>
              <Col sm={6}>
                <RightArea studentName={studentName} StatusCallback={this.StatusCallback} style={{ marginRight: '10px' }} />
              </Col>

              <Col sm={18}>
                <div
                  role="presentation"
                  style={{
                    borderRadius: 10,
                    border: '2px solid #F9F9F9',
                    padding: '5px 27px 20px',
                    display: 'block',
                    marginLeft: '10px',
                    width: '100%',
                    minHeight: '650px',
                    overflow: 'auto'
                  }}
                >
                  {/* {selectedprogram && statusselected &&
                    <Collapse bordered={false} accordion={false} defaultActiveKey={['1']} showArrow={false} ghost>
                      <Panel header="Graphs" key="1" extra={this.graphOptions()}>
                        <div>
                          {selectedGraph === 'PIE' ? <LeftArea key={key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} /> : ''}
                          {selectedGraph === 'BAR' ? <BarChart key={bar_key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} /> : ''}
                        </div>
                      </Panel>
                      <Panel header="Reports" key="2" extra={this.reportActions()}>
                        <div>
                          <p><Report key={report_key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} /></p>
                        </div>
                      </Panel>
                    </Collapse>
                  } */}
                  {selectedprogram && statusselected &&
                    <Tabs defaultActiveKey="1">
                      <TabPane
                        tab={
                          <span>
                            <Icon type="pie-chart" />
                            Pie Chart
                        </span>
                        }
                        key="1"
                      >
                        <div>
                          <LeftArea key={key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} />
                        </div>
                      </TabPane>
                      <TabPane
                        tab={
                          <span>
                            <Icon type="bar-chart" />
                            Bar Chart
                        </span>
                        }
                        key="2"
                      >
                        <div>
                          <BarChart key={bar_key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} />
                        </div>
                      </TabPane>
                      <TabPane
                        tab={
                          <span>
                            <Icon type="diff" />
                            Reports
                        </span>
                        }
                        key="3"
                      >
                        <div>
                          <p><Report key={report_key} start_date={start_date} end_date={end_date} selectedprogram={selectedprogram} statusselected={statusselected} domainSelected={domainSelected} /></p>
                        </div>
                    </TabPane>
                    </Tabs>
                  }
                </div>


              </Col>
            </Row>

          </Content>
        </Layout>
        <Drawer
          title="Graph & Report Filters"
          placement="right"
          width={450}
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form name="targetForm">
            <Form.Item
              label="Date"

            >
              {form.getFieldDecorator('Date', {
                initialValue: [start_date, end_date],
                rules: [{ required: true, message: 'Please select Date' }],
              })(<RangePicker onChange={this.dateChange} allowClear size="large" />)}
            </Form.Item>
            <Form.Item
              label="Program Area"

            >

              {form.getFieldDecorator('programArea', {
                initialValue: defaultprogram,
                rules: [{ required: true, message: 'Please enter program Area' }],
              })(
                <Select placeholder="From Status" onChange={this.ProgramSelected} allowClear size="large">
                  {programArea && programArea.map(dom => (
                    <Option value={dom.node.id}>{dom.node.name}</Option>
                  ))}
                </Select>
              )}

            </Form.Item>
            <Form.Item
              label="Domain"
            >
              <Select placeholder="From Status" onChange={this.DomainChange} allowClear size="large">
                {domainObj && domainObj.map(dom => (
                  <Option value={dom.node.id}>{dom.node.domain}</Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              // htmlType="submit"
              onClick={this.onClose}
              style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
            >
              Submit
                </Button>
          </Form>
        </Drawer>
      </>
    )
  }
}

export default Form.create()(Screeing)
