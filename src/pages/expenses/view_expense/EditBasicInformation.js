/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable */
import React from 'react'

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Divider,
  Upload,
  Tag,
  Checkbox,
  Icon,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles' // '../../../assets/styles/globalStyles' //

const { TextArea } = Input
const { Option } = Select
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 18,
  },
}

@connect(({ user, expenses }) => ({ user, expenses }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    SpecificExpenseID: null,
    // tagArray: [],
  }

  componentDidMount() {
    console.log('THE PROPS ')
    const {
      form,
      expenses: { SpecificExpense },
    } = this.props

    console.log('THE IS SpecificExpense', SpecificExpense)
    form.setFieldsValue({
      itemName: SpecificExpense.itemName,
      purchaseFrom: SpecificExpense.purchaseFrom,
      amount: SpecificExpense.amount,
      paidBy: SpecificExpense.paidBy,
      status: SpecificExpense.status,
    })

    this.setState({
      SpecificExpenseID: SpecificExpense.id,
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      expenses: { SpecificExpense },
    } = this.props
    e.preventDefault()
    const data = new FormData()
    // data.append('file', this.state.selectedFile)
    data.append('pk', this.state.SpecificExpenseID)
    console.log('THE DATA', data)
    form.validateFields((err, values) => {
      console.log('THE VALUES in edit form', err, values)
      // values = { ...values, tags: this.state.tagArray }
      message.success('Upload Successfully.')
      dispatch({
        type: 'expenses/EDIT_EXPENSE',
        payload: {
          id: SpecificExpense.id,
          values: values,
        },
      })
    })
  }

  render() {
    console.log('THE PROPS in EDIT-BASIC-INFO====> initially in render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> initially in render \n', this.state)
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const {
      form,
      expenses: { clinicLocationList, categoryList, staffDropdownList, languageList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }
    // console.log(this.props.form, 'pppp')
    console.log('THE PROPS in EDIT-BASIC-INFO====> END of render \n', this.props)
    console.log('THE STATE in EDIT-BASIC-INFO====> END of render \n', this.state)
    return (
      <div>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
          <Divider orientation="left">Mandatory Fields</Divider>

          {/* item name */}
          <Form.Item label="Item Name" style={itemStyle}>
            {form.getFieldDecorator('itemName', {
              rules: [{ required: true, message: 'Please provide itemName!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* Purchased From */}
          <Form.Item label="Purchase From" style={itemStyle}>
            {form.getFieldDecorator('purchaseFrom', {
              rules: [{ required: true, message: 'Please provide purchaseFrom!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* AMOUNT */}
          <Form.Item label="Amount" style={itemStyle}>
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: 'Please provide email!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* Status */}
          <Form.Item label="Status" style={itemStyle}>
            {form.getFieldDecorator('status', {
              rules: [{ required: true, message: 'Please provide Status' }],
            })(
              <Select placeholder="Status" allowClear>
                <Select.Option value="PENDING">PENDING</Select.Option>
                <Select.Option value="COMPLETED">COMPLETED</Select.Option>
                <Select.Option value="CREATED">CREATED</Select.Option>
              </Select>,
            )}
          </Form.Item>
          {/* Paid By */}
          <Form.Item label="Paid By" style={itemStyle}>
            {form.getFieldDecorator('paidBy', {
              rules: [{ required: true, message: 'Please provide Paid By' }],
            })(
              <Select placeholder="PaidBy" allowClear>
                <Select.Option value="CASH">CASH</Select.Option>
                <Select.Option value="CHEQUE">CHEQUE</Select.Option>
                <Select.Option value="CARD">CARD</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
              Submit
            </Button>
            {/* <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            cancel
          </Button> */}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm
