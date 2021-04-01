/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Button,
  Drawer,
  notification,
  Table,
  Menu,
  Popconfirm,
  Dropdown,
  Select,
  Input,
  DatePicker,
} from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import {
  PlusOutlined,
  CloudDownloadOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import InvoiceForm from 'components/invoice/InvoiceForm'
import EditInvoice from 'components/invoice/EditInvoice'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import PreviewInvoice from '../../../components/invoice/PreviewInvoice'
import { GET_INVOICES, DELETE_INVOICE } from './Queries'

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [isCreateInvoice, setCreateInvoice] = useState(false)
  const [isPreviewInvoice, setPreviewInvoice] = useState(false)
  const [isEditInvoice, setEditInvoice] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState()
  const [data, setData] = useState()
  const [deleteInvoiceId, setDeleteInvoiceId] = useState()
  const [editInvoiceId, setEditInvoiceId] = useState()

  // invoice filer
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [month, setMonth] = useState()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCustomer, setFilterCustomer] = useState('')

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
          : undefined,
        to: to
          ? moment(to).format(dateFormate)
          : month
          ? moment(month)
              .endOf('month')
              .format(dateFormate)
          : undefined,
        status: filterStatus,
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
          return invoice.key !== deleteInvoiceId
        })
      })
      setDeleteInvoiceId(null)
    }
  }, [deleteInvoiceData])

  useEffect(() => {
    if (deleteInvoiceError) {
      notification.error({
        message: 'opps error on delete invoice',
      })
      setDeleteInvoiceId(null)
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
          client: node.customer?.parent?.username,
          status: node.status.statusName,
          date: node.issueDate,
          name: node.customer?.parent
            ? `${node.customer.parent.firstName} ${
                node.customer.parent.lastName ? node.customer?.parent?.lastName : ' '
              }`
            : null,
          email: node.email,
        }
      })
      setData(arrengedData)
    }
  }, [invoiceData])

  useEffect(() => {
    if (invoiceError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch invoices data',
      })
    }
  }, [invoiceError])

  const columns = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      width: 160,
      render: text => {
        return <span>{text}</span>
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 160,
    },
    {
      title: 'Client',
      dataIndex: 'email',
      render: (text, row) => (
        <span>
          {row.name ? `${row.name} - ` : ''} {text}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      width: 260,
      render: row => {
        return (
          <div>
            <Button
              onClick={() => {
                setSelectedInvoiceId(row.key)
                setPreviewInvoice(true)
              }}
              type="link"
            >
              <FilePdfOutlined style={{ fontWeight: 600 }} />
            </Button>

            {row.status !== 'Paid' && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setEditInvoice(true)
                    setEditInvoiceId(row.key)
                  }}
                >
                  <EditOutlined style={{ fontWeight: 600 }} />
                </Button>
                <Popconfirm
                  title="Are you sure to delete this invoice?"
                  onConfirm={() => {
                    deleteInvoice({ variables: { id: row.key } })
                    setDeleteInvoiceId(row.key)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" style={{ color: COLORS.danger }}>
                    <DeleteOutlined style={{ color: COLORS.danger, fontWeight: 600 }} />
                  </Button>
                </Popconfirm>
              </>
            )}
          </div>
        )
      },
    },
  ]

  let filteredList = data || []
  filteredList = filteredList.filter(
    item => item.status && item.status.toLowerCase().includes(filterStatus.toLowerCase()),
  )

  if (filterCustomer) {
    filteredList = filteredList.filter(
      item => item.client && item.client.toLowerCase().includes(filterCustomer.toLowerCase()),
    )
  }

  const status =
    data && data.length > 0
      ? data.reduce(function(sum, current) {
          return sum.concat(current.status ? current.status : [])
        }, [])
      : null

  const statusGrouped = status
    ? status.reduce(function(group, item) {
        const val = item
        if (!group.includes(val)) {
          group.push(val)
          return group
        }
        return group
      }, [])
    : []

  const exportPDF = () => {
    const unit = 'pt'
    const size = 'A4' // Use A1, A2, A3 or A4
    const orientation = 'landscape' // portrait or landscape

    const doc = new JsPDF(orientation, unit, size)

    doc.setFontSize(10)

    const title = 'Invoice List'
    const headers = [['Invoice No', 'Amount', 'Client', 'Status', 'Date']]

    const data1 = filteredList.map(e => [e.invoiceNo, e.amount, e.client, e.status, e.date])

    const content = {
      startY: 50,
      head: headers,
      body: data1,
    }

    doc.text(title, 10, 10)
    doc.autoTable(content)
    doc.save('invoices.pdf')
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = () => {
    const fileName = 'invoice_excel'
    const formattedData = filteredList.map(function(e) {
      return {
        InvoiceNo: e.invoiceNo,
        Amount: e.amount,
        Client: e.client,
        Status: e.status,
        Date: e.date,
      }
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data1 = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data1, fileName + fileExtension)
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Button onClick={() => exportPDF()} type="link" size="small">
          PDF
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <Helmet title="Dashboard Alpha" />

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: 10, marginBottom: 10 }} type="link" size="large">
                <CloudDownloadOutlined />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              style={{ marginBottom: 10 }}
              onClick={() => setCreateInvoice(true)}
            >
              ADD INVOICE
              <PlusOutlined />
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {filterStatus || filterCustomer || from || to ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                onClick={() => {
                  setFilterStatus('')
                  setFilterCustomer('')
                  setFrom()
                  setTo()
                }}
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
            <div>
              <Select
                value={filterStatus}
                onSelect={value => setFilterStatus(value)}
                style={{ width: 188, marginRight: 20 }}
              >
                <Select.Option value="">Select Status</Select.Option>
                {statusGrouped.map((i, index) => {
                  return (
                    <Select.Option key={i} value={i}>
                      {i}
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
            <div>
              <Input
                placeholder="Search Customer"
                value={filterCustomer}
                onChange={e => setFilterCustomer(e.target.value)}
                style={{ width: 188, marginRight: 20 }}
              />
            </div>
            <DatePicker
              placeholder="Form Date"
              value={from}
              onChange={newDate => setFrom(newDate)}
              style={{ marginRight: 20 }}
            />
            <DatePicker placeholder="To Date" value={to} onChange={newDate => setTo(newDate)} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '50px' }}>
        {invoiceLoading && <LoadingComponent />}
        {data && (
          <Table
            columns={columns}
            dataSource={filteredList}
            loading={invoiceLoading}
            rowKey={record => record.key}
            size="middle"
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['20', '30', '50', '100'],
              position: 'top',
            }}
          />
        )}
      </div>

      <Drawer
        visible={isPreviewInvoice}
        width={DRAWER.widthL3}
        className="change-invo-drawer"
        onClose={() => setPreviewInvoice(false)}
      >
        <PreviewInvoice invoiceId={selectedInvoiceId} />
      </Drawer>

      <Drawer visible={isEditInvoice} width={DRAWER.widthL1} onClose={() => setEditInvoice(false)}>
        <EditInvoice
          invoiceId={editInvoiceId}
          closeDrawer={setEditInvoice}
          refetchInvoices={refetch}
        />
      </Drawer>

      <Drawer
        visible={isCreateInvoice}
        width={DRAWER.widthL1}
        onClose={() => setCreateInvoice(false)}
      >
        <InvoiceForm setNewInvDrawer={setCreateInvoice} refetchInvoices={refetch} />
      </Drawer>
    </div>
  )
}
