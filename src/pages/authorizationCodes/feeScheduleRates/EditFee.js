import React from 'react'
import { Form, InputNumber, Button, Select, Row, Col, Divider } from 'antd'
import { connect } from 'react-redux'
import { times } from 'ramda'
import { PlusOutlined } from '@ant-design/icons'
import actions from 'redux/authorizationCodes/actions'
import { FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { modifierActions, modifierDispatch } from './modifierActions'
import ModifierForm from './ModifierForm'

const { layout, tailLayout } = FORM

@connect(({ authorizationCode }) => ({ authorizationCode }))
class EditFee extends React.Component {
  constructor(props) {
    super(props)
    this.state = { modifierRates: [], modifierCount: 0 }
  }

  componentDidMount() {
    const { form, feeProfile } = this.props
    const list = []
    if (feeProfile.modifierRates && feeProfile.modifierRates.edges.length > 0) {
      const subNodes = feeProfile.modifierRates.edges.map(({ node }) => {
        list.push({
          modifier: node.modifier.id,
          rate: node.rate,
          agreedRate: node.agreedRate,
        })
        return node.modifier.name
      })
    }
    this.setState({
      modifierRates: [...list],
      modifierCount: list.length,
    })
    form.setFieldsValue({
      payor: feeProfile?.payor?.id,
      code: feeProfile?.code.id,
      rate: feeProfile?.rate,
      agreedRate: feeProfile?.agreedRate,
    })
  }

  updateModifierCount = updateAction => {
    const { modifierCount } = this.state
    const updatedCount = updateAction(modifierCount)
    this.setState({
      modifierCount: updatedCount,
    })
  }

  updateModifier = ({ type, payload }) => {
    let { modifierRates } = this.state
    modifierRates = modifierDispatch(type, payload, modifierRates)
    this.setState({ modifierRates })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, feeProfile, closeDrawer } = this.props

    form.validateFields((err, values) => {
      const { modifierRates } = this.state
      values.modifierRates = modifierRates
      if (!err) {
        dispatch({
          type: actions.EDIT_FEE_SCHEDULE,
          payload: {
            id: feeProfile.id,
            values,
          },
        })
        closeDrawer()
        form.resetFields()
      }
    })
  }

  render() {
    const { modifierCount, modifierRates } = this.state
    const { form, codeList, payorList, modifiers, feeProfile } = this.props

    if (!feeProfile) return <h3>An error occurred to load Fee Schedule Rate details.</h3>

    return (
      <Form className="addEditFeeScheduleRate" onSubmit={e => this.handleSubmit(e)}>
        <Divider orientation="left">Basic Details</Divider>
        {/* Payor - Service Code */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Payor" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('payor', {
                rules: [{ required: true, message: 'Please select Payor' }],
              })(
                <Select
                  placeholder="Select Payor"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {payorList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.firstname}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Service Code" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('code', {
                rules: [{ required: true, message: 'Please select Service code' }],
              })(
                <Select placeholder="Select Code">
                  {codeList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.code}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* Unit Rate - Agreed Rate */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Unit Rate" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('rate', { initialValue: '' })(
                <InputNumber placeholder="Enter Rate" />,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Agreed Rate" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('agreedRate', { initialValue: '' })(
                <InputNumber placeholder="Enter Agreed Rate" />,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Modifiers</Divider>
        {console.log('modifierCount', modifierCount)}
        {times(n => {
          return (
            <ModifierForm
              key={n}
              index={n}
              setModifierCount={this.updateModifierCount}
              allModifierCodes={modifiers}
              modifierRates={modifierRates}
              updateModifier={this.updateModifier}
            />
          )
        }, modifierCount)}
        <Row>
          <Col offset={6} span={12}>
            <Button
              type="dashed"
              onClick={() => {
                this.updateModifierCount(value => value + 1)
                this.updateModifier({ type: modifierActions.ADD_MODIFIER })
              }}
              style={{ width: '100%', margin: '10px 0px' }}
            >
              <PlusOutlined /> Add another Modifier
            </Button>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={this.onReset} className="ml-4">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(EditFee)
