import { message } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import React from 'react'

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const DragFile = ({ text }) => {
  return (
    <>
      <Dragger {...props}>
        <h1 className="ant-upload-drag-icon">Drop files here to upload</h1>
        <p className="ant-upload-text">
          or <span>{text || `Select up to 20 Files`}</span>
        </p>
      </Dragger>
    </>
  )
}

export default DragFile
