/* eslint-disable */
import React, { useEffect, useState, useReducer } from 'react'
import {
  Select,
  Input,
  Typography,
  Button,
  notification,
  Table,
  Menu,
  Icon,
  Dropdown,
  Drawer,
  Modal,
  DatePicker,
} from 'antd'
import { PlusOutlined, MailOutlined } from '@ant-design/icons'
import moment from 'moment'
import { DRAWER } from 'assets/styles/globalStyles'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import AdvanceInvoiceForm from './advanceInvoice'
import MonthlyInvoiceForm from './monthlyInvoice'
import BankDetails from './bankDetails'
import { CLINIC_QUERY, ADVANCE_INVOICE, MONTHLY_INVOICE } from './query'

function CustomerList() {
  const { data, loading, error } = useQuery(CLINIC_QUERY)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [advInvoiceMonth, setAdvInvoiceMonth] = useState(1)
  const [advanceInvoiceModal, setAdvanceInvoiceModal] = useState(false)
  const [monthlyInvoiceModal, setMonthlyInvoiceModal] = useState(false)
  const [payReminderModal, setPayReminderModal] = useState(false)
  const [advInvForm, setAdvInvForm] = useState(false)
  const [monthlyInvForm, setMonthlyInvForm] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const [bankDetailsDrawer, setBankDetailsDrawer] = useState(false)
  const [selectedClinicsName, setSelectedClinicsName] = useState(null)
  const [monthlyMonth, setMonthlyMonth] = useState(moment().subtract(1, 'M'))
  const [advMonth, setAdvMonth] = useState(moment())
  const [
    createAdvanceInvoice,
    { data: advanceData, loading: advanceLoading, error: advanceError },
  ] = useMutation(ADVANCE_INVOICE)

  const [
    createMonthlyInvoice,
    { data: monthlyData, loading: monthlyLoading, error: monthlyError },
  ] = useMutation(MONTHLY_INVOICE)

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
                    cgst: 10,
                    sgst: 8,
                    discount: 2,
                    generateLink: true,
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
                console.log(selectedRowKeys, 'clinics Id')
                setMonthlyInvForm(true)
                createMonthlyInvoice({
                  variables: {
                    month: 'March',
                    clinics: selectedRowKeys,
                    cgst: 10,
                    sgst: 8,
                    discount: 2,
                    generateLink: true,
                  },
                })
                  .then(res => console.log(res, 'response from monthly invoice'))
                  .catch(err => console.log(err, 'monthly error'))
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
    let names = []
    tableData.map(item =>
      selectedRowKeys.map(key => (key === item.key ? names.push(item.details?.schoolName) : null)),
    )
    console.log(names, 'names')
    setSelectedClinicsName(names)
    if (e.key == 'advanceInvoice') {
      setAdvanceInvoiceModal(true)
    } else if (e.key == 'monthlyInvoice') {
      setMonthlyInvoiceModal(true)
    } else if (e.key == 'payReminder') {
      setPayReminderModal(true)
    }
  }

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
        minHeight: '20px',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Dropdown overlay={menu}>
        <Button>
          Actions <Icon type="down" />
        </Button>
      </Dropdown>
      <Button onClick={() => setBankDetailsDrawer(true)}>Bank Details</Button>
    </div>
  )

  return (
    <div style={{ marginTop: 10 }}>
      <Modal
        title="Advance Invoice Duration"
        visible={advanceInvoiceModal}
        onOk={() => {
          setAdvanceInvoiceModal(false)
        }}
        onCancel={() => {
          setAdvanceInvoiceModal(false)
        }}
        okText="OK"
        cancelText="Cancel"
        width={DRAWER.widthL3}
      >
        <div style={{ alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              color: 'black',
            }}
          >
            <div>
              Create <strong>Advance</strong> invoice for selected clinics for month of{' '}
              <b>{advMonth.format('MMMM')}</b>.
            </div>
            <DatePicker.MonthPicker
              size="small"
              style={{ width: 120 }}
              value={advMonth}
              onChange={e => setAdvMonth(e)}
            />
          </div>
          <div>
            <ol style={{ display: 'grid', marginTop: 14, gridTemplateColumns: 'auto auto' }}>
              {selectedClinicsName &&
                selectedClinicsName.map((item, index) => (
                  <li style={{ width: 300, marginBottom: 4 }}>{item}</li>
                ))}
            </ol>
          </div>
        </div>
      </Modal>
      <Modal
        title="Create Monthly Invoice"
        visible={monthlyInvoiceModal}
        className="ant-modals-design"
        onOk={() => {
          setMonthlyInvoiceModal(false)
        }}
        onCancel={() => {
          setMonthlyInvoiceModal(false)
        }}
        okText="OK"
        cancelText="Cancel"
        width={DRAWER.widthL3}
      >
        <div style={{ alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              color: 'black',
            }}
          >
            <div>
              Create <strong>Monthly</strong> invoice for selected clinics for month of{' '}
              <b>{monthlyMonth.format('MMMM')}</b>.
            </div>
            <DatePicker.MonthPicker
              size="small"
              style={{ width: 120 }}
              value={monthlyMonth}
              onChange={e => setMonthlyMonth(e)}
            />
          </div>
          <div>
            <ol style={{ display: 'grid', marginTop: 14, gridTemplateColumns: 'auto auto' }}>
              {selectedClinicsName &&
                selectedClinicsName.map((item, index) => (
                  <li style={{ width: 300, marginBottom: 4 }}>{item}</li>
                ))}
            </ol>
          </div>
        </div>
      </Modal>
      <Modal
        title="Send pay reminder"
        visible={payReminderModal}
        onOk={() => {
          setPayReminderModal(false)
        }}
        onCancel={() => {
          setPayReminderModal(false)
        }}
        okText="OK"
        cancelText="Cancel"
        width={360}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Send pay reminder to the selected clinics for last invoice
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
      <Drawer
        width={DRAWER.widthL2}
        title="Update Payment accepting details"
        visible={bankDetailsDrawer}
        onClose={() => setBankDetailsDrawer(false)}
        destroyOnClose
      >
        <BankDetails setBankDetailsDrawer={setBankDetailsDrawer} />
      </Drawer>
      <Table
        columns={columns}
        dataSource={tableData}
        rowSelection={rowSelection}
        loading={loading}
        bordered
        title={() => {
          return filterHeader
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['20', '30', '50', '100'],
          position: 'bottom',
        }}
      />
    </div>
  )
}

export default CustomerList
