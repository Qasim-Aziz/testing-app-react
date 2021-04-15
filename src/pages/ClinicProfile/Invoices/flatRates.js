/* eslint-disable */
import LoadingComponent from 'components/LoadingComponent'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Form, Input, Button, Row, Col, Modal, Select } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import { GET_STUDENT_FEE_DETAILS, GET_STUDENT_INVOICE_FEE, STUDENT_INVOICE_ITEMS } from './Queries'
import './template.scss'
import { id } from 'chartjs-plugin-annotation'

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 17,
  },
}

function FlatRates({ form, closeDrawer, currentRow }) {
  const [feeItems, setFeeItems] = useState([])
  const { data, loading, error } = useQuery(GET_STUDENT_FEE_DETAILS)
  const { data: invoiceItemsData, loading: invoiceItemsLoading } = useQuery(STUDENT_INVOICE_ITEMS)
  const [feeListModal, setFeeListModal] = useState(false)
  const [invoiceItemsList, setInvoiceItemsList] = useState([])

  useEffect(() => {
    if (invoiceItemsData) {
      const tempList = []
      setInvoiceItemsList(invoiceItemsData.getStudentInvoiceItems)
    }
  }, [invoiceItemsData])

  console.log(invoiceItemsList, 'invoiceItems List')
  useEffect(() => {
    if (data && data.getStudentInvoiceFeeDetails?.flatItems) {
      const tempFeeDetails = []
      data.getStudentInvoiceFeeDetails.flatItems.edges.map(({ node }) => {
        console.log(node)
        tempFeeDetails.push({
          key: node.id,
          flatRate: node.flatRate,
          feeItem: node.item,
        })
      })

      setFeeItems(tempFeeDetails)
    }
  }, [data])

  const handleRateChange = (index, e) => {
    let tempList = feeItems
    tempList[index].flatRate = e.target.value
    setFeeItems(tempList)
  }

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        console.log(values, 'values')
      }
    })
  }
  console.log(data, loading, error)

  if (loading) {
    return <LoadingComponent />
  }

  console.log(feeItems)
  return (
    <div>
      <div
        style={{
          margin: '20px auto 20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={() => setFeeListModal(true)} type="primary">
          + Add Item
        </Button>
      </div>
      <Form {...layout} onSubmit={handleSubmitt}>
        {feeItems.map((item, index) => {
          return (
            <Row>
              <Col span={23}>
                <Form.Item {...layout} label={item.feeItem.name}>
                  {form.getFieldDecorator(`${item.feeItem.name}`, {
                    initialValue: item.flatRate,
                    rules: [{ required: true, message: 'Please provide rate!' }],
                  })(<Input type="number" />)}
                </Form.Item>
              </Col>
              <Col span={1}>
                <Button style={{ paddingRight: 0 }} type="link">
                  <MinusCircleOutlined style={{ fontSize: 24, marginTop: 4 }} />
                </Button>
              </Col>
            </Row>
          )
        })}
        <Form.Item {...tailLayout}>
          <Button type="primary" style={SUBMITT_BUTTON} htmlType="submit">
            Submit
          </Button>
          <Button type="ghost" style={CANCEL_BUTTON} onClick={() => closeDrawer(false)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Title"
        visible={feeListModal}
        onOk={() => setFeeListModal(false)}
        onCancel={() => setFeeListModal(false)}
      >
        <Select style={{ width: '100%', marginBottom: 100 }} placeholder="Select Invoice Item">
          {invoiceItemsList.map(item => {
            return (
              <Select.Option key={item.key} value={item.key}>
                {item.name}
              </Select.Option>
            )
          })}
        </Select>
      </Modal>
    </div>
  )
}

export default Form.create()(FlatRates)
