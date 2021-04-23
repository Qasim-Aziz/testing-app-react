import { Card, Radio } from 'antd'
import React, { useState } from 'react'
import DragFile from './DragFile'

const FileUploadFrom = () => {
  const [value, setValue] = useState(1)
  const handleChange = e => {
    console.log('radio checked', e.target.value)
    setValue(e.target.value)
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  return (
    <>
      <div className="file_upload_container">
        <Card title="Upload New File(s)">
          <div className="location_section">
            <p className="radio_label">Location</p>
            <Radio.Group onChange={handleChange} value={value}>
              <Radio style={radioStyle} value={1}>
                <span className="location_value">To my accaount</span>
              </Radio>
              <Radio style={radioStyle} value={2}>
                <span className="location_value">To someone else`s accaount</span>
              </Radio>
              <Radio style={radioStyle} value={3}>
                <span className="location_value">Lock File(s) after uploading</span>
              </Radio>
            </Radio.Group>
          </div>
          <hr />
          <div className="drag_drop">
            <p className="drag_title">Override Filename</p>
            <hr />
            <DragFile />
          </div>
        </Card>
      </div>
    </>
  )
}

export default FileUploadFrom
