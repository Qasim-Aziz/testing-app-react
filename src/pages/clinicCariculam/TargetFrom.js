/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
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
import { useMutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import './targetFrom.scss'
import { COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import { TARGET_QUERY } from './query'

const CREATE_TARGET = gql`
  mutation masterTarget(
    $domainId: ID!
    $targetAreaId: ID!
    $targetname: String!
    $targetInstr: String!
    $video: String
  ) {
    masterTarget(
      input: {
        domainId: $domainId
        targetAreaId: $targetAreaId
        targetName: $targetname
        targetInstr: $targetInstr
        video: $video
      }
    ) {
      target {
        id
        targetInstr
        isActive
        targetMain {
          targetName
        }
        video
      }
    }
  }
`

const { layout } = FORM

const itemStyle = { marginBottom: '10px', fontWeight: 'bold' }

const TargetForm = ({
  domainId,
  targetAreaId,
  form,
  handelNewTargetDrawer,
  name,
  instr,
  video = '',
}) => {
  const [createTarget, { data, loading, error }] = useMutation(CREATE_TARGET, {
    update(cache, { data }) {
      const cacheValue = cache.readQuery({
        query: TARGET_QUERY,
        variables: {
          id: targetAreaId,
        },
      })

      cache.writeQuery({
        query: TARGET_QUERY,
        variables: {
          id: targetAreaId,
        },
        data: {
          target: {
            edges: [
              {
                node: data.masterTarget.target,
                __typename: data.masterTarget.__typename,
              },
              ...cacheValue.target.edges,
            ],
            __typename: cacheValue.target.__typename,
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Clinic Curriculam',
        description: 'New Target Added Successfully',
      })
      form.resetFields()
      handelNewTargetDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      console.log(JSON.stringify(error))
      notification.error({
        message: 'Something went wrong!',
        description: error.graphQLErrors[0]?.message,
      })
    }
  }, [error])

  const [instrvalue, setValue] = useState(instr)

  useEffect(() => {
    try {
      setValue(JSON.parse(instr))
    } catch (err) {
      setValue(instr)
    }
  }, [instr])

  function onEditorChange(evt) {
    instr = evt.editor.getData()
    setValue(evt.editor.getData())
  }

  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, value) => {
      if (!error) {
        createTarget({
          variables: {
            domainId,
            targetAreaId,
            targetname: value.targetname,
            targetInstr: JSON.stringify(instrvalue),
            video: value.videolink,
          },
        })
      }
    })
  }

  return (
    <div>
      <Form {...layout} onSubmit={handleSubmit}>
        <Form.Item label="Target Name" style={itemStyle}>
          {form.getFieldDecorator('targetname', {
            initialValue: name,
            rules: [{ required: true, message: 'Please enter Target Name' }],
          })(<Input placeholder="Target Name" size="large" />)}
        </Form.Item>
        <Form.Item label="Target Instructions" style={itemStyle}>
          <CKEditor
            activeClass="p10"
            content={instrvalue}
            events={{
              change: onEditorChange,
            }}
            config={{
              height: 450,
            }}
          />
        </Form.Item>
        <Form.Item label="Target Video Link" style={itemStyle}>
          {form.getFieldDecorator('videolink', {
            initialValue: video,
          })(<Input placeholder="Target Video Link" size="large" />)}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button htmlType="submit" loading={loading} style={SUBMITT_BUTTON}>
            Create Target
          </Button>

          <Button
            onClick={() => handelNewTargetDrawer(false)}
            style={{ ...SUBMITT_BUTTON, backgroundColor: COLORS.danger }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Form.create()(TargetForm)
