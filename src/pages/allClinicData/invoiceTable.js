/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, Tooltip, Popconfirm, notification } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, MailOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import { useHistory, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import client from '../../apollo/config'
import InvoiceForm from './invoiceForm'
import FilterCard from '../Invoices/FilterCard'
import ViewInvoice from './viewInvoice'
import { NOTIFICATION, GET_INVOICES, DELETE_INVOICE, tt } from './query'
import './allClinicData.scss'
import { DRAWER } from 'assets/styles/globalStyles'

const { Content } = Layout
const { Column } = Table

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

function InvoiceTable({ rowData }) {
  const classes = useStyles()
  const [tableData, setTableData] = useState()
  const [invoiceFormDrawer, setInvoiceFormDrawer] = useState(false)
  const history = useHistory()
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [month, setMonth] = useState()
  const [statusSelect, setStatusSelect] = useState()
  const [viewInvoice, setViewInvoice] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState(null)
  const [
    deleteAssessmentCharges,
    {
      data: deleteAssessChargeData,
      loading: deleteAssessChargeLoading,
      error: deleteAssessChargeError,
    },
  ] = useMutation(tt)
  const { data: invoiceData, error: invoiceError, loading: invoiceLoading, refetch } = useQuery(
    GET_INVOICES,
    {
      variables: {
        from: from
          ? moment(from).format(dateFormate)
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
        clinic: rowData?.details.id,
      },
      fetchPolicy: 'network-only',
    },
  )

  const [
    deleteInvoice,
    { data: deleteInvoiceData, error: deleteInvoiceError, loading: deleteInvoiceLoading },
  ] = useMutation(DELETE_INVOICE)

  useEffect(() => {
    if (invoiceData) {
      const dataList = [...invoiceData.getInvoices.edges]
      const arrengedData = dataList.map(({ node }) => {
        return node
      })
      arrengedData.reverse()
      setTableData(arrengedData)
    }
    if (invoiceError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Network error - Response not successful: Unable to fetch invoices',
      })
    }
  }, [invoiceData, invoiceError])

  useEffect(() => {
    if (deleteInvoiceData) {
      notification.success({
        message: 'Delete invoice sucessfully',
      })
      setTableData(state => {
        return state.filter(invoice => {
          return invoice.id !== deleteInvoiceData.deleteInvoice.clientMutationId
        })
      })
    }
    if (deleteInvoiceError) {
      notification.error({
        message: 'opps error on delete invoice',
      })
    }
  }, [deleteInvoiceData, deleteInvoiceError])

  useEffect(() => {
    if (deleteAssessChargeData) {
      notification.success({
        message: 'Assessment charges updated successfully',
      })
    }
    if (deleteAssessChargeError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to update assessment charges',
      })
    }
  }, [deleteAssessChargeData, deleteAssessChargeError])

  const handleSendReminder = async invoiceId => {
    console.log(invoiceId, 'invoiceId')
    try {
      const reminder = await client.mutate({
        mutation: NOTIFICATION,
        variables: {
          pk: invoiceId,
        },
      })
      notification.success({
        message: 'Reminder sent successfully',
      })
      console.log(reminder)
      return reminder
    } catch (error) {
      console.log(error, 'from remainer errororor er')
      return notification.error({
        message: 'Unable to send reminder',
      })
    }
  }
  console.log(invoiceData, 'nv')

  const col = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status.statusName',
      key: 'status',
      render: (text, row) => {
        if (text === 'Pending') return <div style={{ color: 'orange' }}>{text}</div>
        if (text === 'Paid') return <div style={{ color: 'green' }}>{text}</div>
        return text
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, invoice) => {
        return (
          <div>
            <Tooltip placement="top" title="View Invoice">
              <Button
                type="link"
                onClick={() => {
                  setCurrentInvoice(invoice)
                  setViewInvoice(true)
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="Send pay reminder">
              <Button type="link" onClick={() => handleSendReminder(invoice.id)}>
                <MailOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement="top" title="Delete Invoice">
              <Popconfirm
                title="Are you sure to delete this invoice?"
                onConfirm={() => {
                  console.log(invoice.id)
                  deleteAssessmentCharges({ variables: { invoices: [invoice.id] } })
                  deleteInvoice({ variables: { id: invoice.id } }).then(res => refetch())
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" style={{ color: 'red' }}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        )
      },
    },
  ]
  console.log(deleteAssessChargeData, deleteAssessChargeLoading, deleteAssessChargeError)
  console.log(currentInvoice, 'current')
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
          <PageHeader
            className="site-page-header"
            title="INVOICES"
            extra={[
              <Button
                key="1"
                type="primary"
                shape="round"
                className={classes.headIconBut}
                onClick={() => setInvoiceFormDrawer(true)}
              >
                <PlusOutlined className={classes.headIcon} style={{ marginLeft: -3.5 }} />
              </Button>,
            ]}
          />
          <FilterCard
            statusSelect={statusSelect}
            setStatusSelect={setStatusSelect}
            form={from}
            setForm={setFrom}
            to={to}
            setTo={setTo}
            month={month}
            setMonth={setMonth}
          />

          <div style={{ margin: '30px 34px 0 24px' }}>
            <Table
              dataSource={tableData}
              rowKey="id"
              columns={col}
              loading={invoiceLoading}
              pagination={false}
            />
          </div>
          <Drawer
            visible={invoiceFormDrawer}
            onClose={() => setInvoiceFormDrawer(false)}
            width="100vw"
            placement="right"
            closable="true"
            destroyOnClose="true"
          >
            <InvoiceForm
              rowData={rowData}
              refetchInvoices={refetch}
              invoiceFormDrawer={invoiceFormDrawer}
              setInvoiceFormDrawer={setInvoiceFormDrawer}
            />
          </Drawer>

          <Drawer
            visible={viewInvoice}
            onClose={() => setViewInvoice(false)}
            width={DRAWER.widthL3}
            placement="right"
            closable="true"
            destroyOnClose="true"
            className="change-invo-drawer"
          >
            <ViewInvoice invoice={currentInvoice} rowData={rowData} />
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}

export default InvoiceTable
