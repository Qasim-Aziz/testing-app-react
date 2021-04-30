/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */

import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Form,
  Select,
  Input,
  Table,
  Typography,
  Button,
  notification,
  DatePicker,
  Modal,
  Checkbox,
  Tooltip,
  Popconfirm,
} from 'antd'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import moment from 'moment'
import { CANCEL_BUTTON, COLORS, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import { CreateProductForm } from 'components/invoice/InvoiceProductsTable'
import client from 'apollo/config'
import 'components/invoice/invoiceForm.scss'
import '../../allClinicData/allClinicData.scss'
import './template.scss'
import {
  GET_INVOICE_STATUS_LIST,
  PRODUCT_LIST,
  GENERATE_LINK,
  UPDATE_STUDENT_INVOICE,
  GET_INVOICE,
  STUDENT_INVOICE_ITEMS,
} from './query'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

const amParent = {
  display: 'flex',
  color: 'black',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
}
const gen = {
  fontSize: 18,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  textAlign: 'right',
}
const amLabel = {
  ...gen,
  width: '180px',
  margin: 'auto 10px',
}
const amStyle = {
  ...gen,
  marginLeft: 20,
  minWidth: '150px',
  margin: 'auto 0',
}

function getTotal(subTotal, discount = 0, cgst = 0, sgst = 0, tax = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(cgst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(tax || 0),
  ).toFixed(2)
}

const roundNumber = (num, digitFigure) => {
  return Number(Number(num).toFixed(digitFigure))
}

const EditableContext = React.createContext(null)
const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form} key={index}>
      <tr {...props} />
    </EditableContext.Provider>
  )
}

