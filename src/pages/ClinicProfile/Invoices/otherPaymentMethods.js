import React from 'react'
import gql from 'graphql-tag'
import { Button, Form, Input, notification } from 'antd'
import { useMutation, useQuery } from 'react-apollo'
import LoadingComponent from 'components/LoadingComponent'
import { validateSDL } from 'graphql/validation/validate'

const UPDATE_CLINIC = gql`
  mutation($upi: String, $paytm: String, $gpay: String) {
    updateClinic(input: { upi: $upi, paytm: $paytm, gpay: $gpay }) {
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
      paytm
      gpay
      upi
    }
  }
`

function OtherPaymentMethods({ form }) {
  const schoolId = localStorage.getItem('userId')
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
            upi: values.upi,
            gpay: values.gpay,
            paytm: values.paytm,
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
        label="UPI"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ paddingTop: '2em' }}
      >
        {form.getFieldDecorator('upi', {
          initialValue: data.school.upi,
          rules: [{ required: true, message: 'Please provide upi' }],
        })(<Input style={{ width: '80%' }} />)}
      </Form.Item>
      <Form.Item label="Paytm Number" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        {form.getFieldDecorator('paytm', {
          initialValue: data.school.paytm,
          rules: [{ required: true, message: 'Please provide paytm number' }],
        })(<Input style={{ width: '80%' }} />)}
      </Form.Item>
      <Form.Item label="GPay Number" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        {form.getFieldDecorator('gpay', {
          initialValue: data.school.gpay,
          rules: [{ required: true, message: 'Please provide gpay number' }],
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

export default Form.create()(OtherPaymentMethods)
