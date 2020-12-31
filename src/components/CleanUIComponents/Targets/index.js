/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import {
  Form,
  Input,
  Spin,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Collapse,
  notification,
} from 'antd'
import { GraphQLClient } from 'graphql-request'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import client from '../../../apollo/config'

const { Panel } = Collapse
const { TextArea } = Input

const FormItem = Form.Item
const { Option } = Select

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 14,
  },
}

const graphQLClient = new GraphQLClient('https://development.cogniable.us/apis/school/graphql', {
  headers: {
    database: 'india',
  },
})

@connect(({ goals }) => ({ goals }))
class AllocateTarget extends React.Component {
  // constructor(props) {

  // }

  constructor(props) {
    super(props)

    this.state = {
      suggestedSd: [],
      suggestedStep: [],
      fetchingstep: false,
      fetchingsd: false,

      targetList: ['1', '2', '3'],
      targetLength: 1,
      targetInitialValue: 1,
    }
  }

  componentDidMount() {
    const { targets, form } = this.props
    this.setState({
      targetLength: targets.length,
    })
    form.setFieldsValue({
      targetname: targets[0].node.targetMain.targetName,
    })
  }

  fetchSd = value => {
    this.setState({ suggestedSd: [], fetchingsd: true })

    const query = `query {
      targetSd(first:8, sd_Icontains:"${value}")
      {edges {
          node {
          id,
          sd
      }
      }
      }
  }`

    graphQLClient.request(query).then(data => {
      this.setState({
        suggestedSd: data.targetSd.edges,
        fetchingsd: false,
      })
    })
  }

  fetchStep = value => {
    this.setState({ suggestedStep: [], fetchingstep: true })

    const query = `query {
      targetStep(first:8, step_Icontains:"${value}")
      {edges {
          node {
          id,
          step
      }
      }
      }
  }`

    graphQLClient.request(query).then(data => {
      this.setState({
        suggestedStep: data.targetStep.edges,
        fetchingstep: false,
      })
    })
  }

  changeTarget = () => {
    const { form, targets } = this.props
    this.setState({
      targetInitialValue: this.state.targetInitialValue + 1,
    })
    form.resetFields()
    form.setFieldsValue({
      targetname: targets[this.state.targetInitialValue].node.targetMain.targetName,
    })
  }

