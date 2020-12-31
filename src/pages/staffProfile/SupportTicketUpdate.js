/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Button, Form, Input, Select, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { TextArea } = Input
const { Option } = Select

const TICKET_QUERY = gql`
  query($id: ID!) {
    ticket(id: $id) {
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
`

const UPDATE_TICKET = gql`
  mutation(
    $id: ID!
    $subject: String!
    $description: String!
    $priority: ID!
    $service: ID!
    $assign: ID!
  ) {
    updateTicket(
      input: {
        pk: $id
        subject: $subject
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
      }
    ) {
      ticket {
        id
        subject
        description
        createdAt
        priority {
          id
          priority
        }
        status {
          id
          status
        }
        __typename
      }
      __typename
    }
    __typename
  }
`

const TICKET_PRIORITY = gql`
  query {
    ticketPriority {
      id
      priority
    }
  }
`

const TICKET_SERVICE = gql`
  query {
    ticketService {
      id
      service
    }
  }
`

const TICKET_STATUS = gql`
  query {
    ticketStatus {
      id
      status
    }
  }
`

const TICKET_ASSIGN = gql`
  query {
    ticketAssign {
      id
      team
    }
  }
`

export default Form.create()(({ form, updateTicketId, setUpdateTicketId, setUpdateTicketData }) => {
  const { data, loading, error } = useQuery(TICKET_QUERY, {
    variables: {
      id: updateTicketId,
    },
  })

  const { data: ticketPriorityData, loading: ticketPriorityLoading } = useQuery(TICKET_PRIORITY)

  const { data: ticketAssignData, loading: ticketAssignLoading } = useQuery(TICKET_ASSIGN)

  const { data: ticketServiceData, loading: ticketServiceLoading } = useQuery(TICKET_SERVICE)

  const { data: ticketStatusData, loading: ticketStatusLoading } = useQuery(TICKET_STATUS)

  const [
    updateTicket,
    { data: updateTicketData, error: updateTicketError, loading: updateTicketLoading },
  ] = useMutation(UPDATE_TICKET)

  useEffect(() => {
    if (updateTicketData) {
      notification.success({
        message: 'Update support ticket sucessfully',
      })
      setUpdateTicketData(updateTicketData.updateTicket.ticket)
      form.resetFields()
      setUpdateTicketId(null)
    }
  }, [updateTicketData])

  useEffect(() => {
    if (updateTicketError) {
      notification.error({
        message: 'Faild to update support ticket',
      })
    }
  }, [updateTicketError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        updateTicket({
          variables: {
            id: updateTicketId,

            subject: values.issue,
            description: values.description,
            priority: values.priority,
            service: values.service,
            assign: values.assign,
          },
        })
      }
    })
  }

  if (loading) {
    return 'Loading'
  }

  if (error) {
    return 'Opps their something wrong'
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Issue">
        {form.getFieldDecorator('issue', {
          initialValue: data.ticket.subject,
          rules: [{ required: true, message: 'Please give the issue name!' }],
        })(<Input placeholder="Type the issue name" size="large" />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          initialValue: data.ticket.description,
          rules: [{ required: true, message: 'Please type issue details!' }],
        })(<TextArea placeholder="Give more details" />)}
      </Form.Item>
      <Form.Item label="Assign">
        {form.getFieldDecorator('assign', {
          initialValue: data.ticket.assignTo.id,
          rules: [{ required: true, message: 'Please select one!' }],
        })(
          <Select placeholder="Select one" size="large" loading={ticketAssignLoading}>
            {ticketAssignData?.ticketAssign.map(({ id, team }) => (
              <Option key={id} value={id}>
                {team}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Priority">
        {form.getFieldDecorator('priority', {
          initialValue: data.ticket.priority.id,
          rules: [{ required: true, message: 'Please select a priority!' }],
        })(
          <Select placeholder="Select priority" size="large" loading={ticketPriorityLoading}>
            {ticketPriorityData?.ticketPriority.map(({ id, priority }) => (
              <Option key={id} value={id}>
                {priority}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Service Issue">
        {form.getFieldDecorator('service', {
          initialValue: data.ticket.service.id,
          rules: [{ required: true, message: 'Please select a service!' }],
        })(
          <Select placeholder="Select a service issue" size="large" loading={ticketServiceLoading}>
            {ticketServiceData?.ticketService.map(({ id, service }) => (
              <Option key={id} value={id}>
                {service}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Status">
        {form.getFieldDecorator('status', {
          initialValue: data.ticket.status.id,
          rules: [{ required: true, message: 'Please select a status!' }],
        })(
          <Select placeholder="Select a status" size="large" loading={ticketStatusLoading}>
            {ticketStatusData?.ticketStatus.map(({ id, status }) => (
              <Option key={id} value={id}>
                {status}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          loading={updateTicketLoading}
        >
          Update Ticket
        </Button>

        <Button
          type="danger"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          onClick={() => {
            form.resetFields()
            setUpdateTicketId(null)
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  )
})
