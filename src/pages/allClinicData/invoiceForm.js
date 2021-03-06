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
  InputNumber,
  Modal,
  Checkbox,
  Tooltip,
  Popconfirm,
} from 'antd'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import moment from 'moment'
import client from '../../apollo/config'
import '../../components/invoice/invoiceForm.scss'
import './allClinicData.scss'
import { CreateProductForm } from '../../components/invoice/InvoiceProductsTable'
import {
  ALL_LEARNERS,
  ALL_LEARNERS_ASSESS_CHARGES,
  CLINIC_RATES,
  CREATE_INVOICE,
  GENERATE_LINK,
  INVOICE_STATUS,
  MAKE_ASSESS,
  PRODUCT_LIST,
  LEARNER_ACTIVE_DETAILS,
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
  marginLeft: 30,
  minWidth: '140px',
  margin: 'auto 0',
}

const calculatDateAdd = (form, dayNum) => {
  return moment(form.getFieldValue('issueDate'))
    .add(dayNum, 'day')
    .format('YYYY-MM-DD')
}

function getTotal(subTotal, discount = 0, cgst = 0, sgst = 0, taxableSubtotal = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(cgst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(taxableSubtotal || 0),
  ).toFixed(3)
}

function daysInMonth(month, year) {
  // Use 1 for January, 2 for February, etc.
  return new Date(year, month, 0).getDate()
}

const d = new Date()
const month = 'February'
const days = daysInMonth(d.getMonth() === 0 ? 12 : d.getMonth(), d.getFullYear())

const DAYS_365 = 2592000000

const RATES_ZERO = {
  learnerPrice: 0,
  researchParticipantPrice: 0,
  peakPrice: 0,
  vbmappPrice: 0,
  cogPrice: 0,
}

const roundNumber = (num, digitFigure) => {
  return Number(Number(num).toFixed(digitFigure))
}

const essentialServices = [
  'SW52b2ljZVByb2R1Y3RzVHlwZToxMg==',
  'SW52b2ljZVByb2R1Y3RzVHlwZToxNg==',
  'SW52b2ljZVByb2R1Y3RzVHlwZToxNA==',
  'SW52b2ljZVByb2R1Y3RzVHlwZToxMw==',
  'SW52b2ljZVByb2R1Y3RzVHlwZToxNQ==',
]

