import React from 'react'
import { Form, Input, Button, Select, Divider, Switch, Icon, Collapse, Row, Col } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/authorizationCodes/actions'

const { TextArea } = Input

@connect(({ authorizationCode }) => ({ authorizationCode }))
class EditCode extends React.Component {
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

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, codeProfile, closeDrawer } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: actions.EDIT_AUTHORIZATION_CODE,
          payload: {
            id: codeProfile.id,
            values,
          },
        })
        closeDrawer()
        form.resetFields()
      }
    })
  }

  codeActiveInactive = checked => {
    const { dispatch, codeProfile, closeDrawer } = this.props
    dispatch({
      type: actions.AUTHORIZATION_CODES_ACTIVE_INACTIVE,
      payload: {
        id: codeProfile.id,
        isActive: checked,
      },
    })
    codeProfile.isActive = checked
  }

  render() {
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

    if (!codeProfile) return <h3>An error occurred to load Code details.</h3>

    return (
      <Form className="addEditCode" onSubmit={e => this.handleSubmit(e)}>
        <Divider orientation="left">Code Status</Divider>
        <Row>
          <Col span={24}>
            <Form.Item label="Status" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={codeProfile.isActive}
                onChange={this.codeActiveInactive}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Basic Details</Divider>

        {/* Code */}
        <Row>
          <Col sm={24} md={24}>
            <Form.Item label="Code" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('code', {
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
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="primary" onClick={this.onReset} className="ml-4">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(EditCode)
