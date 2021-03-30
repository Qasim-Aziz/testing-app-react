/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable no-useless-concat */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
/* eslint-disable no-unneeded-ternary */
import React, { Component } from 'react'
import { Button, Dropdown, Layout, Typography, notification, Modal, Icon, Form, Input } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import CKEditor from 'react-ckeditor-component'
import apolloClient from '../../apollo/config'

const { Content } = Layout
const { Title, Text } = Typography
const { confirm } = Modal
const assessmentCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E4E9F0',
  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
  borderRadius: 10,
  width: '100%',
  marginRight: '20px',
  padding: '12px 12px',
  alignItems: 'center',
  display: 'inline-block',
  marginTop: '20px',
}
let id = 0
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCodeNode: null,
      selectedCategoryId: '',
      editorText: '',
    }
  }

  componentDidMount() {
    const { selectedCode } = this.props
    apolloClient
      .query({
        query: gql`
        query{
            getPeakEquCodes(code: "${selectedCode}"){
                    edges{
                        node{
                            id
                            code
                            target{
                                id
                                targetInstr
                                maxSd
                                targetMain{
                                    id
                                    targetName
                                }
                            }
                            classes{
                                edges{
                                    node{
                                        id
                                        name
                                        stimuluses{
                                            edges{
                                                node{
                                                    id
                                                    option
                                                    stimulusName
                                                }
                                            }
                                        }
                                    }
                                }
                            }
            
                        }
                    }
                }
            }`,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        this.setState({
          selectedCodeNode: result.data.getPeakEquCodes.edges[0].node,
          editorText: result.data.getPeakEquCodes.edges[0].node.target.targetInstr,
        })
        console.log(result)
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  onEditorChange = evt => {
    this.setState({ editorText: evt.editor.getData() })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  handleSubmit = e => {
    const { form, updateTargetList } = this.props
    const { selectedCodeNode, editorText } = this.state

    const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    let selectedAlpha = ['A', 'B']
    if (selectedCodeNode?.target?.maxSd) {
      selectedAlpha = []
    }
    for (let i = 0; i < selectedCodeNode?.target?.maxSd; i++) {
      selectedAlpha.push(alphaList[i])
    }
    e.preventDefault()
    form.validateFields((error, values) => {
      // console.log('vaues ===>', values)
      const { keys } = values
      const classes = []
      keys.map((key, index) => {
        const sampleStimulus = []
        selectedAlpha.map((alpha, alphaIndex) => {
          sampleStimulus.push({ option: alpha, stimulusName: values[`stimulus${key}${alpha}`] })
        })
        classes.push({ name: `Class ${index + 1}`, stimuluses: sampleStimulus })
      })
      // console.log('--------------------')
      // console.log(classes)

      if (!error) {
        apolloClient
          .mutate({
            mutation: gql`
              mutation UpdateEquivalenceTarget(
                $targetId: ID!
                $targetName: String!
                $maxSd: Int!
                $targetIns: String
                $video: String
                $classes: [ClassessInput]
              ) {
                peakEquCodeUpdate(
                  input: {
                    targetId: $targetId
                    targetName: $targetName
                    maxSd: $maxSd
                    targetInstr: $targetIns
                    video: $video
                    classes: $classes
                  }
                ) {
                  details {
                    id
                    target {
                      id
                      targetInstr
                      video
                      maxSd
                      targetMain {
                        id
                        targetName
                      }
                    }

                    classes {
                      edges {
                        node {
                          id
                          name
                          stimuluses {
                            edges {
                              node {
                                option
                                stimulusName
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              targetId: selectedCodeNode?.target.id,
              targetName: values.targetname,
              maxSd: values.maxStimulus,
              targetIns: editorText,
              video: values.videolink,
              classes: classes,
            },
          })
          .then(result => {
            notification.success({
              message: 'Target Updated successfully!',
            })
            updateTargetList(result.data.peakEquCodeUpdate.details)
          })
          .catch(Gerror => {
            Gerror.graphQLErrors.map(item => {
              return notification.error({
                message: 'Somthing want wrong updating child session duration',
                description: item.message,
              })
            })
          })
      }
    })
  }

  render() {
    const { form } = this.props
    const { selectedCodeNode, editorText } = this.state

    const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    let selectedAlpha = ['A', 'B']
    if (selectedCodeNode?.target?.maxSd) {
      selectedAlpha = []
    }
    for (let i = 0; i < selectedCodeNode?.target?.maxSd; i++) {
      selectedAlpha.push(alphaList[i])
    }
    const initialKeyValue = []
    if (selectedCodeNode?.classes?.edges.length > 0) {
      id = selectedCodeNode?.classes?.edges.length
      selectedCodeNode?.classes?.edges.map((item, index) => {
        initialKeyValue.push(index)
      })
    }

    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      },
    }

    getFieldDecorator('keys', { initialValue: initialKeyValue })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <>
        <Form.Item
          label={
            <>
              <span>Class {index + 1}</span>
              <span style={{ float: 'right', right: 0 }}>
                {keys.length > 0 ? (
                  <Icon
                    style={{ marginRight: 10 }}
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                  />
                ) : null}
              </span>
            </>
          }
          key={k}
          style={{ marginTop: 0, marginBottom: 0 }}
        >
          {selectedAlpha.map((alpha, alphaIndex) => (
            <Form.Item
              required={false}
              key={'stimulus' + k + alpha}
              style={{ display: 'inline-block', width: 'calc(100% - 12px)' }}
            >
              {getFieldDecorator(`stimulus${k}${alpha}`, {
                initialValue:
                  selectedCodeNode?.classes?.edges[k]?.node.stimuluses.edges[alphaIndex]?.node
                    .stimulusName,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Stimulus's name or delete this field.",
                  },
                ],
              })(<Input placeholder={`Stimulus ` + `${alpha}`} />)}
            </Form.Item>
          ))}
        </Form.Item>
      </>
    ))

    return (
      <>
        {selectedCodeNode && (
          <Form name="targetForm" onSubmit={this.handleSubmit}>
            <Form.Item label="Target Name">
              {form.getFieldDecorator('targetname', {
                initialValue: selectedCodeNode?.target?.targetMain?.targetName,
                rules: [{ required: true, message: 'Please enter Target Name' }],
              })(<Input placeholder="Target Name" size="large" />)}
            </Form.Item>

            {formItems}
            <Form.Item>
              <Button type="dashed" onClick={() => this.add()} style={{ width: '100%' }}>
                <Icon type="plus" /> Add Class
              </Button>
            </Form.Item>

            <Form.Item label="Target Instructions">
              <CKEditor
                activeClass="p10"
                content={editorText}
                events={{
                  change: evt => this.onEditorChange(evt),
                }}
                config={{
                  height: 450,
                }}
              />
            </Form.Item>

            <Form.Item label="Number of stimulus per class">
              {form.getFieldDecorator('maxStimulus', {
                initialValue: selectedCodeNode?.target?.maxSd ? selectedCodeNode?.target?.maxSd : 2,
                rules: [{ required: true, message: 'Please enter minimum stimulus per class' }],
              })(
                <Input
                  placeholder="Number of stimulus"
                  size="large"
                  type="number"
                  max={6}
                  min={2}
                />,
              )}
            </Form.Item>

            <Form.Item label="Target Video Link">
              {form.getFieldDecorator('videolink', {
                initialValue: selectedCodeNode.target.video,
              })(<Input placeholder="Target Video Link" size="large" />)}
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              // loading={false}
              style={{
                marginTop: 15,
                fontSize: 16,
                width: '100%',
                height: 40,
              }}
            >
              Update Target
            </Button>
          </Form>
        )}
      </>
    )
  }
}

const TargetUpdateForm = Form.create()(StudentDrawer)
export default TargetUpdateForm
