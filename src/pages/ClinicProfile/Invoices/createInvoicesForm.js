import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import { FORM, DRAWER, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { Form, Input, DatePicker, Drawer, Button, notification, Popconfirm } from 'antd'
import { CREATE_STUDENT_INVOICE } from './query'

const { layout, tailLayout } = FORM

function AdvanceInvoiceForm({ form, studentId, closeDrawer }) {
  const [createStudentInvoice, { loading: createStudentInvoiceLoading }] = useMutation(
    CREATE_STUDENT_INVOICE,
  )
  const handleSubmitt = e => {
    e.preventDefault()

    form.validateFields((error, values) => {
      if (!error && studentId) {
        console.log(values, studentId)
        createStudentInvoice({
          variables: {
            student: studentId,
            month: moment(values.month).format('MMM'),
            cgst: values.cgst,
            sgst: values.sgst,
            tax: values.tax ? Number(values.tax) : 0,
            discount: values.discount ? Number(values.discount) : 0,
          },
        })
          .then(res => {
            notification.success({
              message: 'Invoice generated successfully',
            })
            closeDrawer()
          })
          .catch(err => console.error(err, 'error'))
      }
    })
  }

  return (
    <div>
      <Form {...layout}>
        <Form.Item label="Month">
          {form.getFieldDecorator('month', {
            initialValue: moment(),
            rules: [{ required: true, message: 'Please provide Month!' }],
          })(<DatePicker.MonthPicker />)}
        </Form.Item>
        <Form.Item label="Discount">
          {form.getFieldDecorator('discount', {
            rules: [{ required: false, message: 'Please provide Discount!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="CGST">
          {form.getFieldDecorator('cgst', {
            initialValue: 9,
            rules: [{ required: true, message: 'Please provide CGST!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="SGST">
          {form.getFieldDecorator('sgst', {
            initialValue: 9,
            rules: [{ required: true, message: 'Please provide SGST!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Tax">
          {form.getFieldDecorator('tax', {
            rules: [{ required: false, message: 'Please provide Tax!' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Popconfirm
            title="Make sure all the filled details are correct."
            onConfirm={e => handleSubmitt(e)}
          >
            <Button type="default" loading={createStudentInvoiceLoading} style={SUBMITT_BUTTON}>
              Create Invoice
            </Button>
          </Popconfirm>
          <Button onClick={closeDrawer} type="ghost" style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create()(AdvanceInvoiceForm)
