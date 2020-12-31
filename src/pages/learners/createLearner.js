/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */

import React from 'react'
import { Form, Input, Button, Select, DatePicker, Checkbox, Divider, message, Tag } from 'antd'
import { connect } from 'react-redux'

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

@connect(({ user, learners }) => ({ user, learners }))
class BasicInformationForm extends React.Component {
  formRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    selectedFile: null,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'learners/GET_LEARNERS_DROPDOWNS',
    })
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
        dispatch({
          type: 'learners/CREATE_LEARNER',
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

  render() {
    const {
      form,
      learners: { clinicLocationList, categoryList, staffDropdownList, languageList },
    } = this.props
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const itemStyle1 = { textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }
    return (
      <Form {...layout} name="control-ref" onSubmit={e => this.handleSubmit(e)}>
        <Form.Item {...layout1} label="Profile" style={itemStyle1}>
          <div>
            <img
              src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
              alt="avatar"
              className="avatarlogo"
            />
          </div>
          <Tag>Location</Tag>
          <Tag>Case Manager</Tag>
          <Tag>Category</Tag>
        </Form.Item>

        <Divider orientation="left">Contact Details</Divider>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide email!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please provide firstName!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please provide lastName!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Mobile no" style={itemStyle}>
          {form.getFieldDecorator('mobileNo', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please provide Address!' }],
          })(
            <TextArea
              placeholder="Address"
              autoSize={{ minRows: 3 }}
              size="medium"
              style={{ borderRadius: 0 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Divider orientation="left">Personal Details</Divider>
        <Form.Item label="Client Id" style={itemStyle}>
          {form.getFieldDecorator('clientId', {
            rules: [{ required: true, message: 'Please provide ClientId!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Program" style={itemStyle}>
          {form.getFieldDecorator('program')(
            <Select placeholder="Program" allowClear size="medium">
              <Option value="Basic">Basic</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Parent Activation" style={itemStyle}>
          {form.getFieldDecorator('parentactivation', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(<Checkbox size="medium">Yes</Checkbox>)}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select Gender' }],
          })(
            <Select placeholder="Please select gender" allowClear size="medium">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="DOB" style={itemStyle}>
          {form.getFieldDecorator('dob')(<DatePicker size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Parent/Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentFirstName', {
            rules: [{ required: true, message: 'Please provide Parent Name!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Parent/Guardian Mobile" style={itemStyle}>
          {form.getFieldDecorator('parentMobileNumber', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(<Input size="medium" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnCard', { rules: [{ message: 'Please provide Mobile No!' }] })(
            <Input size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Divider orientation="left">Misc details</Divider>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff', {
            rules: [{ required: true, message: 'Please Select Authorized Staff!' }],
          })(
            <Select mode="multiple" placeholder="Select Therapist" allowClear size="medium">
              {staffDropdownList.map(item => (
                <Option value={item.node.id}>{item.node.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Case Manager" style={itemStyle}>
          {form.getFieldDecorator('caseManager')(
            <Select placeholder="Select Therapist" allowClear size="medium">
              {staffDropdownList.map(item => (
                <Option value={item.node.id}>
                  {item.node.name} {item.node.surname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Date of Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('dateOfDiagnosis')(
            <DatePicker size="medium" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Type of Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('caseManager', {
            rules: [{ required: true, message: 'Please Select Case Manager!' }],
          })(
            <Select placeholder="Select Type of Diagnosis" allowClear size="medium">
              {staffDropdownList.map(item => (
                <Option value={item.node.id}>
                  {item.node.name} {item.node.surname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Default Language" style={itemStyle}>
          {form.getFieldDecorator('learnerLanguage', {
            rules: [{ message: 'Please provide Default Language!' }],
          })(
            <Select placeholder="Select a default Language" allowClear size="medium">
              {languageList.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Location Category" style={itemStyle}>
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Please provide Mobile No!' }],
          })(
            <Select placeholder="Select category" allowClear size="medium">
              {categoryList.map(item => (
                <Option value={item.id}>{item.category}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Upload Your Documents" style={itemStyle}>
          <input type="file" name="file1" onChange={this.onChangeHandler} />
        </Form.Item>

        <Divider orientation="left"> Default program </Divider>
        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {
            rules: [{ message: 'Please provide Clinic Location!' }],
          })(
            <Select placeholder="Select a Clinic location" allowClear size="medium">
              {clinicLocationList.map(item => (
                <Option value={item.node.id}>{item.node.location}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Default Program" style={itemStyle}>
          {form.getFieldDecorator('defaultProgram', {
            rules: [{ required: false, message: 'Please provide Default Program!' }],
          })(<Checkbox size="medium">Check to import Default Program</Checkbox>)}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" size="medium" className="mt-4">
            Submit
          </Button>

          <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            Reset
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const BasicInformation = Form.create()(BasicInformationForm)
export default BasicInformation
