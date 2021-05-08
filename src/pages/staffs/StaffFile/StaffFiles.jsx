/* eslint-disable no-plusplus */
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Drawer, Form, Icon, Input, message, Table } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { DELETE_STAFF_FILE, UPDATE_STAFF_FILE } from './query'

const StaffFiles = ({ staffProfile, form }) => {
  const [files, setFiles] = useState([])
  const staffId = staffProfile.id

  useEffect(() => {
    setFiles(staffProfile.files.edges)
  }, [staffProfile.files.edges])

  console.log(staffProfile.id, 'user profile')

  const [deleteStaffFile] = useMutation(DELETE_STAFF_FILE)
  const [updateStaffFile] = useMutation(UPDATE_STAFF_FILE)

  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [forUpdateDocsId, setForUpdateDocsId] = useState('')

  const handleUpdateDrawer = id => {
    setVisibleUpdate(true)
    setForUpdateDocsId(id)
  }

  const deleteStaffFileHandler = (staff, docsId) => {
    deleteStaffFile({
      variables: {
        staff,
        docsId: [docsId],
      },
    })
      .then(res => {
        message.success('File delete successfully')
        setFiles(res.data.deleteStaffFile.details.files.edges)
      })
      .catch(err => {
        message.error('Some problem happen!')
        console.log(err)
      })
  }

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (values) {
        updateStaffFile({
          variables: {
            docsId: forUpdateDocsId,
            fileName: values.fileName,
            fileDescription: values.description,
          },
        })
          .then(res => {
            message.success('File update successfully')
            console.log(res)
          })
          .catch(err1 => {
            message.error('Some problem happen!')
            console.log(err1)
          })
      }
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
    },
    {
      title: 'Description',
      dataIndex: 'fileDescription',
    },
    {
      title: 'Actions',
      render: record => (
        <>
          <span>
            <a
              style={{
                fontSize: '18px',
              }}
              target="_blank"
              rel="noopener noreferrer"
              href={record.actions.file}
            >
              <Icon type="eye" />
            </a>
          </span>
          <span>
            <Button
              onClick={() => handleUpdateDrawer(record.actions.fileId)}
              className="update_btn"
            >
              <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faUserEdit} />
            </Button>
          </span>
          <span>
            <Button
              className="remove_btn"
              onClick={() => deleteStaffFileHandler(staffId, record.actions.fileId)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </span>
        </>
      ),
    },
  ]

  const data = []
  for (let i = 0; i < files.length; i++) {
    const item = files[i]
    data.push({
      key: i,
      id: i + 1,
      fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
      fileDescription: item.node.fileDescription
        ? item.node.fileDescription
        : 'No File Description!',
      actions: {
        file: item.node.file ? item.node.file : '',
        fileId: item.node.id,
      },
    })
  }
  return (
    <>
      <div
        style={{
          fontSize: '18px',
          color: 'black',
          fontWeight: 600,
          padding: 16,
          width: '100%',
          border: '1px solid #d9d9d9',
          borderBottom: 'none',
        }}
      >
        <span>Documents</span>
      </div>
      <div
        style={{
          fontSize: '18px',
          color: 'black',
          fontWeight: 600,
          padding: 16,
          width: '100%',
          border: '1px solid #d9d9d9',
          backgroundColor: '#ffffff',
          marginBottom: '30px',
        }}
        className="files_data"
      >
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <Drawer
        visible={visibleUpdate}
        onClose={() => setVisibleUpdate(false)}
        width={DRAWER.widthL4}
        title="Update File(s)"
        placement="right"
      >
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {form.getFieldDecorator('fileName', {
              rules: [{ required: true, message: 'Please input your file name!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="File name"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input your file description!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text"
                placeholder="File description"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default Form.create()(StaffFiles)
