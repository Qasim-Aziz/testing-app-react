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
  Select,
  DatePicker,
  Divider,
  Upload,
  Tag,
  Checkbox,
  Icon,
  Card,
  Avatar,
  Switch,
  message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import AntdTag from '../../staffs/antdTag'

const { TextArea } = Input
const { Meta } = Card
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

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}

@connect(({ user, learners }) => ({ user, learners }))
class EditBasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  state = {
    locationTag: null,
    caseManagerTag: null,
    categoryTag: null,
    checked: true,
    selectedFile: null,
    userProfileID: null,
    tagArray: [],
  }

  componentDidMount() {
    const {
      form,
      learners: { UserProfile },
    } = this.props

    const selectedStaffList = []
    UserProfile.authStaff.edges.map(item => selectedStaffList.push(item.node.id))
    form.setFieldsValue({
      clientId: UserProfile.clientId,
      email: UserProfile.email,
      gender: UserProfile.gender,
      dob: moment(UserProfile.dob),
      dateOfDiagnosis: UserProfile.dateOfDiagnosis ? moment(UserProfile.dateOfDiagnosis) : null,
      firstName: UserProfile.firstname,
      lastName: UserProfile.lastname,
      parentFirstName: UserProfile.parentName,
      parentMobileNumber: UserProfile.parentMobile,
      ssnCard: UserProfile.ssnAadhar,
      mobileNo: UserProfile.mobileno,
      address: UserProfile.currentAddress,
      learnerLanguage: UserProfile.language?.id,
      researchParticipant: UserProfile.researchParticipant,
      isActive: UserProfile.isActive
        ? this.setState({ checked: UserProfile.isActive })
        : this.setState({ checked: UserProfile.isActive }),
      tags: UserProfile.tags,
    })

    this.setState(
      {
        locationTag: UserProfile.clinicLocation
          ? UserProfile.clinicLocation.location
          : 'No Location Set',
        caseManagerTag: UserProfile.caseManager
          ? UserProfile.caseManager.name
          : 'No Case Manager Set',
        categoryTag: UserProfile.category?.category,
        userProfileID: UserProfile.id,
        tagArray: UserProfile.tags && UserProfile.tags.length > 0 ? UserProfile.tags : [],
      },
      () => {
        console.log(this.state.tagArray, 'this is tagArray')
      },
    )
  }

  onChange1 = e => {
    this.setState({
      checked: e.target.checked,
    })
  }

  learnerActiveInactive = checked => {
    const {
      dispatch,
      learners: { UserProfile },
    } = this.props
    console.log(UserProfile.id, checked)

    dispatch({
      type: 'learners/LEARNER_ACTIVE_INACTIVE',
      payload: {
        id: UserProfile.id,
        checked: checked,
      },
    })
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      learners: { UserProfile },
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
    data.append('file', this.state.selectedFile)
    data.append('pk', this.state.userProfileID)
    form.validateFields((err, values) => {
      if (!err) {
        axios
          .post('https://application.cogniable.us/apis/student-docs/', data, { headers: headers })
          .then(res => {
            // then print response status
            values = { ...values, tags: this.state.tagArray }
            message.success('Upload Successfully.')
            dispatch({
              type: 'learners/EDIT_LEARNER',
              payload: {
                id: UserProfile.id,
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

  render() {
    const itemStyle = { marginBottom: '5px', fontWeight: 'bold' }
    const {
      form,
      learners: { clinicLocationList, UserProfile, categoryList, staffDropdownList, languageList },
    } = this.props
    const itemStyle1 = { marginBottom: '5px', fontWeight: 'bold' }

    return (
      <div className="card" style={{ marginTop: '5px', border: 'none' }}>
        <div className="card-body">
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
                    {UserProfile ? UserProfile.firstname : ''}
                    <span
                      style={{
                        float: 'right',
                        fontSize: '12px',
                        padding: '5px',
                        color: '#0190fe',
                      }}
                    >
                      {UserProfile.isActive === true ? (
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          defaultChecked
                          onChange={this.learnerActiveInactive}
                        />
                      ) : (
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          onChange={this.learnerActiveInactive}
                        />
                      )}
                    </span>
                  </h5>
                }
                description={
                  <div>
                    <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                      Enrollment Status &nbsp;{' '}
                      {UserProfile.isActive ? (
                        <span style={customSpanStyle}>Active</span>
                      ) : (
                        <span style={inActiveSpanStyle}>In-Active</span>
                      )}
                    </p>
                  </div>
                }
              />
            </Card>

            <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
              <Form.Item {...layout1} label="Profile" style={itemStyle1}>
                <Tag>{this.state.locationTag}</Tag>
                <Tag>{this.state.caseManagerTag}</Tag>
                <Tag>{this.state.categoryTag}</Tag>
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
                  rules: [{ required: false, message: 'Please provide lastName!' }],
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

              <Form.Item label="Gender" style={itemStyle}>
                {form.getFieldDecorator('gender', {
                  rules: [{ required: true, message: 'Please provide Gender' }],
                })(
                  <Select placeholder="Please provide Gender" allowClear>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="DOB" style={itemStyle}>
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

              <Form.Item label="Parent Activation" style={itemStyle}>
                {form.getFieldDecorator('isActive', {
                  rules: [
                    { required: false, message: 'Please Select parent activation if needed' },
                  ],
                })(
                  <Checkbox checked={this.state.checked} onChange={this.onChange1}>
                    Yes
                  </Checkbox>,
                )}
              </Form.Item>

              <Form.Item label="Parent/Guardian Name" style={itemStyle}>
                {form.getFieldDecorator('parentFirstName', {
                  rules: [{ required: false, message: 'Please provide Parent Name!' }],
                })(<Input style={{ borderRadius: 0 }} />)}
              </Form.Item>
              <Form.Item label="Parent/Guardian Mobile no" style={itemStyle}>
                {form.getFieldDecorator('parentMobileNumber', {
                  rules: [{ message: 'Please provide Mobile No!' }],
                })(<Input style={{ borderRadius: 0 }} />)}
              </Form.Item>
              <Form.Item label="SSN/Adhaar card" style={itemStyle}>
                {form.getFieldDecorator('ssnCard', {
                  rules: [{ message: 'Please provide Mobile No!' }],
                })(<Input style={{ borderRadius: 0 }} />)}
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

              <Divider orientation="left">Misc details</Divider>
              <Form.Item label="Authorized Staff" style={itemStyle}>
                {form.getFieldDecorator('authStaff')(
                  <Select mode="multiple" placeholder="Select Therapist" allowClear maxTagCount={4}>
                    {staffDropdownList.map(item => (
                      <Option key={item.node.id} value={item.node.id}>
                        {item.node.name} {item.node.surname}
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
                {form.getFieldDecorator('dateOfDiagnosis')(<DatePicker />)}
              </Form.Item>
              <Form.Item label="Default Language" style={itemStyle}>
                {form.getFieldDecorator('learnerLanguage', {
                  rules: [{ required: false, message: 'Please provide Default Language!' }],
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
                <input type="file" name="file" onChange={this.onChangeHandler} />
              </Form.Item>
              <Form.Item label="Research Participant" name="researchParticipant" style={itemStyle}>
                {form.getFieldDecorator('researchParticipant', {
                  valuePropName: 'checked',
                  rules: [{ required: false }],
                })(<Checkbox />)}
              </Form.Item>

              <Form.Item {...tailLayout}>
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
