/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Table, Button, Layout, Menu, Dropdown, Popconfirm, Drawer, notification } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, FilterFilled } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { FaDownload } from 'react-icons/fa'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import client from '../../apollo/config'
import './allClinicData.scss'
import { ALL_LEARNERS, UPDATE_STUDENT } from './query'
import { FilterCard } from './filterCard'

const { Content } = Layout

function AllLearners(props) {
  const { rowData } = props
  const [learnersList, setLearnersList] = useState([])
  const [mainLearnerList, setMainLearnerList] = useState([])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [clearFilter, setClearFilter] = useState(false)
  const { loading: loadingLearner, data: dataLearners, error: errorLearners, refetch } = useQuery(
    ALL_LEARNERS,
    {
      fetchPolicy: 'network-only',
      variables: { schoolId: rowData.details.id },
    },
  )
  const filterRef = useRef()
  const filterSet = { name: true, email: true, mobile: true, status: true, gender: true }

  useEffect(() => {
    if (dataLearners) {
      const tempArr = []
      dataLearners.students.edges.map(item => {
        return tempArr.push(item.node)
      })
      console.log(tempArr)
      setLearnersList(tempArr)
      setMainLearnerList(tempArr)
    }
  }, [dataLearners])

  const updateLearnerStatus = async (status, record) => {
    return client
      .mutate({
        mutation: UPDATE_STUDENT,
        variables: {
          id: record.node.id,
          isActive: !status,
        },
      })
      .then(data => {
        notification.success({
          message: 'Learner status Updated',
          description: 'Learner status updated successfully',
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Something want wrong',
            description: item.message,
          })
        })
      })
  }

  const [filterInfo, setFilterInfo] = useState(null)

  const handleChange = (pagination, filters, sorter) => {
    console.log(filterInfo, 'info')
    setFilterInfo(filters)
  }

  const filterHandler = ({ name, email, status, mobile, gender }) => {
    let tempList = mainLearnerList
    if ((!name && !email && !status, !mobile, !gender)) {
      setIsFilterActive(false)
    }
    if (name) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(item =>
          `${item.firstname} ${item?.lastname}`.toLowerCase().includes(name.toLowerCase()),
        )
    }
    if (email) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item => item.email && item.email?.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (status === 'true' || status === 'false') {
      setIsFilterActive(true)
      tempList = tempList && tempList.filter(item => item.isActive?.toString() == status)
    }
    if (mobile) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.mobileno?.toLowerCase().includes(mobile.toLowerCase()) ||
            item.parentMobile?.toLowerCase().includes(mobile.toLowerCase()),
        )
    }
    if (gender) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(item => item.gender && item.gender.toLowerCase() === gender.toLowerCase())
    }

    setLearnersList(tempList)
  }

  const learnersColumns = [
    {
      title: 'Name',
      dataIndex: 'firstname',
      align: 'left',
      render: (text, row) => {
        return `${text} ${row.lastname === null ? ' ' : row.lastname}`
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileno',
      width: '160px',
    },
    {
      title: 'Parent Mobile No',
      dataIndex: 'parentMobile',
      width: '160px',
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dob',
      align: 'left',
      width: '120px',
    },
    {
      title: 'Last Login',
      dataIndex: 'parent.lastLogin',
      width: '110px',
      render: text => {
        if (text === null || text === undefined) {
          return text
        }
        return text === 'None' ? 'None' : `${moment(text).format('YYYY-MM-DD')}`
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '100px',
      render: (status, row) => (
        <span>
          <Popconfirm
            title={`Sure to ${status ? 'deactivate' : 'activate'} the Learner?`}
            onConfirm={() => updateLearnerStatus(status, row)}
          >
            <Button type="link">
              {status ? (
                <CheckCircleOutlined style={{ color: 'green' }} />
              ) : (
                <CloseCircleOutlined style={{ color: 'red' }} />
              )}
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ]

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = 'Learner_List_'
    const currentTime = moment().format('YYYY-MM-DD_HH:mm')
    const formattedData = []
    learnersList.map(item => {
      formattedData.push({
        Name: `${item.firstname} ${item.lastname}`,
        Email: item.email,
        'Parent No': item.parentMobile,
        Mobile: item.mobileno,
        Gender: item.gender,
        'Date of Birth': item.dob,
        Active: item.isActive,
      })
    })

    console.log(formattedData)
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, filename + currentTime + fileExtension)
  }

  console.log(learnersList, 'ss')

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
          <div className="ant-drawer-title">{`${rowData.details.schoolName}: Learners`}</div>
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
          width={380}
        >
          <FilterCard filterHandler={filterHandler} filterSet={filterSet} ref={filterRef} />
        </Drawer>

        <Table
          columns={learnersColumns}
          dataSource={learnersList}
          loading={loadingLearner}
          onChange={handleChange}
          style={{ padding: '16px 24px' }}
          scroll={{ x: '800px' }}
          rowKey={record => record.id}
          bordered
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

export default AllLearners
