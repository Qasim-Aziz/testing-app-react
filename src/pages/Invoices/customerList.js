/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { Button, notification, Table, Menu, Icon, Dropdown, Drawer, Form } from 'antd'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { PlusOutlined, MailOutlined } from '@ant-design/icons'
import { DRAWER, COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import AdvanceInvoiceForm from './advanceInvoiceForm'
import BankDetails from './bankDetails'
import UpdateClinicRates from '../allClinicData/updateClinicRates'
import { CLINIC_QUERY, PAYMENT_REMINDER } from './query'
import InvoiceTable from '../allClinicData/invoiceTable'

const { layout, tailLayout } = FORM

function CustomerList() {
  const { data, loading, error } = useQuery(CLINIC_QUERY)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [advanceInvoiceModal, setAdvanceInvoiceModal] = useState(false)
  const [payReminderModal, setPayReminderModal] = useState(false)
  const [advInvForm, setAdvInvForm] = useState(false)
  const [monthlyInvForm, setMonthlyInvForm] = useState(false)
  const [invoiceDrawer, setInvoiceDrawer] = useState(false)
  const [currentRow, setCurrentRow] = useState(null)
  const [drawerTitle, setDrawerTitle] = useState(null)
  const [bankDetailsDrawer, setBankDetailsDrawer] = useState(false)
  const [selectedClinicsName, setSelectedClinicsName] = useState(null)
  const [currentClinicRow, setCurrentClinicRow] = useState()
  const [invoiceType, setInvoiceType] = useState('advance')
  const [ratesDrawer, setRatesDrawer] = useState(false)

  const [sendPaymentReminder, { loading: sendPaymentReminderLoading }] = useMutation(
    PAYMENT_REMINDER,
  )

  useEffect(() => {
    if (data) {
      const tempTable = []
      data.clinicAllDetails.map(item => {
        tempTable.push({
          details: item.details,
          key: item.details.id,
          invoice: item.invoice,
        })
      })
      setTableData(tempTable)
    }
    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: error.message,
      })
    }
  }, [data, error])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'details.schoolName',
    },
    {
      title: 'Billing Name',
    },
    {
      title: 'Debit',
    },
    {
      title: 'Credit',
    },
    {
      title: 'Invoices',
      dataIndex: 'invoice',
      render: (e, row) => (
        <Button
          onClick={() => {
            setCurrentRow(row)
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
      title: 'Action',
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

  const onSelectChange = selectedKeys => {
    setSelectedRowKeys(selectedKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const handlePaymentReminder = () => {
    const clinicIds = selectedClinicsName.map(item => item.key)
    sendPaymentReminder({
      variables: {
        clinics: clinicIds,
      },
    })
      .then(res => {
        notification.success({
          message: 'Payment reminders send successfully',
        })
      })
      .catch(err => console.error(err))
  }

  const handleMenuActions = e => {
    const names = []
    tableData.map(item =>
      selectedRowKeys.map(key =>
        key === item.key ? names.push({ name: item.details?.schoolName, key: item.key }) : null,
      ),
    )
    setSelectedClinicsName(names)
    if (e.key === 'advanceInvoice') {
      setInvoiceType('advance')
      setAdvanceInvoiceModal(true)
    } else if (e.key === 'monthlyInvoice') {
      setInvoiceType('monthly')
      setAdvanceInvoiceModal(true)
    } else if (e.key === 'payReminder') {
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
      <Drawer
        title={`Create ${invoiceType === 'advance' ? 'advance' : 'monthly'} invoice`}
        width={DRAWER.widthL2}
        visible={advanceInvoiceModal}
        closable
        destroyOnClose
        onClose={() => setAdvanceInvoiceModal(false)}
      >
        <AdvanceInvoiceForm
          selectedClinicsName={selectedClinicsName}
          selectedRowKeys={selectedRowKeys}
          invoiceType={invoiceType}
          closeDrawer={() => setAdvanceInvoiceModal(false)}
        />
      </Drawer>

      <Drawer
        title="Send pay reminder"
        visible={payReminderModal}
        closable
        destroyOnClose
        onClose={() => {
          setPayReminderModal(false)
        }}
        width={DRAWER.widthL2}
      >
        <div>
          {selectedClinicsName && selectedClinicsName?.length > 0 ? (
            <>
              <Form.Item {...layout} label="Selected Clinics">
                <div>
                  <ol style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                    {selectedClinicsName &&
                      selectedClinicsName.map((item, index) => (
                        <li key={item.id} style={{ width: 340 }}>
                          {item.name}
                        </li>
                      ))}
                  </ol>
                </div>
                <div style={{ alignItems: 'center' }}>
                  <div>
                    <b>Send Pay reminder to the selected clinics for the last invoice </b>
                  </div>
                </div>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  loading={sendPaymentReminderLoading}
                  type="default"
                  onClick={() => handlePaymentReminder()}
                  style={SUBMITT_BUTTON}
                >
                  Send Reminder
                </Button>
                <Button
                  onClick={() => setPayReminderModal(false)}
                  type="ghost"
                  style={CANCEL_BUTTON}
                >
                  Cancel
                </Button>
              </Form.Item>
            </>
          ) : (
            <b>None, Please select at least one clinic</b>
          )}
        </div>
      </Drawer>

      <Drawer
        title={`${drawerTitle}: Maintain Rates`}
        width={DRAWER.widthL3}
        placement="right"
        closable="true"
        onClose={() => setRatesDrawer(false)}
        visible={ratesDrawer}
        destroyOnClose="true"
      >
        <UpdateClinicRates
          rowData={currentClinicRow}
          ratesDrawer={ratesDrawer}
          closeDrawer={() => setRatesDrawer(false)}
        />
      </Drawer>
      <Drawer
        title={`${drawerTitle}: Invoices`}
        width={DRAWER.widthL1}
        visible={invoiceDrawer}
        onClose={() => setInvoiceDrawer(false)}
        placement="right"
        closable="true"
        destroyOnClose="true"
      >
        <InvoiceTable
          rowData={currentRow}
          invoiceFormDrawer={invoiceDrawer}
          setInvoiceFormDrawer={setInvoiceDrawer}
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
