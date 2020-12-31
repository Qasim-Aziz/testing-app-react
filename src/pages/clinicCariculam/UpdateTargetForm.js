/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import CKEditor from "react-ckeditor-component";
import './targetFrom.scss'

const TARGET_QUERY = gql`
query targetGet($id: ID!) {
    targetGet(id: $id)
    {
        id
      targetInstr
      targetMain {
        targetName
      }
      video
    }
}
`

const UPDATE_TARGET = gql`
  mutation updateMasterTarget(
    $targetId: ID!
    $domainId: ID!
    $targetAreaId: ID!
    $targetName: String!
    $targetInstr: String!
    $video: String
  ) {
    updateMasterTarget(
      input: {
        pk: $targetId
        domainId: $domainId
        targetAreaId: $targetAreaId
        targetName: $targetName
        targetInstr: $targetInstr
        video: $video
      }
    ) {
      details {
        id
        targetInstr
        video
        domain {
          id
          domain
        }
        targetArea {
          id
          Area
        }
        targetMain {
          id
          targetName
        }
      }
    }
  }
`

const TargetForm = ({ targetId, form, targetAreaId, handleUpdateTargetDrawer, domainId }) => {
  const { data, loading, error } = useQuery(TARGET_QUERY, {
    variables: {
      targetAreaId,
      id: targetId,
    },
  })

  const [
    updateTarget,
    { data: updateTargetData, error: updateTargetError, loading: updateTargetLoading },
  ] = useMutation(UPDATE_TARGET)

  useEffect(() => {
    if (updateTargetData) {
      notification.success({
        message: 'Clinic Cariculam',
        description: 'Target Updated Successfully',
      })
      form.resetFields()
      handleUpdateTargetDrawer(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTargetData])

  useEffect(() => {
    if (updateTargetError) {
      notification.error({
        message: 'Somthing want wrong',
        description: updateTargetError.message,
      })
    }
  }, [updateTargetError])


  const [instrvalue, setValue] = useState('');

  useEffect(() => {
    if (data) {
      try {
        setValue(JSON.parse(data.targetGet.targetInstr))
      }
      catch (err) {
        setValue(data.targetGet.targetInstr)
      }
    }

  }, [data])


  function onEditorChange(evt) {
    setValue(evt.editor.getData())
  }

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, value) => {
      if (!error) {
        updateTarget({
          variables: {
            targetId,
            domainId,
            targetAreaId,
            targetName: value.targetname,
            targetInstr: instrvalue,
            video: value.videolink
          },
        })
      }
    })
  }

  return (
    <div>
      {loading ? (
        'Loading...'
      ) : (
          <div>
            {error && 'Something went wrong!'}
            {data && (
              <Form name="targetForm" onSubmit={handleSubmit}>
                <Form.Item label="Target Name">
                  {form.getFieldDecorator('targetname', {
                    initialValue: data.targetGet.targetMain.targetName,
                    rules: [{ required: true, message: 'Please enter Target Name' }],
                  })(<Input placeholder="Target Name" size="large" />)}
                </Form.Item>

                <Form.Item label="Target Instructions">
                  <CKEditor
                    activeClass="p10"
                    content={instrvalue}
                    events={{
                      "change": onEditorChange
                    }}
                    config={{
                      height: 450
                    }}
                  />
                </Form.Item>
                <Form.Item label="Target Video Link">
                  {form.getFieldDecorator('videolink', {
                    initialValue: data.targetGet.video,
                  })(<Input placeholder="Target Video Link" size="large" />)}
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateTargetLoading}
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    width: '100%',
                    height: 40,
                  }}
                >
                  Update Target
              </Button>
              </Form>
            )}
          </div>
        )}
    </div>
  )
}

export default Form.create()(TargetForm)
