/* eslint-disable */
import LoadingComponent from 'components/LoadingComponent'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Form, Input, Button, Row, Col, Modal, Select } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import {
  GET_STUDENT_FEE_DETAILS,
  GET_STUDENT_INVOICE_FEE,
  STUDENT_INVOICE_ITEMS,
  UPDATE_STUDENT_FLAT_RATES,
} from './query'
import './template.scss'

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
  const [feeListModal, setFeeListModal] = useState(false)
  const [selected, setSelected] = useState([])
  const [feeItems, setFeeItems] = useState([])
  const [invoiceItemsList, setInvoiceItemsList] = useState([])
  const { data, loading, error } = useQuery(GET_STUDENT_FEE_DETAILS, {
    variables: {
      id: currentRow.key,
    },
  })
  const { data: invoiceItemsData, loading: invoiceItemsLoading } = useQuery(STUDENT_INVOICE_ITEMS)
  const [updateStudentFlatRates] = useMutation(UPDATE_STUDENT_FLAT_RATES)

  useEffect(() => {
    if (invoiceItemsData) {
      let tempList = invoiceItemsData.getStudentInvoiceItems
      tempList = tempList.filter(item => {
        for (let i = 0; i < feeItems.length; i++) {
          if (feeItems[i].id === item.id) {
            return false
          }
        }
        return true
      })
      setInvoiceItemsList(tempList)
    }
  }, [invoiceItemsData, feeItems])

  useEffect(() => {
    if (data && data.getStudentInvoiceFeeDetails?.flatItems) {
      const tempFeeDetails = []
      data.getStudentInvoiceFeeDetails.flatItems.edges.map(({ node }) => {
        console.log(node)
        tempFeeDetails.push({
          pk: node.id,
          flatRate: node.flatRate,
          id: node.item.id,
          name: node.item.name,
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
      if (!error && currentRow.key) {
        const ratesList = []
        console.log(values, feeItems)
        feeItems.map(feeItem => {
          ratesList.push(
            feeItem.pk
              ? {
                  pk: feeItem.pk,
                  item: feeItem.id,
                  flatRates: values[feeItem.name],
                }
              : { item: feeItem.id, flatRates: values[feeItem.name] },
          )
        })
        console.log(ratesList, 'rates')
        updateStudentFlatRates({
          variable: {
            student: currentRow.key,
            feeType: 'FLAT',
            flatItems: feeItems,
          },
        }).then(res => console.log(res, 'res'))
      }
    })
  }

  console.log(currentRow, 'currentRow')

  if (loading) {
    return <LoadingComponent />
  }

  console.log(selected, 'selected')
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
                <Form.Item {...layout} label={item.name}>
                  {form.getFieldDecorator(`${item.name}`, {
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
        title="Add Fee Items"
        visible={feeListModal}
        width={600}
        height={220}
        destroyOnClose
        onOk={() => {
          console.log(selected)
          const temp = []
          selected.map(item => {
            for (let i = 0; i < invoiceItemsList.length; i++) {
              if (invoiceItemsList[i].id === item) {
                temp.push({ id: invoiceItemsList[i].id, name: invoiceItemsList[i].name })
              }
            }
            setFeeItems([...feeItems, ...temp])
          })
          setFeeListModal(false)
        }}
        onCancel={() => setFeeListModal(false)}
      >
        <div style={{ height: 230 }}>
          <span style={{ color: 'black', marginRight: 8, width: 140 }}>Select Fee Items: </span>
          <Select
            onChange={e => setSelected(e)}
            mode="multiple"
            style={{ width: 380 }}
            placeholder="Select Fee Item"
          >
            {invoiceItemsList.map(item => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              )
            })}
          </Select>
        </div>
      </Modal>
    </div>
  )
}

export default Form.create()(FlatRates)
