/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import { Button, Icon, message, Spin, notification } from 'antd'
import axios, { isCancel } from 'axios'
import React, { useEffect, useRef, useState } from 'react'

const DragFile = ({ value, learnerId, staffId, isStaffById, isLearnerById }) => {
  const st = localStorage.getItem('studentId')
  const tt = localStorage.getItem('therapistId')
  const studentId = st && st !== 'undefined' ? JSON.parse(st) : null
  const therapistId = tt && tt !== 'undefined' ? JSON.parse(tt) : null

  const userRole = JSON.parse(localStorage.getItem('role'))

  const [selectedFile, setFile] = useState(null)
  const fileName = selectedFile?.file?.name
  const fileDescription = value
  const [isLoading, setIsLoading] = useState('')
  const [url, setUrl] = useState('')
  const [userPk, setUserPk] = useState('')
  const cancelFileUpload = useRef(null)
  const [uploadPercentage, setUploadPercentage] = useState(0)

  useEffect(() => {
    if (userRole === 'parents') {
      setUrl('https://application.cogniable.us/apis/student-docs/')
      setUserPk(studentId)
    } else if (userRole === 'therapist') {
      if (isLearnerById && studentId) {
        setUrl('https://application.cogniable.us/apis/student-docs/')
        setUserPk(studentId)
      } else {
        setUrl('https://application.cogniable.us/apis/staff-docs/')
        setUserPk(therapistId)
      }
    } else if (userRole === 'school_admin') {
      console.log('in school admin', isStaffById, therapistId)
      console.log(isLearnerById, studentId)
      if (isLearnerById && studentId) {
        setUrl('https://application.cogniable.us/apis/student-docs/')
        setUserPk(studentId)
      } else if (isStaffById && therapistId) {
        setUrl('https://application.cogniable.us/apis/staff-docs/')
        setUserPk(therapistId)
      }
    }
  }, [])

  const onChange = e => {
    console.log(e, 'this is e')
    setFile({ file: e.target.files[0] })
  }

  console.log(selectedFile, url, 'file file file')

  const handleClick = () => {
    if (selectedFile === null) {
      return notification.info({
        message: 'No file selected!',
        description: 'Please select a file to upload.',
      })
    }

    setIsLoading('loading')
    const data = new FormData()
    data.append('file', selectedFile.file)

    let token = ''
    if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'))
    }

    const options = {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        database: 'india',
        Authorization: token ? `JWT ${token}` : '',
      },
      onUploadProgress: progressEvent => {
        const { loaded, total } = progressEvent

        let percent = Math.floor((loaded * 100) / total)

        if (percent < 100) {
          setUploadPercentage(percent)
        }
      },
      cancelToken: new axios.CancelToken(cancel => (cancelFileUpload.current = cancel)),
    }

    data.append('pk', userPk)
    data.set('file_name', fileName)
    data.append('file_description', fileDescription)

    for (var key of data.entries()) {
      console.log(key[0] + ', ' + key[1])
    }

    axios
      .post(url, data, options)
      .then(res => {
        setUploadPercentage(100)

        setTimeout(() => {
          setUploadPercentage(0)
        }, 1000)

        message.success(res.data.msg)
        setIsLoading('done')
        setFile(null)
        window.location.reload(false)
        console.log(res)
      })
      .catch(err1 => {
        console.error({ err1 })
        if (isCancel(err1)) {
          message.error(err1.message)
        } else {
          message.error('upload Failed.')
        }
        setIsLoading('error')
        return false
      })
  }

  const cancelUpload = () => {
    if (cancelFileUpload.current) cancelFileUpload.current('Cancel uploading')
  }

  return (
    <>
      <form
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div className="input_label" style={{ height: 150 }}>
          {isLoading === 'loading' ? (
            <div
              style={{
                display: 'flex',
              }}
            >
              <Spin
                style={{ margin: '30px auto' }}
                tip={`Uploading...${uploadPercentage}%`}
                size="large"
              />
            </div>
          ) : (
            <>
              <label
                style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
                htmlFor="file_upload"
              >
                <div>
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
            </>
          )}
        </div>
        <div style={{ alignSelf: 'center', margin: '16px auto' }}>
          <Button type="primary" onClick={() => handleClick()}>
            Upload
          </Button>
          <Button
            style={{ marginLeft: '12px' }}
            onClick={() => {
              cancelUpload()
              setFile(null)
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}

export default DragFile
