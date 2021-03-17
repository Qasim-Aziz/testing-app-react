/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Switch, Icon, Avatar, Tag, Tooltip } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import moment from 'moment'
import './style.scss'

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
    padding: '24px 0px',
    border: '1px solid #E8E8E8',
    boxShadow: '0 1px 1px 0 rgb(0 0 0 / 20%)',
  }

  const midCard = {
    marginTop: '36px',
    width: '50%',
    height: 'fit-content',
    backgroundColor: 'white',
    padding: '24px 18px',
    marginRight: '18px',
    border: '1px solid #E8E8E8',
    boxShadow: '0 1px 1px 0 rgb(0 0 0 / 20%)',
  }

  console.log(userProfile, 'userProfile')

  return (
    <div style={{ backgroundColor: '#F7F7F7', padding: '36px' }} className="profile-css">
      <div style={mainCard}>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '0 24px',
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
                <Avatar
                  src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
                  style={{
                    width: '180px',
                    height: '180px',
                    border: '1px solid #f6f7fb',
                  }}
                />
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
                  </div>
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
                      {userProfile.parent.lastLOgin
                        ? moment(userProfile.createdAt).format('YYYY-MM-DD')
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
              <p style={labelHead}>Phone Number </p>
              <p> : {userProfile.mobileno}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <p style={labelHead}>Email </p>
              <p> : {userProfile.email}</p>
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
              style={{ display: 'flex', justifyContent: 'flex-start', textTransform: 'capitalise' }}
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

      <div style={{ ...mainCard, marginTop: '36px' }}>
        <div style={{ width: '50%', padding: '0 12px 0 36px', borderRight: '1px solid #E8E8E8' }}>
          <div style={{ fontSize: '22px', color: 'black', marginBottom: '12px' }}>
            Personal Information
          </div>
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
            <p style={labelHead}>Language </p>
            <p> : {userProfile.language?.name}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>SSN Adhaar </p>
            <p> : {userProfile.ssnAadhar}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p style={labelHead}>Category </p>
            <p> : {userProfile.category?.category}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={midCard}>hwllo</div>
        <div style={{ ...midCard, marginRight: 0 }}>hwllo</div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ learners }) => ({
  learners,
})

export default withRouter(connect(mapStateToProps)(Profile))
