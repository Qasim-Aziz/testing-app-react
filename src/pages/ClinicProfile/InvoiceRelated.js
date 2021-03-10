/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Select, notification, Input } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { Option } = Select

const SCHOOL_CURRENCY = gql`
  query($id: ID!) {
    school(id: $id) {
      id
      bankAccountNo
      bankName
      ifscCode
      bankBrach
      accountTitle
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

export default () => {
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

  const handleSubmit = () => {
    addCurrency({
      variables: {
        id: newCurrency,
      },
    })
  }

  return (
    <div className="profileForm">
      <Form.Item label="Bank Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Input style={{ width: 220 }} />
      </Form.Item>
      <Form.Item label="A/C No" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Input style={{ width: 220 }} />
      </Form.Item>{' '}
      <Form.Item label="IFSC Code" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Input style={{ width: 220 }} />
      </Form.Item>{' '}
      <Form.Item label="A/C Holder's Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Input style={{ width: 220 }} />
      </Form.Item>{' '}
      <Form.Item label="Billing Name" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Input style={{ width: 220 }} />
      </Form.Item>
      <Form.Item label="Change Currency" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
        <Select
          loading={currencyLoading}
          defaultActiveFirstOption
          value={newCurrency}
          onChange={v => setNewCurrency(v)}
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
        </Select>
      </Form.Item>
      <Row>
        <Col offset={8}>
          <Button type="primary" onClick={handleSubmit} loading={addCurrencyLoading}>
            Save
          </Button>
        </Col>
      </Row>
    </div>
  )
}
