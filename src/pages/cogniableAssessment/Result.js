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
/* eslint-disable array-callback-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
  Row,
  Col,
  Card,
  Form,
  Modal,
  Button,
  Select,
  Typography,
  Progress,
  Input,
  notification,
} from 'antd'
import { connect } from 'react-redux'

const { Title, Text } = Typography
const { Option } = Select

@connect(({ cogniableassessment, user }) => ({ cogniableassessment, user }))
class Result extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      score: 0,
      visible: false,
    }
  }

  onChange = (value, id) => {
    const {
      dispatch,
      cogniableassessment: { Areas, AssessmentObject, AreasResponse, AssessmentStatus },
    } = this.props
    // if(AreasResponse[id].recorded === true){
    //     console.log('update', value, id)
    // }
    // else{
    console.log('record', value, id)

    let val = ''
    if (value === 'ADVANCED') {
      val = 'advanced'
    }
    if (value === 'DELAYED') {
      val = 'delayed'
    }
    if (value === 'ONTRACK') {
      val = 'onTrack'
    }

    if (AssessmentStatus !== 'COMPLETED') {
      dispatch({
        type: 'cogniableassessment/RECORD_AREA_RESPONSE',
        payload: {
          areaId: id,
          response: val,
        },
      })
    }
    // }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = e => {
    const {
      dispatch,
      cogniableassessment: { AssessmentObject },
    } = this.props
    dispatch({
      type: 'cogniableassessment/END_ASSESSMENT',
      payload: {
        objectId: AssessmentObject.id,
        score: this.state.score ? this.state.score : 0,
      },
    })

    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }

  endAssessment = () => {
    console.log('result Entered')
    const {
      dispatch,
      cogniableassessment: { Areas, AssessmentObject, AreasResponse },
    } = this.props
    const { score } = this.state
    let end = true
    Areas.map(item => {
      if (AreasResponse[item.id].recorded === false) {
        end = false
      }
    })

    if (end === false) {
      notification.warning({
        message: 'Warning!!',
        description: 'Record response for all the areas before submitting assessment!!',
      })
    } else {
      // this.showModal()
      this.handleOk()
    }
  }

  handelChange = val => {
    // console.log(val)
    if (val < 101) {
      this.setState({
        score: val,
      })
    }
  }

  // handleNumberChange = e => {
  //     const number = parseInt(e.target.value || 0, 10);
  //     if (isNaN(number)) {
  //       return;
  //     }
  //     this.triggerChange({ number });
  // };

  render() {
    const textStyle = {
      fontSize: '18px',
      lineHeight: '27px',
    }
    const titleStyle = {
      fontSize: '25px',
      lineHeight: '47px',
      marginTop: '5px',
    }

    const contentCardStyle = {
      background: '#FFFFFF',
      border: '1px solid #E4E9F0',
      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
      borderRadius: 10,
      padding: '16px 12px',
      alignItems: 'center',
      display: 'block',
      margin: '20px',
      lineHeight: '27px',
      marginTop: '10px',
    }

    const { score } = this.state
    const {
      user: { role },
      cogniableassessment: { Question, AssessmentObject, AssessmentStatus, Areas, AreasResponse },
    } = this.props

    return (
      <>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form.Item label="Final Assessment Score">
            <Input
              type="number"
              max="100"
              min="0"
              value={score}
              onChange={e => this.handelChange(e.target.value)}
            />
          </Form.Item>
        </Modal>

        <Text style={textStyle}>{AssessmentObject.student.firstname}&apos;s CogniAble Assessment Result</Text>
        <br />
        {/* <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 10,
            padding: '16px 12px',
            alignItems: 'center',
            display: 'block',
            width: '100%',
            marginBottom: '20px',
            lineHeight: '27px',
            marginTop: '10px',
            minHeight: '180px',
          }}
        >
          <div style={{ width: '25%', display: 'inline-block' }}>
            <Progress
              style={{ marginLeft: '30px' }}
              type="dashboard"
              percent={AssessmentObject.score ? AssessmentObject.score : 0}
            />
          </div>
          <div style={{ width: '75%', display: 'inline-block' }}>
            <Text style={titleStyle}>
              {AssessmentObject.student.firstname}&apos;s Assessment Result
            </Text>
            <p>Don't let what you can't do stop you from doing what you can do.</p>
          </div>
        </div> */}
        

        <Row>
          {Areas.length > 0 ? (
            <>
              {Areas.map(item => (
                <Col sm={12}>
                  <div style={contentCardStyle}>
                    <Title style={{ fontSize: '18px', lineHeight: '24px', display: 'block' }}>
                      {item.name} <span style={{float: 'right', fontSize: '15px'}}>Age: {AreasResponse[item.id].recorded === true ? AreasResponse[item.id].response.age : '' }</span>
                    </Title>
                    {/* <Text style={{ fontSize: '15px', lineHeight: '18px', display: 'block' }}>
                      {item.description}
                    </Text> */}

                    {AreasResponse[item.id].recorded === true ? (
                      <>
                        {role === 'parents' ? (
                          <Title style={{ fontSize: '16px', lineHeight: '18px', color: 'green' }}>
                            {AreasResponse[item.id].response.response}
                          </Title>
                        ) : (
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a suitable response"
                            optionFilterProp="children"
                            value={AreasResponse[item.id].response.response}
                            onSelect={e => this.onChange(e, item.id)}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="DELAYED">Delayed</Option>
                            <Option value="ONTRACK">On Track</Option>
                            <Option value="ADVANCED">Advanced</Option>
                          </Select>
                        )}
                      </>
                    ) : (
                      <>
                        {role === 'parents' ? (
                          <Title style={{ fontSize: '16px', lineHeight: '18px', color: 'green' }}>
                            Pending
                          </Title>
                        ) : (
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a suitable response"
                            optionFilterProp="children"
                            onSelect={e => this.onChange(e, item.id)}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="DELAYED">Delayed</Option>
                            <Option value="ONTRACK">On Track</Option>
                            <Option value="ADVANCED">Advanced</Option>
                          </Select>
                        )}
                      </>
                    )}

                    <div style={{ marginTop: '10px' }}>
                      <Text>{item.description}</Text>
                    </div>
                    {/* <Progress percent={50} showInfo={false} /> */}
                  </div>
                </Col>
              ))}
            </>
          ) : (
            <p>NO Area found</p>
          )}
        </Row>
        <Row>
          <Col sm={24}>
            {role !== 'parents' && AssessmentStatus === 'QUESTIONSCOMPLETED' ? (
              <Button
                style={{
                  float: 'right',
                  width: '200px',
                  height: 40,
                  background: '#0B35B3',
                  boxShadow:
                    '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                  borderRadius: 8,
                  fontSize: 17,
                  fontWeight: 'bold',
                  // marginTop: 10,
                  color: 'white',
                }}
                onClick={() => this.endAssessment()}
              >
                Submit
              </Button>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </>
    )
  }
}

export default Result
