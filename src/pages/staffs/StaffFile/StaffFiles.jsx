/* eslint-disable no-plusplus */
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Drawer, Popconfirm, notification, Table } from 'antd'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import UpdateFile from 'pages/documentUpload/updateFile'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { DELETE_STAFF_FILE } from './query'

const StaffFiles = ({ staffProfile, dispatch }) => {
  const [deleteStaffFile] = useMutation(DELETE_STAFF_FILE)
  const [currentRow, setCurrentRow] = useState(null)
  const [updateDrawer, setUpdateDrawer] = useState(false)
  const [tableData, setTableData] = useState(null)

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

  useEffect(() => {
    if (staffProfile && staffProfile.files) {
      const tempData = staffProfile.files.edges.map(({ node }) => {
        return {
          ...node,
          ownerId: staffProfile.id,
          firstname: staffProfile.name,
          lastname: staffProfile.surname,
          role: 'therapist',
        }
      })

      setTableData(tempData)
    }
  }, [staffProfile])

  const refetchStaffData = () => {
    dispatch({
      type: 'staffs/GET_STAFF_PROFILE',
      payload: {
        ...staffProfile,
      },
    })
  }

  const columns = [
    {
      title: '#',
      render: row => tableData?.indexOf(row) + 1,
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
      render: row => (
        <>
          <a target="_blank" rel="noopener noreferrer" href={row.file}>
            <EyeOutlined style={{ fontSize: 20, padding: '0 16px', color: COLORS.primary }} />
          </a>
          <Button
            onClick={() => {
              setCurrentRow(row)
              setUpdateDrawer(true)
            }}
            type="link"
          >
            <EditOutlined style={{ fontSize: 20, color: COLORS.primary }} />
          </Button>
          <Popconfirm
            trigger="click"
            title="Are you sure to delete this file?"
            onConfirm={() => deleteStaffFileHandler(row.ownerId, row.id)}
          >
            <Button type="link">
              <DeleteOutlined style={{ color: COLORS.danger, fontSize: 20, fontWeight: 600 }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const tableHeader = (
    <div>
      <span style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}>Documents</span>
    </div>
  )

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <Table
          title={() => {
            return tableHeader
          }}
          className="files_data"
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          bordered
          pagination={false}
        />
        <Drawer
          visible={updateDrawer}
          onClose={() => setUpdateDrawer(false)}
          width={DRAWER.widthL2}
          title="Update File"
          placement="right"
          destroyOnClose
        >
          <UpdateFile
            closeDrawer={() => setUpdateDrawer(false)}
            refetchStaffData={refetchStaffData}
            currentRow={currentRow}
          />
        </Drawer>
      </div>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default withRouter(connect(mapDispatchToProps)(StaffFiles))
