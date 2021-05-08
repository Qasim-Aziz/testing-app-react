/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-plusplus */
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Drawer, Form, Icon, Input, message, Table } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import {
  DELETE_LEARNER_FILE,
  DELETE_STAFF_FILE,
  UPDATE_LEARNER_FILE,
  UPDATE_STAFF_FILE,
} from './query'

const AllFilesData = ({
  studentData,
  staffData,
  isLearnerById,
  learnerId,
  staffId,
  form,
  handleUserName,
}) => {
  const userRole = JSON.parse(localStorage.getItem('role'))

  const StudentName = studentData?.student?.firstname
  const staffName = staffData?.staff?.name

  const studentId = studentData?.student?.id || learnerId
  const therapistId = staffData?.staff?.id || staffId

  const studentFiles = studentData?.student?.files.edges
  const staffFiles = staffData?.staff?.files?.edges

  const studentFilesLength = studentFiles?.length
  const staffFilesLength = staffFiles?.length

  const [filteredData, setFilteredData] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  const [deleteLearnerFile] = useMutation(DELETE_LEARNER_FILE)
  const [deleteStaffFile] = useMutation(DELETE_STAFF_FILE)
  const [updateLearnerFile] = useMutation(UPDATE_LEARNER_FILE)
  const [updateStaffFile] = useMutation(UPDATE_STAFF_FILE)

  const [visibleUpdate, setVisibleUpdate] = useState(false)

  const [forUpdateUserId, setForUpdateUserId] = useState('')
  const handleOpenUpdateDrawer = (id, value) => {
    setVisibleUpdate(value)
    setForUpdateUserId(id)
  }

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (values) {
        if (userRole === 'parents') {
          updateLearnerFile({
            variables: {
              docsId: forUpdateUserId,
              fileName: values.fileName,
              fileDescription: values.description,
            },
          })
            .then(res => {
              message.success('File update successfully')
              console.log(res)
            })
            .catch(err => {
              message.error('Some problem happen!')
              console.log(err)
            })
        } else if (userRole === 'therapist' || userRole === 'school_admin') {
          if (isLearnerById && learnerId) {
            updateLearnerFile({
              variables: {
                docsId: forUpdateUserId,
                fileName: values.fileName,
                fileDescription: values.description,
              },
            })
              .then(res => {
                message.success('File update successfully')
                console.log(res)
              })
              .catch(err => {
                message.error('Some problem happen!')
                console.log(err)
              })
          } else {
            updateStaffFile({
              variables: {
                docsId: forUpdateUserId,
                fileName: values.fileName,
                fileDescription: values.description,
              },
            })
              .then(res => {
                message.success('File update successfully')
                console.log(res)
              })
              .catch(err => {
                message.error('Some problem happen!')
                console.log(err)
              })
          }
        }
      }
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
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
        console.log(res)
      })
      .catch(err => {
        message.error('Some problem happen!')
        console.log(err)
      })
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
        console.log(res)
      })
      .catch(err => {
        message.error('Some problem happen!')
        console.log(err)
      })
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'File Name',
      render: record => (
        <span
          onClick={() => handleOpenUpdateDrawer(record.fileName.id, true)}
          className="upload_file_title"
        >
          <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faUserEdit} />
          {record.fileName.name}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'fileDescription',
    },
    {
      title: 'Preview',
      render: text => (
        <a
          style={{ fontSize: '22px', textAlign: 'center', display: 'inline-block' }}
          target="_blank"
          rel="noopener noreferrer"
          href={text}
        >
          <Icon type="eye" />
        </a>
      ),
      dataIndex: 'file',
    },
    {
      title: 'Upload',
      dataIndex: 'upload',
    },
    {
      title: 'Delete',
      render: id => (
        <Button
          className="remove_btn"
          type="danger"
          onClick={() =>
            userRole === 'parents'
              ? deleteLearnerFileHandler(studentId, id)
              : userRole === 'therapist'
              ? isLearnerById && learnerId
                ? deleteLearnerFileHandler(studentId, id)
                : deleteStaffFileHandler(therapistId, id)
              : userRole === 'school_admin'
              ? isLearnerById && learnerId
                ? deleteLearnerFileHandler(studentId, id)
                : deleteStaffFileHandler(therapistId, id)
              : null
          }
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      ),
      dataIndex: 'delete',
    },
  ]

  const data = []
  if (userRole === 'parents') {
    for (let i = 0; i < studentFilesLength || 0; i++) {
      const item = studentFiles[i]
      data.push({
        key: i,
        id: i + 1,
        fileName: {
          name: item.node.fileName ? item.node.fileName : 'No File Name !',
          id: item.node.id,
        },
        fileDescription: item.node.fileDescription
          ? item.node.fileDescription
          : 'No File Description!',
        file: item.node.file ? item.node.file : '',
        upload: StudentName && StudentName,
        delete: item.node.id,
      })
    }
  } else if (userRole === 'therapist') {
    if (isLearnerById && learnerId) {
      for (let i = 0; i < studentFilesLength || 0; i++) {
        const item = studentFiles[i]
        data.push({
          key: i,
          id: i + 1,
          fileName: {
            name: item.node.fileName ? item.node.fileName : 'No File Name !',
            id: item.node.id,
          },
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: StudentName && StudentName,
          delete: item.node.id,
        })
      }
    } else {
      for (let i = 0; i < staffFilesLength || 0; i++) {
        const item = staffFiles[i]
        data.push({
          key: i,
          id: i + 1,
          fileName: {
            name: item.node.fileName ? item.node.fileName : 'No File Name !',
            id: item.node.id,
          },
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: staffName && staffName,
          delete: item.node.id,
        })
      }
    }
  } else if (userRole === 'school_admin') {
    if (isLearnerById && learnerId) {
      for (let i = 0; i < studentFilesLength || 0; i++) {
        const item = studentFiles[i]
        data.push({
          key: i,
          id: i + 1,
          fileName: {
            name: item.node.fileName ? item.node.fileName : 'No File Name !',
            id: item.node.id,
          },
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: StudentName && StudentName,
          delete: item.node.id,
        })
      }
    } else {
      for (let i = 0; i < staffFilesLength || 0; i++) {
        const item = staffFiles[i]
        data.push({
          key: i,
          id: i + 1,
          fileName: {
            name: item.node.fileName ? item.node.fileName : 'No File Name !',
            id: item.node.id,
          },
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: staffName && staffName,
          delete: item.node.id,
        })
      }
    }
  }

  const filterHandler = ({ name, description }) => {
    let filteredList = []
    if (name) {
      setIsFiltered(true)
      filteredList = data.filter(item => item.fileName?.toLowerCase().includes(name.toLowerCase()))
    }
    if (description) {
      setIsFiltered(true)
      filteredList = data.filter(item =>
        item.fileDescription?.toLowerCase().includes(description.toLowerCase()),
      )
    }
    if (!name && !description) {
      setIsFiltered(false)
    }
    setFilteredData(filteredList)
  }

  if (userRole === 'parents') {
    handleUserName('learner', StudentName)
  } else if (userRole === 'therapist') {
    if (isLearnerById && learnerId) {
      handleUserName('learner', StudentName)
    } else {
      handleUserName('staff', staffName)
    }
  } else if (userRole === 'school_admin') {
    if (isLearnerById && learnerId) {
      handleUserName('learner', StudentName)
    } else {
      handleUserName('staff', staffName)
    }
  }
  return (
    <>
      <div className="filter_container">
        <div className="name_filter_section">
          <div className="name_filter">
            <label className="name_filter_label" htmlFor="name">
              Name:
            </label>
          </div>
          <div className="name_filter_input">
            <Input
              onChange={e => filterHandler({ name: e.target.value })}
              id="name"
              placeholder="Search Name"
            />
          </div>
        </div>
        <div className="description_filter_section" style={{ marginLeft: '30px' }}>
          <div className="description_filter">
            <label className="description_filter_label" htmlFor="description">
              Description:
            </label>
          </div>
          <div className="description_filter_input">
            <Input
              onChange={e => filterHandler({ description: e.target.value })}
              id="description"
              placeholder="Search Description"
            />
          </div>
        </div>
      </div>
      <div className="all_files_data_container">
        <Table columns={columns} dataSource={isFiltered ? filteredData : data} />
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

export default Form.create()(AllFilesData)
