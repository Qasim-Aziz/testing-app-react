/* eslint-disable no-plusplus */
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Drawer, Form, Icon, Input, message, Table } from 'antd'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { DELETE_LEARNER_FILE, UPDATE_LEARNER_FILE } from './query'

const LearnerFiles = ({ userProfile, form, dispatch }) => {
  console.log(userProfile, 'userProfile')
  const [files, setFiles] = useState([])
  const studentId = userProfile.id

  useEffect(() => {
    setFiles(userProfile.files.edges)
  }, [userProfile.files.edges])

  const [deleteLearnerFile] = useMutation(DELETE_LEARNER_FILE)
  const [updateLearnerFile] = useMutation(UPDATE_LEARNER_FILE)

  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [forUpdateDocsId, setForUpdateDocsId] = useState('')

  const handleUpdateDrawer = id => {
    setVisibleUpdate(true)
    setForUpdateDocsId(id)
  }

  const deleteLearnerFileHandler = (student, docsId) => {
    deleteLearnerFile({
      variables: {
        student,
        docsId: [docsId],
      },
    })
      .then(res => {
        message.success('File delete successfully')
        setFiles(res.data.deleteLearnerFile.details.files.edges)
      })
      .catch(err => {
        message.error('Some problem happen!')
        console.log(err)
      })
  }

  useEffect(() => {
    if (userProfile && userProfile.files) {
      const tempData = userProfile.files.edges.map(({ node }) => {
        return {
          ...node,
          stdId: userProfile.id,
          firstname: userProfile.firstname,
          lastname: userProfile.lastname,
          role: 'student',
        }
      })

      console.log(tempData, 'tempdata')
    }
  }, [userProfile])

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (values) {
        updateLearnerFile({
          variables: {
            docsId: forUpdateDocsId,
            fileName: values.fileName,
            fileDescription: values.description,
          },
        })
          .then(res => {
            // console.log('userProfile ===>',userProfile.id)
            dispatch({
              type: 'learners/EDIT_GENERAL_INFO',
              payload: {
                id: userProfile.id,
                response: res,
              },
            })
            setVisibleUpdate(false)
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
          <a target="_blank" rel="noopener noreferrer" href={record.actions.file}>
            <EyeOutlined style={{ fontSize: 20, padding: '0 16px', color: COLORS.primary }} />
          </a>
          <Button onClick={() => handleUpdateDrawer(record.actions.fileId)} type="link">
            <EditOutlined style={{ fontSize: 20, color: COLORS.primary }} />
          </Button>
          <Button
            type="link"
            onClick={() => deleteLearnerFileHandler(studentId, record.actions.fileId)}
          >
            <DeleteOutlined style={{ fontSize: 20, color: COLORS.danger }} />
          </Button>
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

  const tableHeader = (
    <div>
      <span style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}>Documents</span>
    </div>
  )

  console.log(data, 'data')
  return (
    <>
      <Table
        title={() => {
          return tableHeader
        }}
        className="files_data"
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapDispatchToProps)(Form.create()(LearnerFiles)))
