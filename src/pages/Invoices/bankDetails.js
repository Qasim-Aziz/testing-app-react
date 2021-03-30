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
import { COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import './invoices.scss'
import LoadingComponent from 'components/LoadingComponent'

const { Header, Content } = Layout
const { Text } = Typography
const { layout, tailLayout } = FORM

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
    return <LoadingComponent />
  }
  return (
    <div>
      <Layout>
        <Content>
          <Form {...layout} className="update-bank-details">
            <Divider orientation="left">General Details</Divider>
            <Form.Item label="Company Name">
              {form.getFieldDecorator('institutionName', {
                initialValue: details.institutionName,
                rules: [{ required: true, message: 'Please provide company name' }],
              })(<Input placeholder="Name"></Input>)}
            </Form.Item>

            <Form.Item label="Street Address">
              {form.getFieldDecorator('street', {
                initialValue: details.streetAddress,
              })(<Input placeholder="Street Address" />)}
            </Form.Item>

            <Form.Item label="City">
              {form.getFieldDecorator('city', {
                initialValue: details.city,
                rules: [{ required: true, message: 'Please provide City' }],
              })(<Input placeholder="City" />)}
            </Form.Item>

            <Form.Item label="State">
              {form.getFieldDecorator('state', {
                initialValue: details.state,
                rules: [{ required: true, message: 'Please provide State' }],
              })(<Input placeholder="State" />)}
            </Form.Item>

            <Form.Item label="Country">
              {form.getFieldDecorator('country', {
                initialValue: details.country.id,
                rules: [{ required: true, message: 'Please provide Country' }],
              })(
                <Select>
                  <Select.Option key={Math.random()} value={details.country.id}>
                    {details.country.name}
                  </Select.Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="Pincode">
              {form.getFieldDecorator('pincode', {
                initialValue: details.pincode,
                rules: [{ required: true, message: 'Please provide pincode' }],
              })(<Input placeholder="Pincode" />)}
            </Form.Item>

            <Form.Item label="GSTIN">
              {form.getFieldDecorator('gstin', {
                initialValue: details.gstin,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="GST number"></Input>)}
            </Form.Item>

            <Divider orientation="left">Bank Details</Divider>
            <Form.Item label="Account No.">
              {form.getFieldDecorator('accountNo', {
                initialValue: details.accountNo,
                rules: [{ required: true, message: 'Please provide account number' }],
              })(<Input placeholder="Account number"></Input>)}
            </Form.Item>

            <Form.Item label="IFSC Code">
              {form.getFieldDecorator('ifscCode', {
                initialValue: details.ifscCode,
                rules: [{ required: true, message: 'Please provide IFSC Code' }],
              })(<Input placeholder="IFSC Code"></Input>)}
            </Form.Item>
            <Form.Item label="Account Holder's Name">
              {form.getFieldDecorator('accountHolderName', {
                initialValue: details.accountHolderName,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="Account Holder name"></Input>)}
            </Form.Item>

            <Form.Item label="Bank and Branch Name">
              {form.getFieldDecorator('bankName', {
                initialValue: details.bankName,
                rules: [{ required: true, message: 'Please provide gst number' }],
              })(<Input placeholder="Bank Name"></Input>)}
            </Form.Item>

            <Divider orientation="left">Other Methods</Divider>
            <Form.Item label="UPI ">
              {form.getFieldDecorator('upi', {
                initialValue: details.upi,
              })(<Input placeholder="ID"></Input>)}
            </Form.Item>

            <Form.Item label="Google Pay">
              {form.getFieldDecorator('gpay', {
                initialValue: details.gpay,
              })(<Input placeholder="Gpay Mobile Number"></Input>)}
            </Form.Item>

            <Form.Item label="Paytm">
              {form.getFieldDecorator('paytm', {
                initialValue: details.paytm,
              })(<Input placeholder="Paytm Mogile NUmber"></Input>)}
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Popconfirm
                title="Are you sure, that all the details filled are correct ?"
                onConfirm={handleSubmitt}
              >
                <Button
                  loading={updateLoading}
                  type="primary"
                  htmlType="submit"
                  style={SUBMITT_BUTTON}
                >
                  Update
                </Button>
              </Popconfirm>
              <Button type="ghost" style={CANCEL_BUTTON}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)
