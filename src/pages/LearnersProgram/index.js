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
/* eslint-disable lines-between-class-members */
/* eslint-disable react/jsx-closing-bracket-location */

import { FilterOutlined } from '@ant-design/icons'
import { Button, Card, Col, Drawer, Form, Layout, Row, Typography } from 'antd'
import LearnerSelect from 'components/LearnerSelect'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import LearnerAssessments from './LearnerAssessments'
import LearnerGoals from './LearnerGoals'
import LearnerSession from './LearnerSession'
import './padding.scss'
import SessionsTabs from './SessionsTabs'

const { Title, Text } = Typography
const { Content } = Layout

const parentCardStyle = {
  // background: '#F9F9F9',
  borderRadius: 10,
  padding: '20px',
  margin: '10px 0 0 10px',
  overflow: 'auto',
}
const targetMappingStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  padding: '16px 12px',
  // display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class PeakEqvi extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 0,
      visibleFilter: false,
      // TabCheck: 'Assessments',
    }
  }

  componentDidMount() {
    const { dispatch, user, learnersprogram } = this.props
    console.log(learnersprogram, 'lplp')
    if (learnersprogram && learnersprogram.Learners?.length === 0) {
      dispatch({
        type: 'learnersprogram/LOAD_DATA',
      })
    }

    dispatch({
      type: 'student/STUDENT_DETAILS',
    })

    let std = localStorage.getItem('studentId')
    if (std) {
      std = JSON.parse(std)
      dispatch({
        type: 'learnersprogram/SET_STATE',
        payload: {
          SelectedLearnerId: std,
        },
      })
    } else {
      dispatch({
        type: 'student/SET_STATE',
        payload: {
          StudentName: '',
        },
      })
    }
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

  onCloseFilter = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  showDrawerFilter = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  SetTabFunction = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'learnersprogram/SET_STATE',
      payload: {
        TabCheck: val,
      },
    })
  }

  render() {
    const {
      form,
      user,
      student: { StudentName },
      learnersprogram: { SelectedLearnerId, TabCheck, Loading },
    } = this.props

    const { visibleFilter } = this.state

    const BlockStyle = {
      background: '#FFF',
      borderBottom: '1px solid #bcbcbc',
      cursor: 'pointer',
      padding: '30px 20px',
      borderRadius: 0,
      width: '100%',
      height: 50,
      display: 'flex',
      alignItems: 'center',
      minWidth: '200px',
    }

    const ActiveStyle = {
      ...BlockStyle,
      background: COLORS.palleteLightBlue,
    }

    const HeadStyle = {
      color: '#000',
      fontSize: 16,
      lineHeight: '25px',
      display: 'inline',
      margin: 0,
      fontWeight: '500',
    }

    const SideBarHeading = {
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '33px',
      marginBottom: '25px',
    }

    const tdStyle = { border: '1px solid #dddddd', padding: 8, textAlign: 'center' }
    const pstyle = { marginBottom: 0 }
    const std = localStorage.getItem('studentId')

    if (Loading) {
      return <LoadingComponent />
    }

    return (
      <>
        <Helmet title="Learners Program" />
        <Layout style={{ padding: '0px' }}>
          <Content
            style={{
              padding: '0px',
              width: '100%',
              margin: '0px auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',

                width: '100%',
                alignItems: 'center',
                padding: '0px 10px',
                backgroundColor: '#FFF',
                boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
              }}
            >
              <div style={{ margin: '0px auto', width: '100%' }}>
                <div
                  style={{ padding: '5px 0px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ paddingTop: '5px' }}>&nbsp;</div>

                  <div
                    style={{
                      fontSize: 25,
                      marginRight: '9px',
                      marginTop: '2px',
                    }}
                  >
                    {StudentName !== '' && `${StudentName}'s ${TabCheck}`}
                  </div>

                  <div>
                    {user?.role !== 'parents' && (
                      <Button onClick={this.showDrawerFilter} size="large">
                        <FilterOutlined />
                      </Button>
                    )}

                    <Drawer
                      visible={visibleFilter}
                      onClose={this.onCloseFilter}
                      width={DRAWER.widthL4}
                      title="Select Learner"
                      placement="right"
                    >
                      <LearnerSelect />
                    </Drawer>
                  </div>
                </div>
              </div>
            </div>

            <Col style={{ paddingRight: 0 }}>
              <Row>
                <Col sm={5}>
                  <div style={{ display: 'flex' }}>
                    <Card
                      style={{
                        backgroundColor: COLORS.palleteLight,
                        borderRadius: 0,
                        minHeight: '100vh',
                        minWidth: '290px',
                        maxWidth: '350px',
                      }}
                    >
                      <div style={SideBarHeading}>Intervention</div>
                      <div
                        style={TabCheck === 'Assessments' ? ActiveStyle : BlockStyle}
                        onClick={() => this.SetTabFunction('Assessments')}
                      >
                        <span style={HeadStyle}>Assessments</span>
                      </div>
                      <div
                        style={TabCheck === 'Goals' ? ActiveStyle : BlockStyle}
                        onClick={() => this.SetTabFunction('Goals')}
                      >
                        <span style={HeadStyle}>Goals</span>
                      </div>
                      <div
                        style={TabCheck === 'Build Sessions' ? ActiveStyle : BlockStyle}
                        onClick={() => this.SetTabFunction('Build Sessions')}
                      >
                        <span style={HeadStyle}>Build Sessions</span>
                      </div>
                      <div
                        style={TabCheck === 'Sessions' ? ActiveStyle : BlockStyle}
                        onClick={() => this.SetTabFunction('Sessions')}
                      >
                        <span style={HeadStyle}>Sessions</span>
                      </div>
                    </Card>
                  </div>
                </Col>

                <Col sm={19}>
                  {std ? (
                    <>
                      {TabCheck === 'Assessments' && (
                        <>
                          <div style={parentCardStyle}>
                            <LearnerAssessments key={SelectedLearnerId} />
                          </div>
                        </>
                      )}
                      {TabCheck === 'Goals' && (
                        <>
                          <div style={parentCardStyle}>
                            <LearnerGoals key={SelectedLearnerId} />
                          </div>
                        </>
                      )}
                      {TabCheck === 'Build Sessions' && (
                        <>
                          <div style={parentCardStyle}>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                              <tr>
                                <td style={tdStyle}>
                                  <a href="/#/targetsAllocationToSession/">
                                    <Button type="link">
                                      Click here to manage targets in Sessions
                                    </Button>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </>
                      )}
                      {TabCheck === 'Sessions' && (
                        <>
                          {!localStorage.getItem('isOldSessionUI') ? (
                            <SessionsTabs studentId={SelectedLearnerId} />
                          ) : (
                            <Row>
                              <Col span={12}>
                                <div style={parentCardStyle}>
                                  <Title style={{ fontSize: 20, lineHeight: '27px' }}>
                                    Today&apos;s Sessions
                                  </Title>
                                  <LearnerSession key={SelectedLearnerId} />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div style={parentCardStyle}>
                                  <Title style={{ fontSize: 20, lineHeight: '27px' }}>
                                    Previous Sessions
                                  </Title>
                                  <a href="/#/sessionDetails">
                                    <div style={targetMappingStyle}>
                                      <Title
                                        style={{
                                          fontSize: '20px',
                                          lineHeight: '27px',
                                          display: 'block',
                                        }}
                                      >
                                        Sessions
                                      </Title>
                                      <p
                                        style={{
                                          display: 'block',
                                          marginTop: '5px',
                                          marginBottom: '-5px',
                                        }}
                                      >
                                        <i>Click here to see previous Sessions </i>
                                      </p>
                                    </div>
                                  </a>
                                </div>
                              </Col>
                            </Row>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>{this.noLearnerSelected()}</>
                  )}
                </Col>
              </Row>
            </Col>
          </Content>
        </Layout>
      </>
    )
  }
}

export default Form.create()(PeakEqvi)
