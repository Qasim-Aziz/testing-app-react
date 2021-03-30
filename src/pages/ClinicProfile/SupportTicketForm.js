/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import './SupportTicketFormStyle.scss'

const { TextArea } = Input
const { Option } = Select

const CREATE_TICKET = gql`
  mutation createTicket(
    $issue: String!
    $description: String
    $priority: ID!
    $service: ID!
    $assign: ID!
    $module: ID!
    $submodule: ID
  ) {
    createTicket(
      input: {
        subject: $issue
        description: $description
        priority: $priority
        service: $service
        assignTo: $assign
        module: $module
        submodule: $submodule
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
const role = localStorage.getItem('role')

const MODULE = gql`
query {
  menu(group_Name: ${role}) {
    edges {
      node {
        id
        MenuName
        key
        icon
        url
        menuLevel2Set {
          edges {
            node {
              id
              key
              url
              MenuName
            }
          }
        }
      }
    }
  }
}
`

const SUBMODULE = gql`
  query($varrr: ID) {
    submodules(ParentMenu: $varrr) {
      edges {
        node {
          id
          MenuName
        }
      }
    }
  }
`

export default Form.create()(({ form, setOpen, setNewTicket }) => {
  const { data: ticketPriorityData, loading: ticketPriorityLoading } = useQuery(TICKET_PRIORITY)

  const { data: ticketAssignData, loading: ticketAssignLoading } = useQuery(TICKET_ASSIGN)

  const { data: ticketServiceData, loading: ticketServiceLoading } = useQuery(TICKET_SERVICE)

  const { data: ticketStatusData, loading: ticketStatusLoading } = useQuery(TICKET_STATUS)

  const { data: moduleData, loading: moduleLoading } = useQuery(MODULE)

  const [parentID, setParentID] = useState()

  const { data: submoduleData, loading: submoduleLoading } = useQuery(SUBMODULE, {
    variables: { varrr: parentID },
  })

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
            module: values.module,
            submodule: values.submodule,
          },
        })
      }
    })
  }

  const ItemStyle = { width: '100%', display: 'flex' }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Issue" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('issue', {
          rules: [{ required: true, message: 'Please give the issue name!' }],
        })(<Input placeholder="Type the issue name" size="medium" />)}
      </Form.Item>

      <Form.Item label="Module" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('module', {
          rules: [{ required: true, message: 'Please select a module!' }],
        })(
          <Select
            placeholder="Select module"
            size="medium"
            loading={moduleLoading}
            onChange={value => {
              setParentID(`"${value}"`)
            }}
          >
            {moduleData?.menu.edges.map(({ node: { id, MenuName } }) => (
              <Option key={id} value={id}>
                {MenuName}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Sub Module" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('submodule', {
          rules: [{ message: 'Please select a sub module!' }],
        })(
          <Select placeholder="Select sub module" size="medium" loading={submoduleLoading}>
            {submoduleData?.submodules.edges.map(({ node: { id, MenuName } }) => (
              <Option key={id} value={id}>
                {MenuName}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="Description" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please type issue details!' }],
        })(<TextArea placeholder="Give more details" />)}
      </Form.Item>
      <Form.Item label="Assign" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('assign', {
          rules: [{ required: true, message: 'Please select one!' }],
        })(
          <Select placeholder="Select one" size="medium" loading={ticketAssignLoading}>
            {ticketAssignData?.ticketAssign.map(({ id, team }) => (
              <Option key={id} value={id}>
                {team}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Priority" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('priority', {
          rules: [{ required: true, message: 'Please select a priority!' }],
        })(
          <Select placeholder="Select priority" size="medium" loading={ticketPriorityLoading}>
            {ticketPriorityData?.ticketPriority.map(({ id, priority }) => (
              <Option key={id} value={id}>
                {priority}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Service Issue" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('service', {
          rules: [{ required: true, message: 'Please select a service!' }],
        })(
          <Select placeholder="Select a service issue" size="medium" loading={ticketServiceLoading}>
            {ticketServiceData?.ticketService.map(({ id, service }) => (
              <Option key={id} value={id}>
                {service}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Status" style={ItemStyle} className="Form-field-container">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: 'Please select a status!' }],
        })(
          <Select placeholder="Select a status" size="medium" loading={ticketStatusLoading}>
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
