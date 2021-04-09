import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import { FORM, DRAWER, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { Form, Input, DatePicker, Drawer, Button, notification, Popconfirm } from 'antd'
import { ADVANCE_INVOICE, MONTHLY_INVOICE } from './query'

const { layout, tailLayout } = FORM

function AdvanceInvoiceForm({
  form,
  selectedClinicsName,
  selectedRowKeys,
  invoiceType,
  closeDrawer,
}) {
  const [advMonth, setAdvMonth] = useState(
    invoiceType === 'advance' ? moment() : moment().subtract(1, 'M'),
  )

  const [createAdvanceInvoice, { loading: advanceLoading }] = useMutation(ADVANCE_INVOICE)
  const [createMonthlyInvoice, { loading: monthlyLoading }] = useMutation(MONTHLY_INVOICE)

  const handleSubmitt = e => {
    e.preventDefault()

    form.validateFields((error, values) => {
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        if (!error) {
          if (invoiceType === 'advance') {
            createAdvanceInvoice({
              variables: {
                month: values.month?.format('MMMM'),
                clinics: selectedRowKeys,
                cgst: values.cgst,
                sgst: values.sgst,
                discount: values.discount,
                generateLink: true,
              },
            })
              .then(res => {
                if (res) {
                  console.log(res, 'res')
                  notification.success({
                    message: 'Request sent successsfully',
                    description: 'Invoices are generating, wait for some time',
                  })
                }
              })
              .catch(err => {
                notification.error({
                  message: 'Something went wrong',
                  description: 'Unable to send request to create invoices',
                })
              })
          } else if (invoiceType === 'monthly') {
            console.log(values.month?.format('MMMM'))
            createMonthlyInvoice({
              variables: {
                month: values.month?.format('MMMM'),
                clinics: selectedRowKeys,
                cgst: Number(values.cgst),
                sgst: Number(values.sgst),
                discount: Number(values.discount),
                generateLink: true,
              },
            })
              .then(res => {
                console.log(res, 'res')
                if (res) {
                  notification.success({
                    message: 'Request sent successsfully',
                    description: 'Invoices are generating, wait for some time',
                  })
                }
              })
              .catch(err => {
                notification.error({
                  message: 'Something went wrong',
                  description: 'Unable to send request to create invoices',
                })
              })
          }
        }
      } else {
        notification.warning({
          message: 'Please select at least one clinic to create invoice',
        })
      }
    })
  }

  return (
    <div>
      <Form {...layout}>
        <Form.Item label="Month">
          {form.getFieldDecorator('month', {
            initialValue: advMonth,
            rules: [{ required: true, message: 'Please provide Month!' }],
          })(<DatePicker.MonthPicker onChange={e => setAdvMonth(e)} />)}
        </Form.Item>
        <Form.Item label="CGST">
          {form.getFieldDecorator('cgst', {
            rules: [{ required: true, message: 'Please provide CGST!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="SGST">
          {form.getFieldDecorator('sgst', {
            rules: [{ required: true, message: 'Please provide SGST!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Tax">
          {form.getFieldDecorator('tax', {
            rules: [{ required: true, message: 'Please provide Tax!' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Selected Clinics">
          {selectedClinicsName && selectedClinicsName?.length > 0 ? (
            <>
              <div>
                <ol style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                  {selectedClinicsName &&
                    selectedClinicsName.map((item, index) => (
                      <li style={{ width: 340 }}>{item}</li>
                    ))}
                </ol>
              </div>
            </>
          ) : (
            <b>None, Please select at least one clinic</b>
          )}
          <div style={{ alignItems: 'center' }}>
            <div>
              Create <strong>{invoiceType === 'advance' ? 'Advance' : 'Monthly'}</strong> invoice
              for selected clinics for month of <b>{advMonth.format('MMMM')}</b>.
            </div>
          </div>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Popconfirm
            title="Make sure all the filled details are correct."
            onConfirm={e => handleSubmitt(e)}
          >
            <Button
              type="default"
              loading={advanceLoading || monthlyLoading}
              style={SUBMITT_BUTTON}
            >
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
