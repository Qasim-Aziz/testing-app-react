/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState, useReducer } from 'react'
import { Form, Select, Input, Typography, Button, notification, DatePicker } from 'antd'
import { useMutation, useQuery } from 'react-apollo'
import moment from 'moment'
import { InvoiceProductsTable } from './InvoiceProductsTable'
import './invoiceForm.scss'
import { ALL_STUDENT, INVOICE_STATUS, CREATE_INVOICE, GET_STUDENT_EMAIL } from './query'
import { ProductContext } from './context'
import productReducer from './reducer'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

const countSubTotal = data => {
  let total = 0
  data.forEach(({ qty, rate }) => {
    total += Math.round(qty) * rate
  })
  return Number(total).toFixed(2)
}

const calculatDateAdd = (form, dayNum) => {
  return moment(form.getFieldValue('issueDate'))
    .add(dayNum, 'day')
    .format('YYYY-MM-DD')
}

function getTotal(subTotal, discount = 0, taxableSubtotal = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(taxableSubtotal || 0),
  ).toFixed(2)
}

const InvoiceForm = ({ form, setNewInvDrawer, refetchInvoices }) => {
  const { data: allSudent, loading: allSudentLoading } = useQuery(ALL_STUDENT)
  const { data: studentDetails, error: studentDetailsError } = useQuery(GET_STUDENT_EMAIL, {
    skip: !form.getFieldValue('customer'),
    variables: {
      id: form.getFieldValue('customer'),
    },
  })

  const { data: statusData, loading: statusLoading } = useQuery(INVOICE_STATUS)
  const [subTotal, setSubTotal] = useState(0)
  const [productsState, productsDispatch] = useReducer(productReducer, [])
  const [
    createInvoice,
    { data: newInvoiceData, loading: newInvoiceLoading, error: newInvoiceError },
  ] = useMutation(CREATE_INVOICE)

  useEffect(() => {
    if (productsState) {
      const totalAmount = countSubTotal(productsState)
      setSubTotal(totalAmount)
    }
  }, [productsState])

  useEffect(() => {
    if (studentDetails) {
      form.setFieldsValue({
        email: studentDetails?.student.email,
        address: studentDetails?.student.currentAddress,
      })
    }
  }, [studentDetails])

  useEffect(() => {
    if (newInvoiceData) {
      notification.success({
        message: 'New Invoice Created Sucessfully',
      })
      refetchInvoices()
      form.resetFields()
      productsDispatch({ type: 'INIT' })
      setNewInvDrawer(false)
    }
  }, [newInvoiceData])

  useEffect(() => {
    if (newInvoiceError) {
      notification.error({
        message: 'Create Invoice Failed',
      })
    }
  }, [newInvoiceError])

  const submit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        createInvoice({
          variables: {
            customer: values.customer,
            email: values.email,
            status: values.status,
            issueDate: moment(values.issueDate).format('YYYY-MM-DD'),
            dueDate: values.dueDate,
            address: values.address,
            taxableSubtotal: parseFloat(values.taxableSubtotal),
            discount: parseFloat(values.discount),
            total: getTotal(
              subTotal,
              form.getFieldValue('discount'),
              form.getFieldValue('taxableSubtotal'),
            ),
            due: getTotal(
              subTotal,
              form.getFieldValue('discount'),
              form.getFieldValue('taxableSubtotal'),
            ),
            products: productsState.map(product => {
              return {
                product: product.service,
                qty: product.qty,
                rate: product.rate,
                tax: 0.0, // need to remove not required
              }
            }),
          },
        })
      }
    })
  }

  return (
    <div style={{ padding: '0 100px' }}>
      <Form onSubmit={submit}>
        <div style={{ display: 'flex', marginTop: 50 }}>
          <Form.Item label="Customer">
            {form.getFieldDecorator('customer', {
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <Select
                style={{ width: 250 }}
                placeholder="Select a customer"
                size="large"
                showSearch
                optionFilterProp="name"
                loading={allSudentLoading}
              >
                {allSudent?.students.edges.map(({ node }) => {
                  return (
                    <Option key={node.id} value={node.id} name={node.firstname}>
                      {node.firstname}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Customer Email" style={{ marginLeft: 20 }}>
            {form.getFieldDecorator('email', {
              initialValue: studentDetails?.student.email,
              value: studentDetails?.student.email,
              rules: [{ required: true, message: 'Please select a customer!' }],
            })(
              <Input
                type="email"
                style={{ width: 250, display: 'block', color: '#000' }}
                placeholder="customer email"
                size="large"
                disabled={!studentDetailsError}
              />,
            )}
          </Form.Item>

          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ fontSize: 20, color: '#000' }}>BALANCE DUE:</Text>
            <Title style={{ marginTop: 10 }}>
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('taxableSubtotal'),
              )}
            </Title>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: -20 }}>
          <Form.Item label="Billing Address">
            {form.getFieldDecorator('address', {
              initialValue: studentDetails?.student.currentAddress,
              rules: [{ required: true, message: 'Please give the Billing Adress' }],
            })(<TextArea style={{ resize: 'none', width: 250, height: 120 }} />)}
          </Form.Item>

          <Form.Item label="Status" style={{ marginBottom: 0, marginRight: 20, marginLeft: 20 }}>
            {form.getFieldDecorator('status', {
              initialValue: statusData && 'SW52b2ljZVN0YXR1c1R5cGU6Mg==',
              rules: [{ required: true, message: 'Please select a status!' }],
            })(
              <Select
                style={{ width: 200 }}
                placeholder="Select a terms"
                size="large"
                loading={statusLoading}
              >
                {statusData?.invoiceStatusList.map(status => {
                  return (
                    <Option key={status.id} value={status.id}>
                      {status.statusName}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Issue date" style={{ marginRight: 20 }}>
            {form.getFieldDecorator('issueDate', {
              initialValue: moment(),
              rules: [{ required: true, message: 'Please give the issue date' }],
            })(<DatePicker allowClear={false} size="large" placeholder="Select the issue date" />)}
          </Form.Item>

          <Form.Item label="Due date">
            {form.getFieldDecorator('dueDate', {
              rules: [{ required: true, message: 'Please select due time!' }],
            })(
              <Select style={{ width: 200 }} size="large" optionLabelProp="label">
                <Option key="1" value={calculatDateAdd(form, 15)} label={calculatDateAdd(form, 15)}>
                  15 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 30)} label={calculatDateAdd(form, 30)}>
                  30 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 45)} label={calculatDateAdd(form, 45)}>
                  45 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 60)} label={calculatDateAdd(form, 60)}>
                  60 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 75)} label={calculatDateAdd(form, 75)}>
                  75 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 90)} label={calculatDateAdd(form, 90)}>
                  90 days
                </Option>
              </Select>,
            )}
          </Form.Item>
        </div>

        <ProductContext.Provider value={productsDispatch}>
          <InvoiceProductsTable
            style={{ marginTop: 25 }}
            totalAmount={subTotal}
            products={productsState}
            dispatch={productsDispatch}
          />
        </ProductContext.Provider>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 30,
          }}
        >
          <Form.Item label="Discount Percent" style={{ marginBottom: 10 }}>
            {form.getFieldDecorator('discount', { initialValue: 0 })(
              <Input
                size="large"
                placeholder="Give a discount"
                type="number"
                suffix="%"
                style={{ width: 160 }}
                min={0}
              />,
            )}
            <Text
              style={{
                fontSize: 22,
                fontWeight: 600,
                marginLeft: 30,
                marginTop: 5,
              }}
            >
              {Number(
                subTotal - (subTotal / 100) * parseFloat(form.getFieldValue('discount') || 0),
              ).toFixed(2)}
              $
            </Text>
          </Form.Item>
        </div>

        <div
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Form.Item label="Taxable Subtotal" style={{ marginBottom: 3 }}>
                {form.getFieldDecorator('taxableSubtotal', { initialValue: 0 })(
                  <Input
                    size="large"
                    placeholder="Add tax"
                    type="number"
                    suffix="%"
                    min={0}
                    style={{ width: 160 }}
                  />,
                )}
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginLeft: 30,
                    marginTop: 5,
                  }}
                >
                  {getTotal(
                    subTotal,
                    form.getFieldValue('discount'),
                    form.getFieldValue('taxableSubtotal'),
                  )}
                  $
                </Text>
              </Form.Item>
            </div>

            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>Total:</Text>
              <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10 }}>
                {getTotal(
                  subTotal,
                  form.getFieldValue('discount'),
                  form.getFieldValue('taxableSubtotal'),
                )}
              </Text>
            </div>
            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 600 }}>Balance Due:</Text>
              <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10 }}>
                {getTotal(
                  subTotal,
                  form.getFieldValue('discount'),
                  form.getFieldValue('taxableSubtotal'),
                )}
              </Text>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '50px 0px',
            border: '1px solid #e4e9f0',
            padding: 15,
            borderRadius: 4,
          }}
        >
          <Button
            type="danger"
            onClick={() => {
              setNewInvDrawer(false)
              form.resetFields()
              productsDispatch({ type: 'INIT' })
            }}
          >
            Cancel
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            loading={newInvoiceLoading}
            style={{ marginLeft: 'auto', marginRight: 10 }}
          >
            Save
          </Button>
          <Button type="primary">Save an Send</Button>
        </div>
      </Form>
    </div>
  )
}

export default Form.create()(InvoiceForm)
