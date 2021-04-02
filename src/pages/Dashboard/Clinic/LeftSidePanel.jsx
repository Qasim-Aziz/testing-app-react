import React from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import {COLORS} from 'assets/styles/globalStyles'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

const CLINIC_QUERY = gql`
  query {
    schooldetail: schoolDetail {
      id
      schoolName
      address
      email
      contactNo
      country {
        name
      }
      schoolMail {
        parentMail
        staffMail
      }
      currency {
        id
        currency
        symbol
      }
    }
  }
`

const LeftSidePanel = ({ onActiveProfileTabChange }) => {
  const { data: clinicInfo } = useQuery(CLINIC_QUERY)
  const { country, schoolName, address, email, contactNo, schoolMail, currency } = clinicInfo
    ? clinicInfo.schooldetail
    : { country: null }

  return (
    <div
      style={{ minWidth: '280', width: '386px', backgroundColor: COLORS.palleteLight }}
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
        <span style={{ fontFamily: 'bolder' }}>{clinicInfo?.schooldetail?.schoolName}</span>
      </div>

      <div style={{ padding: '17px' }}>
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
              <td className="value">{schoolName}</td>
            </tr>
            <tr>
              <td className="title">Email:</td>
              <td className="value">{email}</td>
            </tr>
            <tr>
              <td className="title">Address:</td>
              <td className="value">{address}</td>
            </tr>
            <tr>
              <td className="title">Country</td>
              <td className="value">{country?.name}</td>
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
              <td className="title">Parent Emails</td>
              <td className="value">
                {schoolMail && schoolMail.parentMail ? 'Enabled' : 'Disabled'}
              </td>
            </tr>
            <tr>
              <td className="title">Therapist Emails</td>
              <td className="value">
                {schoolMail && schoolMail.staffMail ? 'Enabled' : 'Disabled'}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="profile-details-grid">
          <tbody>
            <tr className="heading-row">
              <th colSpan={2}>
                <span className="title">Currency</span>
                <Button
                  className="edit-button"
                  type="link"
                  size="small"
                  onClick={() => onActiveProfileTabChange('invoice-currency')}
                >
                  <EditOutlined />
                </Button>
              </th>
            </tr>
            <tr>
              <td className="title">Invoice Currency</td>
              <td className="value">{currency?.currency}</td>
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
