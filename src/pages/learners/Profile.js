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
import './style.scss'
import GenDetails from './EditDrawers/GeneralInfo'
import PersonalInfo from './EditDrawers/PersonalInfo'
import ClinicInfo from './EditDrawers/ClinicInfo'
import ProgramInfo from './EditDrawers/ProgramInfo'

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
  marginBottom: '36px',
  padding: '24px 0px',
  border: '1px solid #E8E8E8',
  boxShadow: '0 1px 1px 0 rgb(0 0 0 / 20%)',
}

const midCard = {
  width: '50%',
  height: '100%',
  backgroundColor: 'white',
  padding: '24px 18px',
  marginRight: '18px',
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
  const [userProfile, setUserProfile] = useState()
  const [motherName, setMotherName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [genInfoDrawer, setGenInfoDrawer] = useState(false)
  const [personalInfoDrawer, setPersonalInfoDrawer] = useState(false)
  const [clinicInfoDrawer, setClinicInfoDrawer] = useState(false)
  const [programInfoDrawer, setProgramInfoDrawer] = useState(false)
  useEffect(() => {
    if (props.learners.UserProfile) {
      const tt = props.learners.UserProfile

      setUserProfile(tt)

      tt.family?.members.edges.map(item => {
        if (item.node.relationship.name == 'Father' && tt.fatherName === null) {
          setFatherName(item.node.memberName)
        }
        if (item.node.relationship.name == 'Mother' && tt.motherName === null) {
          setMotherName(item.node.memberName)
        }
      })
      tt?.motherName ? setMotherName(tt?.motherName) : null
      tt?.fatherName ? setFatherName(tt?.fatherName) : null
    }
  }, [props.learners])

  if (!userProfile) {
    return <LoadingComponent />
  }

  console.log(userProfile, 'userProfile')

  return (
    <div style={{ backgroundColor: '#F7F7F7', padding: '36px' }} className="profile-css">
      <Drawer
        title="Edit Basic Information"
        width="600px"
        closable
        destroyOnClose
        visible={genInfoDrawer}
        onClose={() => setGenInfoDrawer(false)}
      >
        <GenDetails closeDrawer={setGenInfoDrawer} userProfile={userProfile} />
      </Drawer>
      <Drawer
        title="Edit Personal Information"
        width="600px"
        closable
        destroyOnClose
        visible={personalInfoDrawer}
        onClose={() => setPersonalInfoDrawer(false)}
      >
        <PersonalInfo closeDrawer={setPersonalInfoDrawer} userProfile={userProfile} />
      </Drawer>
      <Drawer
        title="Edit Clinical Information"
        width="600px"
        destroyOnClose
        closable
        visible={clinicInfoDrawer}
        onClose={() => setClinicInfoDrawer(false)}
      >
        <ClinicInfo closeDrawer={setClinicInfoDrawer} userProfile={userProfile} />
      </Drawer>
      <Drawer
        title="Edit Program Information"
        width="600px"
        destroyOnClose
        closable
        visible={programInfoDrawer}
        onClose={() => setProgramInfoDrawer(false)}
      >
        <ProgramInfo closeDrawer={setProgramInfoDrawer} userProfile={userProfile} />
      </Drawer>
      <div style={mainCard}>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '0 12px 0 24px',
            borderRight: '1px solid #E8E8E8',
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
                    src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
                    style={{
                      width: '160px',
                      height: '160px',
                      border: '1px solid #f6f7fb',
                    }}
                  />
                  <div>
                    {userProfile.tags?.map(tag => {
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
                    {userProfile ? userProfile.firstname : ''}
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
                </div>
              }
              description={
                <div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Enrollment Status: </p>
                    <p>
                      {userProfile.isActive ? (
                        <button style={customSpanStyle}>Active</button>
                      ) : (
                        <button style={inActiveSpanStyle}>In-Active</button>
                      )}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Admission No</p>
                    <p> : {userProfile.admissionNo}</p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Admission Date </p>
                    <p> : {userProfile.admissionDate}</p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Created At </p>
                    <p>
                      :{' '}
                      {userProfile.createdAt
                        ? moment(userProfile.createdAt).format('YYYY-MM-DD')
                        : null}
                    </p>
                  </div>
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <p style={labelHead}>Last Login </p>
                    <p>
                      :{' '}
                      {userProfile.parent?.lastLogin
                        ? moment(userProfile.parent?.lastLogin).format('YYYY-MM-DD')
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
            <div style={{ display: 'flex', textAlign: 'left' }}>
              <p style={labelHead}>Client ID </p>
              <p> : {userProfile.clientId}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Email </p>
              <p> : {userProfile.email}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Phone Number </p>
              <p> : {userProfile.mobileno}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Date of Birth </p>
              <p>
                :{' '}
                {userProfile.dob
                  ? `${moment(userProfile.dob).format('DD')} ${moment(userProfile.dob).format(
                      'MMMM',
                    )} ${moment(userProfile.dob).format('YYYY')} `
                  : null}
              </p>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'flex-start', textTransform: 'capitalize' }}
            >
              <p style={labelHead}>Gender </p>
              <p> : {userProfile.gender}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Address </p>
              <p> : {userProfile.currentAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...mainCard, marginBottom: '36px' }}>
        <div style={{ width: '50%', padding: '0 12px 0 36px', borderRight: '1px solid #E8E8E8' }}>
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
          {userProfile.parentName ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Guardian Name </p>
              <p> : {userProfile.parentName}</p>
            </div>
          ) : null}
          {userProfile.parentMobile ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Guardian Mobile </p>
              <p> : {userProfile.parentMobile}</p>
            </div>
          ) : null}
          {userProfile.fatherName ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Father Name </p>
              <p> : {fatherName ? JSON.parse(fatherName) : fatherName}</p>
            </div>
          ) : null}
          {userProfile.fatherPhone ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Father Phone </p>
              <p> : {userProfile.fatherPhone}</p>
            </div>
          ) : null}
          {userProfile.motherName ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Mother Name </p>
              <p> : {motherName ? JSON.parse(motherName) : motherName}</p>
            </div>
          ) : null}
          {userProfile.motherPhone ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Mother Phone </p>
              <p> : {userProfile.motherPhone}</p>
            </div>
          ) : null}
        </div>
        <div
          style={{
            width: '49%',
            height: '100%',
            padding: '0 12px 0 36px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Height </p>
            <p> : {userProfile.height}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Weight </p>
            <p> : {userProfile.weight}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>SSN/Adhaar </p>
            <p> : {userProfile.ssnAadhar}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Language </p>
            <p> : {userProfile.language?.name}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', height: 290, marginBottom: '36px' }}>
        <div style={midCard}>
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
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
            <p style={labelHead}>ClinicLocation</p>
            <p> : {userProfile.clinicLocation?.location}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Location Category </p>
            <p> : {userProfile.category?.category}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Case Manager</p>
            <p> : {userProfile.caseManager?.name}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Authorised Staff </p>
            <Scrollbars
              style={{
                width: '400px',
                maxHeight: '120px',
                minHeight: `${userProfile.authStaff?.edges.length > 6 ? 95 : 40}px`,
              }}
              autoHide
            >
              {userProfile.authStaff?.edges?.map(tag => {
                const isLongTag = tag.length > 20
                const tagElem = (
                  <Tag
                    className="edit-tag"
                    key={tag.node.id}
                    color="#F25E74"
                    style={{ margin: '1px', fontWeight: '600' }}
                  >
                    <span>{isLongTag ? `${tag.node.name.slice(0, 20)}...` : tag.node.name}</span>
                  </Tag>
                )
                return isLongTag ? (
                  <Tooltip title={tag.node.name} key={tag.node.id}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                )
              })}
            </Scrollbars>
          </div>
        </div>
        <div style={{ ...midCard, marginRight: 0, height: '100%' }}>
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Program Status
            <Button
              type="link"
              onClick={() => setProgramInfoDrawer(true)}
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
            <p style={labelHead}>Default Active</p>
            {userProfile.isDefaultActive ? (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: 'green', fontWeight: '700', margin: 'auto' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: 'red', fontWeight: '700', margin: 'auto' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>VBMAPP</p>
            {userProfile.isVbmappActive ? (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: 'green', fontWeight: '700', margin: 'auto' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: 'red', fontWeight: '700', margin: 'auto' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Peak</p>
            {userProfile.isPeakActive ? (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: 'green', fontWeight: '700', margin: 'auto' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: 'red', fontWeight: '700', margin: 'auto' }}
              />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Cogniable </p>
            {userProfile.isCogActive ? (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: 'green', fontWeight: '700', margin: 'auto' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: 'red', fontWeight: '700', margin: 'auto' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Research Participant </p>
            {userProfile.researchParticipant ? (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: 'green', fontWeight: '700', margin: 'auto' }}
              />
            ) : (
              <CloseCircleOutlined
                style={{ fontSize: 20, color: 'red', fontWeight: '700', margin: 'auto' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ learners }) => ({
  learners,
})

export default withRouter(connect(mapStateToProps)(Profile))
