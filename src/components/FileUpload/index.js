import React from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import './style.css'

const { Dragger } = Upload

class FileUpload extends React.Component {
  onChange = e => {
    console.log(e)
  }

  render() {
    const URL = 'https://application.cogniable.us/apis/student-docs/'
    const props = {
      name: 'file',
      multiple: true,
      action: URL,
      onChange(info) {
        message.success(`${info.file.name} file uploaded successfully.`)
      },
    }

    return (
      <Dragger {...props} onChange={this.onChange}>
        <InboxOutlined className="icons-drop" />
        <p>Drag files to upload or</p>
        <p style={{ color: 'blue' }}> select files.</p>
      </Dragger>
    )
  }
}

export default FileUpload
