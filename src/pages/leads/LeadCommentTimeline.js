import React, { useEffect } from 'react'
import { Timeline, notification, Form, Input, Button } from 'antd'
import './LeadCommentTimeline.scss'
import {
  CaretRightOutlined,
  EditOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'

const UPDATE_COMMENT = gql`
  mutation($id: ID!, $comment: String) {
    updateLead(pk: $id, comment: [$comment]) {
      details {
        id
        comment {
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

const COMMENT_QUERY = gql`
  query($id: ID!) {
    lead(id: $id) {
      id
      name
      comment {
        edges {
          node {
            id
            comment
            time
            user {
              username
            }
          }
        }
      }
    }
  }
`

export default Form.create()(({ updateLeadId, form, leadStatus, name, projectName }) => {
  console.log('lead iD', updateLeadId)
  const [
    updateLead,
    { data: updateCommentData, error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      id: updateLeadId,
    },
  })

  const {
    data: commentQueryData,
    error: commentQueryError,
    loading: commentQueryLoading,
    refetch,
  } = useQuery(COMMENT_QUERY, {
    variables: {
      id: updateLeadId,
    },
    fetchPolicy: 'no-cache',
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
        updateLead({
          variables: {
            id: updateLeadId,
            comment: values.comment,
          },
        })
        // refetch()
      }
    })
  }

  return (
    <div>
      <div className="TimelineTopContainer">
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>Name: </p>
          </div>
          <div>
            <p>{name}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>Project Name: </p>
          </div>
          <div>
            <p>{projectName}</p>
          </div>
        </div>
        <div className="TopContainer-Row">
          <div className="TopContainer-Left">
            <CaretRightOutlined />
            <p>Status: </p>
          </div>
          <div>
            <p style={{ marginBottom: 0 }}>{leadStatus}</p>
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
              color: 'blue',
            }}
            // loading={updateCommentLoading}
          >
            Add Comment
          </Button>
        </Form>
      </div>
      <div className="TimelineMiddleContainer">
        <p>Comments:</p>
      </div>
      <div>
        {commentQueryData?.lead.comment.edges.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: 20 }}>No Comments to show </p>
        ) : (
          commentQueryData?.lead.comment.edges
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