const EditableFormRow = Form.create()(EditableRow)

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  const { data: productDataNew, loading: productLoadingNew } = useQuery(STUDENT_INVOICE_ITEMS)
  const { data: productDataOld, loading: productLoadingOld } = useQuery(PRODUCT_LIST)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave(record, values)
    } catch (errInfo) {
      notification.error({
        message: 'Unable to edit this field',
      })
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <div className="table-input-field">
        {title === 'Service' ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
          >
            {form.getFieldDecorator(title.toLowerCase(), {
              initialValue: record[title.toLowerCase()],
              rules: [{ required: true, message: 'Please give service' }],
            })(
              <Select
                ref={inputRef}
                loading={productLoadingNew || productLoadingOld}
                placeholder="Please select a product"
                onPressEnter={save}
                onBlur={save}
              >
                {record.newItem
                  ? productDataNew?.getStudentInvoiceItems.map(({ id, name }) => {
                      return (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      )
                    })
                  : productDataOld?.invoiceProductsList.map(({ id, name }) => {
                      return (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      )
                    })}
              </Select>,
            )}
          </Form.Item>
        ) : title === 'Quantity' ? (
          <Form.Item style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
            {form.getFieldDecorator('qty', {
              initialValue: record.qty,
              rules: [
                {
                  required: true,
                  message: 'Please give product quantity',
                },
              ],
            })(
              <Input
                style={{ width: '100%', textAlign: 'right', alignSelf: 'flex-end' }}
                ref={inputRef}
                type="number"
                step={false}
                min={0}
                onPressEnter={save}
                onBlur={save}
                placeholder={`Give product ${title}`}
              />,
            )}
          </Form.Item>
        ) : (
          <Form.Item style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
            {form.getFieldDecorator('rate', {
              initialValue: record.rate,
              rules: [
                {
                  required: true,
                  message: 'Please give product quantity',
                },
              ],
            })(
              <Input
                style={{ width: '100%', textAlign: 'right', alignSelf: 'flex-end' }}
                ref={inputRef}
                type="number"
                min={0}
                onPressEnter={save}
                onBlur={save}
                placeholder="Give product rate"
              />,
            )}
          </Form.Item>
        )}
      </div>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const EditInvoiceForm = ({ form, invoiceId, closeDrawer, refetchInvoices }) => {
  const [subTotal, setSubTotal] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState('₹')
  const [tableData, setTableData] = useState([])
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [productList, setProductList] = useState([])
  const [addCgst, setAddCgst] = useState(true)
  const [addSgst, setAddSgst] = useState(true)
  const [isIndian, setIsIndian] = useState(true)
  const { data: statusData, loading: statusLoading } = useQuery(GET_INVOICE_STATUS_LIST)
  const [createProModal, setCreateProModal] = useState(false)
  const [lastInvoiceAmount, setLastInvoiceAmount] = useState(null)

  const { data: invoiceData, loading, error } = useQuery(GET_INVOICE, {
    variables: {
      id: invoiceId,
    },
  })

  const { data: productDataNew, loading: productLoadingNew } = useQuery(STUDENT_INVOICE_ITEMS)
  const { data: productDataOld, loading: productLoadingOld } = useQuery(PRODUCT_LIST)

  const [updateStudentInvoice, { loading: updateStudentInvoiceLoading }] = useMutation(
    UPDATE_STUDENT_INVOICE,
  )

  useEffect(() => {
    if (invoiceData) {
      setInvoiceDetails(invoiceData.invoiceDetail)
      if (
        invoiceData.invoiceDetail.invoiceFee &&
        invoiceData.invoiceDetail.invoiceFee.edges.length > 0
      ) {
        const tempList = invoiceData.invoiceDetail.invoiceFee.edges.map(({ node }) => {
          return {
            key: Math.random(),
            service: node.schoolServices?.id,
            qty: node.quantity,
            rate: node.rate,
            amount: roundNumber(Number(node.quantity) * Number(node.rate), 2),
          }
        })
        calculateTotal(tempList)
        setTableData(tempList)
      }
    }
  }, [invoiceData])

  useEffect(() => {
    if (productDataNew && productDataOld) {
      setProductList([
        ...productDataNew?.getStudentInvoiceItems,
        ...productDataOld.invoiceProductsList,
      ])
    }
  }, [productDataNew, productDataOld])

  const generatePaymentLink = id => {
    try {
      const res = client.mutate({
        mutation: GENERATE_LINK,
        variables: {
          pk: [id],
        },
      })
      notification.success({
        message: 'Send Successfully',
        description: 'Payment link send successfully to the clinic email',
      })
    } catch (err) {
      notification.error({
        message: 'Unable to send payment link',
      })
    }
  }

  const handleSave = (row, data) => {
    const newData = [...tableData]
    const index = newData.findIndex(item => row.key === item.key)
    newData[index] = { ...row, ...data }

    let tempTotal = 0
    newData.map(item => {
      tempTotal += roundNumber(Number(item.rate) * Number(item.qty), 2)
    })
    setSubTotal(roundNumber(tempTotal, 2))
    setTableData(newData)
  }

  // console.log(productList, 'prl list')

  const calculateTotal = tempList => {
    let tempTotal = 0
    tempList.forEach(node => {
      tempTotal += roundNumber(Number(node.qty) * Number(node.rate), 2)
    })
    if (lastInvoiceAmount === null) {
      const { discount: ds, cgst: cg, sgst: sg, tax: tx, total } = invoiceData.invoiceDetail
      const tt = total - getTotal(tempTotal, ds, cg, sg, tx)
      const dd = tt < 1 && tt > -1 ? 0 : tt
      setLastInvoiceAmount(roundNumber(dd, 2))
    }
    setSubTotal(roundNumber(tempTotal, 3))
  }

  const handleDelete = row => {
    const tempTableData = [...tableData]
    for (let i = 0; i < tempTableData.length; i++) {
      if (tempTableData[i].key === row.key) {
        tempTableData.splice(i, 1)
      }
    }
    calculateTotal(tempTableData)
    setTableData(tempTableData)
  }

  const handleAdd = () => {
    const newProductData = {
      key: Math.random(),
      service: productList[0].id,
      qty: 1,
      rate: 0,
      newItem: true,
      amount: roundNumber(1 * 0, 3),
    }
    setTableData(row => [...row, newProductData])
  }

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err && invoiceId) {
        // console.log(values, values.cgst, values.sgst, tableData, 'rowData in invoice form')
        updateStudentInvoice({
          variables: {
            pk: invoiceId,
            email: values.email,
            status:
              values.status === 'SW52b2ljZVN0YXR1c1R5cGU6Mg==' &&
              invoiceDetails.linkGenerated === true
                ? 'SW52b2ljZVN0YXR1c1R5cGU6NA=='
                : values.status,
            issueDate: moment(values.issueDate).format('YYYY-MM-DD'),
            dueDate: moment(values.dueDate).format('YYYY-MM-DD'),
            address: values.address,
            taxableSubtotal: parseFloat(subTotal),
            amount: parseFloat(subTotal),
            discount: parseFloat(values.discount),
            sgst: addSgst ? parseFloat(values.sgst) : 0,
            cgst: addCgst ? parseFloat(values.cgst) : 0,
            tax: parseFloat(values.tax),
            total: getTotal(
              subTotal,
              form.getFieldValue('discount'),
              form.getFieldValue('cgst'),
              form.getFieldValue('sgst'),
              form.getFieldValue('tax'),
            ),
            products: tableData.map(item => {
              return {
                product: item.service,
                qty: item.qty,
                rate: item.rate,
                newItem: item.newItem === true,
                amount: roundNumber(item.qty * item.rate, 2),
              }
            }),
          },
        })
          .then(res => {
            notification.success({
              message: 'Invoice updated successfully',
            })
            refetchInvoices()
            closeDrawer()

            if (!res.data.updateInvoice.details?.linkGenerated) {
              generatePaymentLink(invoiceDetails.id)
            }
          })
          .catch(errr => console.error(errr))
      }
    })
  }

  const dataColumns = [
    {
      title: '#',
      width: '80px',
      render: (text, row) => tableData.indexOf(row) + 1,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      align: 'left',
      editable: true,
      width: 250,
      render: obj => {
        return productList.find(({ id }) => obj === id)?.name
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      width: '250px',
      editable: true,
      align: 'right',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      width: '250px',
      editable: true,
      align: 'right',
      render: rate => (rate === 0 ? rate : `${currencySymbol} ${rate}`),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '250px',
      align: 'right',
      render: (text, row) => {
        const amount = parseFloat(row.qty) * parseFloat(row.rate)
        return <span>{amount === 0 ? amount : `${currencySymbol} ${amount}`}</span>
      },
    },
    {
      title: 'Operation',
      width: '100px',
      render: (text, row) => {
        return (
          <span>
            <Popconfirm title="Sure to delete this product?" onConfirm={() => handleDelete(row)}>
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </span>
        )
      },
    },
  ]

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  }

  const columns = dataColumns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        productList,
        handleSave,
      }),
    }
  })

  if (loading || !invoiceDetails) {
    return <LoadingComponent />
  }

  console.log(productDataNew, productDataOld)
  console.log(invoiceDetails, 'invoiceDetilas')
  console.log(tableData, 'tavleData')
  return (
    <div style={{ padding: '0 60px' }}>
      <Form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', marginTop: 50, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item label="Customer" style={{ marginRight: 20 }}>
              {form.getFieldDecorator('clinic', {
                initialValue: invoiceDetails?.customer?.firstname,
                rules: [{ required: true, message: 'Please select a customer!' }],
              })(
                <Input
                  type="text"
                  style={{ width: 250, display: 'block', color: '#000' }}
                  placeholder="Customer Name"
                />,
              )}
            </Form.Item>
            <Form.Item label="Customer Email" style={{ marginRight: 20 }}>
              {form.getFieldDecorator('email', {
                initialValue: invoiceDetails?.email,
                rules: [{ required: true, message: 'Please select a Clinic' }],
              })(
                <Input
                  type="email"
                  style={{ width: 250, display: 'block', color: '#000' }}
                  placeholder="customer email"
                />,
              )}
            </Form.Item>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Form.Item label="Billing Address">
            {form.getFieldDecorator('address', {
              initialValue: invoiceDetails?.address,
              rules: [{ required: true, message: 'Please give the Billing Adress' }],
            })(<TextArea style={{ resize: 'none', width: 250, height: 120 }} />)}
          </Form.Item>

          <Form.Item label="Status" style={{ marginBottom: 0, marginRight: 20, marginLeft: 20 }}>
            {form.getFieldDecorator('status', {
              initialValue: statusData && 'SW52b2ljZVN0YXR1c1R5cGU6Mg==',
              rules: [{ required: true, message: 'Please select a status!' }],
            })(
              <Select style={{ width: 200 }} loading={statusLoading}>
                {statusData?.invoiceStatusList.map(status => {
                  return (
                    <Option key={status.id} value={status.id}>
                      {status.statusName}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Issue date" style={{ marginRight: 20 }}>
            {form.getFieldDecorator('issueDate', {
              initialValue: moment(invoiceDetails.issueDate),
              rules: [{ required: true, message: 'Please give the issue date' }],
            })(<DatePicker allowClear={false} placeholder="Select the issue date" />)}
          </Form.Item>

          <Form.Item label="Due date">
            {form.getFieldDecorator('dueDate', {
              initialValue: moment(invoiceDetails.dueDate),
              rules: [{ required: true, message: 'Please select due time!' }],
            })(
              <DatePicker
                style={{ width: 200 }}
                allowClear={false}
                size="large"
                placeholder="Select Due date"
              />,
            )}
          </Form.Item>
        </div>
        <div style={{ fontSize: 16, color: 'black' }}>
          <span style={{ fontWeight: 700 }}>Hours Used : </span>
          <span style={{ fontWeight: 600 }}>{invoiceDetails.hoursUsed} hrs</span>
        </div>

        <div style={{ marginTop: '15px' }}>
          <Table
            components={components}
            columns={columns}
            dataSource={tableData}
            bordered
            pagination={false}
            footer={() => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={handleAdd} type="primary">
                  Add a Line
                </Button>
                <Text
                  style={{
                    marginLeft: 'auto',
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Subtotal
                </Text>
                <Text style={{ ...amStyle, fontSize: 18, fontWeight: 600 }}>
                  {currencySymbol} {subTotal}
                </Text>
              </div>
            )}
          />
        </div>

        <div style={{ marginTop: 30, padding: '0 16px' }}>
          <div style={amParent}>
            <span style={amLabel}>Discount Percent :</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('discount', { initialValue: invoiceDetails.discount })(
                <Input
                  placeholder="Give a discount"
                  type="number"
                  suffix="%"
                  style={{ width: 100 }}
                  min={0}
                />,
              )}
            </Form.Item>
            <span style={amStyle}>
              {currencySymbol} -
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('discount') || 0)).toFixed(
                2,
              )}
            </span>
          </div>
          <div style={amParent} className="edit-checkBox">
            <Tooltip
              placement="left"
              title={`It is recommended ${isIndian ? '' : 'not'} to charge cgst from ${
                isIndian ? 'indian' : 'non-indian'
              } clients`}
            >
              <Checkbox
                style={{ margin: 'auto 0' }}
                checked={addCgst}
                defaultChecked={addCgst}
                onChange={e => {
                  setAddCgst(e.target.checked)
                  form.setFieldsValue({ cgst: 0 })
                }}
              />
            </Tooltip>
            <span style={{ ...amLabel, color: `${addCgst ? 'black' : '#D9D9D9'}` }}>CGST :</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('cgst', { initialValue: invoiceDetails.cgst })(
                <Input
                  placeholder="Give cgst"
                  type="number"
                  suffix="%"
                  disabled={!addCgst}
                  style={{ width: 100 }}
                  min={0}
                />,
              )}
            </Form.Item>
            <span style={{ ...amStyle, color: `${addCgst ? 'black' : '#D9D9D9'}` }}>
              {currencySymbol}{' '}
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('cgst') || 0)).toFixed(2)}
            </span>
          </div>
          <div style={amParent} className="edit-checkBox">
            <Tooltip
              placement="left"
              title={`It is recommended ${isIndian ? '' : 'not'} to charge sgst from ${
                isIndian ? 'indian' : 'non-indian'
              } clients`}
            >
              <Checkbox
                style={{ margin: 'auto 0' }}
                checked={addSgst}
                defaultChecked={addSgst}
                onChange={e => {
                  setAddSgst(e.target.checked)
                  form.setFieldsValue({ sgst: 0 })
                }}
              />
            </Tooltip>
            <span style={{ ...amLabel, color: `${addSgst ? 'black' : '#D9D9D9'}` }}>SGST :</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('sgst', { initialValue: invoiceDetails.sgst })(
                <Input
                  placeholder="Give sgst"
                  type="number"
                  suffix="%"
                  disabled={!addSgst}
                  style={{ width: 100 }}
                  min={0}
                />,
              )}
            </Form.Item>
            <span style={{ ...amStyle, color: `${addSgst ? 'black' : '#D9D9D9'}` }}>
              {currencySymbol}{' '}
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('sgst') || 0)).toFixed(2)}
            </span>
          </div>
          <div style={amParent}>
            <span style={amLabel}>Tax :</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('tax', {
                initialValue: invoiceDetails.tax ? invoiceDetails.tax : 0,
              })(
                <Input
                  placeholder="Add tax"
                  type="number"
                  suffix="%"
                  min={0}
                  style={{ width: 100 }}
                />,
              )}
            </Form.Item>
            <span style={amStyle}>
              {currencySymbol}{' '}
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('tax') || 0)).toFixed(2)}
            </span>
          </div>
          <div style={{ ...amParent, margin: '5px 0', marginTop: '15px' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Last Invoice Amount :</span>
            <span style={{ ...amStyle, fontSize: '20px' }}>
              {currencySymbol} {lastInvoiceAmount}
            </span>
          </div>
          <div style={{ ...amParent, margin: '5px 0', marginTop: '15px' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Total :</span>
            <span style={{ ...amStyle, fontSize: '20px' }}>
              {currencySymbol}{' '}
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('cgst'),
                form.getFieldValue('sgst'),
                form.getFieldValue('tax'),
              )}
            </span>
          </div>
          {/* <div style={{ ...amParent, margin: '5px 0' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Balance Due:</span>
            <span style={{ ...amStyle, fontSize: '20px' }}>
              {currencySymbol}{' '}
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('cgst'),
                form.getFieldValue('sgst'),
                form.getFieldValue('tax'),
              )}
            </span>
          </div> */}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            margin: '50px 0px',
            border: '1px solid #e4e9f0',
            padding: 15,
            borderRadius: 4,
          }}
        >
          <Button
            htmlType="submit"
            loading={updateStudentInvoiceLoading}
            type="primary"
            style={SUBMITT_BUTTON}
          >
            Update
          </Button>
          <Button type="danger" onClick={closeDrawer} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </div>

        <Modal
          title="Create new product"
          visible={createProModal}
          onCancel={() => setCreateProModal(false)}
          footer={false}
        >
          <CreateProductForm setOpen={setCreateProModal} />
        </Modal>
      </Form>
    </div>
  )
}

export default Form.create()(EditInvoiceForm)
