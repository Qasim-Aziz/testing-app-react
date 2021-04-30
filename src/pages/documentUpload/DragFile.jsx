/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, message } from 'antd'
import { post } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const DragFile = ({ value }) => {
  const studentId = localStorage.getItem('studentId')
  const [file, setFile] = useState(null)

  const onChange = e => {
    setFile({ file: e.target.files[0] })
  }

  const fileUpload = (f, pk, descreption) => {
    const url = 'https://application.cogniable.us/apis/student-docs/'
    const formData = new FormData()
    // console.log(formData)
    formData.append('pk', pk)
    formData.append('file', f)
    formData.append('file_description', descreption)
    console.log(f)
    console.log(pk)
    console.log(descreption)
    // console.log(formData)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    // console.log(formData)
    return post(url, formData, config)
  }

  const onFormSubmit = useCallback(() => {
    fileUpload(file, studentId, value).then(response => {
      message.success(response.data.msg)
      console.log(response.data)
    })
  })
  useEffect(() => {
    if (file !== null) {
      onFormSubmit()
    }
  }, [file, onFormSubmit])

  return (
    <>
      <form style={{ width: '100%' }} onSubmit={onFormSubmit}>
        <h1 style={{ textAlign: 'center' }}>File Upload</h1>
        <label style={{ width: '100%', textAlign: 'center' }} htmlFor="file_upload">
          <div className="input_label">
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click to this area to upload or <br /> <span>Select Up to 20 Files</span>
            </p>
          </div>
        </label>
        <input
          multiple
          style={{ display: 'none' }}
          id="file_upload"
          type="file"
          onChange={onChange}
        />
      </form>
    </>
  )
}

export default DragFile
