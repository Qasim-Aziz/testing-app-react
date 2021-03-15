/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Select, notification, Input } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import './clinicProfile.scss'

const { Option } = Select

const UPDATE_CLINIC = gql`
  mutation(
    $bankName: String
    $bankAccountNo: String
    $ifscCode: String
    $accountHolderName: String
    $billingName: String
    $currency: ID
  ) {
    updateClinic(
      input: {
        bankName: $bankName
        bankAccountNo: $bankAccountNo
        ifscCode: $ifscCode
        accountHolderName: $accountHolderName
        billingName: $billingName
        currency: $currency
      }
    ) {
      school {
        id
        schoolName
        bankName
        bankAccountNo
        ifscCode
        accountHolderName
        billingName
        currency {
          id
          currency
          symbol
        }
      }
    }
  }
`

const SCHOOL_CURRENCY = gql`
  query($id: ID!) {
    school(id: $id) {
      id
      schoolName
      bankAccountNo
      bankName
      ifscCode
      accountHolderName
      billingName
      currency {
        id
        currency
        symbol
      }
    }
  }
`

const CURRENCY = gql`
  query {
    currency {
      id
      currency
      symbol
    }
  }
`

const ADD_CURRENCY = gql`
  mutation addCurrency($id: ID!) {
    addCurrency(input: { currencyId: $id }) {
      currency {
        id
        currency
        symbol
      }
    }
  }
`

const InvoiceRelated = ({ form }) => {
  const [newCurrency, setNewCurrency] = useState()
  const schoolId = localStorage.getItem('userId')
  const { data, error, loading, refetch } = useQuery(SCHOOL_CURRENCY, {
    variables: {
      id: schoolId,
    },
    fetchPolicy: 'no-cache',
  })
  const { data: currencyData, error: currencyError, loading: currencyLoading } = useQuery(CURRENCY)

  const [
    addCurrency,
    { data: addCurrencyData, error: addCurrencyError, loading: addCurrencyLoading },
  ] = useMutation(ADD_CURRENCY)

  const [updateInvoiceDetails, { loading: updateInvoiceDetailLoading }] = useMutation(UPDATE_CLINIC)

  console.log(data, 'currencyData')
  // useEffect(() => {
  //   if (data) {
  //     setNewCurrency(data.schoolDetail.currency?.id)
  //   }
  // }, [data])

  useEffect(() => {
    if (currencyError) {
      notification.error({
        message: 'Faild to load avalable currency list',
      })
    }
  }, [currencyError])

  useEffect(() => {
    if (addCurrencyData) {
      notification.success({
        message: 'School currency update sucessfully',
      })
      refetch()
    }
    if (addCurrencyError) {
      notification.error({
        message: 'School currency update failed',
      })
    }
  }, [addCurrencyData, addCurrencyError])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      console.log(err, values, 'err values')
      if (!err) {
        updateInvoiceDetails({
          variables: {
            bankName: values.bankName,
            accountHolderName: values.accountHolderName,
            bankAccountNo: values.accountNo,
            ifscCode: values.ifscCode,
            currency: values.currency,
            billingName: values.billingName,
          },
        })
          .then(res => {
            console.log(res, 'res')
            notification.success({
              message: 'Details updated successfully',
            })
          })
          .catch(errDt => {
            console.log(errDt, 'err')
            notification.error({
              message: 'Something went wrong',
              description: 'Unable to update bank details',
            })
          })
      }
    })
    // addCurrency({
    //   variables: {
    //     id: newCurrency,
    //   },
    // })
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="profileForm invoice-related">
      <Form.Item label="Bank Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('bankName', {
          initialValue: data.school.bankName,
          rules: [{ required: true, message: 'Please provide bank name' }],
        })(<Input style={{ width: 220 }} />)}
      </Form.Item>
      <Form.Item label="A/C No" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('accountNo', {
          initialValue: data.school.bankAccountNo,
          rules: [{ required: true, message: 'Please provide account number' }],
        })(<Input style={{ width: 220 }} />)}
      </Form.Item>
      <Form.Item label="IFSC Code" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('ifscCode', {
          initialValue: data.school.ifscCode,
          rules: [{ required: true, message: "Please provide bank's IFSC code" }],
        })(<Input style={{ width: 220 }} />)}
      </Form.Item>
      <Form.Item label="A/C Holder's Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('accountHolderName', {
          initialValue: data.school.accountHolderName,
          rules: [{ required: true, message: 'Please provide account holder name' }],
        })(<Input style={{ width: 220 }} />)}
      </Form.Item>
      <Form.Item label="Billing Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('billingName', {
          initialValue: data.school.billingName ? data.school.billingName : data.school.schoolName,
          rules: [{ required: true, message: 'Please provide bank name' }],
        })(<Input style={{ width: 220 }} />)}
      </Form.Item>
      <Form.Item label="Change Currency" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        {form.getFieldDecorator('invoiceCurrency', {
          initialValue: data.school.currency.id,
          rules: [{ required: true, message: 'Please provide invoice currency' }],
        })(
          <Select
            loading={currencyLoading}
            defaultActiveFirstOption
            placeholder="Select a currency"
            style={{ width: 220 }}
          >
            {currencyData?.currency.map(({ id, currency, symbol }) => {
              return (
                <Option key={id} value={id}>
                  {`${symbol} - ${currency}`}
                </Option>
              )
            })}
          </Select>,
        )}
      </Form.Item>
      <Row>
        <Col offset={8}>
          <Button loading={updateInvoiceDetailLoading} type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(InvoiceRelated)
