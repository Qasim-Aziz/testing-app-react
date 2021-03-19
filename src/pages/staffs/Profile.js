/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip, Button, Drawer } from 'antd'
import {
  FilterOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Link, withRouter } from 'react-router-dom'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import moment from 'moment'
import { Scrollbars } from 'react-custom-scrollbars'
import GenDetails from './EditDrawers/GenInfo'
import PersonalInfo from './EditDrawers/PersonalInfo'
import ClinicInfo from './EditDrawers/ClinicInfo'
import './style.scss'
import EmergencyInfo from './EditDrawers/EmergencyInfo'
import MiscInfo from './EditDrawers/MiscInfo'

const { Meta } = Card

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}

const labelHead = {
  minWidth: 160,
  fontWeight: 700,
  color: 'black',
}

const mainCard = {
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'white',
  marginBottom: '28px',
  padding: '24px 0px',
  border: '1px solid #E8E8E8',
  boxShadow: '0 1px 1px 0 rgb(0 0 0 / 20%)',
}

const midCard = {
  width: '50%',
  height: '100%',
  backgroundColor: 'white',
  padding: '24px 18px 24px 28px',
  marginRight: '14px',
  border: '1px solid #E8E8E8',
  boxShadow: '0 1px 1px 0 rgb(0 0 0 / 20%)',
}

const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 28px 0 6px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}

function Profile(props) {
  const [staffProfile, setStaffProfile] = useState()
  const [genInfoDrawer, setGenInfoDrawer] = useState(false)
  const [personalInfoDrawer, setPersonalInfoDrawer] = useState(false)
  const [clinicInfoDrawer, setClinicInfoDrawer] = useState(false)
  const [miscInfoDrawer, setMiscInfoDrawer] = useState(false)
  const [emergencyInfoDrawer, setEmergencyInfoDrawer] = useState(false)

  console.log(props, 'thsee are th[rop')
  useEffect(() => {
    if (props.staffs.StaffProfile) {
      const tt = props.staffs.StaffProfile

      setStaffProfile(tt)
    }
  }, [props])

  const getMomentDiff = a => {
    const b = moment()

    var years = b.diff(a, 'year')
    a.add(years, 'years')

    var months = b.diff(a, 'months')
    a.add(months, 'months')

    var days = b.diff(a, 'days')

    if (years > 0) {
      if (months > 0) {
        return `${years} ${years == 1 ? 'Y' : 'Y'} ${months} ${months == 1 ? 'M' : 'M'} ago`
      } else {
        return `${years} ${years == 1 ? 'M' : 'Y'} ago`
      }
    } else if (months > 0) {
      if (days > 0) {
        return `${months} ${months == 1 ? 'M' : 'M'} ${days} ${days == 1 ? 'D' : 'D'} ago`
      }
    } else if (days > 0) {
      return `${days} ${days == 1 ? 'D' : 'D'} ago`
    } else {
      return ''
    }
  }

  if (!staffProfile) {
    return <LoadingComponent />
  }

  console.log(staffProfile, 'staffProfile')

  return (
    <div style={{ backgroundColor: '#F7F7F7', padding: '28px' }} className="profile-css">
      <Drawer
        title="Edit Basic Information"
        width="600px"
        closable
        destroyOnClose
        visible={genInfoDrawer}
        onClose={() => setGenInfoDrawer(false)}
      >
        <GenDetails closeDrawer={setGenInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        title="Edit Personal Information"
        width="600px"
        closable
        destroyOnClose
        visible={personalInfoDrawer}
        onClose={() => setPersonalInfoDrawer(false)}
      >
        <PersonalInfo closeDrawer={setPersonalInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        title="Edit Emergency Contact Information"
        width="600px"
        destroyOnClose
        closable
        onClose={() => setEmergencyInfoDrawer(false)}
        visible={emergencyInfoDrawer}
      >
        <EmergencyInfo closeDrawer={setEmergencyInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <Drawer
        width="600px"
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
        width="600px"
        destroyOnClose
        closable
        visible={miscInfoDrawer}
        onClose={() => setMiscInfoDrawer(false)}
      >
        <MiscInfo closeDrawer={setMiscInfoDrawer} staffProfile={staffProfile} />
      </Drawer>
      <div style={mainCard}>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '0 12px 0 24px',
            borderRight: '1px solid #E8E8E8',
            color: 'black',
          }}
        >
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
                    }}
                  />
                  <div>
                    {staffProfile.tags?.map(tag => {
                      const isLongTag = tag.length > 20
                      const tagElem = (
                        <Tag
                          className="edit-tag"
                          key={tag}
                          color="#F89A42"
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
                    <p style={labelHead}>Status </p>
                    <p>
                      {staffProfile.isActive ? (
                        <button style={customSpanStyle}>Active</button>
                      ) : (
                        <button style={inActiveSpanStyle}>In-Active</button>
                      )}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Employee Id</p>
                    <p> : {staffProfile.employeeId}</p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Date of Joining </p>
                    <p>
                      :{' '}
                      {staffProfile.dateOfJoining
                        ? `${moment(staffProfile.dateOfJoining).format(
                            'YYYY-MM-DD',
                          )} (${getMomentDiff(moment(staffProfile.dateOfJoining))})`
                        : null}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Last Login </p>
                    <p>
                      :{' '}
                      {staffProfile.user?.lastLogin
                        ? `${moment(staffProfile.user?.lastLogin).format(
                            'YYYY-MM-DD',
                          )} (${getMomentDiff(moment(staffProfile.user?.lastLogin))})`
                        : null}
                    </p>
                  </div>
                </div>
              }
            />
          </Card>
        </div>
        <div
          style={{
            width: '49%',
            height: '100%',
            padding: '0 12px 0 36px',
          }}
        >
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
              <p> : {staffProfile.localAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 270, marginBottom: '28px' }}>
        <div style={midCard}>
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
            <p> : {staffProfile.fatherName ? JSON.parse(staffProfile.fatherName) : ''}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Mother Name </p>
            <p> : {staffProfile.motherName ? JSON.parse(staffProfile.motherName) : ''}</p>
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
        <div style={{ ...midCard, marginRight: 0, marginLeft: '14px' }}>
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
            <p> : {staffProfile.emergencyRelation}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', height: 270, marginBottom: '30px' }}>
        <div style={midCard}>
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '14px' }}>
            Information
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
        <div style={{ ...midCard, marginRight: 0, marginLeft: '14px', height: '100%' }}>
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
    </div>
  )
}

const mapStateToProps = ({ staffs }) => ({
  staffs,
})

export default withRouter(connect(mapStateToProps)(Profile))
