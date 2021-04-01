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
import '../ClinicProfile/SupportTicketTimeline.scss'
import { COLORS, DRAWER, FONT } from '../../assets/styles/globalStyles'

const COMMENT_QUERY = gql`
  query($id: ID!) {
    task(id: $id) {
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
    updateTask(
      input: { task: { pk: $id }, deletedReminder: [], comments: [$comment], removeComments: [] }
    ) {
      task {
        id
        taskName
        description
        comments {
          edges {
            node {
              id
              comment
              time
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

export default Form.create()(({ task, form }) => {
  const { data: commentQueryData, loading: commentQueryLoading, refetch } = useQuery(
    COMMENT_QUERY,
    {
      variables: {
        id: task.id,
      },
    },
  )

  const [
    updateComment,
    { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      id: task.id,
    },
  })

  useEffect(() => {
    if (updateCommentData) {
      notification.success({
        message: 'comment added successfully',
      })
      form.resetFields()
      refetch()
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
            id: task.id,
            comment: values.comment,
          },
        })
      }
    })
  }

  if (commentQueryLoading) {
    return 'loading'
  }

  console.log(commentQueryData?.task.comments)
  return (
    <div>
      <div className="TimelineTopContainer">
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>TASK NAME: </p>
          </div>
          <div>
            <p>{task.taskName}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>STATUS: </p>
          </div>
          <div>
            <p>{task.status.taskStatus}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>PRIORITY: </p>
          </div>
          <div>
            <p>{task.priority.name}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>START DATE: </p>
          </div>
          <div>
            <p>{task.startDate}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>DUE DATE: </p>
          </div>
          <div>
            <p style={{ marginBottom: 0 }}>{task.dueDate}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '4em' }}>
        <Form onSubmit={handleCommentSubmit} style={{ display: 'flex' }}>
          <Form.Item style={{ display: 'flex', width: '90%' }} className="TimeLine-Form">
            {form.getFieldDecorator('comment', {
              rules: [{ required: false, message: 'Please add comment!' }],
            })(<Input placeholder="Add comment here" size="large" />)}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: 'white', border: '1px solid #112D4E', color: '#112D4E' }}
          >
            Add Comment
          </Button>
        </Form>
      </div>
      <div className="TimelineMiddleContainer">
        <p>Comments:</p>
      </div>
      {commentQueryData?.task.comments.edges.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: FONT.level3 }}>No Comments to show </p>
      ) : (
        commentQueryData?.task.comments.edges
          .slice(0)
          .reverse()
          .map(({ node: { time, comment, user: { username } } }) => (
            <Timeline mode="alternate" loading={commentQueryLoading}>
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
  )
})
