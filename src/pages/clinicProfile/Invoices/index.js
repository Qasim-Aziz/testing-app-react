/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Drawer, notification, Menu, Dropdown, Select, Input, DatePicker } from 'antd'
import DataTable from 'react-data-table-component'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import 'jspdf-autotable'
import {
  PlusOutlined,
  CloudDownloadOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import InvoiceForm from 'components/invoice/InvoiceForm'
import LoadingComponent from '../../staffProfile/LoadingComponent'

import './template.scss'

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
          customer {
            parent {
              username
            }
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
  const classNamees = useStyles()
  const [newInvDrawer, setNewInvDrawer] = useState(false)
  const [invPreview, setInvPreview] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState()
  const [data, setData] = useState()
  const [deleteInvoiceId, setDeleteInvoiceId] = useState()

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

  const customStyles = {
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#ddd',
        backgroundColor: '#f5f5f5',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center',
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontSize: '13px',
      },
    },
  }

  const columns = [
    {
      name: 'Invoice No',
      selector: 'invoiceNo',
      maxWidth: '100px',
      cell: row => {
        return (
          <Button
            // onClick={() => setUpdateTicket(row.key)}
            type="link"
          >
            {row.invoiceNo}
          </Button>
        )
      },
    },
    {
      name: 'Date',
      selector: 'date',
      minWidth: '100px',
      maxWidth: '120px',
    },
    {
      name: 'Client',
      selector: 'client',
    },
    {
      name: 'Amount',
      selector: 'amount',
      minWidth: '70px',
      maxWidth: '100px',
    },
    {
      name: 'Status',
      selector: 'status',
      minWidth: '70px',
      maxWidth: '100px',
    },
    {
      name: 'Action',
      minWidth: '150px',
      maxWidth: '180px',
      cell: row => {
        return (
          <div>
            <Button
              onClick={() => {
                setSelectedInvoice(row)
                setInvPreview(true)
              }}
              type="link"
            >
              <FilePdfOutlined />
            </Button>

            {row.status !== 'Paid' && (
              <Button
                type="link"
                style={{ color: 'red', marginLeft: 10 }}
                onClick={() => {
                  deleteInvoice({ variables: { id: row.key } })
                  setDeleteInvoiceId(row.key)
                }}
                loading={deleteInvoiceLoading}
              >
                Delete
              </Button>
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
              onClick={() => setNewInvDrawer(true)}
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
                size="large"
                value={filterStatus}
                onSelect={value => setFilterStatus(value)}
                style={{ width: 188, marginRight: 20 }}
              >
                <Select.Option value="">Select Status</Select.Option>
                {statusGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>
            <div>
              <Input
                size="small"
                placeholder="Search Customer"
                value={filterCustomer}
                onChange={e => setFilterCustomer(e.target.value)}
                style={{ width: 188, marginRight: 20 }}
              />
            </div>
            <DatePicker
              size="small"
              placeholder="Form Date"
              value={from}
              onChange={newDate => setFrom(newDate)}
              style={{ marginRight: 20 }}
            />
            <DatePicker
              placeholder="To Date"
              size="small"
              value={to}
              onChange={newDate => setTo(newDate)}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '50px' }}>
        {invoiceLoading && <LoadingComponent />}
        {data && (
          <DataTable
            columns={columns}
            theme="default"
            pagination="true"
            data={filteredList}
            customStyles={customStyles}
            highlightOnHover
            noHeader
            style={{ border: '1px solid #ddd' }}
            paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
          />
        )}
      </div>

      <Drawer visible={invPreview} width="60%" onClose={() => setInvPreview(false)}>
        <Template invoice={selectedInvoice} />
      </Drawer>

      <Drawer visible={newInvDrawer} width="100vw" onClose={() => setNewInvDrawer(false)}>
        <InvoiceForm setNewInvDrawer={setNewInvDrawer} refetchInvoices={refetch} />
      </Drawer>

      <Drawer visible={newInvDrawer} width="100vw" onClose={() => setNewInvDrawer(false)}>
        <InvoiceForm setNewInvDrawer={setNewInvDrawer} refetchInvoices={refetch} />
      </Drawer>
    </div>
  )
}

const Template = ({ invoice }) => {
  const exportPdf = () => {
    html2canvas(document.querySelector('#capture')).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPDF()
      pdf.addImage(imgData, 'PNG', 10, 0)
      pdf.save('invoice.pdf')
    })
  }

  return (
    <div>
      <Button type="link" onClick={() => exportPdf()}>
        Download <FilePdfOutlined />
      </Button>
      <div id="capture">
        <div className="clearfix" id="header">
          <div id="logo">
            <img src="logo.png" alt="logo" />
          </div>
          <div id="company">
            <h2 className="name">Company Name</h2>
            <div>455 Foggy Heights, AZ 85004, US</div>
            <div>(602) 519-0450</div>
            <div>
              <a href="mailto:company@example.com">company@example.com</a>
            </div>
          </div>
        </div>

        <div id="details" className="clearfix">
          <div id="client">
            <div className="to">INVOICE TO:</div>
            <h2 className="name">NAME</h2>
            <div className="address">ADDRESS</div>
            <div className="email">
              <a href="#">{invoice.client}</a>
            </div>
          </div>
          <div id="invoice">
            <h1>INVOICE {invoice.invoiceNo}</h1>
            <div className="date">Date of Invoice: {invoice.date}</div>
            <div className="date">Due Date: {invoice.date}</div>
          </div>
        </div>
        <table id="invoiceTable" border="0" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="no">#</th>
              <th className="desc">DESCRIPTION</th>
              <th className="total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="no">01</td>
              <td className="desc">
                <h3>Item Title</h3>Sub Title
              </td>
              <td className="total">0.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td cellSpan="2"> </td>
              <td cellSpan="2">SUBTOTAL</td>
              <td>{invoice.amount}.00</td>
            </tr>
            {/* <tr>
              <td cellSpan="2"> </td>
              <td cellSpan="2">TAX 25%</td>
              <td>0.00</td>
            </tr> */}
            <tr>
              <td cellSpan="2"> </td>
              <td cellSpan="2">GRAND TOTAL</td>
              <td>{invoice.amount}.00</td>
            </tr>
          </tfoot>
        </table>
        <div id="thanks">Thank you!</div>
      </div>
    </div>
  )
}
