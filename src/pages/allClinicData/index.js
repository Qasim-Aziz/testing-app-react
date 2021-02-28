/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Highlighter from 'react-highlight-words'
import {
  Table,
  Button,
  Popconfirm,
  Dropdown,
  Drawer,
  Form,
  Menu,
  Input,
  Select,
  notification,
  Space,
  Tabs,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  CheckCircleOutlined,
  FilterOutlined,
  CloudDownloadOutlined,
  CloseCircleOutlined,
  FilterFilled,
  SearchOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { FaDownload } from 'react-icons/fa'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import client from '../../apollo/config'
import './allClinicData.scss'
import AllLearners from './allLearners'
import UpdateClinicRates from './updateClinicRates'
import InvoiceTable from './invoiceTable'
import { CLINIC_QUERY, UPDATE_SCHOOL } from './query'
import ClinicStaff from './clinicStaff'
import { FilterCard } from './filterCard'
import PrintableInvoice from './printableInvoice'
import ViewInvoice from './viewInvoice'

const countrySet = []
const { TabPane } = Tabs

const AllClinicsData = () => {
  const [activeTab, setActiveTab] = useState('Active')
  const [clinicsList, setClinicsList] = useState([])
  const [mainList, setMainList] = useState([])
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [staffDrawer, setStaffDrawer] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')
  const [invoiceDrawer, setInvoiceDrawer] = useState(false)
  const [ratesDrawer, setRatesDrawer] = useState(false)
  const [learnersTableDrawer, setLearnersTableDrawer] = useState(false)
  const [currentClinicRow, setCurrentClinicRow] = useState()
  const filterRef = useRef()
  const filterSet = { name: true, email: true, mobile: true, status: true }
  const { data, loading, error, refetch } = useQuery(CLINIC_QUERY, {
    variables: {
      isActive: activeTab === 'Active' ? true : false,
    },
  })

  useEffect(() => {
    if (data) {
      data.clinicAllDetails.map(item => {
        if (countrySet.indexOf(item.details.country.name) === -1) {
          countrySet.push(item.details.country.name)
        }
        return countrySet
      })

      setClinicsList(data && data.clinicAllDetails ? data.clinicAllDetails : [])
      setMainList(data && data.clinicAllDetails ? data.clinicAllDetails : [])
    }
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing went wrong',
        description: 'Unable to fetch clinic data',
      })
    }
  }, [error])

  const closeTask = async (status, record) => {
    const val = status === 'Active' ? false : true

    console.log(record.details.id, val)
    await client
      .mutate({
        mutation: UPDATE_SCHOOL,
        variables: {
          pk: record.details.id,
          isActive: val,
        },
      })
      .then(updatedData => {
        console.log(updatedData, 'data')
        notification.success({
          message: 'Clinic status Updated',
          description: 'Clinic status updated successfully',
        })
      })
      .catch(updateError => console.log(updateError, 'in errororo'))
    refetch()
  }

  const [sortOrderInfo, setSortOrderInfo] = useState(null)

  const handleChange = (pagination, filters, sorter) => {
    setSortOrderInfo(sorter)
  }

  const sortedInfo = sortOrderInfo || {}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'details.schoolName',
      key: 'schoolName',
      maxWidth: '100px',
      width: '230px',
      align: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'details.email',
      key: 'schoolEmail',
      width: '200px',
      align: 'left',
    },
    {
      title: 'Contact No',
      dataIndex: 'details.contactNo',
      key: 'contactNo',
      align: 'left',
      width: '130px',
      render: (text, row) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{text}</span>
            <span>{row.details.contactNo2}</span>
          </div>
        )
      },
    },
    {
      title: 'Staff',
      key: 'staff',
      width: '85px',
      render: (text, row) => (
        <Button
          onClick={() => {
            setCurrentClinicRow(row)
            setDrawerTitle(row.details.schoolName)
            setStaffDrawer(true)
          }}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          {row.details.staffSet?.edges?.length}
        </Button>
      ),
    },
    {
      title: 'Total Learners',
      dataIndex: 'totalLearners',
      key: 'totalLearners',
      sorter: (a, b) => a.totalLearners - b.totalLearners,
      sortOrder: sortedInfo.columnKey === 'totalLearners' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      width: '95px',
      render: (text, row) => (
        <Button
          onClick={() => {
            setCurrentClinicRow(row)
            setDrawerTitle(row.details.schoolName)
            setLearnersTableDrawer(true)
          }}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Active Learners',
      dataIndex: 'activeLearners',
      key: 'activeLearners',
      sorter: (a, b) => a.activeLearners - b.activeLearners,
      sortOrder: sortedInfo.columnKey === 'activeLearners' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      width: '95px',
    },
    {
      title: 'Last Month Active Learners',
      dataIndex: 'lastMonthActiveLearners',
      key: 'lastMonthsActiveLearners',
      sorter: (a, b) => a.lastMonthsActiveLearners - b.lastMonthsActiveLearners,
      sortOrder: sortedInfo.columnKey === 'lastMonthsActiveLearners' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      width: '110px',
    },
    {
      title: 'Research Participants',
      dataIndex: 'researchParticipent',
      key: 'researchParticipant',
      sorter: (a, b) => a.researchParticipant - b.researchParticipant,
      sortOrder: sortedInfo.columnKey === 'researchParticipant' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      width: '120px',
    },
    {
      title: 'Peak',
      dataIndex: 'peak',
      width: '85px',
    },
    {
      title: 'VBM App',
      dataIndex: 'vbmapp',
      width: '85px',
    },
    {
      title: 'Cogniable',
      dataIndex: 'cogniable',
      width: '85px',
    },
    {
      title: 'Invoices',
      dataIndex: 'invoice',
      width: '85px',
      render: (e, row) => (
        <Button
          onClick={() => {
            setCurrentClinicRow(row)
            setDrawerTitle(row.details.schoolName)
            setInvoiceDrawer(true)
          }}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          {e}
        </Button>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      width: '100px',
      align: 'left',
      ellipsis: true,
      sorter: (a, b) => {
        if (a.lastLogin !== 'None' && b.lastLogin !== 'None') {
          return new Date(a.lastLogin) - new Date(b.lastLogin)
        }
        return false
      },
      sortOrder: sortedInfo.columnKey === 'lastLogin' && sortedInfo.order,
      sortDirections: ['ascend', 'descend'],
      render: text => {
        const tempDate = new Date(text)
        return text === 'None' ? 'None' : `${moment(tempDate).format('YYYY-MM-DD')}`
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '85px',
      render: (status, row) => (
        <span>
          <Popconfirm
            title={`Sure to ${status === 'Active' ? 'deactivate' : 'activate'} the clinic?`}
            onConfirm={() => closeTask(status, row)}
          >
            <Button type="link">
              {status === 'Active' ? (
                <CheckCircleOutlined style={{ color: 'green' }} />
              ) : (
                <CloseCircleOutlined style={{ color: 'red' }} />
              )}
            </Button>
          </Popconfirm>
        </span>
      ),
    },
    {
      title: 'Action',
      width: '130px',
      render: (text, row) => (
        <Button
          onClick={() => {
            setCurrentClinicRow(row)
            setDrawerTitle(row.details.schoolName)
            setRatesDrawer(true)
          }}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          Maintain Rates
        </Button>
      ),
    },
  ]

  const filterHandler = ({ name, email, status, mobile }) => {
    let tempList = mainList
    if (!name && !email && !status) {
      setIsFilterActive(false)
    }
    if (name) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.details.schoolName &&
            item.details.schoolName.toLowerCase().includes(name.toLowerCase()),
        )
    }
    if (email) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.details.email && item.details.email.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (mobile) {
      setIsFilterActive(true)
      tempList =
        tempList &&
        tempList.filter(
          item =>
            item.details.contactNo?.toLowerCase().includes(mobile.toLowerCase()) ||
            item.details.contactNo2?.toLowerCase().includes(mobile.toLowerCase()),
        )
    }
    if (status === 'true' || status === 'false') {
      setIsFilterActive(true)
      const tempStatus = status === 'true' ? 'Active' : 'Inactive'
      console.log(tempStatus, 'tempStatus')
      tempList = tempList && tempList.filter(item => item.status && item.status === tempStatus)
    }

    setClinicsList(tempList)
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = () => {
    const filename = 'Clinic_List_'
    const currentTime = moment().format('YYYY-MM-DD_HH:mm')
    const formattedData = []
    clinicsList.map(item => {
      formattedData.push({
        'Clinic Name': item.details.schoolName,
        Email: item.details.email,
        'Contact No 1': item.details.contactNo,
        'Contact No 2': item.details.contactNo2,
        'Total Learners': item.totalLearners,
        'Active Learners': item.activeLearners,
        'Last Month Active Learners': item.lastMonthActiveLearners,
        Peak: item.peak,
        VBMAPP: item.vbmapp,
        'Research Participants': item.researchParticipent,
        'Cogniable Learners': item.cogniable,
        'Invoices Count': item.invoice,
        'Last Login': moment(item.lastLogin).format('YYYY-MM-DD HH:mm:ss'),
        Status: item.status,
      })
    })
    console.log(formattedData)
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, filename + currentTime + fileExtension)
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV()} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  const exportButton = (
    <div style={{ display: 'flex' }}>
      <div>
        {isFilterActive ? (
          <Button
            type="link"
            onClick={() => {
              filterRef.current.clearFilter()
              setIsFilterActive(false)
            }}
            style={{ color: '#FEBB27' }}
            size="small"
          >
            Clear Filters
            <CloseCircleOutlined />
          </Button>
        ) : null}
        <Button type="link" onClick={() => setFilterDrawer(true)} size="large">
          <FilterFilled style={{ fontSize: '22px' }} />
        </Button>
      </div>
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="link" size="large">
            <FaDownload style={{ fontSize: '22px' }} />{' '}
          </Button>
        </Dropdown>
      </div>
    </div>
  )

  return (
    <Authorize roles={['superUser']} redirect to="/404">
      <Tabs
        style={{ marginTop: 10, marginLeft: 10 }}
        defaultActiveKey={activeTab}
        type="card"
        className="vbmappReportTabs"
        tabBarExtraContent={exportButton}
        onChange={setActiveTab}
      >
        <TabPane tab="Active" key="Active">
          <div className=" modify-table">
            <Table
              scroll={{ x: '70vw' }}
              columns={columns}
              rowKey={record => record.details.id}
              dataSource={clinicsList}
              onChange={handleChange}
              loading={loading}
              bordered
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['20', '30', '50', '100'],
                position: 'top',
              }}
            />
          </div>
        </TabPane>

        <TabPane tab="Inactive" key="Inactive">
          <div className="modify-table">
            <Table
              scroll={{ x: '70vw' }}
              columns={columns}
              rowKey={record => record.details.id}
              dataSource={clinicsList}
              onChange={handleChange}
              loading={loading}
              bordered
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['20', '30', '50', '100'],
                position: 'top',
              }}
            />
          </div>
        </TabPane>
      </Tabs>
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

      <Drawer
        title={`${drawerTitle}: Invoices`}
        width="70vw"
        placement="right"
        closable="true"
        onClose={() => setInvoiceDrawer(false)}
        visible={invoiceDrawer}
      >
        <InvoiceTable rowData={currentClinicRow} setInvoiceDrawer={setInvoiceDrawer} />
      </Drawer>
      <Drawer
        width="70vw"
        placement="right"
        closable="true"
        onClose={() => setStaffDrawer(false)}
        visible={staffDrawer}
        destroyOnClose="true"
        className="change-invo-drawer"
      >
        <ClinicStaff rowData={currentClinicRow} />
      </Drawer>
      <Drawer
        title={`${drawerTitle}: Maintain Rates`}
        width="40%"
        placement="right"
        closable="true"
        onClose={() => setRatesDrawer(false)}
        visible={ratesDrawer}
        destroyOnClose="true"
      >
        <UpdateClinicRates
          rowData={currentClinicRow}
          ratesDrawer={ratesDrawer}
          setRatesDrawer={setRatesDrawer}
        />
      </Drawer>
      <Drawer
        visible={learnersTableDrawer}
        onClose={() => setLearnersTableDrawer(false)}
        width="70vw"
        placement="right"
        closable="true"
        destroyOnClose="true"
        className="change-invo-drawer"
      >
        <AllLearners rowData={currentClinicRow} />
      </Drawer>
    </Authorize>
  )
}

export default AllClinicsData