  handleTargetSubmit = e => {
    e.preventDefault()

    const {
      form,
      targets,
      goals: { LearnerId, ShortTermObject },
    } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        const stepsListSelected = []
        if (values.steps) {
          values.steps.map(item => stepsListSelected.push(`"${item.label}"`))
        }

        const sdList = []
        if (values.sd) {
          values.sd.map(item => sdList.push(`"${item.label}"`))
        }
        console.log(sdList, stepsListSelected)

        console.log(values.sd, values.steps)

        client
          .mutate({
            mutation: gql`mutation{
            createTargetAllocate(
              input:{
                targetData:{
                  shortTerm:"${ShortTermObject.id}", 
                  targetId:"${targets[this.state.targetInitialValue - 1].node.id}", 
                  studentId:"${LearnerId}", 
                  targetStatus:"${values.target_status}", 
                  goalName:"${values.targetname}", 
                  sd:[${sdList}], 
                  
                  steps:[${stepsListSelected}], 
                  date:"${values.date_baseline._d.toISOString().slice(0, 10)}", 
                  targetInstr:"${values.objectives}", 
                  goodPractices:"", 
                  precaution:"", 
                  masteryCriteria:"${values.mcriteria}"
                }
              }
            )
            {
              details{
                id,
                goalName,
                targetStatus{
                  id,
                  statusName
                }
              }
            }
          }`,
          })
          .then(result => {
            notification.success({
              message: 'Target Allocated Successfully',
            })
            form.resetFields()
          })
          .catch(err => {
            err.graphQLErrors.map(item => {
              return notification.error({
                message: 'Somthing want wrong',
                description: item.message,
              })
            })
          })
      }
    })
  }

  render() {
    const { form, DomainList, targettype, mcriteria, codes, status, targets } = this.props
    console.log(targets)
    const {
      suggestedSd,
      fetchingsd,
      fetchingstep,
      suggestedStep,
      targetLength,
      targetInitialValue,
    } = this.state
    const itemStyle = { marginBottom: '5px' }

    return (
      <>
        <h6>
          Target {targetInitialValue}/{targetLength} :{' '}
          {targets[targetInitialValue - 1].node.targetMain.targetName}
        </h6>
        <br />
        <Form {...layout} onSubmit={this.handleTargetSubmit} className="target-form">
          <FormItem label="Target Name" style={itemStyle}>
            {form.getFieldDecorator('targetname', {
              rules: [{ required: true, message: 'Please provide your Target Name!' }],
            })(<Input type="text" placeholder="Target Name" />)}
          </FormItem>

          <FormItem label="Target Type" style={itemStyle}>
            {form.getFieldDecorator('targettype')(
              <Select
                id="product-edit-colors"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a target type"
                optionFilterProp="children"
              >
                {targettype.map(c => (
                  <option value={c.id}>{c.typeTar}</option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="Mastery Criteria" style={itemStyle}>
            {form.getFieldDecorator('mcriteria', {
              rules: [{ required: true, message: 'Please provide your mcriteria!' }],
            })(
              <Select
                id="product-edit-colors"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a mcriteria"
                optionFilterProp="children"
              >
                {mcriteria.map(c => (
                  <option value={c.id}>
                    Response Percentage:{c.responsePercentage}%,Consecutive Days:{c.consecutiveDays}
                    , Min Trial:{c.minTrial}
                  </option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="Date Baseline" style={itemStyle}>
            {form.getFieldDecorator('date_baseline', {
              rules: [{ required: true, message: 'Please provide your Date Baseline!' }],
            })(<DatePicker name="date" />)}
          </FormItem>

          <FormItem label="Custom Prompt Codes" style={itemStyle}>
            {form.getFieldDecorator('codes', {
              rules: [{ required: true, message: 'Please provide your codes!' }],
            })(
              <Select
                id="product-edit-colors"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a codes"
                optionFilterProp="children"
              >
                {codes.map(c => (
                  <option value={c.id}>{c.promptName}</option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="Status" style={itemStyle}>
            {form.getFieldDecorator('target_status', {
              rules: [{ required: true, message: 'Please provide your Status!' }],
            })(
              <Select
                id="product-edit-colors"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a Status"
                optionFilterProp="children"
              >
                {status.map(c => (
                  <option value={c.id}>{c.statusName}</option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="Desired Daily Trials" style={itemStyle}>
            {form.getFieldDecorator('trials', {
              rules: [{ required: true, message: 'Please provide your Desired Daily Trials!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="Steps" style={itemStyle}>
            {form.getFieldDecorator('steps')(
              <Select
                mode="tags"
                labelInValue
                placeholder="Select steps"
                notFoundContent={fetchingstep ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchStep}
                style={{ width: '100%' }}
              >
                {suggestedStep.map(d => (
                  <Option key={d.node.id}>{d.node.step}</Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="SD" style={itemStyle}>
            {form.getFieldDecorator('sd')(
              <Select
                mode="tags"
                labelInValue
                placeholder="Select SD"
                notFoundContent={fetchingsd ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchSd}
                style={{ width: '100%' }}
              >
                {suggestedSd.map(d => (
                  <Option key={d.node.id}>{d.node.sd}</Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="Teaching objectives" style={itemStyle}>
            {form.getFieldDecorator('objectives', {
              rules: [{ required: true, message: 'Please provide your SD!' }],
            })(<TextArea autoSize={{ minRows: 3 }} />)}
          </FormItem>

          <FormItem {...tailLayout}>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>{' '}
            &nbsp;&nbsp;
            {targetLength > targetInitialValue ? (
              <Button onClick={this.changeTarget}>Next</Button>
            ) : (
              <p>No more target</p>
            )}
          </FormItem>
        </Form>
      </>
    )
  }
}

const TargetAllocate = Form.create()(AllocateTarget)
export default TargetAllocate
