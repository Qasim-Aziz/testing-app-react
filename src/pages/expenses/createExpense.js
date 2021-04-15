/* eslint-disable */

/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import { Form, Input, Button, Select, DatePicker, Checkbox, Divider, message, Tag } from 'antd'
import { connect } from 'react-redux'
import AntdTag from '../staffs/antdTag'
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
    offset: 7,
    span: 14,
  },
}

@connect(({ user, expenses }) => ({ user, expenses }))
class BasicInformationForm extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
    this.tagArrayHandler = this.tagArrayHandler.bind(this)
  }

  state = {
    selectedFile: null,
    tagArray: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    // dispatch({
    //   type: 'leaders/GET_LEADS_DROPDOWNS',
    // })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, dispatch } = this.props
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    form.validateFields((error, values) => {
      if (!error) {
        console.log('VALUES SEND TO THE SAGAS middleware are', error, values)
        dispatch({
          type: 'expenses/CREATE_EXPENSE',
          payload: {
            values: values,
            data: data,
          },
        })
        form.resetFields()
      }
    })
  }

  onChangeHandler = event => {
    console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
    })
  }

  render() {
    const { form } = this.props
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }

    return (
      <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
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

          <Button type="default" onClick={this.onReset} style={CANCEL_BUTTON}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
