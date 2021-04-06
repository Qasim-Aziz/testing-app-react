import React from 'react'
import { Form, Input, Button, Select, Switch, Row, Col } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/authorizationCodes/actions'
import { FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'

const { TextArea } = Input
const { layout, tailLayout } = FORM

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
    const { form, dispatch, closeDrawer } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.CREATE_AUTHORIZATION_CODE,
          payload: {
            values,
          },
        })
        closeDrawer()
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
    const { newCode, showSelectCode } = this.state

    return (
      <Form {...layout} className="addEditCode" onSubmit={e => this.handleSubmit(e)}>
        {/* Code */}
        <Row>
          <Col sm={24} md={7}>
            <Form.Item label="Code" labelCol={{ sm: 13 }} wrapperCol={{ sm: 11 }}>
              <Switch
                className="useCodeSwitch"
                checkedChildren="Use Existing"
                unCheckedChildren="Create new"
                defaultChecked
                onChange={this.toggleSelectAddCode}
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={17}>
            <Form.Item label="Code" labelCol={{ sm: 3 }} wrapperCol={{ sm: 21 }}>
              {showSelectCode
                ? form.getFieldDecorator('code', {
                    rules: [{ required: true, message: 'Please provide code' }],
                  })(
                    <Select placeholder="Select Code">
                      {codes.map(item => (
                        <Select.Option key={item.id} value={item.code}>
                          {item.code}
                        </Select.Option>
                      ))}
                    </Select>,
                  )
                : form.getFieldDecorator('code', {
                    rules: [{ required: true, message: 'Please provide code' }],
                  })(<Input placeholder="Enter the code" />)}
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Row>
          <Col span={24}>
            <Form.Item label="Description" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('description', { initialValue: '' })(
                <TextArea placeholder="Description of the Code" autoSize={{ minRows: 3 }} />,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Code Type - Billable */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Code Type" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('codeType', {
                rules: [{ required: true, message: 'Please select Code type' }],
              })(
                <Select placeholder="Select Code Type">
                  {codeTypes.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Billable" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('billable', {
                rules: [{ required: true, message: 'Please select billable' }],
              })(
                <Select placeholder="Select Type">
                  {[
                    { text: 'Billable', value: true },
                    { text: 'Non-billable', value: false },
                  ].map(item => (
                    <Select.Option value={item.value}>{item.text}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* School - Payor */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="School" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('codeSchool', {
                rules: [{ required: true, message: 'Please select School' }],
              })(
                <Select placeholder="Select School">
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
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Payor" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('payor', {
                rules: [{ required: true, message: 'Please select Payor' }],
              })(
                <Select placeholder="Select Payor">
                  {payorList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.firstname}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Default Units - Calculation Type */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Default Units" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('defaultUnits', {
                rules: [{ required: true, message: 'Please select default unit' }],
              })(
                <Select placeholder="Select Default Units">
                  {codeUnits.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.unit}({item.minutes} min)
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Calculation Type" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('calculationType', {
                rules: [{ required: true, message: 'Please select Calculation type' }],
              })(
                <Select placeholder="Select Calculation Type">
                  {calculationTypes.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Permissions */}
        <Row>
          <Col span={24}>
            <Form.Item label="Permissions" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('codePermission', {
                rules: [{ required: true, message: 'Please select Permission' }],
              })(
                <Select mode="multiple" placeholder="Select Permissions">
                  {userRole.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
            Submit
          </Button>
          <Button onClick={() => this.onReset} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(AddCode)
