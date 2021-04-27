/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Button,
  Drawer,
  notification,
  Table,
  Menu,
  Tooltip,
  Popconfirm,
  Dropdown,
  Select,
  Icon,
  Input,
  DatePicker,
} from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import {
  PlusOutlined,
  CloudDownloadOutlined,
  MailOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import InvoiceForm from 'components/invoice/InvoiceForm'
import EditInvoice from './editInvoice'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import UpdateInvoiceStatus from './updateInvoiceStatus'
import PreviewInvoice from './previewInvoice'
import { GET_INVOICES, DELETE_INVOICE, GET_INVOICE_STATUS_LIST } from './query'
import './template.scss'
import SendPaymentLinks from './sendPaymentLinks'

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [isCreateInvoice, setCreateInvoice] = useState(false)
  const [isPreviewInvoice, setPreviewInvoice] = useState(false)
  const [isEditInvoice, setEditInvoice] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState()
  const [data, setData] = useState()
  const [deleteInvoiceId, setDeleteInvoiceId] = useState()
  const [editInvoiceId, setEditInvoiceId] = useState()
  const [invoiceStatusDrawer, setInvoiceStatusDrawer] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [payReminderDrawer, setPayReminderDrawer] = useState(false)
  const [payReminderData, setPayReminderData] = useState([])

  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [month, setMonth] = useState()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCustomer, setFilterCustomer] = useState('')

  const { data: invoiceStatusList } = useQuery(GET_INVOICE_STATUS_LIST)

  console.log(invoiceStatusList)
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
        customer_School: localStorage.getItem('userId'),
      },
      fetchPolicy: 'no-cache',
    },
  )

  console.log(invoiceData, invoiceError, invoiceLoading)
  const [deleteInvoice, { oading: deleteInvoiceLoading }] = useMutation(DELETE_INVOICE)

  useEffect(() => {
    if (invoiceData) {
      const dataList = [...invoiceData.getInvoices.edges]
      const arrengedData = dataList.map(({ node }) => {
        return {
          key: node.id,
          invoiceNo: node.invoiceNo,
          amount: node.amount,
          total: node.total,
          client: node.customer?.parent?.username,
          status: node.status.statusName,
          statusId: node.status.id,
          colorCode: node.status.colorCode,
          date: node.issueDate,
          name: node.customer
            ? `${node.customer.firstname} ${node.customer.lastname ? node.customer.lastname : ' '}`
            : null,
          email: node.email,
          linkGenerated: node.linkGenerated,
        }
      })
      arrengedData.sort((a, b) => new Date(b.date) - new Date(a.date))
      setData(arrengedData)
      setSelectedRowKeys([])
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
      dataIndex: 'total',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, row) => {
        const color = COLORS[row.colorCode]

        return (
          <Tooltip title="Edit status" trigger={['hover']}>
            <Button
              type="link"
              onClick={() => setInvoiceStatusDrawer(row)}
              style={{ color, fontSize: 16, padding: 0 }}
            >
              {text}
            </Button>
          </Tooltip>
        )
      },
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
                      .then(res => {
                        notification.success({
                          message: 'Delete invoice sucessfully',
                        })
                        setData(state => {
                          return state.filter(invoice => {
                            return invoice.key !== deleteInvoiceId
                          })
                        })
                        refetch()
                        setDeleteInvoiceId(null)
                      })
                      .catch(err => {
                        notification.error({
                          message: 'opps error on delete invoice',
                        })
                        setDeleteInvoiceId(null)
                      })
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

  // Allocate target target suggestion create program

  const onSelectChange = key => {
    setSelectedRowKeys(key)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  let filteredList = data || []

  if (filterCustomer) {
    filteredList = filteredList.filter(
      item => item.name && item.name.toLowerCase().includes(filterCustomer.toLowerCase()),
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
        Client: e.name,
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

  // console.log(selectedRowKeys, 'sele')

  const handleMenuActions = e => {
    const names = []
    filteredList.map(item =>
      selectedRowKeys.map(key =>
        key === item.key
          ? names.push({
              key: item.key,
              linkGenerated: item.linkGenerated,
              invNo: item.invoiceNo,
              name: item.name,
              email: item.email,
              amount: item.amount,
              status: item.status,
            })
          : null,
      ),
    )

    if (e.key === 'payReminder') {
      setPayReminderDrawer(true)
      setPayReminderData(names)
    }
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

  const actions = (
    <Menu onClick={e => handleMenuActions(e)}>
      <Menu.Item key="payReminder">
        <MailOutlined /> Send Reminder
      </Menu.Item>
    </Menu>
  )
  const filterHeader = (
    <div
      style={{
        minHeight: '20px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Dropdown overlay={actions}>
          <Button style={{ margin: '0px 28px 0 6px' }}>
            Actions <Icon type="down" />
          </Button>
        </Dropdown>

        <div>
          <span>Status :</span>
          <Select
            value={filterStatus}
            onSelect={value => setFilterStatus(value)}
            style={{ width: 188, margin: '0px 28px 0 6px' }}
          >
            <Select.Option value="">Select Status</Select.Option>
            {invoiceStatusList?.invoiceStatusList.map((item, index) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.statusName}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        <div>
          <span>Customer :</span>
          <Input
            placeholder="Search Customer"
            value={filterCustomer}
            onChange={e => setFilterCustomer(e.target.value)}
            style={{ width: 188, margin: '0px 28px 0 6px' }}
          />
        </div>
        <span>From :</span>
        <DatePicker
          placeholder="Form Date"
          value={from}
          onChange={newDate => setFrom(newDate)}
          style={{ margin: '0px 28px 0 6px' }}
        />

        <span>To :</span>
        <DatePicker
          style={{ width: 188, margin: '0px 28px 0 6px' }}
          placeholder="To Date"
          value={to}
          onChange={newDate => setTo(newDate)}
        />
      </div>
      <div style={{ marginLeft: 'auto' }}>
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
        <Dropdown overlay={menu} trigger={['click']}>
          <Button style={{ marginRight: 10 }} type="link" size="large">
            <CloudDownloadOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  )

  console.log(filteredList)

  return (
    <div style={{ marginTop: 10 }}>
      <Helmet title="Dashboard Alpha" />
      <div className="table-outer-border">
        <Table
          columns={columns}
          dataSource={filteredList}
          loading={invoiceLoading}
          title={() => {
            return filterHeader
          }}
          rowSelection={rowSelection}
          rowKey={record => record.key}
          size="middle"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '50', '100'],
            position: 'bottom',
          }}
        />
      </div>

      <Drawer
        visible={isPreviewInvoice}
        width={DRAWER.widthL2}
        className="change-invo-drawer"
        onClose={() => setPreviewInvoice(false)}
      >
        <PreviewInvoice invoiceId={selectedInvoiceId} />
      </Drawer>

      <Drawer
        title="Send Invoices"
        visible={payReminderDrawer}
        width={DRAWER.widthL2}
        onClose={() => setPayReminderDrawer(false)}
      >
        <SendPaymentLinks
          selectedRowKeys={selectedRowKeys}
          payReminderData={payReminderData}
          closeDrawer={() => setPayReminderDrawer(false)}
        />
      </Drawer>

      <Drawer
        title="Edit Invoice"
        destroyOnClose
        visible={isEditInvoice}
        width={DRAWER.widthL1}
        onClose={() => setEditInvoice(false)}
      >
        <EditInvoice
          invoiceId={editInvoiceId}
          closeDrawer={() => setEditInvoice(false)}
          refetchInvoices={refetch}
        />
      </Drawer>
      <Drawer
        title="Update invoice status"
        visible={invoiceStatusDrawer ? true : false}
        width={DRAWER.widthL2}
        destroyOnClose
        onClose={() => setInvoiceStatusDrawer(null)}
      >
        {invoiceStatusDrawer && (
          <UpdateInvoiceStatus
            invoiceId={editInvoiceId}
            invoiceObj={invoiceStatusDrawer}
            closeDrawer={() => setInvoiceStatusDrawer(null)}
            refetchInvoices={refetch}
          />
        )}
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
