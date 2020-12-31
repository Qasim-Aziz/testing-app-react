/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import { Form, Input, Button, Select } from 'antd'
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
class EditModifier extends React.Component {
  state = { modifierList: [] }

  componentDidMount() {
    const { form, modifierProfile, feeProfile } = this.props
    const list = []
    console.log('profile', modifierProfile)
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
      modifier: modifierProfile?.modifier.id,
      rate: modifierProfile?.rate,
      agreedRate: modifierProfile?.agreedRate,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, modifierProfile, feeProfile } = this.props

    form.validateFields((err, values) => {
      feeProfile.modifierRates = [...this.state.modifierList, values]
      console.log('values', values)
      console.log('feeProfile', feeProfile)
      // if (!err) {
      //   dispatch({
      //     type: actions.EDIT_FEE_SCHEDULE,
      //     payload: {
      //       id: feeProfile.id,
      //       values: values,
      //     },
      //   })
      //   this.props.closeDrawer()
      //   form.resetFields()
      // }
    })
  }

  render() {
    const itemStyle = { marginBottom: '0' }
    const { form, modifiers } = this.props

    return (
      <>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
          <Form.Item label="Modifier" style={itemStyle}>
            {form.getFieldDecorator('modifier')(
              <Select size="small" placeholder="Select Modifiers">
                {modifiers.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Unit Rate" style={itemStyle}>
            {form.getFieldDecorator('rate', { initialValue: '' })(<Input size="small" />)}
          </Form.Item>
          <Form.Item label="Agreed Rate" style={itemStyle}>
            {form.getFieldDecorator('agreedRate', { initialValue: '' })(<Input size="small" />)}
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default Form.create()(EditModifier)
