/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef } from 'react'
import { Card, Form, Input, Typography, Button, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import Scrollbars from 'react-custom-scrollbars'
// eslint-disable-next-line import/no-cycle
import { LSAG_USER_ID } from '.'
import { GET_COMMENTS, SEND_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from './query'

const { Text, Title } = Typography

export default ({ blogId }) => {
  const [editMode, setEditMode] = useState(false)
  const userId = useSelector(state => state.user.id)
  const deleteCommentId = useRef()

  const { data, error, loading, fetchMore } = useQuery(GET_COMMENTS, {
    variables: {
      blogId,
    },
  })

  const [
    deleteComment,
    { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation(DELETE_COMMENT, {
    variables: {
      blogId,
    },
    update(cache) {
      const cacheComments = cache.readQuery({
        query: GET_COMMENTS,
        variables: {
          blogId,
        },
      })

      cache.writeQuery({
        query: GET_COMMENTS,
        variables: {
          blogId,
        },
        data: {
          communityBlogsDetails: {
            comments: {
              edges: cacheComments.communityBlogsDetails.comments.edges.filter(data => {
                console.log(data.node.id, deleteCommentId)
                return data.node.id !== deleteCommentId.current
              }),
              __typename: 'CommunityCommentsTypeConnection',
            },
            __typename: 'CommunityBlogsType',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (deleteData) {
      notification.success({
        message: 'Delete comment sucessfully',
      })
    }

    if (deleteError) {
      notification.error({
        message: 'Delete comment failed',
      })
    }
  }, [deleteData, deleteError])

  return (
    <Card style={{ marginTop: 10, borderRadius: 10 }}>
      <div>
        {loading && 'Loading...'}
        {error && 'Opps their somethins is wrong'}
        <Scrollbars style={{ height: 350 }}>
          {data &&
            data.communityBlogsDetails.comments.edges.map(({ node }) => {
              return (
                <div
                  key={node.id}
                  style={{
                    padding: 10,
                    borderRadius: 15,
                    // border: "2px solid rgb(11, 53, 179)",
                    display: 'block',
                    maxWidth: '70%',
                    marginTop: 0,
                    position: 'relative',
                  }}
                >
                  <Title style={{ fontSize: 16, margin: 0 }}>
                    {`${node.user.firstName} ${node.user.lastName}`}
                  </Title>
                  {!editMode ? (
                    <Text style={{ fontSize: 15, color: '#000' }}>{node.comment}</Text>
                  ) : editMode === node.id ? (
                    <UpdateCommentForm
                      content={node.comment}
                      setEditMode={setEditMode}
                      editId={editMode}
                      id={node.id}
                    />
                  ) : (
                    ''
                  )}
                  {(userId === LSAG_USER_ID || userId === node.user.id) && !editMode && (
                    <div style={{ position: 'absolute', right: 18, top: 24 }}>
                      <Button
                        type="link"
                        loading={deleteCommentId.current === node.id && deleteLoading}
                        onClick={() => {
                          deleteCommentId.current = node.id
                          deleteComment({
                            variables: {
                              commentId: node.id,
                            },
                          })
                        }}
                      >
                        <DeleteOutlined style={{ fontSize: 20, color: 'red' }} />
                      </Button>
                      {!editMode && (
                        <Button type="link" onClick={() => setEditMode(node.id)}>
                          <FormOutlined style={{ fontSize: 20 }} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          {data && data.communityBlogsDetails.comments.pageInfo.hasNextPage && (
            <Button
              onClick={() => {
                fetchMore({
                  variables: {
                    afterCursor: data.communityBlogsDetails.comments.pageInfo.endCursor,
                  },
                  updateQuery(previousResult, { fetchMoreResult }) {
                    const newEdges = fetchMoreResult.communityBlogsDetails.comments.edges
                    const { pageInfo } = fetchMoreResult.communityBlogsDetails.comments

                    return newEdges.length
                      ? {
                          // Put the new comments at the end of the list and update `pageInfo`
                          // so we have the new `endCursor` and `hasNextPage` values
                          communityBlogsDetails: {
                            comments: {
                              // eslint-disable-next-line no-underscore-dangle
                              __typename: previousResult.communityBlogsDetails.comments.__typename,
                              edges: [
                                ...previousResult.communityBlogsDetails.comments.edges,
                                ...newEdges,
                              ],
                              pageInfo,
                            },
                            __typename: 'CommunityBlogsType',
                          },
                        }
                      : previousResult
                  },
                })
              }}
            >
              Get more...
            </Button>
          )}
        </Scrollbars>
      </div>
      <hr />
      <CommentForm blogId={blogId} userId={userId} />
    </Card>
  )
}

const CommentForm = Form.create()(({ form, blogId, userId }) => {
  const [sendComment, { data, loading, error }] = useMutation(SEND_COMMENT, {
    update(
      cache,
      {
        data: {
          communityLikesComments: {
            details: { comments },
          },
        },
      },
    ) {
      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { blogId },
        data: {
          communityBlogsDetails: {
            comments,
            __typename: 'CommunityCommentsTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Comment send sucessfully',
      })
      form.resetFields()
    }
    if (error) {
      notification.error({
        message: 'Opps their is a problem when seding comment',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        sendComment({
          variables: {
            blogId,
            userId,
            message: values.message,
          },
        })
      }
    })
  }

  return (
    <Form
      style={{
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex',
        justifyContent: 'space-between',
        height: 40,
      }}
      onSubmit={handleSubmit}
    >
      <Form.Item style={{ width: '80%' }}>
        {form.getFieldDecorator('message', {
          rule: [{ required: true, message: 'Type what you wanna say' }],
        })(<Input placeholder="Type your thought" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        style={{ width: 150, maxWidth: '15%', background: 'navyblue' }}
        loading={loading}
      >
        Send
      </Button>
    </Form>
  )
})

const UpdateCommentForm = Form.create()(({ form, content, setEditMode, id }) => {
  const [updateComment, { data, error, loading }] = useMutation(UPDATE_COMMENT)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Update comment sucessfully',
      })
      setEditMode(null)
    }
    if (error) {
      notification.error({
        message: 'Update comment failed',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  const submit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        updateComment({
          variables: {
            id,
            comment: values.comment,
          },
        })
      }
    })
  }

  return (
    <Form style={{ display: 'flex', alignItems: 'center' }} onSubmit={submit}>
      <Form.Item style={{ flexGrow: 1 }}>
        {form.getFieldDecorator('comment', {
          initialValue: content,
          rules: [{ required: true, message: 'Please type something' }],
        })(<Input autoFocus />)}
      </Form.Item>
      <Form.Item style={{ display: 'flex' }}>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }} loading={loading}>
          Save
        </Button>
        <Button type="danger" style={{ marginLeft: 5 }} onClick={() => setEditMode(null)}>
          Cancle
        </Button>
      </Form.Item>
    </Form>
  )
})
