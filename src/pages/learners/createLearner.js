/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */

import React from 'react'
import { Form, Input, Button, Select, DatePicker, Checkbox, Divider, message, Tag } from 'antd'
import { connect } from 'react-redux'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
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

const { tailLayout } = FORM

@connect(({ user, learners }) => ({ user, learners }))
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
        console.log(error, values)
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

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
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
        <Form.Item {...layout} label="Profile" style={itemStyle1}>
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

        <Form.Item label="Tags" style={itemStyle}>
          {form.getFieldDecorator('tags')(
            <AntdTag
              style={itemStyle}
              changeTagsHandler={this.tagArrayHandler}
              closeable="true"
              tagArray={this.state.tagArray}
            />,
          )}
        </Form.Item>

        <Divider orientation="left">Mandatory Fields</Divider>

        <Form.Item label="Client Id" style={itemStyle}>
          {form.getFieldDecorator('clientId', {
            rules: [{ required: true, message: 'Please provide ClientId!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
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
            rules: [{ required: false, message: 'Please provide Mobile No!' }],
          })(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select Gender' }],
          })(
            <Select placeholder="Please select gender" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="D.O.B" style={itemStyle}>
          {form.getFieldDecorator('dob', {
            rules: [{ required: true, message: 'Please provide Date of Birth!' }],
          })(<DatePicker style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {
            rules: [{ required: true, message: 'Please provide Clinic Location!' }],
          })(
            <Select placeholder="Select a Clinic location" allowClear>
              {clinicLocationList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.location}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Location Category" style={itemStyle}>
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: 'Please provide Location!' }],
          })(
            <Select placeholder="Select category" allowClear>
              {categoryList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.category}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Divider orientation="left">Personal Details</Divider>

        <Form.Item label="Program" style={itemStyle}>
          {form.getFieldDecorator('program')(
            <Select placeholder="Program" allowClear>
              <Option value="Basic">Basic</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Parent Activation" style={itemStyle}>
          {form.getFieldDecorator('parentactivation', {
            rules: [{ required: false, message: 'Please Select parent activation if needed' }],
          })(<Checkbox>Yes</Checkbox>)}
        </Form.Item>

        <Form.Item label="Parent/Guardian Name" style={itemStyle}>
          {form.getFieldDecorator('parentFirstName')(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Parent/Guardian Mobile" style={itemStyle}>
          {form.getFieldDecorator('parentMobileNumber')(<Input style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="SSN/Adhaar card" style={itemStyle}>
          {form.getFieldDecorator('ssnCard', { rules: [{ message: 'Please provide Mobile No!' }] })(
            <Input style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="Street Address" style={itemStyle}>
          {form.getFieldDecorator('street', { rules: [{ message: 'Please provide Street Name' }] })(
            <Input placeholder="Street Address" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="State" style={itemStyle}>
          {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
            <Input placeholder="State" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="City" style={itemStyle}>
          {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
            <Input placeholder="City" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Form.Item label="Country" style={itemStyle}>
          {form.getFieldDecorator('country', { rules: [{ message: 'Please provide Country' }] })(
            <Input placeholder="Country" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>
        <Form.Item label="Pincode" style={itemStyle}>
          {form.getFieldDecorator('pincode', { rules: [{ message: 'Please provide pincode' }] })(
            <Input placeholder="Pincode" style={{ borderRadius: 0 }} />,
          )}
        </Form.Item>

        <Divider orientation="left">Misc details</Divider>
        <Form.Item label="Authorized Staff" style={itemStyle}>
          {form.getFieldDecorator('authStaff')(
            <Select mode="multiple" placeholder="Select Therapist" allowClear>
              {staffDropdownList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Case Manager" style={itemStyle}>
          {form.getFieldDecorator('caseManager')(
            <Select placeholder="Select Therapist" allowClear>
              {staffDropdownList.map(item => (
                <Option key={item.node.id} value={item.node.id}>
                  {item.node.name} {item.node.surname}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Date of Diagnosis" style={itemStyle}>
          {form.getFieldDecorator('dateOfDiagnosis')(<DatePicker style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="Default Language" style={itemStyle}>
          {form.getFieldDecorator('learnerLanguage', {
            rules: [{ message: 'Please provide Default Language!' }],
          })(
            <Select placeholder="Select a default Language" allowClear>
              {languageList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Upload Your Documents" style={itemStyle}>
          <input type="file" name="file1" onChange={this.onChangeHandler} />
        </Form.Item>
        <Form.Item label="Research Participant" name="researchParticipant" style={itemStyle}>
          {form.getFieldDecorator('researchParticipant', {
            initialValue: false,
            valuePropName: 'checked',
            rules: [{ required: false }],
          })(<Checkbox />)}
        </Form.Item>

        <Divider orientation="left"> Default program </Divider>

        <Form.Item label="Default Program" style={itemStyle}>
          {form.getFieldDecorator('defaultProgram', {
            rules: [{ required: false, message: 'Please provide Default Program!' }],
          })(<Checkbox>Check to import Default Program</Checkbox>)}
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