const checkYear = item => {
  const lastDate = new Date(Math.max(...item.map(e => new Date(e.node.date))))
  const currentDate = new Date()
  return currentDate - lastDate > DAYS_365
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

const InvoiceForm = ({ form, rowData, refetchInvoices, setInvoiceFormDrawer }) => {
  const [subTotal, setSubTotal] = useState(0)
  const [count, setCount] = useState(-1)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [tableData, setTableData] = useState([])
  const [details, setDetails] = useState([])
  const [perDayRates, setPerDayRates] = useState({})
  const [updateAssessList, setUpdateAssessList] = useState([])
  const [addCgst, setAddCgst] = useState(rowData.details.country?.name?.toLowerCase() === 'india')
  const [addSgst, setAddSgst] = useState(rowData.details.country?.name?.toLowerCase() === 'india')
  const [isIndian, setIsIndian] = useState(rowData.details.country?.name?.toLowerCase() === 'india')
  const { data: statusData, loading: statusLoading } = useQuery(INVOICE_STATUS)
  const { data: productData, loading: productLoading, refetch: productRefetch } = useQuery(
    PRODUCT_LIST,
  )
  const [createProModal, setCreateProModal] = useState(false)
  const [isCreated, setIsCreated] = useState(false)

  const [
    getLearners,
    { data: learnerData, loading: learnerLoading, error: learnerError },
  ] = useLazyQuery(ALL_LEARNERS_ASSESS_CHARGES)

  const [getRates, { data: ratesData, loading: ratesLoading }] = useLazyQuery(CLINIC_RATES, {
    fetchPolicy: 'network-only',
  })
  const [
    createInvoice,
    { data: newInvoiceData, loading: newInvoiceLoading, error: newInvoiceError },
  ] = useMutation(CREATE_INVOICE)

  useEffect(() => {
    getRates({ variables: { clinic: rowData.details.id } })
    getLearners({ variables: { schoolId: rowData.details.id } })
    setCurrencySymbol(rowData.details.currency ? rowData.details.currency.symbol : '$')
  }, [])

  useEffect(() => {
    if (ratesData) {
      setPerDayRates(
        ratesData.getClinicRates.edges.length > 0
          ? {
              learnerPrice: roundNumber(
                ratesData.getClinicRates.edges[0].node.learnerPrice / days,
                3,
              ),
              researchParticipantPrice:
                ratesData.getClinicRates.edges[0].node.researchParticipantPrice,
              peakPrice: ratesData.getClinicRates.edges[0].node.peakPrice,
              vbmappPrice: ratesData.getClinicRates.edges[0].node.vbmappPrice,
              cogPrice: 0,
            }
          : RATES_ZERO,
      )
    }
  }, [ratesData])

  useEffect(() => {
    const learnerId = []
    if (learnerData) {
      learnerData.students.edges.map(item => {
        learnerId.push(item.node.id)
      })

      setCount(learnerId.length)
      getLearnerDetails(learnerId)
    }
  }, [learnerData])

  useEffect(() => {
    if (details.length === count && learnerData && ratesData && productData) {
      let learnerCount = 0
      let peakCount = 0
      let cogCount = 0
      let vbmappCount = 0
      let researchCount = 0
      details.map((item, index) => {
        const tempStudent = learnerData.students.edges.filter(
          studentItem => studentItem.node.id === item.id,
        )
        // console.log(learnerData)
        // console.log(details, 'details')
        const assessCharges = tempStudent[0].node.assessmentCharges.edges
        let checkPeak = true
        let checkVbmapp = true
        let checkCogniable = true

        if (assessCharges.length > 0) {
          const peak = assessCharges.filter(assessItem => assessItem.node.assessType === 'PEAK')
          const vbmapp = assessCharges.filter(assessItem => assessItem.node.assessType === 'VBMAPP')
          const cogniable = assessCharges.filter(
            assessItem => assessItem.node.assessType === 'COGNIABLE',
          )

          checkPeak = peak.length > 0 ? checkYear(peak) : true
          checkVbmapp = vbmapp.length > 0 ? checkYear(vbmapp) : true
          checkCogniable = cogniable.length > 0 ? checkYear(cogniable) : true
        }

        if (!tempStudent[0].node.researchParticipant) {
          learnerCount += item.activeDays

          if (item.peakDays > 0 && checkPeak) {
            setUpdateAssessList(ids => [
              ...ids,
              { id: item.id, assessType: 'Peak', amount: perDayRates.peakPrice },
            ])
            peakCount += 1
          }
          if (item.cogDays > 0 && checkCogniable) {
            setUpdateAssessList(ids => [
              ...ids,
              { id: item.id, assessType: 'Cogniable', amount: perDayRates.cogPrice },
            ])
            cogCount += 1
          }
          if (item.vbmappDays > 0 && checkVbmapp) {
            setUpdateAssessList(ids => [
              ...ids,
              { id: item.id, assessType: 'Vbmapp', amount: perDayRates.vbmappPrice },
            ])
            vbmappCount += 1
          }
        } else {
          console.log(tempStudent, 'temper')
          researchCount += 1
        }
      })

      const tempTable = [
        {
          key: Math.random(),
          service: productData?.invoiceProductsList.filter(item => {
            if (item.name === 'Learner') {
              return true
            }
            return false
          })[0].id,
          qty: learnerCount,
          rate: perDayRates.learnerPrice,
          amount: roundNumber(learnerCount * perDayRates.learnerPrice, 3),
        },

        {
          key: Math.random(),
          service: productData?.invoiceProductsList.filter(item => {
            if (item.name === 'Peak') {
              return true
            }
            return false
          })[0].id,
          qty: peakCount,
          rate: perDayRates.peakPrice,
          amount: roundNumber(peakCount * perDayRates.peakPrice, 3),
        },
        {
          key: Math.random(),
          service: productData?.invoiceProductsList.filter(item => {
            if (item.name === 'Vbmapp') {
              return true
            }
            return false
          })[0].id,
          qty: vbmappCount,
          rate: perDayRates.vbmappPrice,
          amount: roundNumber(vbmappCount * perDayRates.vbmappPrice, 3),
        },
        {
          key: Math.random(),
          service: productData?.invoiceProductsList.filter(item => {
            if (item.name === 'Cogniable') {
              return true
            }
            return false
          })[0].id,
          qty: cogCount,
          rate: perDayRates.cogPrice,
          amount: roundNumber(cogCount * perDayRates.cogPrice, 3),
        },
        {
          key: Math.random(),
          service: productData?.invoiceProductsList.filter(item => {
            if (item.name === 'Research Participant') {
              return true
            }
            return false
          })[0].id,
          qty: researchCount,
          rate: perDayRates?.researchParticipantPrice,
          amount: roundNumber(researchCount * perDayRates.researchParticipantPrice, 3),
        },
      ]

      let tempTotal = subTotal
      tempTable.map(item => {
        tempTotal += Number(item.amount)
        return tempTotal
      })
      setSubTotal(roundNumber(tempTotal, 3))
      setTableData(tempTable)
    }
  }, [details.length === count])

  useEffect(() => {
    if (newInvoiceData) {
      notification.success({
        message: 'Invoice Created Succesfully',
      })
    }
    if (newInvoiceError) {
      notification.error({
        message: 'Unable to create invoice',
      })
    }
  }, [newInvoiceData, newInvoiceError])

  const getLearnerDetails = learnerId => {
    learnerId.map((item, index) => {
      client
        .mutate({
          mutation: LEARNER_ACTIVE_DETAILS,
          variables: { pk: item, month },
        })
        .then(data => {
          setDetails(details => [...details, { ...data.data.learnerActiveDetails.data, id: item }])
        })
    })
  }

  const submit = e => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        console.log(rowData, values, values.cgst, values.sgst, tableData, 'rowData in invoice form')
        createInvoice({
          variables: {
            clinic: rowData?.details?.id,
            email: values.email,
            status: values.status,
            issueDate: moment(values.issueDate).format('YYYY-MM-DD'),
            dueDate: moment(values.dueDate).format('YYYY-MM-DD'),
            address: values.address,
            taxableSubtotal: parseFloat(values.taxableSubtotal),
            discount: parseFloat(values.discount),
            sgst: parseFloat(values.sgst),
            cgst: parseFloat(values.cgst),
            total: getTotal(
              subTotal,
              form.getFieldValue('discount'),
              form.getFieldValue('cgst'),
              form.getFieldValue('sgst'),
              form.getFieldValue('taxableSubtotal'),
            ),
            due: getTotal(
              subTotal,
              form.getFieldValue('discount'),
              form.getFieldValue('cgst'),
              form.getFieldValue('sgst'),
              form.getFieldValue('taxableSubtotal'),
            ),
            products: tableData.map(item => {
              return {
                product: item.service,
                qty: item.qty,
                rate: item.rate,
                amount: roundNumber(item.qty * item.rate, 3),
              }
            }),
          },
        }).then(data => {
          console.log(data.data.createInvoice, 'invoice data')
          setIsCreated(true)
          refetchInvoices()
          generatePaymentLink(data.data.createInvoice.details.id)
          updateAssess(data.data.createInvoice.details.id)
          setInvoiceFormDrawer(false)
        })
      }
    })
  }

  const updateAssess = invoiceId => {
    updateAssessList.map(async item => {
      try {
        const data = await client.mutate({
          mutation: MAKE_ASSESS,
          variables: {
            pk: item.id,
            assessType: item.assessType,
            amount: item.amount,
            invoiceId,
          },
        })
        console.log(data, 'data')
      } catch (e) {
        notification.error({
          message: 'Unable to update assess type',
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
    console.log(row, data, 'row')
    const newData = [...tableData]
    const index = newData.findIndex(item => row.key === item.key)
    console.log(index, 'index')
    newData[index] = { ...row, ...data }

    let tempTotal = 0
    newData.map(item => {
      tempTotal += roundNumber(Number(item.rate) * Number(item.qty), 3)
    })
    setSubTotal(roundNumber(tempTotal, 3))
    setTableData(newData)
  }

  const handleDelete = row => {
    const tempTableData = [...tableData]
    console.log(tempTableData, '11')
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
      amount: roundNumber(1 * 0, 3),
    }
    console.log(productData, 'productData')
    setTableData(row => [...row, newProductData])
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
      editable: true,
      align: 'left',
      render(obj) {
        return productData?.invoiceProductsList.find(({ id }) => obj === id)?.name
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      width: '300px',
      editable: true,
      align: 'right',
    },
    {
      title: 'Rate / day',
      dataIndex: 'rate',
      width: '300px',
      editable: true,
      align: 'right',
      render: rate => (rate === 0 ? rate : `${currencySymbol} ${rate}`),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '300px',
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
        if (essentialServices.indexOf(row.service) === -1) {
          return (
            <span>
              <Popconfirm title="Sure to delete this product?" onConfirm={() => handleDelete(row)}>
                <Button type="danger">Delete</Button>
              </Popconfirm>
            </span>
          )
        }
        return null
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

  return (
    <div style={{ padding: '0 100px' }}>
      <Form onSubmit={submit}>
        <div style={{ display: 'flex', marginTop: 50, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item label="Customer" style={{ marginRight: 20 }}>
              {form.getFieldDecorator('clinic', {
                initialValue: rowData?.details.schoolName,
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
                initialValue: rowData?.details.email,
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
            <Text style={{ fontSize: 20, color: '#000' }}>BALANCE DUE:</Text>
            <Title style={{ marginTop: 10 }}>
              {currencySymbol}
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('taxableSubtotal'),
              )}
            </Title>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Form.Item label="Billing Address">
            {form.getFieldDecorator('address', {
              initialValue: rowData?.details.address,
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
            loading={ratesLoading || learnerLoading || details.length !== count || productLoading}
            bordered
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
                <Button
                  style={{ marginLeft: 15 }}
                  type="primary"
                  onClick={() => setCreateProModal(true)}
                >
                  Create a new product
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
            <span style={amLabel}>Discount Percent:</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('discount', { initialValue: 0 })(
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
                3,
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
            <span style={{ ...amLabel, color: `${addCgst ? 'black' : '#D9D9D9'}` }}>CGST:</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('cgst', { initialValue: 0 })(
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
              {currencySymbol}
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('cgst') || 0)).toFixed(3)}
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
            <span style={{ ...amLabel, color: `${addSgst ? 'black' : '#D9D9D9'}` }}>SGST:</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('sgst', { initialValue: 0 })(
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
              {currencySymbol}
              {Number((subTotal / 100) * parseFloat(form.getFieldValue('sgst') || 0)).toFixed(3)}
            </span>
          </div>
          <div style={amParent}>
            <span style={amLabel}>Taxable:</span>
            <Form.Item style={{ margin: 'auto 0' }}>
              {form.getFieldDecorator('taxableSubtotal', { initialValue: 0 })(
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
              {currencySymbol}
              {Number(
                (subTotal / 100) * parseFloat(form.getFieldValue('taxableSubtotal') || 0),
              ).toFixed(3)}
            </span>
          </div>
          <div style={{ ...amParent, margin: '5px 0', marginTop: '15px' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Total:</span>
            <span style={{ ...amStyle, fontSize: '20px' }}>
              {currencySymbol}
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('cgst'),
                form.getFieldValue('sgst'),
                form.getFieldValue('taxableSubtotal'),
              )}
            </span>
          </div>
          <div style={{ ...amParent, margin: '5px 0' }}>
            <span style={{ ...amLabel, fontSize: '20px' }}>Balance Due:</span>
            <span style={{ ...amStyle, fontSize: '20px' }}>
              {currencySymbol}
              {getTotal(
                subTotal,
                form.getFieldValue('discount'),
                form.getFieldValue('cgst'),
                form.getFieldValue('sgst'),
                form.getFieldValue('taxableSubtotal'),
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
          <Button type="danger" onClick={() => setInvoiceFormDrawer(false)}>
            Cancel
          </Button>

          <Button
            htmlType="submit"
            disabled={isCreated}
            loading={newInvoiceLoading}
            type="primary"
            style={{ margin: 'auto 10px' }}
          >
            Create
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

export default Form.create()(InvoiceForm)
