/* eslint-disable */
import React, { useEffect, useState, useReducer } from 'react'
import {
  Button,
  notification,
  Table,
  Menu,
  Icon,
  Dropdown,
  Drawer,
  Modal,
  DatePicker,
  Form,
} from 'antd'
import { PlusOutlined, MailOutlined } from '@ant-design/icons'
import { DRAWER, COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import AdvanceInvoiceForm from './advanceInvoiceForm'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import MonthlyInvoiceForm from './monthlyInvoice'
import BankDetails from './bankDetails'
import { CLINIC_QUERY, ITEM } from './query'
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
  const [invoiceType, setInvoiceType] = useState('advance')

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
      title: 'Debit',
    },
    {
      title: 'Credit',
    },
  ]

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const handleMenuActions = e => {
    let names = []
    tableData.map(item =>
      selectedRowKeys.map(key => (key === item.key ? names.push(item.details?.schoolName) : null)),
    )
    console.log(names, 'names')
    setSelectedClinicsName(names)
    if (e.key == 'advanceInvoice') {
      setInvoiceType('advance')
      setAdvanceInvoiceModal(true)
    } else if (e.key == 'monthlyInvoice') {
      setInvoiceType('monthly')
      setAdvanceInvoiceModal(true)
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
          <Form.Item {...layout} label="Selected Clinics">
            {selectedClinicsName && selectedClinicsName?.length > 0 ? (
              <>
                <div>
                  <ol style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                    {selectedClinicsName &&
                      selectedClinicsName.map((item, index) => (
                        <li style={{ width: 340 }}>{item}</li>
                      ))}
                  </ol>
                </div>
              </>
            ) : (
              <b>None, Please select at least one clinic</b>
            )}
            <div style={{ alignItems: 'center' }}>
              <div>
                <b>Send Pay reminder to the selected clinics for the last invoice </b>
              </div>
            </div>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="default" style={SUBMITT_BUTTON}>
              Send Reminder
            </Button>
            <Button onClick={() => setPayReminderModal(false)} type="ghost" style={CANCEL_BUTTON}>
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Drawer>

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
