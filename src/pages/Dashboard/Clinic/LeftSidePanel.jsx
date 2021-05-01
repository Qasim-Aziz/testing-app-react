import React, { useEffect } from 'react'
import { Button } from 'antd'
import { EditOutlined, CameraOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LoadingComponent from '../../../components/LoadingComponent'
// import UploadLogoModal from '../../../components/LogoModal/UploadLogoModal'

const CLINIC_QUERY = gql`
  query($id: ID!) {
    clinicAllDetails(pk: $id) {
      details {
        id
        schoolName
        email
        address
        contactNo
        country {
          id
          name
        }
        schoolMail {
          id
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
  }
`

const LeftSidePanel = ({ onActiveProfileTabChange }) => {
  const clinicID = localStorage.getItem('userId')
  const { data: clinicInfo, loading } = useQuery(CLINIC_QUERY, {
    variables: {
      id: clinicID,
    },
  })
  // const { country, schoolName, address, email, contactNo, schoolMail, currency } = clinicInfo
  //   ? clinicInfo.schooldetail
  //   : { country: null }
  if (loading) {
    return <LoadingComponent />
  }
  const clinicObj = clinicInfo?.clinicAllDetails[0].details
  console.log('clinic info', clinicInfo?.clinicAllDetails[0].details)
  // console.log('check orro', clinicInfo.schooldetail)
  // const [isModalVisible, setIsModalVisible] = useState(false)
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
        {/* <a onClick={()=> setIsModalVisible(true)} aria-hidden="true">
          <CameraOutlined style={{ position: 'absolute', top: '6px', right: '79px', fontSize: '1.7rem', color: '#0190fe'}} />
          </a> */}
        <span style={{ fontFamily: 'bolder' }}>{clinicObj?.schoolName}</span>
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
              <td className="value">{clinicObj.schoolName}</td>
            </tr>
            <tr>
              <td className="title">Email:</td>
              <td className="value">{clinicObj.email}</td>
            </tr>
            <tr>
              <td className="title">Address:</td>
              <td className="value">{clinicObj.address}</td>
            </tr>
            <tr>
              <td className="title">Country</td>
              <td className="value">{clinicObj?.country?.name}</td>
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
                {clinicObj.schoolMail && clinicObj.schoolMail.parentMail ? 'Enabled' : 'Disabled'}
              </td>
            </tr>
            <tr>
              <td className="title">Therapist Emails</td>
              <td className="value">
                {clinicObj.schoolMail && clinicObj.schoolMail.staffMail ? 'Enabled' : 'Disabled'}
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
              <td className="value">{clinicObj.currency?.currency}</td>
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
      {/* <UploadLogoModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} /> */}
    </div>
  )
}

export default LeftSidePanel
