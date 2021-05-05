/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-plusplus */
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Icon, Input, Table } from 'antd'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'

const DELETE_LEARNER_FILE = gql`
  mutation($student: ID!, $docsId: [ID]!) {
    deleteLearnerFile(input: { student: $student, docsId: $docsId }) {
      details {
        id
        firstname
        lastname
        email
        files {
          edges {
            node {
              id
              file
              fileName
              fileDescription
            }
          }
        }
      }
    }
  }
`

const AllFilesData = ({
  studentData,
  staffData,
  isLearnerById,
  learnerId,
  staffId,
  isStaffById,
}) => {
  const userRole = JSON.parse(localStorage.getItem('role'))

  console.log('isLearnerById ==>', isLearnerById, '<==&&==>', learnerId, 'learnerId')
  console.log('isStaffById', isStaffById, '<==&&==>', staffId, 'isStaffById')

  const StudentName = studentData?.student?.firstname
  const staffName = staffData?.staff?.name

  const studentId = studentData?.student?.id || learnerId

  const studentFiles = studentData?.student?.files.edges
  const staffFiles = staffData?.staff?.files?.edges

  const studentFilesLength = studentFiles?.length
  const staffFilesLength = staffFiles?.length

  const [filteredData, setFilteredData] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  const [deleteLearnerFile] = useMutation(DELETE_LEARNER_FILE)

  // console.log(studentData?.student?.id)
  console.log(studentFiles)
  const deleteFileHandler = (student, docsId) => {
    console.log(student, docsId, 'in side func')
    deleteLearnerFile({
      variables: {
        input: {
          student,
          docsId: [docsId],
        },
      },
    })
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const columns = [
    {
      title: 'Id',
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
          onClick={() => deleteFileHandler(studentId, id)}
        >
          {console.log(studentId)}
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
        fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
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
          fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
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
          fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: staffName && staffName,
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
          fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: StudentName && StudentName,
          delete: item.node.id,
        })
      }
    }
    if (isStaffById && staffId) {
      for (let i = 0; i < staffFilesLength || 0; i++) {
        const item = staffFiles[i]
        data.push({
          key: i,
          id: i + 1,
          fileName: item.node.fileName ? item.node.fileName : 'No File Name !',
          fileDescription: item.node.fileDescription
            ? item.node.fileDescription
            : 'No File Description!',
          file: item.node.file ? item.node.file : '',
          upload: staffName && staffName,
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

  console.log('DATA', data)

  return (
    <>
      <div className="filter_container">
        <p className="student_name">
          {userRole === 'parents'
            ? StudentName === undefined
              ? 'Loading...'
              : `${StudentName} File(s)`
            : userRole === 'therapist'
            ? isLearnerById && learnerId
              ? StudentName === undefined
                ? 'Loading...'
                : `${StudentName} File(s)`
              : staffName === undefined
              ? 'Loading...'
              : `${staffName} File(s)`
            : userRole === 'school_admin'
            ? isLearnerById && learnerId
              ? StudentName === undefined
                ? 'Select Learner/Staff'
                : `${StudentName} File(s)`
              : staffName === undefined
              ? 'Select Staff/Learner'
              : `${staffName} File(s)`
            : ''}
        </p>
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
        <div className="description_filter_section">
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
    </>
  )
}

export default AllFilesData
