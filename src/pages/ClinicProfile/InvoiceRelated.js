/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Select, notification, Input, Tabs } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from 'components/LoadingComponent'
import BankDetails from './Invoices/bankDetails'
import OtherPaymentMethods from './Invoices/otherPaymentMethods'
import './clinicProfile.scss'
import GeneralInfoProfile from './Invoices/generalInfoProfile'

const { Option } = Select
const { TabPane } = Tabs

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
    <div className="profileForm invoice-related">
      <div className="profileTab-heading">
        <p>Invoice</p>
      </div>
      <Tabs>
        <TabPane tab="General Info" key="gg">
          <GeneralInfoProfile />
        </TabPane>
        <TabPane tab="Bank Details" key="bg">
          <BankDetails />
        </TabPane>
        <TabPane tab="Other Methods" key="tg">
          <OtherPaymentMethods />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Form.create()(InvoiceRelated)
