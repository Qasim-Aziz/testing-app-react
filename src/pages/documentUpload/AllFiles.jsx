/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import { Button, Drawer, Form, Input, Table, Tooltip, Popconfirm, notification } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import {
  DELETE_LEARNER_FILE,
  DELETE_STAFF_FILE,
  UPDATE_LEARNER_FILE,
  GET_STAFF_DATA,
  GET_STUDENT_DATA,
  UPDATE_STAFF_FILE,
} from './query'
import UpdateFile from './updateFile'

const AllFiles = ({ learnerId, staffId, isLearnerById, isStaffById, handleUserName }) => {
  const st = localStorage.getItem('studentId')
  const tt = localStorage.getItem('therapistId')
  const std = st && st !== 'undefined' ? JSON.parse(st) : null
  const therapistId = tt && tt !== 'undefined' ? JSON.parse(tt) : null

  const [tableData, setTableData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [forUpdateUserId, setForUpdateUserId] = useState('')
  const [currentRow, setCurrentRow] = useState(null)
  const [updateDrawer, setUpdateDrawer] = useState(false)

  const { data, loading, refetch: refetchStudentData } = useQuery(GET_STUDENT_DATA, {
    variables: {
      id: learnerId ? learnerId : std,
    },
    fetchPolicy: 'network-only',
  })

  const { data: staffData, loading: staffDataLoading, refetch: refetchStaffData } = useQuery(
    GET_STAFF_DATA,
    {
      variables: {
        id: therapistId ? therapistId : '',
      },
      fetchPolicy: 'network-only',
    },
  )

  const [deleteLearnerFile] = useMutation(DELETE_LEARNER_FILE)
  const [deleteStaffFile] = useMutation(DELETE_STAFF_FILE)
  const [updateLearnerFile] = useMutation(UPDATE_LEARNER_FILE)
  const [updateStaffFile] = useMutation(UPDATE_STAFF_FILE)

  useEffect(() => {
    console.log(data, staffData, isLearnerById, isStaffById, 'hello')
    if (data && data.student && isLearnerById) {
      const tempTable = data.student.files.edges.map(item => {
        return {
          ...item.node,
          firstname: data.student.firstname,
          lastname: data.student.lastname,
          stdId: data.student.id,
          role: 'student',
        }
      })
      handleUserName('student', data.student.firstname)
      setTableData(tempTable)
      setOriginalData(tempTable)
    } else if (staffData && staffData.staff && isStaffById) {
      const tempTable = staffData.staff.files.edges.map(item => {
        return {
          ...item.node,
          firstname: staffData.staff.name,
          lastname: staffData.staff.surname,
          stdId: staffData.staff.id,
          role: 'therapist',
        }
      })
      handleUserName('therapist', staffData.staff.name)
      setOriginalData(tempTable)
      setTableData(tempTable)
    }
  }, [data, staffData, isLearnerById, isStaffById])

  const deleteLearnerFileHandler = (student, docsId) => {
    deleteLearnerFile({
      variables: {
        student,
        docsId: [docsId],
      },
    })
      .then(res => {
        refetchStudentData()
        notification.success({
          message: 'File deleted successfully',
        })
      })
      .catch(err => console.log(err))
  }

  const deleteStaffFileHandler = (staff, docsId) => {
    deleteStaffFile({
      variables: {
        staff,
        docsId: [docsId],
      },
    })
      .then(res => {
        refetchStaffData()
        notification.success({
          message: 'File deleted successfully',
        })
      })
      .catch(err => console.log(err))
  }

  const handleOpenUpdateDrawer = (id, value) => {
    setVisibleUpdate(value)
    setForUpdateUserId(id)
  }

  const columns = [
    {
      title: 'Id',
      render: (text, row) => tableData.indexOf(row) + 1,
    },
    {
      title: 'File Name',
      render: record => {
        return (
          <Button type="link" onClick={() => handleOpenUpdateDrawer(record.fileName.id, true)}>
            {record.fileName}
          </Button>
        )
      },
    },
    {
      title: 'Description',
      dataIndex: 'fileDescription',
    },
    {
      title: 'Upload',
      dataIndex: 'firstname',
    },
    {
      title: 'Action',
      render: row => (
        <>
          <Tooltip title="View Document">
            <a
              style={{
                fontSize: '20px',
                padding: '0 16px',
                textAlign: 'center',
                display: 'inline-block',
              }}
              target="_blank"
              rel="noopener noreferrer"
              href={row?.file}
            >
              <EyeOutlined style={{ fontSize: 20, fontWeight: 600, color: COLORS.primary }} />
            </a>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="link"
              onClick={() => {
                setCurrentRow(row)
                setUpdateDrawer(true)
              }}
            >
              <EditOutlined style={{ fontSize: 20, fontWeight: 600 }} />
            </Button>
          </Tooltip>
          <Popconfirm
            trigger="click"
            title="Are you sure to delete this file?"
            onConfirm={() =>
              row.role === 'therapist'
                ? deleteStaffFileHandler(row.stdId, row.id)
                : deleteLearnerFileHandler(row.stdId, row.id)
            }
          >
            <Button type="link">
              <DeleteOutlined style={{ color: COLORS.danger, fontSize: 20, fontWeight: 600 }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const filterHandler = ({ name, description }) => {
    let filteredList = originalData
    if (name) {
      setIsFilterActive(true)
      filteredList =
        filteredList &&
        filteredList.filter(item => item.fileName?.toLowerCase().includes(name.toLowerCase()))
    }
    if (description) {
      setIsFilterActive(true)
      filteredList =
        filteredList &&
        filteredList.filter(item =>
          item.fileDescription?.toLowerCase().includes(description.toLowerCase()),
        )
    }
    if (!name && !description) {
      setIsFilterActive(false)
    }
    setTableData(filteredList)
  }

  console.log(tableData, 'table data')
  return (
    <>
      <div className="filter_container">
        <div className="name_filter_section">
          <div className="name_filter">
            <span className="name_filter_label">Name : </span>
          </div>
          <div className="name_filter_input">
            <Input
              onChange={e => filterHandler({ name: e.target.value })}
              placeholder="Search Name"
            />
          </div>
        </div>
        <div className="description_filter_section" style={{ marginLeft: '30px' }}>
          <div className="description_filter">
            <span className="description_filter_label" htmlFor="description">
              Description :
            </span>
          </div>
          <div className="description_filter_input">
            <Input
              onChange={e => filterHandler({ description: e.target.value })}
              placeholder="Search Description"
            />
          </div>
        </div>
      </div>
      <div className="all_file_container">
        <Table columns={columns} dataSource={tableData} loading={loading || staffDataLoading} />
      </div>
      <Drawer
        visible={updateDrawer}
        onClose={() => setUpdateDrawer(false)}
        width={DRAWER.widthL2}
        title="Update File"
        placement="right"
      >
        <UpdateFile
          closeDrawer={() => setUpdateDrawer(false)}
          currentRow={currentRow}
          refetchStaffData={refetchStaffData}
          refetchStudentData={refetchStudentData}
        />
      </Drawer>
    </>
  )
}

export default AllFiles
