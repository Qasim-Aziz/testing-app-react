import React from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { useSelector } from 'react-redux'

const CONTACT_DETAILS = gql`
  query($id: ID!) {
    staffs(user: $id) {
      edges {
        node {
          name
          email
          id
          contactNo
        }
      }
    }
  }
`
const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
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
  const user = useSelector(state => state.user)
  const { data: schoolData } = useQuery(CONTACT_DETAILS, {
    fetchPolicy: 'no-cache',
    variables: { id: user.id },
  })

  const { data: clinicData } = useQuery(CLINIC_QUERY, {
    fetchPolicy: 'no-cache',
    variables: { id: user.id },
  })

  const { data: settingsData } = useQuery(SETTING, {
    fetchPolicy: 'no-cache',
    variables: { id: user.id },
  })

  const { node } =
    schoolData && schoolData.staffs && schoolData.staffs.edges.length > 0
      ? schoolData.staffs.edges['0']
      : { node: null }

  const settings =
    settingsData && settingsData.userSettings && settingsData.userSettings.edges.length > 0
      ? settingsData.userSettings.edges['0'].node
      : { node: null }

  const { schooldetail } = clinicData || { schooldetail: { schoolName: '', address: '' } }

  return (
    <div
      style={{ minWidth: '240px', width: '386px', backgroundColor: '#dbe2ef' }}
      className="border-right profile-details"
    >
      <div className="profile-title">Profile</div>
      <div className="profile-avtar-title-block">
        <img
          alt="Profile"
          width={150}
          height={150}
          className="profile-avtar"
          src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
        />
        <span style={{ fontFamily: 'bolder' }}>{node?.name}</span>
      </div>
      <div style={{ padding: '17px' }}>
        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">Work Location</span>
              </th>
            </tr>
            <tr>
              <td className="title">Clinic Name:</td>
              <td className="value">{schooldetail?.schoolName}</td>
            </tr>
            <tr>
              <td className="title">Address:</td>
              <td className="value">{schooldetail?.address}</td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row" style={{ paddingTop: 0 }}>
              <th colSpan={2}>
                <span className="title">Contact Details</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => onActiveProfileTabChange('contact-details')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
            <tr>
              <td className="title">Name:</td>
              <td className="value">{node?.name}</td>
            </tr>
            <tr>
              <td className="title">Email:</td>
              <td className="value">{node?.email}</td>
            </tr>
            <tr>
              <td className="title">Phone Number</td>
              <td className="value">{node?.contactNo}</td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row">
              <th colSpan={2}>
                <span className="title">Email Notifications</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => onActiveProfileTabChange('email-notification')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
            <tr>
              <td className="title">Session Remainder</td>
              <td className="value">{settings.sessionReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
            <tr>
              <td className="title">Medical Remainder</td>
              <td className="value">{settings.medicalReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
            <tr>
              <td className="title">Data Recording Remainder</td>
              <td className="value">{settings.dataRecordingReminders ? 'Enabled' : 'Disabled'}</td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row">
              <th colSpan={2}>
                <span className="title">Change Password</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => onActiveProfileTabChange('change-password')}
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
