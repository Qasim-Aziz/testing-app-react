/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Form, Drawer, Input, Button, Select, DatePicker, notification } from 'antd'
import './createStaffForm.scss'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}

const { TextArea } = Input

class StaffBasicInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: true,

      clinicLocationList: [],
      userRoleList: [],
    }
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          {
            schoolLocation {
              edges {
                node {
                  id
                  location
                }
              }
            }
            userRole {
              id
              name
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          clinicLocationList: result.data.schoolLocation.edges,
          userRoleList: result.data.userRole,
        })
      })
  }

  handleSubmit = (e, This) => {
    e.preventDefault()

    const { form } = this.props

    form.validateFields((error, values) => {
      if (!error) {
        client
          .mutate({
            mutation: gql`mutation {
              createStaff(
                input:{
                  staffData:{
                    empId:"${values.staffId}",
                    dateOfJoining:"${values.dateOfJoining._d.toISOString().slice(0, 10)}",
                    designation:"${values.designation}",
                    role:"${values.role}",
                    clinicLocation:"${values.clinicLocation}"
                    firstname:"${values.firstname}",
                    surname:"${values.lastname}",
                    email:"${values.email}",
                    gender:"${values.gender}",
                    mobile:"${values.contactNumber}",
                    address:"${values.address}",
                    dob:"${values.dob._d.toISOString().slice(0, 10)}",
                    qualification:"${values.qualification}",
                    emergencyName:"${values.emergencyName}",
                    emergencyContact:"${values.emergencyContactNumber}",
                    authLearner:[]
                  }
                }
              )
              { 
                staff{
                  id,
                  surname
                }
              }
            }`,
          })
          .then(result => {
            notification.success({
              message: 'Staff Added Successfully',
              description: 'Please check your mail for Username and Password',
            })
            form.resetFields()
            // eslint-disable-next-line react/destructuring-assignment
            this.props.setOpen(false)
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

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  render() {
    const { form } = this.props
    const { isLoaded, clinicLocationList, userRoleList } = this.state
    const itemStyle = { marginBottom: '5px' }

    if (isLoaded) {
      return <div>Loding...</div>
    }

    return (
      <Form onSubmit={e => this.handleSubmit(e, this)}>
        <Form.Item label="Staff ID" style={itemStyle}>
          {form.getFieldDecorator('staffId', {
            rules: [{ required: true, message: 'Please provide your Staff Id!' }],
          })(<Input size="large" />)}
        </Form.Item>

        <Form.Item label="Role" style={itemStyle}>
          {form.getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please provide your Role' }],
          })(
            <Select size="large">
              {userRoleList.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Date of Joining" style={itemStyle}>
          {form.getFieldDecorator('dateOfJoining', {
            rules: [{ required: true, message: 'Please provide your Date of Joining!' }],
          })(<DatePicker size="large" style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="Designation" style={itemStyle}>
          {form.getFieldDecorator('designation', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>

        <Form.Item label="Clinic Location" style={itemStyle}>
          {form.getFieldDecorator('clinicLocation', {
            rules: [{ required: true, message: 'Please select Clinic Location' }],
          })(
            <Select size="large">
              {clinicLocationList.map(item => (
                <Select.Option value={item.node.id}>{item.node.location}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="First Name" style={itemStyle}>
          {form.getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please provide your name' }],
          })(<Input size="large" />)}
        </Form.Item>

        <Form.Item label="Last Name" style={itemStyle}>
          {form.getFieldDecorator('lastname', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>
        <Form.Item label="Email" style={itemStyle}>
          {form.getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
          })(<Input size="large" />)}
        </Form.Item>
        <Form.Item label="Gender" style={itemStyle}>
          {form.getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select gender' }],
          })(
            <Select size="large">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="D.O.B" style={itemStyle}>
          {form.getFieldDecorator('dob', {
            rules: [{ required: true, message: 'Please provide Date of Birth' }],
          })(<DatePicker size="large" style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="Contact no." style={itemStyle}>
          {form.getFieldDecorator('contactNumber', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>

        <Form.Item label="Address" style={itemStyle}>
          {form.getFieldDecorator('address', { initialValue: '' })(
            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} />,
          )}
        </Form.Item>
        <Form.Item label="Merital Status" style={itemStyle}>
          {form.getFieldDecorator('meritalStatus', { initialValue: '' })(
            <Select size="large">
              <Select.Option value="Single">Single</Select.Option>
              <Select.Option value="Married">Married</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Emergency Contact Name" style={itemStyle}>
          {form.getFieldDecorator('emergencyName', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>
        <Form.Item label="Emergency Contact Relation" style={itemStyle}>
          {form.getFieldDecorator('emergencyRelation', { initialValue: '' })(
            <Input size="large" />,
          )}
        </Form.Item>
        <Form.Item label="Emergency contact no." style={itemStyle}>
          {form.getFieldDecorator('emergencyContactNumber', { initialValue: '' })(
            <Input size="large" />,
          )}
        </Form.Item>
        <Form.Item label="Qualification" style={itemStyle}>
          {form.getFieldDecorator('qualification', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>
        <Form.Item label="Work Exprience" style={itemStyle}>
          {form.getFieldDecorator('workExprience', { initialValue: '' })(<Input size="large" />)}
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '47%',
                height: 40,
                background: '#0B35B3',
                fontSize: 16,
              }}
            >
              Submit
            </Button>

            <Button
              htmlType="primary"
              onClick={this.onReset}
              style={{
                width: '47%',
                marginLeft: 20,
                height: 40,
                background: '#ff4444',
                color: '#fff',
                fontSize: 16,
              }}
            >
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

const CreateStaffForm = Form.create()(StaffBasicInfo)

export default ({ open, setOpen }) => {
  return (
    <Drawer
      visible={open}
      title="New Staff"
      onClose={() => {
        setOpen(false)
      }}
      width="500px"
      bodyStyle={{
        padding: '30px 60px',
      }}
    >
      <CreateStaffForm setOpen={setOpen} />
    </Drawer>
  )
}
