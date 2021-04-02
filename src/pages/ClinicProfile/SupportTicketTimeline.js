import React, { useEffect } from 'react'
import { Timeline, notification, Form, Input, Button } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import {
  CaretRightOutlined,
  EditOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import './SupportTicketTimeline.scss'
import { COLORS, FONT } from '../../assets/styles/globalStyles'

const TICKET_QUERY = gql`
  query($id: ID!) {
    ticket(id: $id) {
      id
      subject
      description
      module {
        id
        MenuName
      }
      submodule {
        id
        MenuName
      }
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

const COMMENT_QUERY = gql`
  query($id: ID!) {
    ticket(id: $id) {
      comments {
        edges {
          node {
            id
            time
            comment
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`

const UPDATE_COMMENT = gql`
  mutation($id: ID!, $comment: String!) {
    updateTicket(input: { pk: $id, comments: [$comment] }) {
      ticket {
        id
        comments {
          edges {
            node {
              id
              time
              comment
              user {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`

export default Form.create()(({ updateTicketId, form, setUpdateTicketId }) => {
  const { data, loading, error } = useQuery(TICKET_QUERY, {
    variables: {
      id: updateTicketId,
    },
  })

  console.log('before comment query')
  console.log(updateTicketId)
  const {
    data: commentQueryData,
    error: commentQueryError,
    loading: commentQueryLoading,
  } = useQuery(COMMENT_QUERY, {
    variables: {
      id: updateTicketId,
    },
    fetchPolicy: 'no-cache',
  })

  const [
    updateComment,
    { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      id: updateTicketId,
    },
  })
  console.log('update ticket id')
  console.log(updateTicketId)
  useEffect(() => {
    if (updateCommentData) {
      notification.success({
        message: 'comment added successfully',
      })
      form.resetFields()
      setUpdateTicketId(null)
    }
  }, [updateCommentData])

  useEffect(() => {
    if (updateCommentError) {
      notification.success({
        message: 'Failed to add comment',
      })
    }
  }, [updateCommentError])

  const handleCommentSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, values) => {
      if (!error) {
        updateComment({
          variables: {
            id: updateTicketId,
            comment: values.comment,
          },
        })
      }
    })
  }

  if (!data && loading === true) {
    return 'Loading'
  }

  if (error) {
    return 'Opps their something wrong'
  }
  return (
    <div>
      <div className="TimelineTopContainer">
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>ISSUE: </p>
          </div>
          <div>
            <p>{data.ticket.subject}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>STATUS: </p>
          </div>
          <div>
            <p>{data.ticket.status.status}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>DESCRIPTION: </p>
          </div>
          <div>
            <p style={{ marginBottom: 0 }}>{data.ticket.description}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '4em' }}>
        <Form onSubmit={handleCommentSubmit} style={{ display: 'flex' }}>
          <Form.Item style={{ display: 'flex', width: '90%' }} className="TimeLine-Form">
            {form.getFieldDecorator('comment', {
              rules: [{ required: true, message: 'Please add comment!' }],
            })(<Input placeholder="Add comment here" size="large" />)}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: 'white',
              border: '1px solid #0b35b3',
              color: COLORS.palleteDarkBlue,
            }}
            loading={updateCommentLoading}
          >
            Add Comment
          </Button>
        </Form>
      </div>
      <div className="TimelineMiddleContainer">
        <p>Comments:</p>
      </div>
      <div>
        {commentQueryData?.ticket.comments.edges.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: FONT.level3 }}>No Comments to show </p>
        ) : (
          commentQueryData?.ticket.comments.edges
            .slice(0)
            .reverse()
            .map(({ node: { id, time, comment, user: { username } } }) => (
              <Timeline mode="alternate" loading={commentQueryLoading} key={id}>
                <Timeline.Item dot={<EditOutlined className="Timeline-Icon" />}>
                  <span id="timeline-body">Commented by</span>
                  <p> {username}</p>{' '}
                </Timeline.Item>
                <Timeline.Item dot={<ClockCircleOutlined className="Timeline-Icon" />}>
                  at {moment(time).format('MMMM DD, YYYY')}{' '}
                </Timeline.Item>
                <Timeline.Item dot={<MessageOutlined className="Timeline-Icon" />}>
                  {comment}
                </Timeline.Item>
              </Timeline>
            ))
        )}
      </div>
    </div>
  )
})
