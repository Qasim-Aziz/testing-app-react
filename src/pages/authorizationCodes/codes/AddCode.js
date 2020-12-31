/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'
import { Form, Input, Button, Select, Switch, Icon } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
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
class AddCode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSelectCode: true,
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.CREATE_AUTHORIZATION_CODE,
          payload: {
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  toggleSelectAddCode = checked => {
    console.log(checked)
    if (checked) {
      this.setState({ showSelectCode: true })
    } else {
      this.setState({ showSelectCode: false })
    }
  }

  render() {
    const { form, codes, codeTypes, calculationTypes, codeUnits, userRole, payorList } = this.props
    const itemStyle = { marginBottom: '5px' }
    const { newCode } = this.state

    return (
      <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
        <Form.Item label="Code" style={itemStyle}>
          {this.state.showSelectCode
            ? form.getFieldDecorator('code', {
                rules: [{ required: true, message: 'Please provide code' }],
              })(
                <Select size="small" placeholder="Select or Add Code" style={{ width: '70%' }}>
                  {codes.map(item => (
                    <Select.Option key={item.id} value={item.code}>
                      {item.code}
                    </Select.Option>
                  ))}
                </Select>,
              )
            : form.getFieldDecorator('code', {
                rules: [{ required: true, message: 'Please provide code' }],
              })(<Input placeholder="Enter the code" size="small" style={{ width: '70%' }} />)}
          <Switch
            style={{ marginLeft: '3px' }}
            checkedChildren="Select Code"
            unCheckedChildren="Add Code"
            defaultChecked
            onChange={this.toggleSelectAddCode}
          />
        </Form.Item>
        <Form.Item label="Description" style={itemStyle}>
          {form.getFieldDecorator('description', { initialValue: '' })(
            <TextArea
              placeholder="Description of the Code"
              autoSize={{ minRows: 3 }}
              size="small"
              style={{ width: '70%' }}
            />,
          )}
        </Form.Item>
        <Form.Item label="Code Type" style={itemStyle}>
          {form.getFieldDecorator('codeType', {
            rules: [{ required: true, message: 'Please select Code type' }],
          })(
            <Select placeholder="Select Code Type" size="small" style={{ width: '70%' }}>
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
            <Select size="small" placeholder="Select Type" style={{ width: '70%' }}>
              <Select.Option value={true}>Billable</Select.Option>
              <Select.Option value={false}>Non-billable</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="School" style={itemStyle}>
          {form.getFieldDecorator('codeSchool', {
            rules: [{ required: true, message: 'Please select School' }],
          })(
            <Select placeholder="Select School" size="small" style={{ width: '70%' }}>
              <Select.Option key="U2Nob29sVHlwZTo0Mzc=" value="U2Nob29sVHlwZTo0Mzc=">
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
            <Select size="small" placeholder="Select Payor" style={{ width: '70%' }}>
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
            <Select size="small" placeholder="Select Default Units" style={{ width: '70%' }}>
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
            <Select size="small" placeholder="Select Calculation Type" style={{ width: '70%' }}>
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
            <Select
              size="small"
              mode="multiple"
              placeholder="Select Permissions"
              style={{ width: '70%' }}
            >
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
            Submit
          </Button>
          {/* <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            Cancel
          </Button> */}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(AddCode)
