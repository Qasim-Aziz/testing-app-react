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
class EditFee extends React.Component {
  state = { modifierList: [] }

  componentDidMount() {
    const { form, feeProfile } = this.props
    const list = []
    console.log('profile', feeProfile)
    if (feeProfile.modifierRates && feeProfile.modifierRates.edges.length > 0) {
      const subNodes = feeProfile.modifierRates.edges.map(({ node }) => {
        list.push(node.modifier)
        return node.modifier.name
      })
    }
    this.setState({
      modifierList: [...list],
    })
    form.setFieldsValue({
      payor: feeProfile?.payor?.id,
      code: feeProfile?.code.id,
      rate: feeProfile?.rate,
      agreedRate: feeProfile?.agreedRate,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, feeProfile } = this.props

    form.validateFields((err, values) => {
      values.modifierRates = this.state.modifierList
      console.log('values', values)
      if (!err) {
        dispatch({
          type: actions.EDIT_FEE_SCHEDULE,
          payload: {
            id: feeProfile.id,
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  feeActiveInactive = checked => {
    const { dispatch, feeProfile } = this.props
    dispatch({
      type: actions.AUTHORIZATION_CODES_ACTIVE_INACTIVE,
      payload: {
        id: feeProfile.id,
        isActive: checked,
      },
    })
    this.props.closeDrawer()
    feeProfile.isActive = checked
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
    const { form, codeList, payorList, modifiers, feeProfile } = this.props
    console.log('profile', feeProfile)

    return (
      <>
        {feeProfile ? (
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
                        {feeProfile ? feeProfile.payor?.firstname : ''}
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                          {' '}
                          : {feeProfile.code ? feeProfile.code.code : ''}
                        </span>
                        {/* <span
                          style={{
                            float: 'right',
                            fontSize: '12px',
                            padding: '5px',
                            color: '#0190fe',
                          }}
                        > */}
                        {/* {feeProfile.isActive === true ? (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked
                              onChange={this.feeActiveInactive}
                            />
                          ) : (
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={this.feeActiveInactive}
                            />
                          )} */}
                        {/* </span> */}
                      </h5>
                    }
                    // description={
                    //   <div>
                    //     <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                    //       Code Status &nbsp;{' '}
                    //       {feeProfile.isActive === true ? (
                    //         <span style={activeSpanStyle}>Active</span>
                    //       ) : (
                    //         <span style={inActiveSpanStyle}>In-Active</span>
                    //       )}
                    //     </p>
                    //   </div>
                    // }
                  />
                </Card>
                {feeProfile ? (
                  <Collapse defaultActiveKey="1" accordion bordered={false}>
                    <Collapse.Panel header="Basic Details" key="1">
                      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
                        <Form.Item label="Company/Payor" style={itemStyle}>
                          {form.getFieldDecorator('payor', {
                            rules: [{ required: true, message: 'Please provide name of Payor' }],
                          })(
                            <Select placeholder="Select Name" size="small">
                              {payorList.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.firstname}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        <Form.Item label="Service Code" style={itemStyle}>
                          {form.getFieldDecorator('code', {
                            rules: [{ required: true, message: 'Please select Service code' }],
                          })(
                            <Select placeholder="Select Code" size="small">
                              {codeList.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.code}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                        {/* <Form.Item label="Modifier" style={itemStyle}>
                          {form.getFieldDecorator('modifier')(
                            <Select size="small" placeholder="Select Modifiers">
                              {modifiers.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item> */}
                        <Form.Item label="Unit Rate" style={itemStyle}>
                          {form.getFieldDecorator('rate', { initialValue: '' })(
                            <Input size="small" />,
                          )}
                        </Form.Item>
                        <Form.Item label="Agreed Rate" style={itemStyle}>
                          {form.getFieldDecorator('agreedRate', { initialValue: '' })(
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
    )
  }
}

export default Form.create()(EditFee)
