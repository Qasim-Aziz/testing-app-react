import React, { useState, useEffect } from 'react'
import { Form, Switch, Button, notification } from 'antd'
import './form.css'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from '../staffProfile/LoadingComponent'

const EMAIL_NOTI_INFO = gql`
  query {
    schoolDetail {
      schoolMail {
        parentMail
        staffMail
      }
    }
  }
`

const CHANGE_SETT = gql`
  mutation schoolMail($parentMail: Boolean!, $staffMail: Boolean!) {
    schoolMail(input: { parentMail: $parentMail, staffMail: $staffMail }) {
      schoolMail {
        id
        parentMail
        staffMail
      }
    }
  }
`

const EmailNotiSett = () => {
  const [parentId, setParentId] = useState()
  const [therapistId, setTherapistId] = useState()
  const [changeData, setChangeData] = useState(false)

  const { data: mailData, error: mailError, loading: mailLoading } = useQuery(EMAIL_NOTI_INFO, {
    fetchPolicy: 'no-cache',
  })

  const [
    updateSett,
    { data: updateSettData, error: updateSettError, loading: updateSettLoading },
  ] = useMutation(CHANGE_SETT)

  useEffect(() => {
    if (mailData) {
      const { parentMail, staffMail } = mailData.schoolDetail.schoolMail
      setParentId(parentMail)
      setTherapistId(staffMail)
    }
  }, [mailData])

  useEffect(() => {
    if (updateSettData) {
      notification.success({
        message: 'Update Email Notificaiton Setting Successfully',
      })
      setChangeData(false)
    }
    if (updateSettError) {
      notification.error({
        message: 'Update Email Notificaiton Setting Faild',
      })
    }
  }, [updateSettData, updateSettError])

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 5 },
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 5 },
  }
  const handelChange = userType => () => {
    setChangeData(true)
    if (userType === 'parent') {
      setParentId(state => !state)
    } else if (userType === 'staff') {
      setTherapistId(state => !state)
    }
  }

  return (
    <div>
      {mailLoading ? (
        <LoadingComponent />
      ) : (
        <div>
          {mailError && <pre>{JSON.stringify(mailError, null, 2)}</pre>}
          {mailData && (
            <Form {...formItemLayout} className="profileForm">
              <Form.Item label="Parent Email Notification">
                <Switch checked={parentId} onChange={handelChange('parent')} />
              </Form.Item>
              <Form.Item label="Therapist Email Notification">
                <Switch checked={therapistId} onChange={handelChange('staff')} />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateSettLoading}
                  onClick={() =>
                    updateSett({
                      variables: {
                        parentMail: parentId,
                        staffMail: therapistId,
                      },
                    })
                  }
                  disabled={!changeData}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}

export default EmailNotiSett
