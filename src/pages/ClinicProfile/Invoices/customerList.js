/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, notification, Table, Menu, Icon, Dropdown, Drawer, Form, Tooltip } from 'antd'
import { PlusOutlined, MailOutlined, TransactionOutlined } from '@ant-design/icons'
import { DRAWER, COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { useMutation, useQuery } from 'react-apollo'
import { STUDENTS, STUDENT_INVOICE_ITEMS, CREATE_STUDENT_INVOICE } from './query'
import CreateInvoiceForm from './createInvoicesForm'
import LoadingComponent from 'components/LoadingComponent'
import MaintainRates from './maintainRates'
import InvoiceListItems from './invoiceListItems'

const { layout, tailLayout } = FORM

function CustomerList() {
  const { data, loading, error, refetch: refetchStudents } = useQuery(STUDENTS)
  const [currentRow, setCurrentRow] = useState(null)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [createInvoiceDrawer, setCreateInvoiceDrawer] = useState(false)
  const [payReminderModal, setPayReminderModal] = useState(false)
  const [selectedClinicsName, setSelectedClinicsName] = useState(null)
  const [invoiceItemsDrawer, setInvoiceItemsDrawer] = useState(false)
  const [maintainRatesDrawer, setMaintainRatesDrawer] = useState(false)
  const [invoiceType, setInvoiceType] = useState('advance')

  console.log(data, 'daya')

  // console.log(invoiceItemsData, 'item data')
  useEffect(() => {
    if (data) {
      // console.log(data, 'THIS IS DATA')
      const tempTable = []
      // console.log(data.students)
      data.students?.edges.map(item => {
        tempTable.push({
          key: item.node.id,
          firstname: item.node.firstname,
          lastname: item.node.lastname,
          invoices: item.node.invoiceSet?.edges?.length,
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
      dataIndex: 'firstName',
      render: (text, row) => (
        <span>
          {row.firstname} {row.lastname}
        </span>
      ),
    },
    {
      title: 'Debit',
    },
    {
      title: 'Credit',
    },
    {
      title: 'Invoices',
      dataIndex: 'invoices',
    },
    {
      title: 'Actions',
      render: row => {
        return (
          <>
            <Tooltip title="Maintain Rates" trigger="hover">
              <Button
                onClick={() => {
                  setMaintainRatesDrawer(true)
                  setCurrentRow(row)
                }}
                style={{ padding: 0, marginRight: 10 }}
                type="link"
              >
                Maintain Rates
              </Button>
            </Tooltip>
            <Button
              onClick={() => {
                setCurrentRow(row)
                setCreateInvoiceDrawer(true)
              }}
              style={{ padding: 0 }}
              type="link"
            >
              + Add Invoice
            </Button>
          </>
        )
      },
    },
  ]

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const handleMenuActions = e => {
    let names = []
    tableData.map(item =>
      selectedRowKeys.map(key =>
        key === item.key
          ? names.push(`${item.firstname} ${item.lastname ? item.lastname : ''}`)
          : null,
      ),
    )

    setSelectedClinicsName(names)
    if (e.key == 'advanceInvoice') {
      setInvoiceType('advance')
      setCreateInvoiceDrawer(true)
    } else if (e.key == 'monthlyInvoice') {
      setInvoiceType('monthly')
      setCreateInvoiceDrawer(true)
    } else if (e.key == 'payReminder') {
      setPayReminderModal(true)
    }
  }

  console.log(tableData, 'tabldata')

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
        justifyContent: 'flex-end',
      }}
    >
      {/* <Dropdown overlay={menu}>
        <Button>
          Actions <Icon type="down" />
        </Button>
      </Dropdown> */}
      <Button onClick={() => setInvoiceItemsDrawer(true)}>Invoice Items</Button>
    </div>
  )

  return (
    <div style={{ marginTop: 10 }}>
      <Drawer
        title={`Create ${invoiceType === 'advance' ? 'advance' : 'monthly'} invoice`}
        width={DRAWER.widthL2}
        visible={createInvoiceDrawer}
        closable
        destroyOnClose
        onClose={() => setCreateInvoiceDrawer(false)}
      >
        <CreateInvoiceForm
          studentId={currentRow?.key}
          closeDrawer={() => setCreateInvoiceDrawer(false)}
          refetchStudents={refetchStudents}
        />
      </Drawer>
      <Drawer
        title="Invoice Items"
        width={DRAWER.widthL2}
        visible={invoiceItemsDrawer}
        closable
        destroyOnClose
        onClose={() => setInvoiceItemsDrawer(false)}
      >
        <InvoiceListItems closeDrawer={() => setInvoiceItemsDrawer(false)} />
      </Drawer>
      <Drawer
        title={`${currentRow?.firstname}'s - Rates`}
        width={DRAWER.widthL2}
        visible={maintainRatesDrawer}
        closable
        destroyOnClose
        onClose={() => setMaintainRatesDrawer(false)}
      >
        <MaintainRates
          selectedClinicsName={selectedClinicsName}
          selectedRowKeys={selectedRowKeys}
          invoiceType={invoiceType}
          currentRow={currentRow}
          closeDrawer={() => setMaintainRatesDrawer(false)}
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
