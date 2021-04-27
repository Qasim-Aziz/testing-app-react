/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import {
  Form,
  Select,
  Button,
  Divider,
  Input,
  Table,
  Typography,
  Popconfirm,
  notification,
} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import LoadingComponent from 'components/LoadingComponent'
import { FORM, COLORS, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import {
  GET_INVOICE_PAYMENTS,
  CREATE_INVOICE_PAYMENT,
  GET_PAYMENT_METHODS,
  UPDATE_INVOICE_STATUS,
} from './query'

const { layout, tailLayout } = FORM

const { Text, Title } = Typography

const roundNumber = (num, digitFigure) => {
  return Number(Number(num).toFixed(digitFigure))
}

function InvoicePayments({ form, invoiceObj, closeDrawer }) {
  const statusList = [
    { key: 'SW52b2ljZVN0YXR1c1R5cGU6Mg==', name: 'Pending' },
    { key: 'SW52b2ljZVN0YXR1c1R5cGU6NA==', name: 'Sent' },
    { key: 'SW52b2ljZVN0YXR1c1R5cGU6Mw==', name: 'Paid' },
    { key: 'SW52b2ljZVN0YXR1c1R5cGU6Ng==', name: 'Partially Paid' },
  ]

  const [selectedStatus, setSelectedStatus] = useState(invoiceObj.statusId)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState()
  const [amount, setAmount] = useState()
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)

  const {
    data: paymentMethods,
    loading: paymentMethodsLoading,
    error: paymentMethodsError,
  } = useQuery(GET_PAYMENT_METHODS)

  const {
    data: invoicePayments,
    loading: invoicePaymentsLoading,
    error: invoicePaymentsError,
  } = useQuery(GET_INVOICE_PAYMENTS, {
    variables: { invoice: invoiceObj.key },
    fetchPolicy: 'network-only',
  })

  const [createInvoicePayment, { loading: createInvoicePaymentLoading }] = useMutation(
    CREATE_INVOICE_PAYMENT,
  )

  const [updateInvoiceStatus, { loading: updateInvoiceStatusLoading }] = useMutation(
    UPDATE_INVOICE_STATUS,
  )

  useEffect(() => {
    console.log(invoicePayments, 'inv')
    if (invoicePayments) {
      const tempTable = []
      let tempTotal = 0
      invoicePayments.getInvoicePayments.edges.map(item => {
        tempTable.push(item.node)
        console.log(item.node.amount)
        tempTotal += Number(item.node.amount)
      })
      setTableData(tempTable)
      setTotal(tempTotal)
    }
  }, [invoicePayments])

  console.log(invoiceObj)
  console.log(paymentMethods)
  console.log(invoicePayments)
  console.log(tableData, 'tableData')

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && invoiceObj.key) {
        console.log(values)
        updateInvoiceStatus({
          variables: {
            pk: invoiceObj.key,
            status: values.status,
          },
        })
          .then(res => {
            notification.success({
              message: 'Status Updated successfully',
            })
          })
          .catch(err => console.error(err))

        createInvoicePayment({
          variables: {
            invoiceId: invoiceObj.key,
            paymentMethod: values.paymentMethod,
            amount: values.amount,
          },
        })
          .then(res => {
            notification.success({
              message: 'Payment added successfully',
            })
            closeDrawer()
          })
          .catch(err => console.error(err))
      }
    })
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'datetime',
      width: 200,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod.method',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'right',
    },
  ]

  if (invoicePaymentsLoading || paymentMethodsLoading) {
    return <LoadingComponent />
  }

  return (
    <div>
      {invoiceObj.status === 'Pending' ||
      invoiceObj.status === 'Partially Paid' ||
      invoiceObj.status === 'Sent' ? (
        <Form {...layout}>
          <Form.Item label="Select Status">
            {form.getFieldDecorator('status', {
              initialValue: selectedStatus,
              rules: [{ required: true, message: 'Please provide status!' }],
            })(
              <Select>
                {statusList.map(item => {
                  return (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item required label="Payment Method">
            {form.getFieldDecorator('paymentMethod', {
              rules: [{ required: true, message: 'Please provide payment method!' }],
            })(
              <Select placeholder="Select Payment Method">
                {paymentMethods.getPaymentMethods.map(item => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.method}
                    </Select.Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item required label="Amount">
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: 'Please provide amount!' }],
            })(<Input placeholder="Enter Amount" />)}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Popconfirm
              title="Are you sure all the filled details are correct？"
              okText="Yes"
              cancelText="No"
              trigger={['click']}
              onConfirm={handleSubmit}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={createInvoicePaymentLoading || updateInvoiceStatusLoading}
                style={SUBMITT_BUTTON}
              >
                Submit
              </Button>
            </Popconfirm>
            <Button type="ghost" onClick={() => closeDrawer()} style={CANCEL_BUTTON}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      ) : null}

      <Divider orientation="left">Payment History</Divider>
      <Table columns={columns} dataSource={tableData} rowKey="id" bordered pagination={false} />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', marginLeft: 'auto', width: 'fit-content' }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Total</Text>
          <Text
            style={{
              width: 100,
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'right',
              marginBottom: 10,
            }}
          >
            {roundNumber(total, 3)}
          </Text>
        </div>
        <div style={{ display: 'flex', marginLeft: 'auto', width: 'fit-content' }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Invoice Amount</Text>
          <Text
            style={{
              width: 100,
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'right',
              marginBottom: 10,
            }}
          >
            {roundNumber(invoiceObj.amount, 3)}
          </Text>
        </div>
        <div style={{ display: 'flex', marginLeft: 'auto', width: 'fit-content' }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Remaining</Text>
          <Text
            style={{
              width: 100,
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'right',
              marginBottom: 10,
            }}
          >
            {roundNumber(invoiceObj.amount - total, 3)}
          </Text>
        </div>
        {invoiceObj.status === 'Paid' ? (
          <div style={{ display: 'flex', marginLeft: 'auto', width: 'fit-content' }}>
            <Text style={{ fontSize: 18, fontWeight: 600, color: COLORS.success }}>
              Paid <CheckCircleOutlined />{' '}
            </Text>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Form.create()(InvoicePayments)
