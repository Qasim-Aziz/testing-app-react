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
  Icon,
  Input,
  DatePicker,
} from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import gql from 'graphql-tag'
import {
  CloudDownloadOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  EditOutlined,
  MailOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import UpdateInvoiceStatus from 'pages/ClinicProfile/Invoices/updateInvoiceStatus'
import SendPaymentLinks from './sendPaymentLinks'
import EditInvoice from './editInvoice'
import PreviewInvoice from '../allClinicData/viewInvoice'
import './invoices.scss'
import { GET_INVOICES, DELETE_INVOICE } from './query'

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [isPreviewInvoice, setPreviewInvoice] = useState(false)
  const [isEditInvoice, setEditInvoice] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState()
  const [data, setData] = useState()
  const [deleteInvoiceId, setDeleteInvoiceId] = useState()
  const [editInvoiceId, setEditInvoiceId] = useState()
  const [currentClinicRow, setCurrentClinicRow] = useState()
  const [currentInvoice, setCurrentInvoice] = useState(null)
  const [payReminderDrawer, setPayReminderDrawer] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [payReminderData, setPayReminderData] = useState([])

  // invoice filer
  const [from, setFrom] = useState(
    moment()
      .subtract(2, 'M')
      .startOf('M'),
  )
  const [to, setTo] = useState(moment().endOf('M'))
  const [month, setMonth] = useState()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCustomer, setFilterCustomer] = useState('')
  const [invoiceStatusDrawer, setInvoiceStatusDrawer] = useState(false)

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
        allclinics: true,
      },
    },
  )

  const [deleteInvoice, { loading: deleteInvoiceLoading }] = useMutation(DELETE_INVOICE)

  useEffect(() => {
    if (invoiceData) {
      const dataList = [...invoiceData.getInvoices.edges]
      const arrengedData = dataList.map(({ node }) => {
        return {
          ...node,
          key: node.id,
          status: node.status.statusName,
          colorCode: node.status.colorCode,
          statusId: node.status.id,
        }
      })
      arrengedData.reverse()
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
    },
    {
      title: 'Clinic',
      dataIndex: 'clinic.schoolName',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      width: 160,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      width: 160,
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
          <Button
            onClick={() => {
              setCurrentInvoice(row)
              setInvoiceStatusDrawer(true)
            }}
            type="link"
            style={{ color, fontSize: 16, padding: 0 }}
          >
            {text}
          </Button>
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
                setCurrentInvoice(row)
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
                    setCurrentInvoice(row)
                  }}
                >
                  <EditOutlined style={{ fontWeight: 600 }} />
                </Button>
                <Popconfirm
                  title="Are you sure to delete this invoice?"
                  onConfirm={() => {
                    deleteInvoice({ variables: { id: row.id } })
                      .then(res => {
                        notification.success({
                          message: 'Delete invoice sucessfully',
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
                    setDeleteInvoiceId(row.id)
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
      item =>
        item.clinic?.schoolName &&
        item.clinic.schoolName.toLowerCase().includes(filterCustomer.toLowerCase()),
    )
  }

  const status =
    data && data.length > 0
      ? data.reduce(function(sum, current) {
          return sum.concat(current.status.statusName ? current.status.statusName : [])
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
    const headers = [['Invoice No', 'Amount', 'Clinic', 'Status', 'Date']]

    const data1 = filteredList.map(e => [e.invoiceNo, e.amount, e.clinic, e.status, e.date])

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
        Clinic: e.clinic,
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

  const handleMenuActions = e => {
    const names = []
    filteredList.map(item =>
      selectedRowKeys.map(key =>
        key === item.key
          ? names.push({
              key: item.key,
              linkGenerated: item.linkGenerated,
              invNo: item.invoiceNo,
              name: item.clinic?.schoolName,
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

  const onSelectChange = key => {
    setSelectedRowKeys(key)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const actions = (
    <Menu onClick={e => handleMenuActions(e)}>
      <Menu.Item key="payReminder">
        <MailOutlined /> Send Reminder
      </Menu.Item>
    </Menu>
  )

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
          <span>Clinic :</span>
          <Input
            placeholder="Search Clinic"
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
        {filterStatus || filterCustomer ? (
          <Button
            type="link"
            style={{ marginLeft: '10px', color: '#FEBB27' }}
            onClick={() => {
              setFilterStatus('')
              setFilterCustomer('')
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

  console.log(filteredList, 'data')

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
          rowKey="id"
          rowSelection={rowSelection}
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
        <PreviewInvoice invoiceId={currentInvoice?.id} />
      </Drawer>
      <Drawer
        title={`Edit Invoice - ${currentInvoice?.invoiceNo}`}
        visible={isEditInvoice}
        width={DRAWER.widthL1}
        onClose={() => setEditInvoice(false)}
      >
        <EditInvoice
          rowData={currentInvoice}
          refetchInvoices={refetch}
          closeDrawer={() => setEditInvoice(false)}
        />
      </Drawer>

      <Drawer
        title="Send Invoices"
        visible={payReminderDrawer}
        width={DRAWER.widthL2}
        onClose={() => setPayReminderDrawer(false)}
        destroyOnClose
      >
        <SendPaymentLinks
          selectedRowKeys={selectedRowKeys}
          payReminderData={payReminderData}
          refetchInvoices={refetch}
          closeDrawer={() => setPayReminderDrawer(false)}
        />
      </Drawer>

      <Drawer
        title={`Add Payment - ${currentInvoice?.invoiceNo}`}
        visible={invoiceStatusDrawer}
        width={DRAWER.widthL2}
        destroyOnClose
        onClose={() => setInvoiceStatusDrawer(null)}
      >
        <UpdateInvoiceStatus
          invoiceId={currentInvoice?.id}
          invoiceObj={currentInvoice}
          closeDrawer={() => setInvoiceStatusDrawer(null)}
          refetchInvoices={refetch}
        />
      </Drawer>
    </div>
  )
}
