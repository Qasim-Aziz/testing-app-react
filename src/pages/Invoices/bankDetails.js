/* eslint-disable */
import React from 'react'
import { Form, Button, Input, Select, Layout, Typography, Divider } from 'antd'

const { Header, Content } = Layout
const { Text } = Typography

const itemStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
}
const inputStyle = {
  width: '295px',
  borderRadius: 0,
}
function BankDetails({ form }) {
  return (
    <div>
      <Layout>
        <Content>
          <Form>
            <Divider orientation="left">General Details</Divider>
            <Form.Item
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              label="Institution Name"
            >
              <Input placeholder="Name" style={inputStyle}></Input>
            </Form.Item>

            <Form.Item label="Street Address" style={itemStyle}>
              {form.getFieldDecorator('street', {
                rules: [{ message: 'Please provide Street Name' }],
              })(<Input placeholder="Street Address" style={inputStyle} />)}
            </Form.Item>

            <Form.Item label="State" style={itemStyle}>
              {form.getFieldDecorator('state', { rules: [{ message: 'Please provide State' }] })(
                <Input placeholder="State" style={inputStyle} />,
              )}
            </Form.Item>

            <Form.Item label="City" style={itemStyle}>
              {form.getFieldDecorator('city', { rules: [{ message: 'Please provide City' }] })(
                <Input placeholder="City" style={inputStyle} />,
              )}
            </Form.Item>

            <Form.Item label="Country" style={itemStyle}>
              {form.getFieldDecorator('country', {
                rules: [{ message: 'Please provide Country' }],
              })(<Input placeholder="Country" style={inputStyle} />)}
            </Form.Item>
            <Form.Item label="Pincode" style={itemStyle}>
              {form.getFieldDecorator('pincode', {
                rules: [{ message: 'Please provide pincode' }],
              })(<Input placeholder="Pincode" style={inputStyle} />)}
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="GSTIN">
              <Input placeholder="GST number" style={inputStyle}></Input>
            </Form.Item>

            <Divider orientation="left">Bank Details</Divider>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="Account No.">
              <Input placeholder="Account Number" style={inputStyle}></Input>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="IFSC Code">
              <Input placeholder="IFSC Code" style={inputStyle}></Input>
            </Form.Item>
            <Form.Item
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              label="Account Holder's Name"
            >
              <Input placeholder="Name" style={inputStyle}></Input>
            </Form.Item>
            <Form.Item
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              label="Bank and Branch Name"
            >
              <Input placeholder="Bank Name" style={inputStyle}></Input>
            </Form.Item>

            <Divider orientation="left">Other Methods</Divider>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="UPI ">
              <Input placeholder="ID" style={inputStyle}></Input>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="PayTm No.">
              <Input placeholder="Mobile Number" style={inputStyle}></Input>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }} label="GPay No.">
              <Input placeholder="Mobile Number" style={inputStyle}></Input>
            </Form.Item>
            <div
              style={{ width: 500, display: 'flex', justifyContent: 'center', margin: '20px 0' }}
            >
              <Button type="primary" style={{ margin: 5 }}>
                Update
              </Button>
              <Button type="ghost" style={{ margin: 5 }}>
                Cancel
              </Button>
            </div>
          </Form>
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)
