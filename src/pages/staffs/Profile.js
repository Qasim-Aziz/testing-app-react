/* eslint-disable */
import { EditOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Drawer, Tag, Tooltip } from 'antd'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AppointmentCard from './AppointmentCard/index'
import Attendance from './Attendance'
import ClinicInfo from './EditDrawers/ClinicInfo'
import EmergencyInfo from './EditDrawers/EmergencyInfo'
import GenDetails from './EditDrawers/GenInfo'
import MiscInfo from './EditDrawers/MiscInfo'
import PersonalInfo from './EditDrawers/PersonalInfo'
import StaffFiles from './StaffFile/StaffFiles'
import './style.scss'

const { Meta } = Card

const activeSpanStyle = {
  backgroundColor: COLORS.success,
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: COLORS.danger,
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}

const labelHead = {
  minWidth: 160,
  fontWeight: 700,
  color: 'black',
}

const th2 = {
  minWidth: 140,
  fontWeight: 700,
  color: 'black',
}

function Profile(props) {
  const [staffProfile, setStaffProfile] = useState()
  const [genInfoDrawer, setGenInfoDrawer] = useState(false)
  const [personalInfoDrawer, setPersonalInfoDrawer] = useState(false)
  const [clinicInfoDrawer, setClinicInfoDrawer] = useState(false)
  const [miscInfoDrawer, setMiscInfoDrawer] = useState(false)
  const [emergencyInfoDrawer, setEmergencyInfoDrawer] = useState(false)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (props.staffs.StaffProfile) {
      const tt = props.staffs.StaffProfile

      setStaffProfile(tt)
      let temp = ''
      if (tt.streetAddress) {
        temp += tt.streetAddress
      }
      if (tt.city) {
        temp += tt.city?.trim() + ', '
      }
      if (tt.state) {
        temp += tt.state?.trim() + ', '
      }
      if (tt.country) {
        temp += tt.country?.trim() + ', '
      }
      if (tt.zipCode) {
        temp += tt.zipCode?.trim()
      }

      setAddress(temp)
    }
  }, [props])

  const getMomentDiff = a => {
    const b = moment()

    var years = b.diff(a, 'year')
    a.add(years, 'years')

    var months = b.diff(a, 'months')
    a.add(months, 'months')

    var days = b.diff(a, 'days')
    a.add(days, 'days')

    var hrs = b.diff(a, 'hours')
    a.add(hrs, 'hours')

    var min = b.diff(a, 'minutes')
    a.add(min, 'minutes')

    if (years > 0) {
      if (months > 0) {
        return `${years} ${years == 1 ? 'Y' : 'Y'} ${months} ${months == 1 ? 'M' : 'M'} ago`
      } else {
        return `${years} ${years == 1 ? 'M' : 'Y'} ago`
      }
    } else if (months > 0) {
      if (days > 0) {
        return `${months} ${months == 1 ? 'M' : 'M'} ${days} ${days == 1 ? 'D' : 'D'} ago`
      } else {
        return `${months} ${months == 1 ? 'M' : 'M'} ago`
      }
    } else if (days > 0) {
      if (hrs > 0) {
        return `${days} ${days == 1 ? 'D' : 'D'} ${hrs} ${hrs == 1 ? 'H' : 'H'} ago`
      } else {
        return `${days} ${days == 1 ? 'D' : 'D'} ago`
      }
    } else if (hrs > 0) {
      if (min > 0) {
        return `${hrs} H ${min} Min ago`
      } else {
        return `${hrs} H ago`
      }
    } else {
      return ''
    }
  }

  if (!staffProfile) {
    return <LoadingComponent />
  }

  console.log(staffProfile, 'staffProfile')

  return (
    <div style={{ backgroundColor: COLORS.palleteLight, padding: '28px' }} className="profile-css">
      <Drawer
        title="Edit Basic Information"
        width={DRAWER.widthL3}
        closable
        destroyOnClose
        visible={genInfoDrawer}
        onClose={() => setGenInfoDrawer(false)}
      >
        <GenDetails closeDrawer={setGenInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        title="Edit Personal Information"
        width={DRAWER.widthL3}
        closable
        destroyOnClose
        visible={personalInfoDrawer}
        onClose={() => setPersonalInfoDrawer(false)}
      >
        <PersonalInfo closeDrawer={setPersonalInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        title="Edit Emergency Contact Information"
        width={DRAWER.widthL3}
        destroyOnClose
        closable
        onClose={() => setEmergencyInfoDrawer(false)}
        visible={emergencyInfoDrawer}
      >
        <EmergencyInfo closeDrawer={setEmergencyInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        width={DRAWER.widthL3}
        title="Edit Clinical Information"
        destroyOnClose
        closable
        visible={clinicInfoDrawer}
        onClose={() => setClinicInfoDrawer(false)}
      >
        <ClinicInfo closeDrawer={setClinicInfoDrawer} staffProfile={staffProfile} />
      </Drawer>

      <Drawer
        title="Edit Misc Information"
        width={DRAWER.widthL3}
        destroyOnClose
        closable
        visible={miscInfoDrawer}
        onClose={() => setMiscInfoDrawer(false)}
      >
        <MiscInfo closeDrawer={setMiscInfoDrawer} staffProfile={staffProfile} />
      </Drawer>

      <div className="mainCard">
        <div className="mainCard-child right-border">
          <Card
            style={{
              textAlign: 'center',
              border: 'none',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Meta
              avatar={
                <>
                  <Avatar
                    src={
                      staffProfile.image
                        ? staffProfile.image
                        : 'https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png'
                    }
                    style={{
                      width: '170px',
                      height: '170px',
                      border: '1px solid #f6f7fb',
                      marginBottom: `${staffProfile.image ? '10px' : 0}`,
                    }}
                  />
                  <div>
                    {staffProfile.tags?.map(tag => {
                      const isLongTag = tag.length > 20
                      const tagElem = (
                        <Tag
                          className="edit-tag"
                          key={tag}
                          color="#3f72af"
                          style={{ margin: '1px', fontWeight: '600' }}
                        >
                          <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
                        </Tag>
                      )
                      return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                          {tagElem}
                        </Tooltip>
                      ) : (
                        tagElem
                      )
                    })}
                  </div>
                </>
              }
              title={
                <div
                  style={{
                    marginTop: '0px',
                    textAlign: 'left',
                    alignContent: 'center',
                    color: 'black',
                  }}
                >
                  <div style={{ fontSize: '32px', width: '100%', wordWrap: 'no-wrap' }}>
                    {staffProfile ? `${staffProfile.name} ${staffProfile.surname}` : ''}
                    <Button
                      onClick={() => setGenInfoDrawer(true)}
                      type="link"
                      style={{
                        padding: 0,
                        marginTop: '10px',
                        fontSize: '16px',
                        float: 'right',
                      }}
                    >
                      <EditOutlined />
                    </Button>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p>
                      {staffProfile.designation}
                      {staffProfile.qualification && staffProfile.qualification !== ' '
                        ? ` | ${staffProfile.qualification}`
                        : null}
                    </p>
                  </div>
                </div>
              }
              description={
                <div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={th2}>Status </p>
                    <p>
                      {staffProfile.isActive ? (
                        <button style={activeSpanStyle}>Active</button>
                      ) : (
                        <button style={inActiveSpanStyle}>In-Active</button>
                      )}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left', color: 'black' }}>
                    <p style={th2}>Employee Id</p>
                    <p> : {staffProfile.employeeId}</p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left', color: 'black' }}>
                    <p style={th2}>Date of Joining </p>
                    <p>
                      :{' '}
                      {staffProfile.dateOfJoining
                        ? `${moment(staffProfile.dateOfJoining).format(
                            'YYYY-MM-DD',
                          )} (${getMomentDiff(moment(staffProfile.dateOfJoining))})`
                        : null}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left', color: 'black' }}>
                    <p style={th2}>Last Login </p>
                    <p>
                      :{' '}
                      {staffProfile.user?.lastLogin
                        ? `${moment(staffProfile.user?.lastLogin).format('YYYY-MM-DD')} ${
                            getMomentDiff(moment(staffProfile.user?.lastLogin)) !== ''
                              ? `(${getMomentDiff(moment(staffProfile.user?.lastLogin))})`
                              : ''
                          }`
                        : null}
                    </p>
                  </div>
                </div>
              }
            />
          </Card>
        </div>
        <div className="mainCard-child">
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Staff ID </p>
              <p> : {staffProfile.staffId}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Email </p>
              <p> : {staffProfile.email}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Phone Number </p>
              <p> : {staffProfile.contactNo}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Date of Birth </p>
              <p>
                :{' '}
                {staffProfile.dob
                  ? `${moment(staffProfile.dob).format('DD')} ${moment(staffProfile.dob).format(
                      'MMMM',
                    )} ${moment(staffProfile.dob).format('YYYY')} `
                  : null}
              </p>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'flex-start', textTransform: 'capitalize' }}
            >
              <p style={labelHead}>Gender </p>
              <p> : {staffProfile.gender}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Address </p>
              <p> : {address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="midCard-container">
        <div className="midCard">
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Personal Information
            <Button
              type="link"
              onClick={() => setPersonalInfoDrawer(true)}
              style={{
                paddingRight: 0,
                fontSize: '16px',
                float: 'right',
              }}
            >
              <EditOutlined />
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Father Name </p>
            <p> : {staffProfile.fatherName}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Mother Name </p>
            <p> : {staffProfile.motherName}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>SSN/Aadhar </p>
            <p> : {staffProfile.ssnAadhar}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Marital Status </p>
            <p> : {staffProfile.maritalStatus}</p>
          </div>
        </div>
        <div className="midCard midCard-rMargin">
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Emergency Contact
            <Button
              type="link"
              onClick={() => setEmergencyInfoDrawer(true)}
              style={{
                paddingRight: 0,
                fontSize: '16px',
                float: 'right',
              }}
            >
              <EditOutlined />
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Name </p>
            <p> : {staffProfile.emergencyName}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Contact </p>
            <p> : {staffProfile.emergencyContact}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Relation </p>
            <p> : {staffProfile.contactRelation}</p>
          </div>
        </div>
      </div>
      <div className="midCard-container">
        <div className="midCard">
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '14px' }}>
            Clinical Information
            <Button
              type="link"
              onClick={() => setClinicInfoDrawer(true)}
              style={{
                paddingRight: 0,
                fontSize: '16px',
                float: 'right',
              }}
            >
              <EditOutlined />
            </Button>{' '}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Clinic Location</p>
            <p> : {staffProfile.clinicLocation?.location}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>School </p>
            <p> : {staffProfile.school?.schoolName}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Work Experience</p>
            <p> : {staffProfile.workExp}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Salutation </p>
            <p> : {staffProfile.salutation}</p>
          </div>
        </div>
        <div className="midCard midCard-rMargin">
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Misc
            <Button
              type="link"
              onClick={() => setMiscInfoDrawer(true)}
              style={{
                paddingRight: 0,
                fontSize: '16px',
                float: 'right',
              }}
            >
              <EditOutlined />
            </Button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>NPI </p>
            <p> : {staffProfile.npi}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Tax ID </p>
            <p> : {staffProfile.taxId}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>File Name </p>
            <p> : {staffProfile.fileName}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>File Description </p>
            <p> : {staffProfile.fileDescription}</p>
          </div>
        </div>
      </div>
      <StaffFiles staffProfile={staffProfile} />
      <AppointmentCard />
      <Attendance staffProfile={staffProfile} />
    </div>
  )
}

const mapStateToProps = ({ staffs }) => ({
  staffs,
})

export default withRouter(connect(mapStateToProps)(Profile))
