/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState, useReducer, useRef, useContext } from 'react'
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
import LoadingComponent from 'components/LoadingComponent'
import { SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import moment from 'moment'
import client from '../../apollo/config'
import '../../components/invoice/invoiceForm.scss'
import '../allClinicData/allClinicData.scss'
import './invoices.scss'
import { CreateProductForm } from '../../components/invoice/InvoiceProductsTable'
import { GENERATE_LINK, INVOICE_STATUS, PRODUCT_LIST } from '../allClinicData/query'
import { GET_INVOICES, GET_INVOICE_DETAIL, UPDATE_INVOICE } from './query'

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
  marginLeft: 30,
  minWidth: '140px',
  margin: 'auto 0',
}

const calculatDateAdd = (form, dayNum) => {
  return moment(form.getFieldValue('issueDate'))
    .add(dayNum, 'day')
    .format('YYYY-MM-DD')
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
  return Number(Number(num).toFixed(2))
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
  const { data: productData, loading: productLoading } = useQuery(PRODUCT_LIST)

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
      <div>
        {title === 'Service' ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
          >
            {form.getFieldDecorator(title.toLowerCase(), {
              initialValue: record[title.toLowerCase()],
              rules: [
                {
                  required: true,
                  message: 'Please give service name',
                },
              ],
            })(
              <Select
                ref={inputRef}
                loading={productLoading}
                placeholder="Please select a product"
                onPressEnter={save}
                onBlur={save}
              >
                {productData?.invoiceProductsList.map(({ id, name }) => {
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
                // step={false}
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

const EditInvoice = ({ form, rowData, refetchInvoices, closeDrawer }) => {
  const [subTotal, setSubTotal] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState('₹')
  const [tableData, setTableData] = useState([])
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [addCgst, setAddCgst] = useState(true)
  const [addSgst, setAddSgst] = useState(true)
  const [isIndian, setIsIndian] = useState(true)
  const { data: statusData, loading: statusLoading } = useQuery(INVOICE_STATUS)
  const { data: productData, loading: productLoading, refetch: productRefetch } = useQuery(
    PRODUCT_LIST,
  )
  const [createProModal, setCreateProModal] = useState(false)
  const [isCreated, setIsCreated] = useState(false)

  const [updateInvoice, { loading: updateInvoiceLoading, error: updateInvoiceError }] = useMutation(
    UPDATE_INVOICE,
  )

  const { data: invoiceData, loading: invoiceLoading, error: invoiceError } = useQuery(
    GET_INVOICE_DETAIL,
    {
      variables: {
        id: rowData.id,
      },
    },
  )

  console.log(rowData, 'rowData')
  console.log(statusData, 'status data')

  useEffect(() => {
    if (invoiceData) {
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
      setInvoiceDetails(invoiceData.invoiceDetail)
    }
  }, [invoiceData])

  const calculateTotal = tempList => {
    let tempTotal = 0
    tempList.forEach(node => {
      tempTotal += roundNumber(Number(node.qty) * Number(node.rate), 2)
    })
    // if (lastInvoiceAmount === null) {
    //   const { discount: ds, cgst: cg, sgst: sg, tax: tx, total } = invoiceData.invoiceDetail
    //   const tt = total - getTotal(tempTotal, ds, cg, sg, tx)
    //   const dd = tt < 1 && tt > -1 ? 0 : tt
    // }
    setSubTotal(roundNumber(tempTotal, 2))
  }

  useEffect(() => {
    if (updateInvoiceError) {
      notification.error({
        message: 'Unable to create invoice',
      })
    }
  }, [updateInvoiceError])

  const submit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error && invoiceDetails.id) {
        console.log(values, invoiceDetails.id, subTotal, tableData, 'rowData in invoice form')
        updateInvoice({
          variables: {
            pk: invoiceDetails.id,
            email: values.email,
            status:
              values.status === 'SW52b2ljZVN0YXR1c1R5cGU6Mg==' &&
              invoiceDetails.linkGenerated === true
                ? 'SW52b2ljZVN0YXR1c1R5cGU6NA=='
                : values.status,
            issueDate: moment(values.issueDate).format('YYYY-MM-DD'),
            dueDate: moment(values.dueDate).format('YYYY-MM-DD'),
            address: values.address,
            tax: parseFloat(values.tax),
            discount: parseFloat(values.discount),
            sgst: parseFloat(values.sgst),
            cgst: parseFloat(values.cgst),
            amount: parseFloat(subTotal),
            taxableSubtotal: parseFloat(subTotal),
            products: tableData.map(item => {
              return {
                product: item.service,
                qty: item.qty,
                rate: item.rate,
                amount: roundNumber(item.qty * item.rate, 2),
              }
            }),
          },
        }).then(data => {
          console.log(data, 'invoice data')
          setIsCreated(true)
          refetchInvoices()
          notification.success({
            message: 'Invoice updated successfully',
          })
          if (!data.data.updateInvoice.details?.linkGenerated) {
            generatePaymentLink(invoiceDetails.id)
          }
        })
      }
    })
  }

  const generatePaymentLink = invoiceId => {
    try {
      const res = client.mutate({
        mutation: GENERATE_LINK,
        variables: {
          pk: invoiceId,
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
    setSubTotal(roundNumber(tempTotal, 3))
    setTableData(newData)
  }

  const handleDelete = row => {
    const tempTableData = [...tableData]
    for (let i = 0; i < tempTableData.length; i++) {
      if (tempTableData[i].key === row.key) {
        tempTableData.splice(i, 1)
      }
    }
    setTableData(tempTableData)
  }

  const handleAdd = () => {
    const newProductData = {
      key: Math.random(),
      service: productData?.invoiceProductsList[0].id,
      qty: 1,
      rate: 0,
      amount: roundNumber(1 * 0, 2),
    }
    setTableData(row => [...row, newProductData])
  }

  const dataColumns = [
    {
      title: '#',
      width: '50px',
      render: (text, row) => tableData.indexOf(row) + 1,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      editable: true,
      align: 'left',
      render(obj) {
        return productData?.invoiceProductsList.find(({ id }) => obj === id)?.name
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      width: '220px',
      editable: true,
      align: 'right',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      width: '220px',
      editable: true,
      align: 'right',
      render: rate => (rate === 0 ? rate : `${currencySymbol} ${rate}`),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '220px',
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
        handleSave,
      }),
    }
  })

  if (invoiceLoading || statusLoading || !invoiceDetails) {
    return <LoadingComponent />
  }

  return (
    <div style={{ padding: '0 60px' }} className="table-input-field">
      <Form onSubmit={submit}>
        <div style={{ display: 'flex', marginTop: 50, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item label="Customer" style={{ marginRight: 20 }}>
              {form.getFieldDecorator('clinic', {
                initialValue: invoiceDetails?.clinic?.schoolName,
                rules: [{ required: true, message: 'Please select a customer!' }],
              })(
                <Input
                  type="text"
                  style={{ width: 250, display: 'block', color: '#000' }}
                  placeholder="Clinic"
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

          <div style={{ minWidth: '160px' }}>
            <Text style={{ fontSize: 20, color: '#000' }}>BALANCE DUE : </Text>
            <Title style={{ marginTop: 10 }}>
              {currencySymbol}{' '}
              {getTotal(subTotal, form.getFieldValue('discount'), form.getFieldValue('tax'))}
            </Title>
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
              initialValue: moment(),
              rules: [{ required: true, message: 'Please give the issue date' }],
            })(<DatePicker allowClear={false} placeholder="Select the issue date" />)}
          </Form.Item>

          <Form.Item label="Due date">
            {form.getFieldDecorator('dueDate', {
              initialValue: calculatDateAdd(form, 30),
              rules: [{ required: true, message: 'Please select due time!' }],
            })(
              <Select style={{ width: 200 }} optionLabelProp="label">
                <Option key="1" value={calculatDateAdd(form, 15)} label={calculatDateAdd(form, 15)}>
                  15 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 30)} label={calculatDateAdd(form, 30)}>
                  30 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 45)} label={calculatDateAdd(form, 45)}>
                  45 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 60)} label={calculatDateAdd(form, 60)}>
                  60 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 75)} label={calculatDateAdd(form, 75)}>
                  75 days
                </Option>
                <Option key="1" value={calculatDateAdd(form, 90)} label={calculatDateAdd(form, 90)}>
                  90 days
                </Option>
              </Select>,
            )}
          </Form.Item>
        </div>

        <div style={{ marginTop: '15px' }}>
          <Table
            components={components}
            columns={columns}
            dataSource={tableData}
            loading={productLoading}
            bordered
            rowKey="key"
            pagination={false}
            footer={() => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button onClick={handleAdd} type="primary">
                  Add a Line
                </Button>

                <Text
                  style={{
                    marginLeft: 'auto',
                    marginRight: '10%',
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Subtotal
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>
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
              } clinics`}
            >
              <Checkbox
                style={{ margin: 'auto 0' }}
                checked={addCgst}
                defaultChecked={addCgst}
                onChange={e => setAddCgst(e.target.checked)}
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
              } clinics`}
            >
              <Checkbox
                style={{ margin: 'auto 0' }}
                checked={addSgst}
                defaultChecked={addSgst}
                onChange={e => setAddSgst(e.target.checked)}
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
              {form.getFieldDecorator('tax', { initialValue: invoiceDetails.tax })(
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
          <div style={{ ...amParent, margin: '5px 0' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Balance Due :</span>
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
            disabled={isCreated}
            loading={updateInvoiceLoading}
            type="primary"
            style={SUBMITT_BUTTON}
          >
            Update
          </Button>
          <Button type="danger" onClick={() => closeDrawer()} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </div>

        <Modal
          title="Create new product"
          visible={createProModal}
          onCancel={() => setCreateProModal(false)}
          footer={false}
        >
          <CreateProductForm setOpen={setCreateProModal} refetch={productRefetch} />
        </Modal>
      </Form>
    </div>
  )
}

export default Form.create()(EditInvoice)
