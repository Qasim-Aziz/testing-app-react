/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { Card, Input, Form } from 'antd'
import { FORM } from 'assets/styles/globalStyles'
import React, { useState } from 'react'
import DragFile from './DragFile'

const FileUploadFrom = ({ learnerId, staffId, isLearnerById, isStaffById }) => {
  const [value, setValue] = useState('')

  const handleChange = e => {
    setValue(e.target.value)
  }

  return (
    <>
      <div className="file_upload_container">
        <Card title="Upload New File(s)">
          <div>
            <Form.Item {...FORM.layout} label="File Description">
              <Input id="fileDesc" onChange={handleChange} placeholder="Files description" />
            </Form.Item>
          </div>
          <DragFile
            learnerId={learnerId}
            staffId={staffId}
            value={value}
            isLearnerById={isLearnerById}
            isStaffById={isStaffById}
          />
        </Card>
      </div>
    </>
  )
}

export default FileUploadFrom
