/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import {
  Typography,
  Button,
  DatePicker,
  Drawer,
  notification,
  Input,
  Select,
  Dropdown,
  Menu,
} from 'antd'
import { PlusOutlined, CloseCircleOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import './editTable.css'
import SupportTicketForm from './SupportTicketForm'
import SupportTicketUpdate from './SupportTicketUpdate'
import LoadingComponent from '../staffProfile/LoadingComponent'

const { Text } = Typography

const TICKETS_QUERY = gql`
  query tickets($form: Date, $to: Date) {
    tickets(date_Gte: $form, date_Lte: $to) {
      edges {
        node {
          id
          subject
          description
          priority {
            id
            priority
          }
          service {
            id
            service
          }
          assignTo {
            id
            team
          }
          status {
            id
            status
          }
          createdBy {
            id
            username
          }
          createdAt
        }
      }
    }
  }
`

const DELETE_TICKET = gql`
  mutation($id: ID!) {
    deleteTicket(input: { pk: $id }) {
      status
    }
  }
`

const TICKET_STATUS_SORT = gql`
  query {
    InProcessticket: tickets(status: "VGlja2V0U3RhdHVzVHlwZTox") {
      edgeCount
    }
    Resolvedticket: tickets(status: "VGlja2V0U3RhdHVzVHlwZToy") {
      edgeCount
    }
  }
`

const InfoCard = ({ count, title, style, onClick, filterButId, id }) => (
  <div
    onClick={onClick}
    style={{
      padding: 15,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      width: 160,
      height: 85,
      background: filterButId === id ? '#74b4ef' : '#eee',
      color: filterButId === id ? '#fff' : '#000',
      cursor: 'pointer',
      boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
      ...style,
    }}
  >
    <Text
      style={{
        fontSize: 22,
        fontWeight: 600,
        color: filterButId === id ? '#fff' : '#000',
      }}
    >
      {count}
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontWeight: 600,
        display: 'block',
        lineHeight: '20px',
        color: filterButId === id ? '#fff' : '#000',
      }}
    >
      {title}
    </Text>
  </div>
)

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [createTicketDrawer, setCreateTicketDrawer] = useState(false)
  const [form, setForm] = useState()
  const [to, setTo] = useState()
  const allTickets = useRef()
  const [tickets, setTickets] = useState()
  const [newTicket, setNewTicket] = useState()
  const [updateTicket, setUpdateTicket] = useState()
  const [updateTicketData, setUpdateTicketData] = useState()
  const deleteTicketId = useRef()
  const [filterButId, setFilterButId] = useState('1')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAssignedTo, setFilterAssignedTo] = useState('')

  const {
    data: ticketsData,
    error: ticketsError,
    loading: ticketLoading,
    refetch: ticketRefetch,
  } = useQuery(TICKETS_QUERY, {
    variables: {
      form: form && to ? moment(form).format(dateFormate) : null,
      to: to && form ? moment(to).format(dateFormate) : null,
    },
  })
  const { data: ticketStatusInfo } = useQuery(TICKET_STATUS_SORT)

  const [
    deleteTicket,
    { data: deleteTicketData, error: deleteTicketError, loading: deleteTicketLoading },
  ] = useMutation(DELETE_TICKET, {
    update(cache) {
      const ticketData = cache.readQuery({
        query: TICKETS_QUERY,
        variables: {
          form: form && to ? moment(form).format(dateFormate) : null,
          to: to && form ? moment(to).format(dateFormate) : null,
        },
      })
      console.log(ticketData)
      cache.writeQuery({
        query: TICKETS_QUERY,
        variables: {
          form: form && to ? moment(form).format(dateFormate) : null,
          to: to && form ? moment(to).format(dateFormate) : null,
        },
        data: {
          tickets: {
            edges: ticketData.tickets.edges.filter(({ node }) => {
              console.log(node.id)
              console.log(deleteTicketId)
              return node.id !== deleteTicketId.current
            }),
            __typename: 'TicketsTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (newTicket) {
      ticketRefetch()
      setNewTicket(null)
    }
  }, [newTicket])

  useEffect(() => {
    if (deleteTicketData) {
      notification.success({
        message: 'Delete ticket sucessfully',
      })
    }
    if (deleteTicketError) {
      notification.error({
        message: 'Ticket delete unsucessfull',
      })
    }
  }, [deleteTicketData, deleteTicketError])

  useEffect(() => {
    if (updateTicketData) {
      setTickets(state => {
        const filterTicket = state.map(ticket => {
          if (ticket.key === updateTicketData.id) {
            return {
              key: updateTicketData.id,
              date: moment(updateTicketData.createdAt).format('YYYY-MM-DD'),
              piority: updateTicketData.priority.priority,
              status: updateTicketData.status.status,
              issue: updateTicketData.subject,
            }
          }
          return ticket
        })
        return filterTicket
      })
      setUpdateTicketData(null)
    }
  }, [updateTicketData])

  useEffect(() => {
    if (ticketsData) {
      const modifiedTicket = ticketsData.tickets.edges.map(({ node }) => {
        return {
          key: node.id,
          date: moment(node.createdAt).format('YYYY-MM-DD'),
          piority: node.priority.priority,
          status: node.status.status,
          issue: node.subject,
          raiseBy: node.createdBy?.username,
        }
      })
      setTickets(modifiedTicket)
      allTickets.current = modifiedTicket
    }
  }, [ticketsData])

  let filteredList = tickets || []
  filteredList = filteredList.filter(
    item => item.status && item.status.toLowerCase().includes(filterStatus.toLowerCase()),
  )

  if (filterAssignedTo) {
    filteredList = filteredList.filter(
      item => item.raiseBy && item.raiseBy.toLowerCase().includes(filterAssignedTo.toLowerCase()),
    )
  }

  const status =
    tickets && tickets.length > 0
      ? tickets.reduce(function(sum, current) {
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
      name: 'Date',
      key: 'date',
      selector: 'date',
      minWidth: '80px',
      maxWidth: '140px',
    },
    {
      name: 'Priority',
      selector: 'piority',
      minWidth: '60px',
      maxWidth: '100px',
    },
    {
      name: 'Status',
      selector: 'status',
      minWidth: '60px',
      maxWidth: '100px',
    },
    {
      name: 'Issues',
      selector: 'issue',
      minWidth: '200px',
    },
    {
      name: 'Raise By',
      selector: 'raiseBy',
      minWidth: '120px',
    },
    {
      name: 'Action',
      maxWidth: '180px',
      cell: data => {
        return (
          <div>
            <Button onClick={() => setUpdateTicket(data.key)} type="link">
              Edit
            </Button>
            <Button
              type="link"
              style={{ color: 'red', marginLeft: 10 }}
              onClick={() => {
                deleteTicketId.current = data.key
                deleteTicket({ variables: { id: data.key } })
              }}
              loading={deleteTicketLoading && data.key === deleteTicketId.current}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = () => {
    const fileName = 'tickets_excel'
    const formattedData = filteredList.map(function(e) {
      return {
        Date: e.date,
        Priority: e.piority,
        Status: e.status,
        Issues: e.issue,
        RaisedBy: e.raiseBy,
      }
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const exportPDF = () => {
    const unit = 'pt'
    const size = 'A4' // Use A1, A2, A3 or A4
    const orientation = 'landscape' // portrait or landscape

    const doc = new JsPDF(orientation, unit, size)

    doc.setFontSize(10)

    const title = 'Tickets List'
    const headers = [['Date', 'Priority', 'Status', 'Issue', 'Raised By']]

    const data = filteredList.map(e => [e.date, e.piority, e.status, e.issue, e.raiseBy])

    const content = {
      startY: 50,
      head: headers,
      body: data,
    }

    doc.text(title, 10, 10)
    doc.autoTable(content)
    doc.save('tickets.pdf')
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
              onClick={() => setCreateTicketDrawer(true)}
            >
              ADD TICKET
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
            {filterAssignedTo || filterStatus || form || to ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                onClick={() => {
                  setFilterStatus('')
                  setFilterAssignedTo('')
                  setForm()
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
                placeholder="Search Raised By"
                value={filterAssignedTo}
                onChange={e => setFilterAssignedTo(e.target.value)}
                style={{ width: 188, marginRight: 20 }}
              />
            </div>
            <DatePicker
              size="small"
              placeholder="Form Date"
              value={form}
              onChange={newDate => setForm(newDate)}
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
        {ticketsError && 'Opps their is something wrong'}
        {ticketLoading && <LoadingComponent />}
        {ticketsData && (
          <DataTable
            columns={columns}
            theme="default"
            pagination
            data={filteredList}
            customStyles={customStyles}
            highlightOnHover
            noHeader
            style={{ border: '1px solid #ddd' }}
            paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
          />
        )}
      </div>

      <Drawer
        visible={createTicketDrawer}
        onClose={() => setCreateTicketDrawer(false)}
        title="Add Support Ticket"
        width={450}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <SupportTicketForm setOpen={setCreateTicketDrawer} setNewTicket={setNewTicket} />
        </div>
      </Drawer>
      <Drawer
        visible={updateTicket}
        onClose={() => setUpdateTicket(null)}
        title="Update Support Ticket"
        width={450}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            padding: 30,
            paddingTop: 0,
          }}
        >
          <SupportTicketUpdate
            setUpdateTicketData={setUpdateTicketData}
            updateTicketId={updateTicket}
            setUpdateTicketId={setUpdateTicket}
          />
        </div>
      </Drawer>
    </div>
  )
}
