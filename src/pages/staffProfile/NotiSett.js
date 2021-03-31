import React, { useState, useEffect } from 'react'
import { Typography, Switch, Form, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from 'react-apollo'
import LoadingComponent from './LoadingComponent'

const { Text } = Typography
const SETTING = gql`
  query($userId: ID!) {
    userSettings(user: $userId) {
      edges {
        node {
          id
          language
          sessionReminders
          medicalReminders
          dataRecordingReminders
          user {
            id
            username
          }
        }
      }
    }
  }
`

const CHANGE_SETTING = gql`
  mutation(
    $user: ID!
    $language: String
    $sessionReminders: Boolean!
    $medicalReminders: Boolean!
    $dataRecordingReminders: Boolean!
  ) {
    changeUserSetting(
      input: {
        user: $user
        language: $language
        sessionReminders: $sessionReminders
        medicalReminders: $medicalReminders
        dataRecordingReminders: $dataRecordingReminders
      }
    ) {
      details {
        id
        language
        sessionReminders
        medicalReminders
        dataRecordingReminders
      }
    }
  }
`

const SettingForm = () => {
  const [editMode, setEditMode] = useState(true)
  const user = useSelector(state => state.user)
  const [sessionReminders, setSessionReminders] = useState(false)
  const [medicalReminders, setMedicalReminders] = useState(false)
  const [dataRecordingReminders, setDataRecordingReminders] = useState(false)

  const { data: userSettings, error: userSettingsError, loading: userSettingsLoading } = useQuery(
    SETTING,
    {
      variables: {
        userId: user.id,
      },
    },
  )

  const [
    changeSetting,
    { data: changeSettingData, loading: changeSettingLoading, error: changeSettingError },
  ] = useMutation(CHANGE_SETTING, {
    variables: {
      user: user.id,
    },
  })

  useEffect(() => {
    if (userSettings) {
      if (userSettings.userSettings.edges[0]) {
        setDataRecordingReminders(userSettings.userSettings.edges[0].node.dataRecordingReminders)
        setMedicalReminders(userSettings.userSettings.edges[0].node.medicalReminders)
        setSessionReminders(userSettings.userSettings.edges[0].node.sessionReminders)
      } else {
        setDataRecordingReminders(false)
        setMedicalReminders(false)
        setSessionReminders(false)
      }
    }
  }, [userSettings])

  useEffect(() => {
    if (changeSettingData) {
      notification.success({
        message: 'Notification setting change sucessfully',
      })
    }
    if (changeSettingError) {
      notification.error({
        message: 'Error on changing notification setting',
      })
    }
  }, [changeSettingError, changeSettingData])

  const SwitchFrom = ({ title, style, value, setValue }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 350,
          ...style,
        }}
      >
        <div>
          <Text style={{ fontSize: 14, margin: 0, fontWeight: 'bold' }}>{title}</Text>
        </div>
        <Form.Item style={{ marginTop: 8, marginBottom: 5 }}>
          <Switch checked={value} onChange={() => setValue(state => !state)} />
        </Form.Item>
      </div>
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    changeSetting({
      variables: {
        sessionReminders,
        medicalReminders,
        dataRecordingReminders,
      },
    })
  }
  const handleCancle = () => {
    setEditMode(false)
    if (userSettings.userSettings.edges[0]) {
      setDataRecordingReminders(userSettings.userSettings.edges[0].node.dataRecordingReminders)
      setMedicalReminders(userSettings.userSettings.edges[0].node.medicalReminders)
      setSessionReminders(userSettings.userSettings.edges[0].node.sessionReminders)
    } else {
      setDataRecordingReminders(false)
      setMedicalReminders(false)
      setSessionReminders(false)
    }
  }

  if (userSettingsError) {
    return <div style={{ marginTop: 45 }}>Opps their is something wrong</div>
  }

  if (userSettingsLoading) {
    return <LoadingComponent />
  }

  return (
    <div>
      <div>
        <div className="profileTab-heading">
          <p>Email Notification</p>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <div>
          <SwitchFrom
            title="Session Reminders"
            info="Reminders for everyday sessions"
            value={sessionReminders}
            setValue={setSessionReminders}
          />
          <SwitchFrom
            title="Data Recoreding"
            info="Reminders for everyday data recoreding"
            editMode={editMode}
            value={dataRecordingReminders}
            setValue={setDataRecordingReminders}
          />
          <SwitchFrom
            title="Medical Reminders"
            info="Reminders for everyday medical reminders"
            value={medicalReminders}
            setValue={setMedicalReminders}
          />
        </div>
        {editMode && (
          <div
            style={{
              marginTop: 15,
              display: 'flex',
            }}
          >
            <Button type="primary" htmlType="submit" loading={changeSettingLoading}>
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}

export default SettingForm
