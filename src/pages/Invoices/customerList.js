/* eslint-disable */
import React, { useEffect, useState, useReducer } from 'react'
import {
  Form,
  Select,
  Input,
  Typography,
  Button,
  notification,
  DatePicker,
  Table,
  Menu,
  Popover,
  Icon,
  Dropdown,
  Drawer,
  Modal,
} from 'antd'
import {
  PlayCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import moment from 'moment'
import AdvanceInvoiceForm from './advanceInvoice'
import MonthlyInvoiceForm from './monthlyInvoice'
import { CLINIC_QUERY, ADVANCE_INVOICE } from './query'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input
function CustomerList() {
  const { data, loading, error } = useQuery(CLINIC_QUERY)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [advInvoiceMonth, setAdvInvoiceMonth] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [advInvForm, setAdvInvForm] = useState(false)
  const [monthlyInvForm, setMonthlyInvForm] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const [
    createAdvanceInvoice,
    { data: advanceData, loading: advanceLoading, error: advanceError },
  ] = useMutation(ADVANCE_INVOICE)

  useEffect(() => {
    if (data) {
      console.log(data)
      const tempTable = []
      data.clinicAllDetails.map(item => {
        tempTable.push({
          details: item.details,
          key: item.details.id,
          invoice: item.invoice,
        })
      })
      setTableData(tempTable)

      console.log(tempTable, 'tempTable')
    }
    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: error.message,
      })
    }
  }, [data, error])

  console.log(advanceData, advanceLoading, advanceError, 'ainvoi')
  const columns = [
    {
      title: 'Name',
      dataIndex: 'details.schoolName',
    },
    {
      title: 'Billing Name',
    },
    {
      title: 'Invoices',
      dataIndex: 'invoice',
    },
    {
      title: 'Actions',
      render: text => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                setCurrentRow(text)
                // setAdvInvForm(true)
                createAdvanceInvoice({
                  variables: {
                    month: 'April',
                    clinic: selectedRowKeys[0],
                  },
                })
                  .then(res => console.log(res, 'response'))
                  .catch(err => console.log(err, 'erroror'))
              }}
            >
              Adv Invoice +
            </Button>
            <span style={{ borderRight: '1px solid #ccc' }} />
            <Button
              type="link"
              onClick={() => {
                setCurrentRow(text)
                setMonthlyInvForm(true)
              }}
            >
              Monthly Invoice +
            </Button>
            <span style={{ borderRight: '1px solid #ccc' }} />
            <Button
              type="link"
              onClick={() => {
                setCurrentRow(text)
                setMonthlyInvForm(true)
              }}
            >
              Edit <Icon type="edit" />
            </Button>
          </div>
        )
      },
    },
  ]

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }

  const onSelectAll = (e, a, b) => {
    console.log(e, a, b, 'jjjjjjjjjjjkkkkkkkkkkkkkkk ')
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: true,
    onSelectAll: onSelectAll,
  }

  const handleMenuActions = e => {
    if (e.key == 'advanceInvoice') {
      setShowModal(true)
    }
  }

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  )

  const menu = (
    <Menu onClick={e => handleMenuActions(e)}>
      <Menu.Item key="advanceInvoice">
        <PlusOutlined /> Advance invoice
      </Menu.Item>
      <Menu.Item key="monthlyInvoice">
        <PlusOutlined /> Monthly invoice
      </Menu.Item>
      <Menu.Item key="payReminder">
        <MailOutlined /> Send Reminder
      </Menu.Item>
    </Menu>
  )

  const filterHeader = (
    <div
      style={{
        minHeight: '25px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Dropdown overlay={menu}>
        <Button>
          Actions <Icon type="down" />
        </Button>
      </Dropdown>
    </div>
  )

  return (
    <div>
      <Modal
        title="Advance Invoice Duration"
        visible={showModal}
        onOk={() => {
          setShowModal(false)
        }}
        onCancel={() => {
          setShowModal(false)
        }}
        okText="OK"
        cancelText="Cancel"
        width={360}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 15 }}>Months: </span>
          <Input
            value={advInvoiceMonth}
            min={1}
            type="number"
            onChange={e => setAdvInvoiceMonth(e.target.value)}
          ></Input>
        </div>
      </Modal>
      <Drawer
        visible={advInvForm}
        onClose={() => setAdvInvForm(false)}
        width="100vw"
        placement="right"
        closable="true"
        destroyOnClose="true"
      >
        <AdvanceInvoiceForm
          rowData={currentRow}
          invoiceFormDrawer={advInvForm}
          setInvoiceFormDrawer={setAdvInvForm}
        />
      </Drawer>
      <Drawer
        visible={monthlyInvForm}
        onClose={() => setMonthlyInvForm(false)}
        width="100vw"
        placement="right"
        closable="true"
        destroyOnClose="true"
      >
        <MonthlyInvoiceForm
          rowData={currentRow}
          invoiceFormDrawer={monthlyInvForm}
          setInvoiceFormDrawer={setMonthlyInvForm}
        />
      </Drawer>
      <Table
        columns={columns}
        dataSource={tableData}
        rowSelection={rowSelection}
        bordered
        loading={loading}
        title={() => {
          return filterHeader
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '50', '100'],
          position: 'top',
        }}
      />
    </div>
  )
}

export default CustomerList
