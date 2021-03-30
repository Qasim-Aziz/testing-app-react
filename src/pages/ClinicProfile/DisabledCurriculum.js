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
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import {
  Button,
  Switch,
  Form,
  Input,
  Icon,
  notification,
  Row,
  Col,
  Typography,
  Popconfirm,
} from 'antd'
import gql from 'graphql-tag'
import apolloClient from '../../apollo/config'

const { Title, Text } = Typography

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      programAreas: [],
      domains: [],
      targetAreas: [],
      targets: [],
    }
  }

  componentWillMount() {
    this.setState({
      loading: true,
    })
    apolloClient
      .query({
        query: gql`
          {
            programArea(isActive: false) {
              edges {
                node {
                  id
                  name
                }
              }
            }
            domain(isActive: false) {
              edges {
                node {
                  id
                  domain
                }
              }
            }
            targetArea(isActive: false) {
              edges {
                node {
                  id
                  Area
                }
              }
            }
            target(isActive: false) {
              edges {
                node {
                  id
                  targetMain {
                    id
                    targetName
                  }
                }
              }
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        console.log(result)
        this.setState({
          programAreas: result.data.programArea.edges,
          domains: result.data.domain.edges,
          targetAreas: result.data.targetArea.edges,
          targets: result.data.target.edges,
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong loading Data',
            description: item.message,
          })
        })
      })

    this.setState({
      loading: false,
    })
  }

  activateProgramArea = id => {
    const { programAreas } = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation ActivateProgramArea($objectId: ID!) {
            disableProgramArea(input: { programArea: $objectId, isActive: true }) {
              status
              msg
            }
          }
        `,
        variables: {
          objectId: id,
        },
      })
      .then(result => {
        if (result.data.disableProgramArea.status) {
          const newList = programAreas.filter(item => item.node.id !== id)
          this.setState({
            programAreas: newList,
          })

          notification.success({
            message: 'Program Area Activated',
          })
        }
      })
      .catch(error => {
        if (error.graphQLErrors) {
          error.errors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        }
      })
  }

  activateDomain = id => {
    const { domains } = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation ActivateDomain($objectId: ID!) {
            disableDomain(input: { pk: $objectId, isActive: true }) {
              status
              msg
            }
          }
        `,
        variables: {
          objectId: id,
        },
      })
      .then(result => {
        if (result.data.disableDomain.status) {
          const newList = domains.filter(item => item.node.id !== id)
          this.setState({
            domains: newList,
          })

          notification.success({
            message: 'Domain Activated',
          })
        }
      })
      .catch(error => {
        if (error.graphQLErrors) {
          error.errors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        }
      })
  }

  activateTargetArea = id => {
    const { targetAreas } = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation ActivateTargetArea($objectId: ID!) {
            disableTargetArea(input: { pk: $objectId, isActive: true }) {
              status
              msg
            }
          }
        `,
        variables: {
          objectId: id,
        },
      })
      .then(result => {
        if (result.data.disableTargetArea.status) {
          const newList = targetAreas.filter(item => item.node.id !== id)
          this.setState({
            targetAreas: newList,
          })

          notification.success({
            message: 'Target Area Activated',
          })
        }
      })
      .catch(error => {
        if (error.graphQLErrors) {
          error.errors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        }
      })
  }

  activateTarget = id => {
    const { targets } = this.state
    apolloClient
      .mutate({
        mutation: gql`
          mutation ActivateTargetArea($objectId: ID!) {
            disableTarget(input: { pk: $objectId, isActive: true }) {
              status
              msg
            }
          }
        `,
        variables: {
          objectId: id,
        },
      })
      .then(result => {
        if (result.data.disableTarget.status) {
          const newList = targets.filter(item => item.node.id !== id)
          this.setState({
            targets: newList,
          })

          notification.success({
            message: 'Target Activated',
          })
        }
      })
      .catch(error => {
        if (error.graphQLErrors) {
          error.errors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        }
      })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { loading, domains, programAreas, targetAreas, targets } = this.state

    if (loading) {
      return 'Loading...'
    }

    const divStyle = { height: 600, overflow: 'auto', backgroundColor: '#f9f9f9' }
    const childDivStyle = { padding: 4 }
    const childChildDivStyle = {
      border: '1px solid black',
      backgroundColor: 'white',
      borderRadius: 4,
      padding: 4,
    }

    return (
      <div>
        <div className="profileTab-heading">
          <p>Disabled Curriculum</p>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Row style={{ marginTop: 9, backgroundColor: '#f9f9f9', padding: 5 }}>
            <Col span={6}>
              <Title style={{ fontSize: 18, lineHeight: '21px' }}>Program Areas</Title>
              <div style={divStyle}>
                {programAreas.map(item => (
                  <div style={childDivStyle}>
                    <div className="d-flex flex-wrap align-items-center" style={childChildDivStyle}>
                      <div>
                        <p className="text-uppercase font-weight-bold mb-1">{item.node.name}</p>
                        <p className="mb-0">
                          <Popconfirm
                            // style={{ float: 'right', marginBottom: '10px' }}
                            title="Are you sure you want to do this"
                            onConfirm={() => this.activateProgramArea(item.node.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button style={{ border: 'none' }}>Activate</Button>
                          </Popconfirm>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col span={6}>
              <Title style={{ fontSize: 18, lineHeight: '21px' }}>Domains</Title>
              <div style={divStyle}>
                {domains.map(item => (
                  <div style={childDivStyle}>
                    <div className="d-flex flex-wrap align-items-center" style={childChildDivStyle}>
                      <div className="mr-auto">
                        <p className="text-uppercase font-weight-bold mb-1">{item.node.domain}</p>
                        <p className="mb-0">
                          <Popconfirm
                            // style={{ float: 'right', marginBottom: '10px' }}
                            title="Are you sure you want to do this"
                            onConfirm={() => this.activateDomain(item.node.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button style={{ border: 'none' }}>Activate</Button>
                          </Popconfirm>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col span={6}>
              <Title style={{ fontSize: 18, lineHeight: '21px' }}>Target Areas</Title>
              <div style={divStyle}>
                {targetAreas.map(item => (
                  <div style={childDivStyle}>
                    <div className="d-flex flex-wrap align-items-center" style={childChildDivStyle}>
                      <div className="mr-auto">
                        <p className="text-uppercase font-weight-bold mb-1">{item.node.Area}</p>
                        <p className="mb-0">
                          <Popconfirm
                            // style={{ float: 'right', marginBottom: '10px' }}
                            title="Are you sure you want to do this"
                            onConfirm={() => this.activateTargetArea(item.node.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button style={{ border: 'none' }}>Activate</Button>
                          </Popconfirm>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col span={6}>
              <Title style={{ fontSize: 18, lineHeight: '21px' }}>Targets</Title>
              <div style={divStyle}>
                {targets.map(item => (
                  <div style={childDivStyle}>
                    <div className="d-flex flex-wrap align-items-center" style={childChildDivStyle}>
                      <div className="mr-auto">
                        <p className="text-uppercase font-weight-bold mb-1">
                          {item.node.targetMain.targetName}
                        </p>
                        <p className="mb-0">
                          <Popconfirm
                            // style={{ float: 'right', marginBottom: '10px' }}
                            title="Are you sure you want to do this"
                            onConfirm={() => this.activateTarget(item.node.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button style={{ border: 'none' }}>Activate</Button>
                          </Popconfirm>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Form.create()(ChangePasswordForm)
