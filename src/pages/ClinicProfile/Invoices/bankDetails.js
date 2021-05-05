/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Select, notification, Input } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from 'components/LoadingComponent'

const { Option } = Select

const UPDATE_CLINIC = gql`
  mutation(
    $bankName: String
    $bankAccountNo: String
    $ifscCode: String
    $accountHolderName: String
  ) {
    updateClinic(
      input: {
        bankName: $bankName
        bankAccountNo: $bankAccountNo
        ifscCode: $ifscCode
        accountHolderName: $accountHolderName
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

function BankDetails({ form }) {
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

  console.log(currencyData, 'currencyData')
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
          },
        })
          .then(res => {
            notification.success({
              message: 'Details updated successfully',
            })
          })
          .catch(errDt => console.log(errDt, 'err'))
      }
    })
  }

  if (loading) {
    return <LoadingComponent />
  }
  if (error) {
    return <div>Oops! Something went wrong</div>
  }

  return (
    <div>
      <Form.Item
        label="Bank Name"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ paddingTop: '2em' }}
      >
        {form.getFieldDecorator('bankName', {
          initialValue: data.school.bankName,
          rules: [{ required: true, message: 'Please provide bank name' }],
        })(<Input style={{ width: '80%' }} />)}
      </Form.Item>
      <div style={{ display: 'flex' }}>
        <Form.Item
          label="A/C No"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ width: '40%', paddingRight: '1em' }}
        >
          {form.getFieldDecorator('accountNo', {
            initialValue: data.school.bankAccountNo,
            rules: [{ required: true, message: 'Please provide account number' }],
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item
          label="IFSC Code"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ width: '40%' }}
        >
          {form.getFieldDecorator('ifscCode', {
            initialValue: data.school.ifscCode,
            rules: [{ required: true, message: "Please provide bank's IFSC code" }],
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
      </div>
      <Form.Item label="A/C Holder's Name" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        {form.getFieldDecorator('accountHolderName', {
          initialValue: data.school.accountHolderName,
          rules: [{ required: true, message: 'Please provide account holder name' }],
        })(<Input style={{ width: '80%' }} />)}
      </Form.Item>
      <div style={{ display: 'flex' }}>
        <Button loading={updateInvoiceDetailLoading} type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default Form.create()(BankDetails)
