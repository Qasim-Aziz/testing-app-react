import { Tabs } from 'antd'
import React from 'react'
import FileUploadFrom from './FileUploadFrom'
import './index.scss'

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const index = () => {
  return (
    <>
      <div className="file_upload_section">
        <div className="file_upload_header">
          <div className="header_container">
            <div className="header_content">
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Files" key="1">
                  all files
                </TabPane>
                <TabPane tab="New File" key="2">
                  <FileUploadFrom />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
