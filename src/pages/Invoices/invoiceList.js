/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, notification, Popover } from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import InvoiceForm from '../../components/invoice/InvoiceForm'
import FilterCard from './FilterCard'

const { Content } = Layout
const { Column } = Table

const GET_INVOICES = gql`
  query getInvoices($from: Date, $to: Date, $status: ID) {
    getInvoices(date_Gte: $from, date_Lte: $to, status: $status) {
      edges {
        node {
          id
          invoiceNo
          email
          issueDate
          dueDate
          amount
          address
          taxableSubtotal
          discount
          total
          clinic {
            id
            schoolName
          }
          status {
            id
            statusName
          }
          invoiceFee {
            edges {
              node {
                id
                quantity
                rate
                amount
                tax
                schoolServices {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`

const DELETE_INVOICE = gql`
  mutation deleteInvoice($id: ID!) {
    deleteInvoice(input: { pk: $id }) {
      status
      message
    }
  }
`

const useStyles = createUseStyles(() => ({
  headIconBut: {
    width: 50,
    height: 50,
    marginLeft: 20,
    margin: 10,
  },

  headIcon: {
    fontSize: 24,
    marginTop: 5,
  },
}))

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const classes = useStyles()
  const [newInvDrawer, setNewInvDrawer] = useState(false)
  const [data, setData] = useState()

  // invoice filer
  const [form, setForm] = useState()
  const [to, setTo] = useState()
  const [month, setMonth] = useState()
  const [statusSelect, setStatusSelect] = useState()

  const { data: invoiceData, error: invoiceError, loading: invoiceLoading } = useQuery(
    GET_INVOICES,
    {
      variables: {
        form: form
          ? moment(form).format(dateFormate)
          : month
          ? moment(month)
              .startOf('month')
              .format(dateFormate)
          : null,
        to: to
          ? moment(to).format(dateFormate)
          : month
          ? moment(month)
              .endOf('month')
              .format(dateFormate)
          : null,
        status: statusSelect,
      },
    },
  )

  const [
    deleteInvoice,
    { data: deleteInvoiceData, error: deleteInvoiceError, loading: deleteInvoiceLoading },
  ] = useMutation(DELETE_INVOICE)

  useEffect(() => {
    if (deleteInvoiceData) {
      notification.success({
        message: 'Delete invoice sucessfully',
      })
      setData(state => {
        return state.filter(invoice => {
          return invoice.key !== deleteInvoiceData.deleteInvoice.clientMutationId
        })
      })
    }
  }, [deleteInvoiceData])

  useEffect(() => {
    if (deleteInvoiceError) {
      notification.error({
        message: 'opps error on delete invoice',
      })
    }
  }, [deleteInvoiceError])

  useEffect(() => {
    if (invoiceData) {
      const dataList = [...invoiceData.getInvoices.edges]
      const arrengedData = dataList.map(({ node }) => {
        return {
          key: node.id,
          invoiceNo: node.invoiceNo,
          amount: node.amount,
          client: 'hello',
          status: node.status.statusName,
          date: node.issueDate,
        }
      })
      setData(arrengedData)
    }
  }, [invoiceData])

  useEffect(() => {
    if (invoiceError) {
      notification.error({
        message: 'Opps their are something wrong on fatching invoces data',
      })
    }
  }, [invoiceError])

  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          {/* <PageHeader
            className="site-page-header"
            title="INVOICES"
            extra={[
              <Button
                key="1"
                type="primary"
                shape="round"
                className={classes.headIconBut}
                onClick={() => setNewInvDrawer(true)}
              >
                <PlusOutlined className={classes.headIcon} style={{ marginLeft: -3.5 }} />
              </Button>,
            ]}
          /> */}
          <FilterCard
            statusSelect={statusSelect}
            setStatusSelect={setStatusSelect}
            form={form}
            setForm={setForm}
            to={to}
            setTo={setTo}
            month={month}
            setMonth={setMonth}
          />

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          <div style={{ margin: '30px 34px 0 24px' }}>
            <Table dataSource={data} loading={invoiceLoading} pagination={false}>
              <Column title="Invoice No" dataIndex="invoiceNo" key="invoiceNo" />
              <Column title="Amount" dataIndex="amount" key="amount" />
              <Column title="Client" dataIndex="client" key="clent" />
              <Column title="Status" dataIndex="status" key="status" />
              <Column title="Date" key="date" dataIndex="date" />
              <Column
                title="Actions"
                key="actions"
                render={invoice => {
                  return (
                    <div>
                      <Popover
                        content={
                          <div>
                            <Button
                              type="danger"
                              onClick={() => deleteInvoice({ variables: { id: invoice.key } })}
                              loading={deleteInvoiceLoading}
                            >
                              Delete
                            </Button>
                            <Button type="primary" style={{ marginLeft: 10 }}>
                              Send
                            </Button>
                          </div>
                        }
                        trigger="click"
                      >
                        <Button shape="circle" type="primary">
                          <MoreOutlined style={{ fontSize: 24, marginTop: 4 }} />
                        </Button>
                      </Popover>
                    </div>
                  )
                }}
              />
            </Table>
            ,
          </div>

          <Drawer visible={newInvDrawer} width="100vw" onClose={() => setNewInvDrawer(false)}>
            <InvoiceForm setNewInvDrawer={setNewInvDrawer} />
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}
