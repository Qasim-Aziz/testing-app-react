import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Form, Select, Button } from 'antd'
import moment from 'moment'
import { FORM, COLORS, SUBMITT_BUTTON } from 'assets/styles/globalStyles'

const { layout, tailLayout } = FORM

function InvoicePayments({ invoiceObj }) {
  const statusList = ['Pending', 'Paid', 'Partially Paid']

  const [selectedStatus, setSelectedStatus] = useState(invoiceObj.status)

  console.log(invoiceObj)
  return (
    <div>
      <Form.Item {...layout} label="Select Status">
        <Select value={selectedStatus}>
          {statusList.map(item => {
            return <Select.Option value={item}>{item}</Select.Option>
          })}
        </Select>
      </Form.Item>
    </div>
  )
}

export default InvoicePayments
