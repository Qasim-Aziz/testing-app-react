import React, { useState, useEffect } from 'react'
import { Typography, Table, Button, DatePicker, Drawer, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import SupportTicketForm from './SupportTicketForm'
import SupportTicketUpdate from './SupportTicketUpdate'
import './editTable.css'
import LoadingComponent from './LoadingComponent'

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

const InfoCard = ({ count, title, style }) => (
  <div
    style={{
      padding: 15,
      borderRadius: 8,
      background: '#eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      maxWidth: 100,
      ...style,
    }}
  >
    <Text style={{ fontSize: 22, fontWeight: 600 }}>{count}</Text>
    <Text
      style={{
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 600,
        display: 'block',
        lineHeight: '20px',
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
  const [tickets, setTickets] = useState()
  const [newTicket, setNewTicket] = useState()
  const [updateTicket, setUpdateTicket] = useState()
  const [updateTicketData, setUpdateTicketData] = useState()

  const {
    data: ticketsData,
    error: ticketsError,
    loading: ticketLoading,
    refetch: ticketRefetch,
  } = useQuery(TICKETS_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      form: form && to ? moment(form).format(dateFormate) : null,
      to: to && form ? moment(to).format(dateFormate) : null,
    },
  })
  const { data: ticketStatusInfo } = useQuery(TICKET_STATUS_SORT)

  useEffect(() => {
    if (newTicket) {
      ticketRefetch()
      setNewTicket(null)
    }
  }, [newTicket])

  useEffect(() => {
    if (updateTicketData) {
      setTickets(state => {
        return state.map(ticket => {
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
      })
      setUpdateTicketData(null)
    }
  }, [updateTicketData])

  useEffect(() => {
    if (ticketsData) {
      setTickets(
        ticketsData.tickets.edges.map(({ node }) => {
          return {
            key: node.id,
            date: moment(node.createdAt).format('YYYY-MM-DD'),
            piority: node.priority.priority,
            status: node.status.status,
            issue: node.subject,
          }
        }),
      )
    }
  }, [ticketsData])

  const columns = [
    {
      title: 'Date',
      key: 'date',
      dataIndex: 'date',
      width: '16%',
      editable: true,
    },
    {
      title: 'Piority',
      dataIndex: 'piority',
      width: '12%',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%',
      editable: true,
    },
    {
      title: 'Issues',
      dataIndex: 'issue',
      width: '30%',
      editable: true,
    },
    {
      title: 'Action',
      render(data) {
        return (
          <div>
            <Button onClick={() => setUpdateTicket(data.key)}>Edit</Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 20, marginTop: 20 }}>
        <InfoCard
          count={ticketStatusInfo?.InProcessticket.edgeCount}
          title="Active Tickets"
          style={{
            marginRight: 30,
          }}
        />
        <InfoCard
          count={ticketStatusInfo?.Resolvedticket.edgeCount}
          title="Resolved Tickets"
          style={{
            marginRight: 30,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 25,
        }}
      >
        <Button
          size="large"
          style={{ marginRight: 20 }}
          onClick={() => setCreateTicketDrawer(true)}
        >
          <PlusOutlined style={{ fontSize: 24, marginTop: 5, fontWeight: 600 }} />
        </Button>

        <DatePicker
          size="large"
          placeholder="Form Date"
          value={form}
          onChange={newDate => setForm(newDate)}
          style={{ marginRight: 20 }}
        />
        <DatePicker
          placeholder="To Date"
          size="large"
          value={to}
          onChange={newDate => setTo(newDate)}
        />
      </div>

      {ticketsError && 'Opps their is something wrong'}
      {ticketLoading && <LoadingComponent />}
      {ticketsData && <Table pagination={false} columns={columns} dataSource={tickets} bordered />}

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
