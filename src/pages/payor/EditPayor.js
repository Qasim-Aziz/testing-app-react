/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React from 'react'
import { Form, Input, Button, Select, Card, Switch, Icon, Collapse, Avatar } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/payor/actions'

const { TextArea } = Input

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 13,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 14,
  },
}

@connect(({ payor }) => ({ payor }))
class EditPayor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { form, payorProfile } = this.props

    form.setFieldsValue({
      firstname: payorProfile?.firstname,
      lastname: payorProfile?.lastname,
      email: payorProfile?.email,
      description: payorProfile?.description,
      contactType: payorProfile?.contactType.id,
      street: payorProfile?.street,
      city: payorProfile?.city,
      state: payorProfile?.state,
      primaryLocation: payorProfile?.primaryLocation,
      homePhone: payorProfile?.homePhone,
      workPhone: payorProfile?.workPhone,
    })
  }

  handleSubmit = e => {
    const { form, dispatch, payorProfile } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: actions.EDIT_PAYOR,
          payload: {
            id: payorProfile.id,
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  payorActiveInactive = checked => {
    const { dispatch, payorProfile } = this.props
    dispatch({
      type: actions.PAYOR_ACTIVE_INACTIVE,
      payload: {
        id: payorProfile.id,
        isActive: checked,
      },
    })
    this.props.closeDrawer()
    payorProfile.isActive = checked
  }

  render() {
    const activeSpanStyle = {
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
    const itemStyle = { marginBottom: '0' }
    const { form, contactTypes, payorProfile } = this.props

    return (
      <>
        {payorProfile ? (
          <div
            className="card"
            style={{ marginTop: '5px', minHeight: '600px', border: '1px solid #f4f6f8' }}
          >
            <div className="card-body">
              <div>
                <Card style={{ border: 'none' }}>
                  <Card.Meta
                    avatar={
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        style={{
                          width: '100px',
                          height: '100px',
                          border: '1px solid #f6f7fb',
                        }}
                      />
                    }
                    title={
                      <h5 style={{ marginTop: '10px' }}>
                        {payorProfile
                          ? `${payorProfile.firstname} ${
                              payorProfile.lastname ? payorProfile.lastname : ''
                            }`
                          : ''}
                        <span
                          style={{
                            float: 'right',
                            fontSize: '12px',
                            padding: '5px',
                            color: '#0190fe',
                          }}
                        >
                          {payorProfile.isActive === true ? (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              onChange={this.payorActiveInactive}
                            />
                          ) : (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={this.payorActiveInactive}
                            />
                          )}
                        </span>
                      </h5>
                    }
                    description={
                      <div>
                        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                          Payor Status &nbsp;{' '}
                          {payorProfile.isActive === true ? (
                            <span style={activeSpanStyle}>Active</span>
                          ) : (
                            <span style={inActiveSpanStyle}>In-Active</span>
                          )}
                        </p>
                      </div>
                    }
                  />
                </Card>
                {payorProfile ? (
                  <Collapse defaultActiveKey="1" accordion bordered={false}>
                    <Collapse.Panel header="Basic Details" key="1">
                      {' '}
                      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
                        <Form.Item label="First Name" style={itemStyle}>
                          {form.getFieldDecorator('firstname', {
                            rules: [{ required: true, message: 'Please provide your first name' }],
                          })(<Input size="small" />)}
                        </Form.Item>
                        <Form.Item label="Last Name" style={itemStyle}>
                          {form.getFieldDecorator('lastname', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="Email" style={itemStyle}>
                          {form.getFieldDecorator('email', {
                            rules: [
                              {
                                required: true,
                                type: 'email',
                                message: 'Please provide your email',
                              },
                            ],
                          })(<Input size="small" />)}
                        </Form.Item>
                        <Form.Item label="Description" style={itemStyle}>
                          {form.getFieldDecorator('description', { initialValue: '' })(
                            <TextArea
                              placeholder="Enter Description"
                              autoSize={{ minRows: 3 }}
                              size="small"
                            />,
                          )}
                        </Form.Item>
                        <Form.Item label="Contact Name." style={itemStyle}>
                          {form.getFieldDecorator('contactType', {
                            rules: [
                              { required: true, message: 'Please provide your Contact name' },
                            ],
                          })(
                            <Select size="small">
                              {contactTypes.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="City" style={itemStyle}>
                          {form.getFieldDecorator('city', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="State" style={itemStyle}>
                          {form.getFieldDecorator('state', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="Primary Location" style={itemStyle}>
                          {form.getFieldDecorator('primaryLocation', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="Home Phone" style={itemStyle}>
                          {form.getFieldDecorator('homePhone', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="Work Phone" style={itemStyle}>
                          {form.getFieldDecorator('workPhone', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Form.Item>
                      </Form>
                    </Collapse.Panel>
                  </Collapse>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
      // <Form onSubmit={e => this.handleSubmit(e)}>
      //   <Form.Item label="First Name" style={itemStyle}>
      //     {form.getFieldDecorator('firstname', {
      //       rules: [{ required: true, message: 'Please provide your first name' }],
      //     })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Last Name" style={itemStyle}>
      //     {form.getFieldDecorator('lastname', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Email" style={itemStyle}>
      //     {form.getFieldDecorator('email', {
      //       rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
      //     })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Description" style={itemStyle}>
      //     {form.getFieldDecorator('description', { initialValue: '' })(
      //       <TextArea placeholder="Enter Description" autoSize={{ minRows: 3 }} size="small" />,
      //     )}
      //   </Form.Item>
      //   <Form.Item label="Contact Name." style={itemStyle}>
      //     {form.getFieldDecorator('contactType', {
      //       rules: [{ required: true, message: 'Please provide your Contact name' }],
      //     })(
      //       <Select size="small">
      //         {contactTypes.map(item => (
      //           <Select.Option key={item.id} value={item.id}>
      //             {item.name}
      //           </Select.Option>
      //         ))}
      //       </Select>,
      //     )}
      //   </Form.Item>
      //   <Form.Item label="City" style={itemStyle}>
      //     {form.getFieldDecorator('city', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="State" style={itemStyle}>
      //     {form.getFieldDecorator('state', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Primary Location" style={itemStyle}>
      //     {form.getFieldDecorator('primaryLocation', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Home Phone" style={itemStyle}>
      //     {form.getFieldDecorator('homePhone', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item label="Work Phone" style={itemStyle}>
      //     {form.getFieldDecorator('workPhone', { initialValue: '' })(<Input size="small" />)}
      //   </Form.Item>
      //   <Form.Item>
      //     <Button style={{ width: '100%' }} type="primary" htmlType="submit">
      //       Save
      //     </Button>
      //   </Form.Item>
      // </Form>
    )
  }
}

export default Form.create()(EditPayor)
