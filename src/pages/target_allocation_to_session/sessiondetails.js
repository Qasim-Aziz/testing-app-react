/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */

import React from 'react'
import { Form, Input, Select, Button, Icon, Checkbox } from 'antd'
import { connect } from 'react-redux'
import style from './style.module.scss'

const { Option } = Select
const { TextArea } = Input

let id = 0

@connect(({ user, sessiontargetallocation }) => ({ user, sessiontargetallocation }))
class SessionDetailsForm extends React.Component {
  state = {
    isParent: false
  }

  componentDidMount() {
    const {
      form,
      sessiontargetallocation: { MorningSession, AfternoonSession, EveningSession, DefaultSession, CurrentSession },
    } = this.props

    let sessionObject = null
    if (CurrentSession === 'Morning') {
      sessionObject = MorningSession
    }
    if (CurrentSession === 'Afternoon') {
      sessionObject = AfternoonSession
    }
    if (CurrentSession === 'Evening') {
      sessionObject = EveningSession
    }
    if (CurrentSession === 'Default') {
      sessionObject = DefaultSession
    }

    const hostList = []

    if (sessionObject.sessionHost.edges.length > 0) {
      sessionObject.sessionHost.edges.map(item => hostList.push(item.node.id))
    }

    const instructionList = []
    if (sessionObject.instruction.edges.length > 0) {
      sessionObject.instruction.edges.map(item => instructionList.push(item.node.instruction))
    }

    const therapistHost = []
    if (sessionObject.therapistHost.edges.length > 0) {
      sessionObject.therapistHost.edges.map(item => therapistHost.push(item.node.id))
    }

    id = instructionList.length

    console.log(sessionObject.parentView)

    form.setFieldsValue({
      items: sessionObject.itemRequired,
      hosts: hostList,
      sessionName: sessionObject.name,
      // keys: [0,1,2,3],
      names: instructionList,
      therapist: therapistHost,
      duration: sessionObject.duration,
    })

    this.setState({isParent: sessionObject.parentView})
  }

  onParentView = isChecked => {
    this.setState({isParent: isChecked})
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
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

  handleSubmit = e => {
    const { form, dispatch } = this.props

    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values
        // console.log('Received values of form: ', values)
        // console.log(
        //   'Merged values:',
        //   keys.map(key => names[key]),
        // )

        // console.log(values)
        dispatch({
          type: 'sessiontargetallocation/UPDATE_SESSION_DETAILS',
          payload: {
            values: values,
          },
        })
      }
    })
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const {
      form,
      sessiontargetallocation: {
        FamilyMemberList,
        AuthStaffList,
        MorningSession,
        AfternoonSession,
        EveningSession,
        DefaultSession,
        CurrentSession,
      },
    } = this.props

    const {isParent} = this.state
    // console.log(FamilyMemberList)

    let familyList = []
    if (FamilyMemberList && FamilyMemberList.members.edges.length > 0){
      familyList = FamilyMemberList.members.edges
    }

    // console.log(familyList)

    const { getFieldDecorator, getFieldValue } = form

    let sessionObject = null
    if (CurrentSession === 'Morning') {
      sessionObject = MorningSession
    }
    if (CurrentSession === 'Afternoon') {
      sessionObject = AfternoonSession
    }
    if (CurrentSession === 'Evening') {
      sessionObject = EveningSession
    }
    if (CurrentSession === 'Default') {
      sessionObject = DefaultSession
    }

    const instructionIndex = []

    if (sessionObject) {
      if (sessionObject.instruction.edges.length > 0) {
        sessionObject.instruction.edges.map((item, index) => instructionIndex.push(index))
      }
    }

    // const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: instructionIndex })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <Form.Item
        // {...(index === 0 ? formItemLayout : '')}
        label={index === 0 ? 'Session Instruction' : ''}
        required={false}
        key={k}
        style={itemStyle}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: 'Please input session instruction.',
            },
          ],
        })(<Input placeholder="write instruction" style={{ width: '80%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className={style.dynamicDeleteButton}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ))
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Custom Session Name" style={itemStyle}>
            {form.getFieldDecorator('sessionName')(<Input />)}
          </Form.Item>
          <Form.Item label="Host" style={itemStyle}>
            {form.getFieldDecorator('hosts')(
              <Select mode="multiple" placeholder="Select family members" allowClear>
                {/* {familyList.map(item => (
                  <Option value={item.node.id}>
                    <span>{item.node.memberName}</span> (
                    {item.node.timeSpent.edges.map(timeItem => <span> {timeItem.node.sessionName.name === 'Morning' ? 'M' : timeItem.node.sessionName.name === 'Afternoon' ? 'A' : 'E'}: {timeItem.node.duration}&nbsp;</span>)}
                    )
                  </Option>
                ))} */}
                {familyList.map(item => (
                  <Option value={item.node.id}>
                    <span>{item.node.memberName}</span> available for&nbsp; 
                    {item.node.timeSpent.edges.map(timeItem => 
                      <>
                      {timeItem.node.sessionName.name === CurrentSession ? 
                        <span>{timeItem.node.duration}</span>
                          : 
                          ''
                      }
                      </>
                    )} 
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Therapist" style={itemStyle}>
            {form.getFieldDecorator('therapist')(
              <Select mode="multiple" placeholder="Select Therapist" allowClear>
                {AuthStaffList.edges.map(item => (
                  <Option value={item.node.id}>{item.node.name}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Preferred Items" style={itemStyle}>
            {form.getFieldDecorator('items', {
              rules: [{ required: true, message: 'Please provide preferred items!' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Session Duration" style={itemStyle}>
            {form.getFieldDecorator('duration', {
              rules: [{ required: true, message: 'Please provide session duration!' }],
            })(<Input />)}
          </Form.Item>
          {formItems}
          <Form.Item>
            <Button type="dashed" onClick={this.add} style={{ width: '80%' }}>
              <Icon type="plus" /> Add New Instruction
            </Button>
          </Form.Item>
          <Form.Item style={itemStyle}>
            {form.getFieldDecorator('isParentView')(
              <Checkbox checked={isParent} onChange={e => this.onParentView(e.target.checked)}>Visible for Parent </Checkbox> 
            )}
          </Form.Item>
          <Form.Item style={itemStyle}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>

            <Button htmlType="primary" onClick={this.onReset} className="ml-4">
              Reset
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}
const SessionDetails = Form.create({ name: 'dynamic_form_item' })(SessionDetailsForm)
export default SessionDetails
