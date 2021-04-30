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

@connect(({ user, leaders }) => ({ user, leaders }))
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
    console.log('FORM VALUE', e)
    const { form, dispatch } = this.props
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    form.validateFields((error, values) => {
      if (!error) {
        console.log('VALUES SEND TO THE SAGAS middleware are', error, values)
        dispatch({
          type: 'leaders/CREATE_LEADER',
          payload: {
            values: values,
            data: data,
          },
        })
        form.resetFields()
        this.props.CloseDrawer()
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

        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please provide firstName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please provide lastName!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide email!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobileNo', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Type" style={itemStyle}>
          {form.getFieldDecorator('leadType', {
            rules: [{ required: true, message: 'Please provide Lead Type' }],
          })(
            <Select placeholder="Type" allowClear>
              <Select.Option value="B2B-CLINIC">B2b -clinic</Select.Option>
              <Select.Option value="B2B-SPL-SCHOOL">B2B - spl school</Select.Option>
              <Select.Option value="B2B-INCL-SCHOOL">B2b - Incl school</Select.Option>
              <Select.Option value="B2C-PARENT">B2c - parent</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Status" style={itemStyle}>
          {form.getFieldDecorator('leadStatus', {
            rules: [{ required: true, message: 'Please provide Status' }],
          })(
            <Select placeholder="Status" allowClear>
              <Select.Option value="NEW">NEW</Select.Option>
              <Select.Option value="CONTACTED">CONTACTED</Select.Option>
              <Select.Option value="INTRESTED">INTRESTED</Select.Option>
              <Select.Option value="DEMO">DEMO</Select.Option>
              <Select.Option value="CONVERTED">CONVERTED</Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Project Name" style={itemStyle}>
          {form.getFieldDecorator('projectName', {
            rules: [{ required: true, message: 'Please provide Project' }],
          })(
            <Select placeholder="Project Name" allowClear>
              <Option value="PROJECT_1">Project_1</Option>
              <Option value="PROJECT_2">Project_2</Option>
              <Option value="PROJECT_3">Project_3</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" className="mt-4">
            Submit
          </Button>

          <Button type="primary" onClick={this.onReset} className="ml-4">
            Reset
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
