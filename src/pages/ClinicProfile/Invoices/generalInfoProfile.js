import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { Button, Form, Input, Select, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from 'components/LoadingComponent/index'

const { Option } = Select

const CURRENCY = gql`
  query {
    currency {
      id
      currency
      symbol
    }
  }
`

const UPDATE_CLINIC = gql`
  mutation($billingName: String, $currency: ID) {
    updateClinic(input: { billingName: $billingName, currency: $currency }) {
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

function GeneralInfo({ form }) {
  const [newCurrency, setNewCurrency] = useState()
  const schoolId = localStorage.getItem('userId')
  const { data: currencyData, error: currencyError, loading: currencyLoading } = useQuery(CURRENCY)
  const { data, error, loading, refetch } = useQuery(SCHOOL_CURRENCY, {
    variables: {
      id: schoolId,
    },
    fetchPolicy: 'no-cache',
  })

  const [updateInvoiceDetails, { loading: updateInvoiceDetailLoading }] = useMutation(UPDATE_CLINIC)

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      console.log(err, values, 'err values')
      if (!err) {
        updateInvoiceDetails({
          variables: {
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
        label="Billing Name"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ paddingTop: '2em' }}
      >
        {form.getFieldDecorator('billingName', {
          initialValue: data.school.billingName ? data.school.billingName : data.school.schoolName,
          rules: [{ required: true, message: 'Please provide billing Name' }],
        })(<Input style={{ width: '80%' }} />)}
      </Form.Item>
      <Form.Item
        label="Currency"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ width: '80%' }}
      >
        {form.getFieldDecorator('currency', {
          initialValue: data.school.currency?.id,
          rules: [{ required: true, message: 'Please provide invoice currency' }],
        })(
          <Select
            loading={currencyLoading}
            defaultActiveFirstOption
            placeholder="Select a currency"
            style={{ width: '100%' }}
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

      <div style={{ display: 'flex' }}>
        <Button onClick={handleSubmit} loading={updateInvoiceDetailLoading} type="primary">
          Save
        </Button>
      </div>
    </div>
  )
}

export default Form.create()(GeneralInfo)
