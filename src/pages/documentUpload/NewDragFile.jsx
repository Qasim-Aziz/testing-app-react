import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import React from 'react'

const { Dragger } = Upload

const NewDragFile = () => {
  const studentId = localStorage.getItem('studentId')
  const draggerProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: ({ onSuccess, onError, file }) => {
      console.log(file)
      fetch('https://application.cogniable.us/apis/student-docs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: {
          pk: studentId,
          file,
        },
      })
        .then(res => onSuccess())
        .catch(err => onError())
    },
  }
  // name: "file",
  //     multiple: false,
  //     showUploadList: false,
  //     customRequest: ({onSuccess, onError, file}) => {
  //         fetch('https://application.cogniable.us/apis/student-docs/', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type' : 'multipart/form-data; boundary=<calculated when request is sent>'
  //         },
  //         body: {
  //             pk: studentId,
  //             file
  //         },
  //         success: (resp) => {
  //           onSuccess()
  //         },
  //         failure: (err) => {
  //           onError()
  //         }
  //       )
  //     }
  return (
    <>
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </Dragger>
    </>
  )
}

export default NewDragFile
