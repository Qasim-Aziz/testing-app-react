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

@connect(({ user, assets }) => ({ user, assets }))
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
    console.log('THE PROPS in CDM', this.props)
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
          type: 'assets/CREATE_ASSET',
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
    console.log('THE RENDER PROPS ====> ', this.props)
    console.log('THE RENDER STATE ====> ', this.state)
    const { form } = this.props
    const {
      assets: { UsersList },
    } = this.props
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }

    console.log('THE RENDER END ====> ', this.props)
    console.log('THE RENDER END ====> ', this.state)
    // console.log('THE ASSET', assets)
    console.log('THE user-list', UsersList)

    return (
      <>
        {console.log('THE INITIAL RETURN ====> ', this.props)}
        {console.log('THE INITIAL RETURN ====> ', this.state)}
        <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
          <Divider orientation="left">Mandatory Fields</Divider>
          {/* item name */}
          <Form.Item label="Asset Name" style={itemStyle}>
            {form.getFieldDecorator('assetName', {
              rules: [{ required: true, message: 'Please provide asset name!' }],
            })(<Input style={{ borderRadius: 0 }} />)}
          </Form.Item>
          {/* Description */}
          <Form.Item label="Description From" style={itemStyle}>
            {form.getFieldDecorator('description')(
              <Input.TextArea rows={4} style={{ borderRadius: 0 }} />,
            )}
          </Form.Item>
          {/* USER */}
          <Form.Item label="Select" style={itemStyle}>
            {form.getFieldDecorator('userId', {
              rules: [{ required: true, message: 'Please provide Choose a user' }],
            })(
              <Select placeholder="userId" allowClear>
                {UsersList.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    {item.firstName} {item.lastName}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          {/* Status */}
          <Form.Item label="Status" style={itemStyle}>
            {form.getFieldDecorator('assetStatus', {
              rules: [{ required: true, message: 'Please provide Status' }],
            })(
              <Select placeholder="Status" allowClear>
                <Select.Option value="ASSIGNED">ASSIGNED</Select.Option>
                <Select.Option value="NOT_ASSIGNED">NOT_ASSIGNED</Select.Option>
              </Select>,
            )}
          </Form.Item>
          {/* ADD DATE FIELD BELOW */}

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="mt-4">
              Submit
            </Button>

            <Button type="primary" onClick={this.onReset} className="ml-4">
              Reset
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}
const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
