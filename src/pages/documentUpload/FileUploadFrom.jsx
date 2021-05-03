/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { Card, Input } from 'antd'
import React, { useState } from 'react'
import DragFile from './DragFile'

const FileUploadFrom = () => {
  const [value, setValue] = useState('')

  const handleChange = e => {
    setValue(e.target.value)
  }

  console.log(value)
  return (
    <>
      <div className="file_upload_container">
        <Card title="Upload New File(s)">
          <div className="description_container">
            <div className="desc_label">
              <label className="file_desc" htmlFor="fileDesc">
                File Description :
              </label>
            </div>
            <div className="file_input">
              <Input id="fileDesc" onChange={handleChange} placeholder="Files description" />
            </div>
          </div>
          <DragFile value={value} />
        </Card>
      </div>
    </>
  )
}

export default FileUploadFrom
