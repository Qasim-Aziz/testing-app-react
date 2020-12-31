import React from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const STUDENT_QUERY = gql`
  query parentDashboard($studentId: ID!) {
    student(id: $studentId) {
      firstname
      lastname
      currentAddress
      family {
        members {
          edges {
            node {
              id
              memberName
              relationship {
                name
              }
            }
          }
        }
      }
      email
      parentMobile
    }
  }
`

const SETTING = gql`
  query($id: ID!) {
    userSettings(user: $id) {
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

const LeftSidePanel = ({ onActiveProfileTabChange }) => {
  const studentId = localStorage.getItem('studentId')

  const user = useSelector(state => state.user)
  const history = useHistory()

  const { data: settingsData } = useQuery(SETTING, {
    fetchPolicy: 'no-cache',
    variables: { id: user.id },
  })

  const { data, loading, error } = useQuery(STUDENT_QUERY, {
    variables: {
      studentId,
    },
  })

  const settings =
    settingsData &&
    settingsData.userSettings &&
    settingsData.userSettings.edges &&
    settingsData.userSettings.edges.length > 0
      ? settingsData.userSettings.edges['0'].node
      : { node: null }

  const student = data ? data.student : null

  const members = student && student.family.members ? student.family.members.edges : null

  return (
    <div style={{ minWidth: '240px', width: '320px' }} className="border-right profile-details">
      <div className="profile-title">Profile</div>
      <div className="profile-avtar-title-block">
        <img
          alt="profile"
          width={150}
          height={150}
          className="avatar-image"
          src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
        />
        <span>{student?.firstname}</span>
      </div>
      <div style={{ padding: 10 }}>
        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">User Details</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => history.push('/profileSetting')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
            <tr>
              <td className="title">Name:</td>
              <td className="value">{student?.firstname}</td>
            </tr>
            <tr>
              <td className="title">Email:</td>
              <td className="value">{student?.email}</td>
            </tr>
            <tr>
              <td className="title">Phone Number:</td>
              <td className="value">{student?.parentMobile}</td>
            </tr>
            <tr>
              <td className="title">Address:</td>
              <td className="value">{student?.currentAddress}</td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">Parent Details</span>
              </th>
            </tr>
            {members &&
              members.map(({ node }) => (
                <tr key={node.id}>
                  <td className="title">{node?.relationship?.name}:</td>
                  <td className="value">{node?.memberName}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">Email Notifications</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => history.push('/profileSetting')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
            <tr>
              <td className="title">Session Remainder:</td>
              <td className="value">{settings.sessionReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
            <tr>
              <td className="title">Medical Remainder:</td>
              <td className="value">{settings.medicalReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
            <tr>
              <td className="title">Data Recording Remainder:</td>
              <td className="value">{settings.dataRecordingReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">Change Language</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => history.push('/profileSetting')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeftSidePanel
