/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, notification, Table, Menu, Icon, Dropdown, Drawer, Form } from 'antd'
import { PlusOutlined, MailOutlined } from '@ant-design/icons'
import { DRAWER, COLORS, FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { useMutation, useQuery } from 'react-apollo'
import { STUDENTS } from './Queries'
import CreateInvoiceForm from './createInvoicesForm'

const { layout, tailLayout } = FORM

function CustomerList() {
  const { data, loading, error } = useQuery(STUDENTS)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [createInvoiceDrawer, setCreateInvoiceDrawer] = useState(false)
  const [payReminderModal, setPayReminderModal] = useState(false)
  const [selectedClinicsName, setSelectedClinicsName] = useState(null)
  const [invoiceType, setInvoiceType] = useState('advance')

  useEffect(() => {
    if (data) {
      console.log(data, 'THIS IS DATA')
      const tempTable = []
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
      title: 'Invoices',
      dataIndex: 'invoices',
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
      selectedRowKeys.map(key =>
        key === item.key
          ? names.push(`${item.firstname} ${item.lastname ? item.lastname : ''}`)
          : null,
      ),
    )
    console.log(names, 'names')
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
        justifyContent: 'flex-start',
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
          selectedClinicsName={selectedClinicsName}
          selectedRowKeys={selectedRowKeys}
          invoiceType={invoiceType}
          closeDrawer={() => setCreateInvoiceDrawer(false)}
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
