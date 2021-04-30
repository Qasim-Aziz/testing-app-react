import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import React from 'react'

const { Dragger } = Upload

const NewDragFile = () => {
  const studentId = localStorage.getItem('studentId')

  let token = ''
  if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
    token = JSON.parse(localStorage.getItem('token'))
  }

  const headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    database: 'india',
    'content-type': 'multipart/form-data',
    Authorization: token ? `JWT ${token}` : '',
  }
  const draggerProps = {
    onChange({ file, fileList }) {
      console.log(file, fileList)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
    },
  }

  return (
    <>
      <Upload {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </Upload>
    </>
  )
}

export default NewDragFile
