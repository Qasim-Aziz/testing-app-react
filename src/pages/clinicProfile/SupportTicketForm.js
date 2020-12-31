/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Button, Form, Input, Select, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { TextArea } = Input
const { Option } = Select

const CREATE_TICKET = gql`
  mutation createTicket(
    $issue: String!
    $description: String
    $priority: ID!
    $service: ID!
    $assign: ID!
  ) {
    createTicket(
      input: {
        subject: $issue
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
      }
    ) {
      ticket {
        id
        subject
      }
    }
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

export default Form.create()(({ form, setOpen, setNewTicket }) => {
  const { data: ticketPriorityData, loading: ticketPriorityLoading } = useQuery(TICKET_PRIORITY)

  const { data: ticketAssignData, loading: ticketAssignLoading } = useQuery(TICKET_ASSIGN)

  const { data: ticketServiceData, loading: ticketServiceLoading } = useQuery(TICKET_SERVICE)

  const { data: ticketStatusData, loading: ticketStatusLoading } = useQuery(TICKET_STATUS)

  const [
    createTicket,
    { data: createTicketData, error: createTicketError, loading: createTicketLoading },
  ] = useMutation(CREATE_TICKET)

  useEffect(() => {
    if (createTicketData) {
      notification.success({
        message: 'New support ticket create sucessfully',
      })
      form.resetFields()
      setOpen(false)
      setNewTicket(createTicketData.createTicket.ticket)
    }
  }, [createTicketData])

  useEffect(() => {
    if (createTicketError) {
      notification.error({
        message: 'Faild to create new support ticket',
      })
    }
  }, [createTicketError])

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        createTicket({
          variables: {
            issue: values.issue,
            description: values.description,
            priority: values.priority,
            service: values.service,
            assign: values.assign,
          },
        })
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Issue">
        {form.getFieldDecorator('issue', {
          rules: [{ required: true, message: 'Please give the issue name!' }],
        })(<Input placeholder="Type the issue name" size="large" />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please type issue details!' }],
        })(<TextArea placeholder="Give more details" />)}
      </Form.Item>
      <Form.Item label="Assign">
        {form.getFieldDecorator('assign', {
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
          loading={createTicketLoading}
        >
          Create Ticket
        </Button>

        <Button
          type="danger"
          style={{ marginTop: 15, fontSize: 16, width: '46%', height: 40 }}
          onClick={() => {
            form.resetFields()
            setOpen(false)
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  )
})
