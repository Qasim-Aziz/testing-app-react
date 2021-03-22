/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import {
  Form,
  Input,
  Button,
  Collapse,
  Card,
  Select,
  DatePicker,
  Divider,
  Switch,
  Avatar,
  Icon,
  Tag,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../antdTag'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
}

@connect(({ user, staffs }) => ({ user, staffs }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    roleTag: null,
    designationTag: null,
    qualificationTag: null,
    clinicLocationTag: null,
    selectedFile: null,
    userProfileID: null,
    tagArray: [],
    defaultTags: [],
  }

  componentDidMount() {
    const {
      form,
      staffs: { StaffProfile },
    } = this.props
    console.log('staff profile', StaffProfile)
    if (form) {
      form.setFieldsValue({
        staffId: StaffProfile.employeeId,
        dateOfJoining: moment(StaffProfile.dateOfJoining),
        designation: StaffProfile.designation,
        role: StaffProfile.userRole.id,
        clinicLocation: StaffProfile.clinicLocation ? StaffProfile.clinicLocation.id : null,
        firstname: StaffProfile.name,
        lastname: StaffProfile.surname,
        email: StaffProfile.email,
        gender: StaffProfile.gender,
        contactNumber: StaffProfile.contactNo,
        address: StaffProfile.localAddress,
        dob: moment(StaffProfile.dob),
        qualification: StaffProfile.qualification,
        emergencyName: StaffProfile.emergencyName,
        emergencyContactNumber: StaffProfile.emergencyContact,
        tags: StaffProfile.tags,
      })
    }
    this.setState({
      roleTag: StaffProfile.userRole.name,
      designationTag: StaffProfile.designation,
      qualificationTag: StaffProfile.qualification,
      clinicLocationTag: StaffProfile.clinicLocation
        ? StaffProfile.clinicLocation.location
        : 'No Location Set',
      userProfileID: StaffProfile.id,
      defaultTags: StaffProfile.tags,
      tagArray: StaffProfile.tags && StaffProfile.tags.length > 0 ? StaffProfile.tags : [],
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      staffs: { StaffProfile },
    } = this.props
    e.preventDefault()

    let token = ''
    if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'))
    }
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
      Authorization: token ? `JWT ${token}` : '',
    }
    const data = new FormData()
    data.append('resume', this.state.selectedFile)
    data.append('pk', this.state.userProfileID)
    form.validateFields((err, values) => {
      if (!err) {
        axios
          .post('https://application.cogniable.us/apis/staff-docs/', data, { headers: headers })
          .then(res => {
            // then print response status
            values = { ...values, tags: this.state.tagArray }
            message.success('Upload Successfully.')
            dispatch({
              type: 'staffs/EDIT_STAFF',
              payload: {
                id: StaffProfile.id,
                values: values,
              },
            })
          })
          .catch(err1 => {
            console.error({ err1 })
            message.error('upload Failed.')
            return false
          })
      }
    })
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  tagArrayHandler = tags => {
    this.setState({
      tagArray: tags,
    })
  }

  staffActiveInactive = checked => {
    const {
      dispatch,
      staffs: { UserRole, StaffProfile, clinicLocationList },
    } = this.props

    dispatch({
      type: 'staffs/STAFF_ACTIVE_INACTIVE',
      payload: {
        id: StaffProfile.id,
        checked: checked,
      },
    })
  }

  onReset = () => {
    const { form, CloseDrawer } = this.props
    form.resetFields()
  }

  render() {
    const itemStyle = { marginBottom: '0', color: 'black', fontWeight: 'bold' }
    const {
      form,
      staffs: { UserRole, StaffProfile, clinicLocationList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }
    const { defaultTags } = this.state

    return (
      <div className="card" style={{ marginTop: '5px', border: 'none' }}>
        <div className="card-body" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
          <div>
            <Card
              style={{
                textAlign: 'center',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Meta
                avatar={
                  <Avatar
                    src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
                    style={{
                      width: '100px',
                      height: '100px',
                      border: '1px solid #f6f7fb',
                    }}
                  />
                }
                title={
                  <h5 style={{ marginTop: '20px' }}>
                    {StaffProfile ? StaffProfile.name : ''}
                    <span
                      style={{
                        float: 'right',
                        fontSize: '12px',
                        padding: '5px',
                        color: '#0190fe',
                      }}
                    >
                      {StaffProfile.isActive === true ? (
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          defaultChecked
                          onChange={this.staffActiveInactive}
                        />
                      ) : (
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          onChange={this.staffActiveInactive}
                        />
                      )}
                    </span>
                  </h5>
                }
                description={
                  <div>
                    <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                      {' '}
                      Therapist{' '}
                      <span
                        style={{
                          backgroundColor: '#52c41a',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '1px 5px',
                        }}
                      >
                        Active
                      </span>
                    </p>
                  </div>
                }
              />
            </Card>

            <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
              <Form.Item label="Profile" style={itemStyle1}>
                <Tag>{this.state.roleTag}</Tag>
                <Tag>{this.state.designationTag}</Tag>
                <Tag>{this.state.qualificationTag}</Tag>
                <Tag>{this.state.clinicLocationTag}</Tag>
              </Form.Item>

              <Form.Item label="Tags" style={itemStyle}>
                {form.getFieldDecorator('tags')(
                  <AntdTag
                    style={itemStyle}
                    changeTagsHandler={this.tagArrayHandler}
                    closeable="true"
                    tagArray={this.state.tagArray}
                    defaultVal={defaultTags}
                  />,
                )}
              </Form.Item>

              <Divider orientation="left">Mandatory Fields</Divider>
              <Form.Item label="Staff ID" style={itemStyle}>
                {form.getFieldDecorator('staffId', {
                  rules: [{ required: true, message: 'Please provide your Staff Id!' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Role" style={itemStyle}>
                {form.getFieldDecorator('role', {
                  rules: [{ required: true, message: 'Please provide your Role' }],
                })(
                  <Select>
                    {UserRole.map(item => (
                      <Select.Option key={item} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="First Name" style={itemStyle}>
                {form.getFieldDecorator('firstname', {
                  rules: [{ required: true, message: 'Please provide your name' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Last Name" style={itemStyle}>
                {form.getFieldDecorator('lastname', {
                  rules: [{ required: true, message: 'Please provide your last name' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Email" style={itemStyle}>
                {form.getFieldDecorator('email', {
                  rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Gender" style={itemStyle}>
                {form.getFieldDecorator('gender', {
                  rules: [{ required: true, message: 'Please select gender' }],
                })(
                  <Select>
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="D.O.B" style={itemStyle}>
                {form.getFieldDecorator('dob', {
                  rules: [{ required: true, message: 'Please provide Date of Birth' }],
                })(<DatePicker />)}
              </Form.Item>
              <Form.Item label="Date of Joining" style={itemStyle}>
                {form.getFieldDecorator('dateOfJoining', {
                  rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
                })(<DatePicker />)}
              </Form.Item>

              <Divider orientation="left">Personal Details</Divider>

              <Form.Item label="Designation" style={itemStyle}>
                {form.getFieldDecorator('designation', { initialValue: '' })(<Input />)}
              </Form.Item>
              <Form.Item label="Marital Status" style={itemStyle}>
                {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
                  <Select>
                    <Select.Option value="Single">Single</Select.Option>
                    <Select.Option value="Married">Married</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              <Divider orientation="left">Contact Details</Divider>
              <Form.Item label="Emergency Contact Name" style={itemStyle}>
                {form.getFieldDecorator('emergencyName', {
                  rules: [{ required: false, message: 'Please provide Emergency Contact Name' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Emergency Contact Relation" style={itemStyle}>
                {form.getFieldDecorator('emergencyRelation', {
                  rules: [
                    { required: false, message: 'Please provide Emergency Contact Relation' },
                  ],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Emergency contact no." style={itemStyle}>
                {form.getFieldDecorator('emergencyContactNumber', {
                  rules: [
                    { required: false, message: 'Please provide Emergency Contact Relation' },
                  ],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Contact no." style={itemStyle}>
                {form.getFieldDecorator('contactNumber', {
                  rules: [{ required: false, message: 'Please provide your Contact no.!' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Street Address" style={itemStyle}>
                {form.getFieldDecorator('street', {
                  rules: [{ message: 'Please provide Street Name' }],
                })(<Input placeholder="Street Address" style={{ borderRadius: 0 }} />)}
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
                {form.getFieldDecorator('country', {
                  rules: [{ message: 'Please provide Country' }],
                })(<Input placeholder="Country" style={{ borderRadius: 0 }} />)}
              </Form.Item>
              <Form.Item label="Pincode" style={itemStyle}>
                {form.getFieldDecorator('pincode', {
                  rules: [{ message: 'Please provide pincode' }],
                })(<Input placeholder="Pincode" style={{ borderRadius: 0 }} />)}
              </Form.Item>
              <Form.Item label="Qualification" style={itemStyle}>
                {form.getFieldDecorator('qualification', {
                  rules: [{ required: false, message: 'Please provide Qualification' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Work Exprience" style={itemStyle}>
                {form.getFieldDecorator('workExprience', {
                  rules: [{ required: false, message: 'Please provide Work Experience' }],
                  initialValue: '',
                })(<Input />)}
              </Form.Item>

              <Divider orientation="left">Misc details</Divider>

              <Form.Item label="Clinic Location" style={itemStyle}>
                {form.getFieldDecorator('clinicLocation')(
                  <Select>
                    {clinicLocationList.map(item => (
                      <Select.Option key={item} value={item.node.id}>
                        {item.node.location}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="Upload Your Documents" style={itemStyle}>
                <input type="file" name="file" onChange={this.onChangeHandler} />
              </Form.Item>

              <Form.Item {...tailLayout} style={{ marginTop: '10px' }}>
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const EditBasicInformationForm = Form.create()(EditBasicInformation)

export default EditBasicInformationForm
