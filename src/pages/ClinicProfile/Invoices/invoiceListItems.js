import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Table, Button, Form } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent/index'
import { STUDENT_INVOICE_ITEMS } from './query'

function InvoiceListItems() {
  const { data: invoiceFeeItems, loading: invoiceFeeItemsLoading } = useQuery(STUDENT_INVOICE_ITEMS)
  const [tableData, setTableData] = useState(null)

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
          <Button type="link" style={{ color: COLORS.danger }}>
            <DeleteOutlined /> Delete
          </Button>
        )
      },
    },
  ]
  console.log(tableData)
  return (
    <div>
      <Table loading={invoiceFeeItemsLoading} columns={columns} dataSource={tableData} bordered />
    </div>
  )
}

export default InvoiceListItems
