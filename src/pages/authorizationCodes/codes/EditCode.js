/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import { Form, Input, Button, Select, Card, Switch, Icon, Collapse } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/authorizationCodes/actions'

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

@connect(({ authorizationCode }) => ({ authorizationCode }))
class EditCode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSelectCode: false,
    }
  }

  componentDidMount() {
    const getPermissions = data => {
      const list = []
      if (data && data.edges.length > 0) {
        const nodes = data.edges.map(({ node }) => {
          list.push(node.id)
          return node
        })
      }
      return list
    }

    const { form, codeProfile } = this.props

    form.setFieldsValue({
      code: codeProfile?.code,
      description: codeProfile?.description ? codeProfile.description : '',
      codeType: codeProfile?.codeType?.id,
      billable: codeProfile?.billable,
      codeSchool: codeProfile?.school?.id,
      payor: codeProfile?.payor?.id,
      defaultUnits: codeProfile?.defaultUnits?.id,
      calculationType: codeProfile?.calculationType?.id,
      codePermission: getPermissions(codeProfile?.codePermission),
    })
  }

  toggleSelectAddCode = checked => {
    if (checked) {
      this.setState({ showSelectCode: true })
    } else {
      this.setState({ showSelectCode: false })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, codeProfile } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: actions.EDIT_AUTHORIZATION_CODE,
          payload: {
            id: codeProfile.id,
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  codeActiveInactive = checked => {
    const { dispatch, codeProfile } = this.props
    dispatch({
      type: actions.AUTHORIZATION_CODES_ACTIVE_INACTIVE,
      payload: {
        id: codeProfile.id,
        isActive: checked,
      },
    })
    this.props.closeDrawer()
    codeProfile.isActive = checked
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
    const {
      form,
      codes,
      codeTypes,
      calculationTypes,
      codeUnits,
      userRole,
      payorList,
      codeProfile,
    } = this.props

    return (
      <>
        {codeProfile ? (
          <div
            className="card"
            style={{ marginTop: '5px', minHeight: '600px', border: '1px solid #f4f6f8' }}
          >
            <div className="card-body">
              <div>
                <Card style={{ border: 'none' }}>
                  <Card.Meta
                    title={
                      <h5 style={{ marginTop: '10px' }}>
                        {codeProfile ? codeProfile.code : ''}
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                          {' '}
                          : {codeProfile.description ? codeProfile.description : ''}
                        </span>
                        <span
                          style={{
                            float: 'right',
                            fontSize: '12px',
                            padding: '5px',
                            color: '#0190fe',
                          }}
                        >
                          {codeProfile.isActive === true ? (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              onChange={this.codeActiveInactive}
                            />
                          ) : (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={this.codeActiveInactive}
                            />
                          )}
                        </span>
                      </h5>
                    }
                    description={
                      <div>
                        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                          Code Status &nbsp;{' '}
                          {codeProfile.isActive === true ? (
                            <span style={activeSpanStyle}>Active</span>
                          ) : (
                            <span style={inActiveSpanStyle}>In-Active</span>
                          )}
                        </p>
                      </div>
                    }
                  />
                </Card>
                {codeProfile ? (
                  <Collapse defaultActiveKey="1" accordion bordered={false}>
                    <Collapse.Panel header="Basic Details" key="1">
                      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
                        {/* <Form.Item label="Code" style={itemStyle}>
                          {form.getFieldDecorator('code', {
                            rules: [{ required: true, message: 'Please provide code' }],
                          })(<Input size="small" />)}
                        </Form.Item> */}
                        {this.state.showSelectCode ? (
                          <Form.Item label="Code" style={itemStyle}>
                            {form.getFieldDecorator('code', {
                              rules: [{ required: true, message: 'Please provide code' }],
                            })(
                              <Select size="small" placeholder="Select or Add Code">
                                {codes.map(item => (
                                  <Select.Option key={item.id} value={item.code}>
                                    {item.code}
                                  </Select.Option>
                                ))}
                              </Select>,
                            )}
                          </Form.Item>
                        ) : (
                          <Form.Item label="Code" style={itemStyle}>
                            {form.getFieldDecorator('code', {
                              rules: [{ required: true, message: 'Please provide code' }],
                            })(<Input placeholder="Enter the code" size="small" />)}
                          </Form.Item>
                        )}
                        <Switch
                          style={{
                            float: 'right',
                            marginTop: '-5px',
                            marginRight: '70px',
                            marginBottom: '10px',
                          }}
                          checkedChildren="Select Code"
                          unCheckedChildren="Edit Code"
                          defaultChecked={false}
                          onChange={this.toggleSelectAddCode}
                        />
                        <Form.Item label="Description" style={itemStyle}>
                          {form.getFieldDecorator('description', { initialValue: '' })(
                            <TextArea
                              placeholder="Description of the Code"
                              autoSize={{ minRows: 3 }}
                              size="small"
                            />,
                          )}
                        </Form.Item>
                        <Form.Item label="Code Type" style={itemStyle}>
                          {form.getFieldDecorator('codeType', {
                            rules: [{ required: true, message: 'Please select Code type' }],
                          })(
                            <Select size="small">
                              {codeTypes.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Billable" style={itemStyle}>
                          {form.getFieldDecorator('billable', {
                            rules: [{ required: true, message: 'Please select billable' }],
                          })(
                            <Select size="small" initialValue="billable">
                              <Select.Option value={true}>Billable</Select.Option>
                              <Select.Option value={false}>Non-billable</Select.Option>
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="School" style={itemStyle}>
                          {form.getFieldDecorator('codeSchool', {
                            rules: [{ required: true, message: 'Please select School' }],
                          })(
                            <Select size="small">
                              <Select.Option
                                key="U2Nob29sVHlwZTo0Mzc="
                                value="U2Nob29sVHlwZTo0Mzc="
                              >
                                Demo
                              </Select.Option>
                              {/* {codeTypes.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))} */}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Payor" style={itemStyle}>
                          {form.getFieldDecorator('payor', {
                            rules: [{ required: true, message: 'Please select Payor' }],
                          })(
                            <Select size="small">
                              {payorList.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.firstname}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Default Units" style={itemStyle}>
                          {form.getFieldDecorator('defaultUnits', {
                            rules: [{ required: true, message: 'Please select default unit' }],
                          })(
                            <Select size="small">
                              {codeUnits.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.unit}({item.minutes} min)
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Calculation Type" style={itemStyle}>
                          {form.getFieldDecorator('calculationType', {
                            rules: [{ required: true, message: 'Please select Calculation type' }],
                          })(
                            <Select size="small">
                              {calculationTypes.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Permissions" style={itemStyle}>
                          {form.getFieldDecorator('codePermission', {
                            rules: [{ required: true, message: 'Please select Permission' }],
                          })(
                            <Select size="small" mode="multiple" placeholder="Select Permissions">
                              {userRole.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>,
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
    )
  }
}

export default Form.create()(EditCode)
