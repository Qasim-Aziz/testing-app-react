/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
import { Icon, message, Button } from 'antd'
import axios, { post } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const DragFile = ({ value }) => {
  const studentId = JSON.parse(localStorage.getItem('studentId'))
  const [selectedFile, setFile] = useState(null)

  const onChange = e => {
    setFile({ file: e.target.files[0] })
  }

  const handleClick = () => {
    const url = 'https://application.cogniable.us/apis/student-docs/'
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

    data.append('pk', studentId)
    console.log(studentId, selectedFile, 'this is upload')

    for (var key of data.entries()) {
      console.log(key[0] + ', ' + key[1])
    }

    axios
      .post(url, data, { headers: headers })
      .then(res => {
        console.log(res, 'this iis respionse')
        // then print response status
        message.success('Upload Successfully.')
      })
      .catch(err1 => {
        console.error({ err1 })
        message.error('upload Failed.')
        return false
      })
  }

  console.log(selectedFile)

  return (
    <>
      <form style={{ width: '100%' }}>
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
        <input style={{ display: 'none' }} id="file_upload" type="file" onChange={onChange} />
        <Button onClick={() => handleClick()}>Submitt</Button>
      </form>
    </>
  )
}

export default DragFile
