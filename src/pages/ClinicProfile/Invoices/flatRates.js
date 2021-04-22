/* eslint-disable */
import LoadingComponent from 'components/LoadingComponent'
import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import { Form, Input, Button, Row, Col, Modal, Select, notification, Popconfirm } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import {
  GET_STUDENT_INVOICE_FEE,
  CREATE_STUDENT_RATES,
  REMOVE_FEE_ITEM,
  STUDENT_INVOICE_ITEMS,
  UPDATE_STUDENT_RATES,
} from './query'
import './template.scss'
import moment from 'moment'

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
  const [createRates, setCreateRates] = useState(false)
  const [objPk, setObjPk] = useState(null)
  const [invoiceItemsList, setInvoiceItemsList] = useState([])
  const [fetchData, { data, loading, error }] = useLazyQuery(GET_STUDENT_INVOICE_FEE, {
    fetchPolicy: 'no-cache',
  })

  const { data: invoiceItemsData, loading: invoiceItemsLoading } = useQuery(STUDENT_INVOICE_ITEMS)
  const [updateStudentFlatRates, { loading: updateRatesLoading }] = useMutation(
    UPDATE_STUDENT_RATES,
  )
  const [removeFeeItem] = useMutation(REMOVE_FEE_ITEM)
  const [createStudentFlatRates, { loading: createRatesLoading }] = useMutation(
    CREATE_STUDENT_RATES,
  )

  useEffect(() => {
    if (currentRow.key) {
      fetchData({
        variables: {
          student: currentRow.key,
          feeType: 'FLAT',
        },
      })
    }
  }, [currentRow.key])

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
    if (data && data.getStudentInvoiceFee?.edges.length > 0) {
      const tempFeeDetails = []
      data.getStudentInvoiceFee.edges[0].node.flatItems.edges.map(({ node }) => {
        tempFeeDetails.push({
          pk: node.id,
          flatRate: node.flatRate,
          id: node.item.id,
          name: node.item.name,
        })
      })
      setObjPk(data.getStudentInvoiceFee.edges[0].node.id)
      setFeeItems(tempFeeDetails)
      setCreateRates(false)
    } else if (data && data.getStudentInvoiceFee?.edges.length === 0) {
      setObjPk(null)
      setFeeItems([])
      setCreateRates(true)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      return notification.error({
        message: 'Something went wrong',
      })
    }
  }, [error])

  const handleCreate = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && currentRow.key) {
        const ratesList = []

        feeItems.map(feeItem => {
          ratesList.push({ item: feeItem.id, flatRate: Number(values[feeItem.name]) })
        })

        createStudentFlatRates({
          variables: {
            student: currentRow.key,
            feeType: 'FLAT',
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment()
              .add(1, 'M')
              .format('YYYY-MM-DD'),
            gstApplicable: true,
            flatItems: ratesList,
            hourlyItems: [],
          },
        })
          .then(res => {
            notification.success({
              message: 'Rates added successfully',
            })
            closeDrawer(false)
          })
          .catch(err => console.error(err))
      }
    })
  }

  const handleUpdate = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && objPk) {
        const ratesList = []

        feeItems.map(feeItem => {
          ratesList.push(
            feeItem.pk
              ? {
                  pk: feeItem.pk,
                  item: feeItem.id,
                  flatRate: Number(values[feeItem.name]),
                }
              : { item: feeItem.id, flatRate: Number(values[feeItem.name]) },
          )
        })

        updateStudentFlatRates({
          variables: {
            pk: objPk,
            flatItems: ratesList,
            hourlyItems: [],
          },
        })
          .then(res => {
            notification.success({
              message: 'Rates updated successfully',
            })
            closeDrawer(false)
          })
          .catch(err => console.log(err))
      }
    })
  }

  const handleRemove = obj => {
    if (obj && obj.pk && objPk) {
      removeFeeItem({
        variables: {
          pk: objPk,
          removeFlatItems: [obj.pk],
          removeHourlyItems: [],
        },
      })
        .then(res => {
          let tempList = []
          tempList = feeItems.filter(item => obj.id !== item.id)
          setFeeItems(tempList)
        })
        .catch(err => console.error(err))
    } else if (obj) {
      let tempList = []
      tempList = feeItems.filter(item => obj.id !== item.id)
      setFeeItems(tempList)
    }
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div>
      <div
        style={{
          margin: '20px auto 20px',
          width: '100%',
          display: 'flex',
          justifyContent: feeItems.length === 0 ? 'center' : 'flex-end',
        }}
      >
        <Button onClick={() => setFeeListModal(true)} type="primary">
          + Add Item
        </Button>
      </div>
      {feeItems && feeItems.length > 0 ? (
        <Form {...layout} onSubmit={createRates ? handleCreate : handleUpdate}>
          {feeItems.map((item, index) => {
            return (
              <Row key={item.id}>
                <Col span={23}>
                  <Form.Item {...layout} label={item.name}>
                    {form.getFieldDecorator(`${item.name}`, {
                      initialValue: item.flatRate,
                      rules: [{ required: true, message: 'Please provide rate!' }],
                    })(<Input type="number" />)}
                  </Form.Item>
                </Col>
                <Col span={1}>
                  <Popconfirm
                    onConfirm={() => handleRemove(item)}
                    title="Are you sure to remove this item?"
                    placement="topRight"
                    okText="Yes"
                    cancelText="No"
                    trigger="click"
                  >
                    <Button style={{ paddingRight: 0 }} type="link">
                      <MinusCircleOutlined style={{ fontSize: 24, marginTop: 4 }} />
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            )
          })}
          <Form.Item {...tailLayout}>
            <Button
              loading={updateRatesLoading || createRatesLoading}
              type="primary"
              style={SUBMITT_BUTTON}
              htmlType="submit"
            >
              {createRates ? 'Create' : 'Update'}
            </Button>
            <Button type="ghost" style={CANCEL_BUTTON} onClick={() => closeDrawer(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      ) : null}

      <Modal
        title="Add Fee Items"
        visible={feeListModal}
        width={600}
        height={220}
        destroyOnClose
        onOk={() => {
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
            loading={invoiceItemsLoading}
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
