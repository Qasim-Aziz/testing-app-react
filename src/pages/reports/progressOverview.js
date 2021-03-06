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
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Button, Typography, Form, DatePicker, Select, Dropdown, Menu } from 'antd'
import html2canvas from 'html2canvas'
import { FaDownload } from 'react-icons/fa'
import JsPDF from 'jspdf'
import { COLORS } from 'assets/styles/globalStyles'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import Moment from 'moment'
import client from '../../apollo/config'
import PieChart from './PieChart'
import BarChart from './BarChart'
import Report from './Report'
import './behavior.scss'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const parentCardStyle = {
  background: COLORS.palleteLight,
  borderRadius: 10,
  padding: '10px',
  margin: '10px 5px 0 10px',
  height: 380,
  overflow: 'hidden',
}

const filterCardStyle = {
  backgroundColor: COLORS.palleteLight,
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
}

const parentDiv = { display: 'flex', margin: '5px 15px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

const cardStyle = {
  borderRadius: 10,
  border: '2px solid #F9F9F9',
  display: 'flex',
  width: '100%',
  height: '100%',
  overflowY: 'hidden',
}

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class ProgressOverview extends React.Component {
  constructor(props) {
    super(props)
    this.childRef = React.createRef()
    this.state = {
      current: 0,
      graphstartdate: Moment(Date.now())
        .subtract(21, 'days')
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(Date.now())
        .format('YYYY-MM-DD')
        .toString(),
      targetStatus: [],
      selectTargetArea: 0,
      programArea: [],
      defaultprogram: '',
      domainObj: [],
      key: 0,
      selectedprogram: null,
      statusselected: null,
      domainSelected: null,
      barKey: 20,
      visibleFilter: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props

    client
      .query({
        query: gql`
          {
            targetStatus(first: 4) {
              id
              statusName
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          targetStatus: result.data.targetStatus,
          selectTargetArea: result.data.targetStatus[0].id,
          statusselected: result.data.targetStatus[0].id,
        })
      })

    client
      .query({
        query: gql`
          {
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
          }
        `,
      })
      .then(result => {
        const programArea = result.data.programArea.edges
        const domain = result.data.domain.edges
        const defaultprogram = programArea.filter(area => area.node.name == 'ABA')
        this.setState({
          programArea: programArea,
          domainObj: domain,
          defaultprogram: defaultprogram[0].node.id,
          selectedprogram: defaultprogram[0].node.id,
        })
      })
  }

  onChange = current => {
    this.setState({ current })
  }

  noLearnerSelected = () => {
    return (
      <>
        <Row>
          <Col sm={24}>
            <div style={parentCardStyle}>
              <Title style={{ fontSize: 20, lineHeight: '27px', textAlign: 'center' }}>
                Select any learner from the list
              </Title>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  searchLearner = text => {
    const {
      dispatch,
      learnersprogram: { CloneLearners },
    } = this.props

    const searchedLearnersList = []
    if (CloneLearners.length > 0) {
      CloneLearners.map(itemNode => {
        if (itemNode.node.firstname.toLowerCase().includes(text.toLowerCase())) {
          searchedLearnersList.push(itemNode)
        }
      })
    }

    dispatch({
      type: 'learnersprogram/SET_STATE',
      payload: {
        Learners: searchedLearnersList,
      },
    })
  }

  ProgramSelected = program => {
    this.setState({
      selectedprogram: program,
    })
  }

  DomainChange = domain => {
    this.setState({
      domainSelected: domain,
    })
  }

  StatusCallback = status => {
    this.setState({
      statusselected: status,
    })
  }

  DateChange = date => {
    this.setState({
      graphstartdate: Moment(date[0])
        .format('YYYY-MM-DD')
        .toString(),
      graphenddate: Moment(date[1])
        .format('YYYY-MM-DD')
        .toString(),
    })
  }

  render() {
    const {
      form,
      selectedStudentId,
      student: { StudentName },
    } = this.props

    const {
      graphstartdate,
      graphenddate,
      targetStatus,
      key,
      programArea,
      domainObj,
      selectedprogram,
      defaultprogram,
      statusselected,
      domainSelected,
      barKey,
      visibleFilter,
    } = this.state

    const pxToMm = px => {
      return Math.floor(px / document.getElementById('pieChart').offsetHeight)
    }

    const exportPDF = () => {
      const input = document.getElementById('pieChart')
      const barInput = document.getElementById('barChart')
      const inputHeightMm = pxToMm(input.offsetHeight)
      const a4WidthMm = 210
      const a4HeightMm = 297
      const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm / a4HeightMm) + 1
      let pdf = new JsPDF()
      if (inputHeightMm > a4HeightMm) {
        // elongated a4 (system print dialog will handle page breaks)
        pdf = new JsPDF('p', 'mm', [inputHeightMm + 16, a4WidthMm])
      }
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0)
        pdf.save(`progress_overview.pdf`)
      })
    }

    const exportToCSV = () => {
      this.report.exportToCSV(StudentName)
    }

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Button onClick={() => exportToCSV()} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
      </Menu>
    )

    return (
      <>
        <Row>
          <Col sm={24} style={{ padding: 0 }}>
            <div style={filterCardStyle}>
              <div style={parentDiv}>
                <span style={parentLabel}>Date :</span>
                <RangePicker
                  style={{
                    marginLeft: 'auto',
                    width: 240,
                  }}
                  defaultValue={[
                    Moment(graphstartdate, 'YYYY-MM-DD'),
                    Moment(graphenddate, 'YYYY-MM-DD'),
                  ]}
                  format="YYYY-MM-DD"
                  onChange={this.DateChange}
                />
              </div>
              <div style={parentDiv}>
                <span style={parentLabel}>Status :</span>
                {targetStatus.length > 0 && (
                  <Select
                    placeholder="Status"
                    onChange={this.StatusCallback}
                    style={{
                      width: 160,
                      borderRadius: 4,
                    }}
                    allowClear
                    size="default"
                    defaultValue={statusselected}
                    showSearch
                    optionFilterProp="name"
                  >
                    {targetStatus &&
                      targetStatus.map(node => {
                        return (
                          <Option key={node.id} value={node.id} name={node.statusName}>
                            {node.statusName}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </div>
              <div style={parentDiv}>
                <span style={parentLabel}>Program Area :</span>
                {programArea.length > 0 && (
                  <Select
                    placeholder="From Status"
                    onChange={this.ProgramSelected}
                    size="default"
                    defaultValue={defaultprogram}
                    style={{
                      width: 160,
                      borderRadius: 4,
                    }}
                  >
                    {programArea &&
                      programArea.map(dom => (
                        <Option key={dom.node.id} value={dom.node.id}>
                          {dom.node.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </div>
              <div style={{ ...parentDiv, marginRight: 0 }}>
                <span style={parentLabel}>Domain :</span>
                {domainObj.length > 0 && (
                  <Select
                    style={{
                      width: 160,
                      borderRadius: 4,
                    }}
                    placeholder="ALL"
                    onChange={this.DomainChange}
                    allowClear
                    size="default"
                  >
                    {domainObj &&
                      domainObj.map(dom => (
                        <Option key={dom.node.id} value={dom.node.domain}>
                          {dom.node.domain}
                        </Option>
                      ))}
                  </Select>
                )}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Dropdown overlay={menu} style={{ padding: 0 }} trigger={['hover']}>
                  <Button type="link" size="large" style={{ padding: '0 8px' }}>
                    <FaDownload fontSize="22px" />
                  </Button>
                </Dropdown>
              </div>
            </div>

            <Col span={12}>
              <div style={parentCardStyle}>
                <div id="pieChart" style={cardStyle}>
                  {selectedprogram && statusselected && (
                    <PieChart
                      key={key}
                      start_date={graphstartdate}
                      end_date={graphenddate}
                      selectedprogram={selectedprogram}
                      statusselected={statusselected}
                      domainSelected={domainSelected}
                      studentIdSelected={selectedStudentId}
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ ...parentCardStyle, marginRight: 0, marginLeft: '5px' }}>
                <div id="barChart" style={cardStyle}>
                  {selectedprogram && statusselected && (
                    <BarChart
                      key={barKey}
                      start_date={graphstartdate}
                      end_date={graphenddate}
                      selectedprogram={selectedprogram}
                      statusselected={statusselected}
                      domainSelected={domainSelected}
                      studentIdSelected={selectedStudentId}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Col>
        </Row>
        <div className="behaviorReport" style={{ margin: '20px 0 20px 10px' }}>
          {selectedprogram && statusselected && (
            <Report
              ref={instance => {
                this.report = instance
              }}
              start_date={graphstartdate}
              end_date={graphenddate}
              selectedprogram={selectedprogram}
              statusselected={statusselected}
              domainSelected={domainSelected}
              studentIdSelected={selectedStudentId}
            />
          )}
        </div>
      </>
    )
  }
}

export default Form.create()(ProgressOverview)
