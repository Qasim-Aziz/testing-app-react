import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Table, Button, Form, Modal, Input, notification } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent/index'
import { STUDENT_INVOICE_ITEMS, CREATE_STUDENT_INVOICE_ITEM } from './query'

function InvoiceListItems() {
  const [tableData, setTableData] = useState(null)
  const [feeItemModal, setFeeItemModal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [itemName, setItemName] = useState()

  const { data: invoiceFeeItems, loading: invoiceFeeItemsLoading, refetch } = useQuery(
    STUDENT_INVOICE_ITEMS,
  )
  const [createStudentInvoiceItem, { loading: createStudentInvoiceItemLoading }] = useMutation(
    CREATE_STUDENT_INVOICE_ITEM,
  )

  useEffect(() => {
    if (invoiceFeeItems) {
      setTableData(invoiceFeeItems.getStudentInvoiceItems)
    }
  }, [invoiceFeeItems])

  const columns = [
    {
      title: 'Sr No.',
      render: row => tableData.indexOf(row) + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Action',
      render: row => {
        return (
          <>
            {/* <Button type="link">
              <EditOutlined />
            </Button>
            <Button type="link" style={{ color: COLORS.danger }}>
              <DeleteOutlined />
            </Button> */}
          </>
        )
      },
    },
  ]

  const handleOk = () => {
    setConfirmLoading(true)

    console.log(itemName)
    createStudentInvoiceItem({
      variables: {
        name: itemName,
      },
    })
      .then(res => {
        console.log(res, 'response')
        notification.success({
          message: 'Fee Item added successfully',
        })
        refetch()
        setFeeItemModal(false)
      })
      .catch(err => console.error(err))
  }

  console.log(tableData, 'tablDara')

  return (
    <div>
      <Modal
        title="Create Fee Item"
        visible={feeItemModal}
        destroyOnClose
        onOk={handleOk}
        confirmLoading={createStudentInvoiceItemLoading}
        onCancel={() => setFeeItemModal(false)}
        okText="Create"
      >
        <div>
          <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="Name" required>
            <Input
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Enter fee item name"
            />
          </Form.Item>
        </div>
      </Modal>
      <div style={{ paddingBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => setFeeItemModal(true)} type="primary">
          + Add Invoice Item
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={invoiceFeeItemsLoading}
        columns={columns}
        dataSource={tableData}
        bordered
        pagination={false}
      />
    </div>
  )
}

export default InvoiceListItems
