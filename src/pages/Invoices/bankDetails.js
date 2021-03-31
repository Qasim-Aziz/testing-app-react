/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Input,
  Select,
  Layout,
  Typography,
  Divider,
  notification,
  Popconfirm,
} from 'antd'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import { GET_PAYMENT_DETAILS, UPDATE_PAYMENT_DETAILS } from './query'
import './invoices.scss'

const { Header, Content } = Layout
const { Text } = Typography

const itemStyle = {
  display: 'flex',
  marginRight: '25px',
  justifyContent: 'flex-end',
}
const inputStyle = {
  width: '295px',
  borderRadius: 0,
}
function BankDetails({ form, setBankDetailsDrawer }) {
  const { data: detailsData, loading: detailsLoading, error: detailsError } = useQuery(
    GET_PAYMENT_DETAILS,
  )
  const [updatePaymentDetails, { loading: updateLoading }] = useMutation(UPDATE_PAYMENT_DETAILS)
  const [details, setDetails] = useState({})

  useEffect(() => {
    if (detailsData) {
      setDetails({
        id: detailsData.recievingPaymentDetails.id,
        institutionName: detailsData.recievingPaymentDetails.institutionName,
        streetAddress: detailsData.recievingPaymentDetails.streetAddress,
        state: detailsData.recievingPaymentDetails.state,
        city: detailsData.recievingPaymentDetails.city,
        country: detailsData.recievingPaymentDetails.country,
        pincode: detailsData.recievingPaymentDetails.pincode,
        accountNo: detailsData.recievingPaymentDetails.accountNo,
        accountHolderName: detailsData.recievingPaymentDetails.accountHolderName,
        bankName: detailsData.recievingPaymentDetails.bankName,
        ifscCode: detailsData.recievingPaymentDetails.ifscCode,
        gstin: detailsData.recievingPaymentDetails.gstin,
        upi: detailsData.recievingPaymentDetails.upi,
        gpay: detailsData.recievingPaymentDetails.gpay,
        paytm: detailsData.recievingPaymentDetails.paytm,
      })
    }
  }, [detailsData])

  console.log(detailsData, 'jhjh')
  console.log(details, 'dt')

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        updatePaymentDetails({
          variables: {
            pk: details.id,
            institutionName: values.institutionName,
            accountHolderName: values.accountHolderName,
            accountNo: values.accountNo,
            bankName: values.bankName,
            city: values.city,
            country: values.country,
            gpay: values.gpay,
            ifscCode: values.ifscCode,
            pincode: values.pincode,
            paytm: values.paytm,
            state: values.state,
            streetAddress: values.street,
            upi: values.upi,
            gstin: values.gstin,
          },
        })
          .then(res => {
            setBankDetailsDrawer(false)
            notification.success({
              message: 'Details updated successfully',
            })
          })
          .catch(err => {
            notification.error({
              message: 'Something went wrong',
            })
          })
      }
    })
  }

  if (detailsLoading || !details.institutionName) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Layout>
        <Content>
          <Form className="update-bank-details">
            <Divider orientation="left">General Details</Divider>
            <Form.Item style={itemStyle} label="Company Name">
              {form.getFieldDecorator('institutionName', {
                initialValue: details.institutionName,
                rules: [{ required: true, message: 'Please provide company name' }],
              })(<Input placeholder="Name" style={inputStyle}></Input>)}
            </Form.Item>

            <Form.Item label="Street Address" style={itemStyle}>
              {form.getFieldDecorator('street', {
                initialValue: details.streetAddress,
              })(<Input placeholder="Street Address" style={inputStyle} />)}
            </Form.Item>

            <Form.Item label="City" style={itemStyle}>
              {form.getFieldDecorator('city', {
                initialValue: details.city,
                rules: [{ required: true, message: 'Please provide City' }],
              })(<Input placeholder="City" style={inputStyle} />)}
            </Form.Item>

            <Form.Item label="State" style={itemStyle}>
              {form.getFieldDecorator('state', {
                initialValue: details.state,
                rules: [{ required: true, message: 'Please provide State' }],
              })(<Input placeholder="State" style={inputStyle} />)}
            </Form.Item>

            <Form.Item label="Country" style={itemStyle}>
              {form.getFieldDecorator('country', {
                initialValue: details.country.id,
                rules: [{ required: true, message: 'Please provide Country' }],
              })(
                <Select style={inputStyle}>
                  <Select.Option key={Math.random()} value={details.country.id}>
                    {details.country.name}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="Pincode" style={itemStyle}>
              {form.getFieldDecorator('pincode', {
                initialValue: details.pincode,
                rules: [{ required: true, message: 'Please provide pincode' }],
              })(<Input placeholder="Pincode" style={inputStyle} />)}
            </Form.Item>

            <Form.Item style={itemStyle} label="GSTIN">
              {form.getFieldDecorator('gstin', {
                initialValue: details.gstin,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="GST number" style={inputStyle}></Input>)}
            </Form.Item>

            <Divider orientation="left">Bank Details</Divider>
            <Form.Item style={itemStyle} label="Account No.">
              {form.getFieldDecorator('accountNo', {
                initialValue: details.accountNo,
                rules: [{ required: true, message: 'Please provide account number' }],
              })(<Input placeholder="Account number" style={inputStyle}></Input>)}
            </Form.Item>

            <Form.Item style={itemStyle} label="IFSC Code">
              {form.getFieldDecorator('ifscCode', {
                initialValue: details.ifscCode,
                rules: [{ required: true, message: 'Please provide IFSC Code' }],
              })(<Input placeholder="IFSC Code" style={inputStyle}></Input>)}
            </Form.Item>
            <Form.Item style={itemStyle} label="Account Holder's Name">
              {form.getFieldDecorator('accountHolderName', {
                initialValue: details.accountHolderName,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="Account Holder name" style={inputStyle}></Input>)}
            </Form.Item>

            <Form.Item style={itemStyle} label="Bank and Branch Name">
              {form.getFieldDecorator('bankName', {
                initialValue: details.bankName,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="Bank Name" style={inputStyle}></Input>)}
            </Form.Item>

            <Divider orientation="left">Other Methods</Divider>
            <Form.Item style={itemStyle} label="UPI ">
              {form.getFieldDecorator('upi', {
                initialValue: details.upi,
              })(<Input placeholder="ID" style={inputStyle}></Input>)}
            </Form.Item>

            <Form.Item style={itemStyle} label="Google Pay">
              {form.getFieldDecorator('gpay', {
                initialValue: details.gpay,
              })(<Input placeholder="Gpay Mobile Number" style={inputStyle}></Input>)}
            </Form.Item>

            <Form.Item style={itemStyle} label="Paytm">
              {form.getFieldDecorator('paytm', {
                initialValue: details.paytm,
              })(<Input placeholder="Paytm Mogile NUmber" style={inputStyle}></Input>)}
            </Form.Item>

            <div
              style={{ width: 535, display: 'flex', justifyContent: 'center', margin: '20px 0' }}
            >
              <Popconfirm
                title="Are you sure all the details filled are correct ?"
                onConfirm={handleSubmitt}
              >
                <Button
                  loading={updateLoading}
                  type="primary"
                  htmlType="submit"
                  style={{ margin: 5 }}
                >
                  Update
                </Button>
              </Popconfirm>
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
