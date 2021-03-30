/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */

import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Menu, Dropdown, Layout, Drawer, notification } from 'antd'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { CheckCircleOutlined, CloseCircleOutlined, FilterFilled } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import './allClinicData.scss'
import { COLORS } from 'assets/styles/globalStyles'
import { FilterCard } from './filterCard'

const { Content } = Layout

function ClinicStaff({ rowData }) {
  const [staffList, setStaffList] = useState([])
  const [mainStaffList, setMainStaffList] = useState([])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [clearFilter, setClearFilter] = useState(false)
  const filterRef = useRef()
  const filterSet = {
    name: true,
    email: true,
    mobile: true,
    status: true,
    gender: true,
    designation: true,
  }

  useEffect(() => {
    if (rowData) {
      let tempTable = rowData.details.staffSet?.edges
      tempTable = tempTable.map(item => {
        return {
          ...item.node,
          key: item.node.id,
        }
      })
      setStaffList(rowData.details.staffSet?.edges)
      setMainStaffList(rowData.details.staffSet?.edges)
    }
  }, [])

  const filterHandler = ({ name, email, status, mobile, designation, gender }) => {
    console.log(name, email, status, mobile, gender, 'learner filter')

    let tempList = mainStaffList
    if (!name && !email && !status && !gender && !designation && !mobile) {
      setIsFilterActive(false)
    }
    if (name) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            `${item.node.name} ${item.node?.surname}` &&
            `${item.node.name} ${item.node?.surname}`.toLowerCase().includes(name.toLowerCase()),
        )
    }
    if (email) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.email && item.node.email?.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (status === 'true' || status === 'false') {
      setIsFilterActive(true)
      tempList = tempList && tempList.filter(item => item.node.isActive?.toString() == status)
    }
    if (mobile) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.node.contactNo && item.node.contactNo.toLowerCase().includes(mobile.toLowerCase()),
        )
    }
    if (designation) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.node.designation &&
            item.node.designation.toLowerCase().includes(designation.toLowerCase()),
        )
    }
    if (gender) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item => item.node.gender && item.node.gender?.toLowerCase() === gender.toLowerCase(),
        )
    }

    setStaffList(tempList)
  }

  const col = [
    {
      title: 'Name',
      dataIndex: 'node.name',
      key: 'node.name',
      align: 'left',
      render: (text, row) => {
        return `${text} ${row.node.surname}`
      },
    },
    {
      title: 'Email',
      dataIndex: 'node.email',
      align: 'left',
      key: 'email',
    },
    {
      title: 'Designation',
      dataIndex: 'node.designation',
      key: 'designation',
      width: 180,
    },
    {
      title: 'Gender',
      dataIndex: 'node.gender',
      key: 'gender',
      width: '90px',
    },
    {
      title: 'Mobile',
      dataIndex: 'node.contactNo',
      key: 'mobile',
      align: 'left',
      width: '120px',
    },
    {
      title: 'Last Login',
      dataIndex: 'node.user.lastLogin',
      width: '100px',
      render: text => {
        if (text === null || text === undefined) {
          return text
        }
        return text === 'None' ? 'None' : `${moment(text).format('YYYY-MM-DD')}`
      },
    },
    {
      title: 'Status',
      dataIndex: 'node.isActive',
      key: 'status',
      width: '90px',
      render: (status, row) => (
        <span>
          <Button type="link">
            {status ? (
              <CheckCircleOutlined style={{ fontSize: 22, color: COLORS.success }} />
            ) : (
              <CloseCircleOutlined style={{ fontSize: 22, color: COLORS.danger }} />
            )}
          </Button>
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'node.localAddress',
      align: 'left',
      key: 'address',
      width: '200px',
    },
  ]

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = 'Staff_List_'
    const currentTime = moment().format('_YYYY-MM-DD_HH:mm_')
    const formattedData = []
    staffList.map(item => {
      console.log(item, 'item')
      formattedData.push({
        Name: `${item.node.name} ${item.node.surname}`,
        Email: item.node.email,
        Contact: item.node.contactNo,
        Gender: item.node.gender,
        Designation: item.node.designation,
        'Date of Birth': item.node.dob,
        Address: item.node.localAddress,
        Active: item.node.isActive,
        'Last Login': item.node?.lastLogin
          ? moment(item.node?.lastLogin).format('YYYY-MM-DD HH:mm:ss')
          : null,
      })
    })

    console.log(formattedData)
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    // FileSaver.saveAs(
    //   excelData,
    //   filename + rowData?.details?.schoolName + currentTime + fileExtension,
    // )
  }

  console.log(rowData, 'rowData')
  console.log(staffList, 'ss')

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="modify-table">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <div className="ant-drawer-header">
          <div className="ant-drawer-title">{`${rowData.details.schoolName}: Staff`}</div>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              right: '50px',
              width: 'fit-content',
            }}
          >
            <div style={{ margin: 'auto 0px' }}>
              {isFilterActive ? (
                <Button
                  type="link"
                  onClick={() => {
                    filterRef.current.clearFilter()
                    setIsFilterActive(false)
                  }}
                  style={{ marginLeft: '10px', color: '#FEBB27' }}
                  size="small"
                >
                  Clear Filters
                  <CloseCircleOutlined />
                </Button>
              ) : null}
            </div>
            <Button
              className="drawer-header-button"
              style={{ margin: 'auto 0px' }}
              onClick={() => setFilterDrawer(true)}
            >
              <FilterFilled />
            </Button>

            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
              <Button
                className="drawer-header-button"
                tyle={{ margin: 'auto 0px' }}
                type="link"
                size="large"
              >
                <FaDownload style={{ marginTop: 6 }} />{' '}
              </Button>
            </Dropdown>
          </div>
        </div>

        <Drawer
          title="Filters"
          placement="right"
          closable="true"
          onClose={() => setFilterDrawer(false)}
          visible={filterDrawer}
          width={360}
        >
          <FilterCard filterHandler={filterHandler} filterSet={filterSet} ref={filterRef} />
        </Drawer>

        <Table
          columns={col}
          dataSource={staffList}
          bordered
          style={{ padding: '16px 24px' }}
          rowKey={record => record.node.id}
          scroll={{ x: '850px' }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            position: 'top',
          }}
        />
      </Layout>
    </div>
  )
}

export default ClinicStaff
