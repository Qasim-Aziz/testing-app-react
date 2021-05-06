/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import { Button, Icon, message, Spin } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DragFile = ({ value, learnerId, staffId, isStaffById, isLearnerById }) => {
  const studentId = learnerId ? learnerId : JSON.parse(localStorage.getItem('studentId'))
  const therapistId = staffId ? staffId : JSON.parse(localStorage.getItem('therapistId'))
  const userRole = JSON.parse(localStorage.getItem('role'))
  const [selectedFile, setFile] = useState(null)
  const fileName = selectedFile?.file?.name
  const fileDescription = value
  const [isLoading, setIsLoading] = useState('')
  const [url, setUrl] = useState('')
  const [userPk, setUserPk] = useState('')

  useEffect(() => {
    if (userRole === 'parents') {
      setUrl('https://application.cogniable.us/apis/student-docs/')
      setUserPk(studentId)
    } else if (userRole === 'therapist') {
      if (isLearnerById && learnerId) {
        setUrl('https://application.cogniable.us/apis/student-docs/')
        setUserPk(studentId)
      } else {
        setUrl('https://application.cogniable.us/apis/staff-docs/')
        setUserPk(therapistId)
      }
    } else if (userRole === 'school_admin') {
      if (isLearnerById && learnerId) {
        setUrl('https://application.cogniable.us/apis/student-docs/')
        setUserPk(studentId)
      } else if (isStaffById && staffId) {
        setUrl('https://application.cogniable.us/apis/staff-docs/')
        setUserPk(therapistId)
      }
    }
  }, [])

  const onChange = e => {
    setFile({ file: e.target.files[0] })
  }

  const handleClick = () => {
    setIsLoading('loading')
    const data = new FormData()
    data.append('file', selectedFile.file)

    let token = ''
    if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'))
    }

    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
      Authorization: token ? `JWT ${token}` : '',
    }

    data.append('pk', userPk)
    data.set('file_name', fileName)
    data.append('file_description', fileDescription)

    for (var key of data.entries()) {
      console.log(key[0] + ', ' + key[1])
    }

    axios
      .post(url, data, { headers: headers })
      .then(res => {
        message.success(res.data.msg)
        setIsLoading('done')
        setFile(null)
        window.location.reload(false)
        console.log(res)
      })
      .catch(err1 => {
        console.error({ err1 })
        message.error('upload Failed.')
        setIsLoading('error')
        return false
      })
  }

  return (
    <>
      {isLoading === 'loading' ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <p style={{ fontSize: '16px', color: '#2998FF', fontWeight: '600' }}>Uploading...</p>
        </div>
      ) : (
        <form style={{ width: '100%' }}>
          <label style={{ width: '100%', textAlign: 'center' }} htmlFor="file_upload">
            <div className="input_label">
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              {fileName ? (
                <p style={{ color: '#2998FF' }}> {fileName} </p>
              ) : (
                <p className="ant-upload-text">Click to this area to upload</p>
              )}
            </div>
          </label>
          <input style={{ display: 'none' }} id="file_upload" type="file" onChange={onChange} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button className="submit_btn" onClick={() => handleClick()}>
              Upload
            </Button>
          </div>
        </form>
      )}
    </>
  )
}

export default DragFile
