import React, { useState, useEffect } from 'react'
import { Typography, Switch, Select } from 'antd'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select

const SETTING = gql`
  query($userId: ID!) {
    userSettings(user: $userId) {
      edges {
        node {
          sessionReminders
          language
          medicalReminders
          dataRecordingReminders
        }
      }
    }
  }
`

const SwitchFrom = ({ title, info, active, setActive, style }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        ...style,
      }}
    >
      <div>
        <Title className="fromInputTitle">{title}</Title>
        <Text
          style={{
            fontSize: 13,
            lineHeight: '18px',
          }}
        >
          {info}
        </Text>
      </div>

      <Switch
        checked={active}
        onClick={() => {
          setActive(state => !state)
        }}
      />
    </div>
  )
}

export default () => {
  const [sessionReminder, setSessionReminder] = useState(false)
  const [dataRecoredingReminder, setDataRecoredingReminder] = useState(false)
  const [madicalReminder, setMadicalReminder] = useState(false)
  const [language, setLanguage] = useState()
  const user = useSelector(state => state.user)

  const { data: userSettings, error: userSettingsError, loading: userSettingsLoading } = useQuery(
    SETTING,
    {
      variables: {
        userId: user.id,
      },
    },
  )

  useEffect(() => {
    if (userSettings?.userSettings?.edges[0]?.node) {
      const settingObj = userSettings.userSettings.edges[0].node
      setSessionReminder(settingObj.sessionReminders)
      setDataRecoredingReminder(settingObj.dataRecordingReminders)
      setMadicalReminder(settingObj.medicalReminders)
      setLanguage(settingObj.language)
    }
  }, [userSettings])

  return (
    <div
      style={{
        background: '#F9F9F9',
        borderRadius: 10,
        padding: '25px 20px',
      }}
    >
      {userSettingsLoading && <div>Loading...</div>}
      {userSettingsError && <div>Opps their something is wrong</div>}
      {userSettings && (
        <>
          <div>
            <Title
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: '27px',
              }}
            >
              Notifications
            </Title>

            <SwitchFrom
              title="Session Reminders"
              info="Reminders for everyday sessions"
              active={sessionReminder}
              setActive={setSessionReminder}
            />
            <SwitchFrom
              title="Data Recording"
              info="Reminders for everyday sessions"
              active={dataRecoredingReminder}
              setActive={setDataRecoredingReminder}
            />
            <SwitchFrom
              title="Medical Reminders"
              info="Text"
              active={madicalReminder}
              setActive={setMadicalReminder}
            />
          </div>
          <div>
            <Title
              style={{
                margin: 0,
                marginTop: 24,
                fontSize: 20,
                lineHeight: '27px',
              }}
            >
              App Settings
            </Title>
            <Link
              style={{
                marginTop: 8,
                fontSize: 18,
                lineHeight: '25px',
                display: 'block',
                color: '#000',
              }}
            >
              Need help?
            </Link>
            <Link
              style={{
                marginTop: 8,
                fontSize: 18,
                lineHeight: '25px',
                display: 'block',
                color: '#000',
              }}
            >
              Privacy & Data
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <div>
                <Title className="fromInputTitle">Language</Title>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: '18px',
                  }}
                >
                  Select language
                </Text>
              </div>
              <Select
                value={language}
                onChange={value => {
                  setLanguage(value)
                }}
              >
                <Option value="Hindi">Hindi</Option>
                <Option value="English">English</Option>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
