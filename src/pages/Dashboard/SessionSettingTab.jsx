import React, { useState, useEffect } from 'react'
import { Switch, Form, Input, Button, Icon, Modal } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'

const USER_SETTINGS = gql`
  query UserSettings($id: ID!) {
    userSettings(user: $id) {
      edges {
        node {
          id
          default
          morning
          afternoon
          evening
          user {
            id
          }
        }
      }
    }
  }
`

const UPDATE_DEFAULT_SESSION = gql`
  mutation updateDefaultSession($userId: ID!, $updatedValue: Boolean) {
    changeUserSetting(input: { user: $userId, default: $updatedValue }) {
      details {
        id
        default
        user {
          id
        }
      }
    }
  }
`

const UPDATE_MORNING_SESSION = gql`
  mutation updateMorningSession($userId: ID!, $updatedValue: Boolean) {
    changeUserSetting(input: { user: $userId, morning: $updatedValue }) {
      details {
        id
        morning
        user {
          id
        }
      }
    }
  }
`

const UPDATE_AFTERNOON_SESSION = gql`
  mutation updateAfternoonSession($userId: ID!, $updatedValue: Boolean) {
    changeUserSetting(input: { user: $userId, afternoon: $updatedValue }) {
      details {
        id
        afternoon
        user {
          id
        }
      }
    }
  }
`

const UPDATE_EVENING_SESSION = gql`
  mutation updateEveningSession($userId: ID!, $updatedValue: Boolean) {
    changeUserSetting(input: { user: $userId, evening: $updatedValue }) {
      details {
        id
        evening
        user {
          id
        }
      }
    }
  }
`
const UPDATE_SESSION_NAME = gql`
  mutation($pk: ID!, $name: String) {
    updateMasterSession(input: { pk: $pk, name: $name }) {
      details {
        name
        id
      }
    }
  }
`
const SESSION_NAME = gql`
  query {
    sessionName {
      id
      name
    }
  }
`
const SessionSettingTab = () => {
  const [defaultSession, setDefaultSession] = useState(false)
  const [morningSession, setMorningSession] = useState(false)
  const [afternoonSession, setAfternoonSession] = useState(false)
  const [eveningSession, setEveningSession] = useState(false)
  const [sessionNameModal, setSessionNameModal] = useState(false)
  const reduxUser = useSelector(state => state.user)

  const { data: userDetails, loading: userLoading } = useQuery(USER_SETTINGS, {
    variables: {
      id: reduxUser?.id,
    },
  })

  const { data, loading, error } = useQuery(SESSION_NAME)
  const [updateDefaultSession] = useMutation(UPDATE_DEFAULT_SESSION)
  const [updateMorningSession] = useMutation(UPDATE_MORNING_SESSION)
  const [updateAfternoonSession] = useMutation(UPDATE_AFTERNOON_SESSION)
  const [updateEveningSession] = useMutation(UPDATE_EVENING_SESSION)
  const [updateSessionName] = useMutation(UPDATE_SESSION_NAME)
  const [currentSessionName, setCurrentSessionName] = useState('')

  useEffect(() => {
    if (userDetails) {
      const settings = userDetails.userSettings.edges[0]?.node
      setDefaultSession(settings.default)
      setMorningSession(settings.morning)
      setAfternoonSession(settings.afternoon)
      setEveningSession(settings.evening)
    }
  }, [userDetails])

  const saveDefaultSession = checked => {
    setDefaultSession(checked)
    updateDefaultSession({
      variables: {
        userId: reduxUser?.id,
        updatedValue: checked,
      },
    })
  }

  const saveMorningSession = checked => {
    setMorningSession(checked)
    updateMorningSession({
      variables: {
        userId: reduxUser?.id,
        updatedValue: checked,
      },
    })
  }

  const saveAfternoonSession = checked => {
    setAfternoonSession(checked)
    updateAfternoonSession({
      variables: {
        userId: reduxUser?.id,
        updatedValue: checked,
      },
    })
  }

  const saveEveningSession = checked => {
    setEveningSession(checked)
    updateEveningSession({
      variables: {
        userId: reduxUser?.id,
        updatedValue: checked,
      },
    })
  }

  const handleModalOk = e => {
    updateSessionName({
      variables: {},
    })
  }

  const handleModalCancel = e => {
    setSessionNameModal(false)
  }

  console.log(data, loading, error)
  const tdStyle = { border: '1px solid #dddddd', padding: 8, textAlign: 'center' }

  return (
    <div className="miscConfigTab">
      {userLoading || loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <table>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, width: 200 }}>
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentSessionName(data.sessionName[3].name)
                      setSessionNameModal(true)
                    }}
                    style={{
                      color: '#1C8FFA',
                      fontSize: 15,
                      display: 'block',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    {data.sessionName[3].name} Session
                  </Button>
                </td>
                <td style={{ ...tdStyle, width: 100 }}>
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    checked={defaultSession}
                    unCheckedChildren={<Icon type="close" />}
                    onChange={saveDefaultSession}
                  />
                </td>
                <td style={tdStyle}>
                  <i>
                    An evidence-based tool that assesses and teaches language and cognitive skills
                    starting from basic foundational abilities to generalizing and higher-order
                    abilities.
                  </i>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, width: 200 }}>
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentSessionName(data.sessionName[0].name)
                      setSessionNameModal(true)
                    }}
                    style={{
                      color: '#1C8FFA',
                      fontSize: 15,
                      display: 'block',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    {data.sessionName[0].name} Session
                  </Button>
                </td>
                <td style={{ ...tdStyle, width: 100 }}>
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    checked={morningSession}
                    onChange={saveMorningSession}
                  />
                </td>
                <td style={tdStyle}>
                  <i>
                    An evidence-based tool that assesses and teaches language and cognitive skills
                    starting from basic foundational abilities to generalizing and higher-order
                    abilities.
                  </i>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, width: 200 }}>
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentSessionName(data.sessionName[1].name)
                      setSessionNameModal(true)
                    }}
                    style={{
                      color: '#1C8FFA',
                      fontSize: 15,
                      display: 'block',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    {data.sessionName[1].name} Session
                  </Button>
                </td>
                <td style={{ ...tdStyle, width: 100 }}>
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    checked={afternoonSession}
                    onChange={saveAfternoonSession}
                    unCheckedChildren={<Icon type="close" />}
                  />
                </td>
                <td style={tdStyle}>
                  <i>
                    An evidence-based tool that assesses and teaches language and cognitive skills
                    starting from basic foundational abilities to generalizing and higher-order
                    abilities.
                  </i>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, width: 200 }}>
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentSessionName(data.sessionName[2].name)
                      setSessionNameModal(true)
                    }}
                    style={{
                      color: '#1C8FFA',
                      fontSize: 15,
                      display: 'block',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    {data.sessionName[2].name} Session
                  </Button>
                </td>
                <td style={{ ...tdStyle, width: 100 }}>
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    checked={eveningSession}
                    onChange={saveEveningSession}
                    unCheckedChildren={<Icon type="close" />}
                  />
                </td>
                <td style={tdStyle}>
                  <i>
                    An evidence-based tool that assesses and teaches language and cognitive skills
                    starting from basic foundational abilities to generalizing and higher-order
                    abilities.
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      <Modal
        title="Modal"
        visible={sessionNameModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Input value={currentSessionName} onChange={e => setCurrentSessionName(e.target.value)} />
      </Modal>
    </div>
  )
}

export default SessionSettingTab
