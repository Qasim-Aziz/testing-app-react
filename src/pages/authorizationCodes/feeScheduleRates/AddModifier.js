import React, { useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const AddModifier = ({ form, modifiers, addModifierRate, closeDrawer }) => {
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      addModifierRate(values)
      console.log('values', values)
      closeDrawer()
      form.resetFields()
    })
  }
  const itemStyle = { marginBottom: '5px' }
  return (
    <>
      {' '}
      <Form {...layout} onSubmit={e => handleSubmit(e)}>
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

export default Form.create()(AddModifier)
