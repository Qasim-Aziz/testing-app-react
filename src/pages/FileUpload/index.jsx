import { Tabs } from 'antd'
import React from 'react'
import AllFiles from './AllFiles'
import FileUploadFrom from './FileUploadFrom'
import './index.scss'
import NewAuthorization from './NewAuthorization'

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const index = () => {
  const isAuthorization = true
  return (
    <>
      <div className="file_upload_section">
        <div className="file_upload_header">
          <div className="header_container">
            <div className="header_content">
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Files" key="1">
                  <AllFiles />
                </TabPane>
                {isAuthorization ? (
                  <TabPane tab="New Authorization" key="2">
                    <NewAuthorization />
                  </TabPane>
                ) : (
                  <TabPane tab="New File" key="2">
                    <FileUploadFrom />
                  </TabPane>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index

// PRESCRIPTION SECTION

// <div className="test_contianer">
// <div style={{ width: '70%' }}>
//   <Form.Item {...testLayout} label="Test Requestsed">
//     {form.getFieldDecorator('testRequested')(
//       <TextArea
//         placeholder="Test Requestsed"
//         autoSize={{ minRows: 1, maxRows: 2 }}
//         allowClear
//       />,
//     )}
//   </Form.Item>
// </div>

// <div style={{ width: '16%' }} className="sub_test_container">
//   <p className="tast_title">Test(when)</p>
//   <InputGroup compact>
//     <AutoComplete
//       dataSource={testTime}
//       style={{ width: 80 }}
//       onChange={handelTestTime}
//     />
//     <Select
//       style={{ backgroundColor: '#E5E5E5' }}
//       className="select_option"
//       defaultValue="None"
//     >
//       <Select.Option value="None">None</Select.Option>
//       <Select.Option value="Today">Today</Select.Option>
//       <Select.Option value="Next">Next</Select.Option>
//     </Select>
//   </InputGroup>
// </div>

// <div style={{ width: '15%' }} className="test_icon_section">
//   <FontAwesomeIcon
//     title="add"
//     className="test_icon_section_icon"
//     icon={faFileMedical}
//   />
//   <FontAwesomeIcon className="test_icon_section_icon" icon={faFileWord} />
//   <FontAwesomeIcon className="test_icon_section_icon" icon={faCaretSquareDown} />
//   <FontAwesomeIcon
//     className="test_icon_section_icon caret_icon"
//     icon={faCaretLeft}
//   />
// </div>
// </div>
