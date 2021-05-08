import React, { useEffect } from 'react'
import { Form, Input, notification, Button, Icon, message } from 'antd'
import { CANCEL_BUTTON, SUBMITT_BUTTON, FORM } from 'assets/styles/globalStyles'
import { useMutation } from 'react-apollo'
import { UPDATE_LEARNER_FILE, UPDATE_STAFF_FILE } from './query'

const { layout, tailLayout } = FORM

function UpdateFile({ form, currentRow, refetchStaffData, refetchStudentData, closeDrawer }) {
  const [updateLearnerFile, { loading: learnerFileLoading }] = useMutation(UPDATE_LEARNER_FILE)
  const [updateStaffFile, { loading: staffFileLoading }] = useMutation(UPDATE_STAFF_FILE)

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (!err && currentRow?.stdId && currentRow?.id) {
        if (currentRow.role === 'therapist') {
          updateStaffFile({
            variables: {
              docsId: currentRow.id,
              fileName: values.fileName,
              fileDescription: values.description,
            },
          })
            .then(res => {
              refetchStaffData()
              notification.success({
                message: 'File updated successfully',
              })
              closeDrawer()
            })
            .catch(er => console.error(er))
        } else if (currentRow.role === 'student') {
          updateLearnerFile({
            variables: {
              docsId: currentRow.id,
              fileName: values.fileName,
              fileDescription: values.description,
            },
          })
            .then(res => {
              refetchStudentData()
              notification.success({
                message: 'File updated successfully',
              })
              closeDrawer()
            })
            .catch(er => console.error(er))
        }
      }
    })
  }

  return (
    <div>
      <Form onSubmit={handleSubmit} {...layout} className="login-form">
        <Form.Item label="File Name">
          {form.getFieldDecorator('fileName', {
            initialValue: currentRow?.fileName,
            rules: [{ required: true, message: 'Please input your file name!' }],
          })(<Input placeholder="File name" />)}
        </Form.Item>
        <Form.Item label="File Description">
          {form.getFieldDecorator('description', {
            initialValue: currentRow?.fileDescription,
            rules: [{ required: true, message: 'Please input your file description!' }],
          })(<Input type="text" placeholder="File description" />)}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            loading={learnerFileLoading || staffFileLoading}
            htmlType="submit"
            style={SUBMITT_BUTTON}
          >
            Update
          </Button>
          <Button type="danger" onClick={() => closeDrawer()} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create()(UpdateFile)
