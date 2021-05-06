/* eslint-disable */

import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  notification,
  Popconfirm,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Typography,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useDispatch, useSelector } from 'react-redux'
import { FORM } from '../../assets/styles/globalStyles'
import actionPrescription from '../../redux/prescriptions/actions'
import { PrescriptionItemContext } from './context'
import './index.scss'
import PrescriptionItemTable from './prescriptionItemTable'
import PrescriptionVisitTable from './PrescriptionVisit/PrescriptionVisitTable'
import { GET_COMPLAINT_QUERY, GET_DIAGNOSIS_QUERY, GET_TESTS_QUERY } from './query'
import productReducer from './reducer'

const { Header, Content } = Layout
const { Text, Title } = Typography
const { Meta } = Card
const { TextArea } = Input
const InputGroup = Input.Group

const layout1 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const lt = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

const layout11 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
}

const layout12 = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const layout13 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
}

function addNevObject(val) {
  let theMainArray = []
  val.map((item, index) => {
    let some_random = {}
    console.log('THE ITEM', item)
    some_random.key = index + 1 // item.node.id
    some_random.name = item.node.name
    some_random.medicineType = item.node.medicineType
    some_random.unit = item.node.unit
    some_random.when = item.node.when
    some_random.frequency = item.node.frequency
    some_random.duration = item.node.duration
    some_random.dosage = item.node.dosage
    some_random.qty = item.node.qty

    theMainArray.push(some_random)
  })
  console.log('THE VAL', val)
  console.log('THE MAIN ARRAY', theMainArray)
  return theMainArray
}

const GetComplaints = ({ form }) => {
  console.log('form', form)
  const [sdText, setSdText] = useState('')
  const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_COMPLAINT_QUERY, {
    variables: {
      val: sdText,
    },
  })

  useEffect(() => {
    if (sdError) {
      notification.error({
        message: 'Failed to load sd list',
      })
    }
  }, [sdError])

  return (
    <>
      {(form.getFieldValue('complaints') || !form.getFieldValue('complaints')) && (
        <Form.Item {...lt} label="MAIN Complaints">
          {form.getFieldDecorator('complaints')(
            <Select
              mode="tags"
              allowClear
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more Complaints"
            >
              {sdData?.getPrescriptionComplaints.edges.map(({ node }) => {
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {node.name}
                  </Select.Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      )}
    </>
  )
}

const GetDiagnosis = ({ form }) => {
  const [sdText, setSdText] = useState('')
  const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_DIAGNOSIS_QUERY, {
    variables: {
      val: sdText,
    },
  })

  useEffect(() => {
    if (sdError) {
      notification.error({
        message: 'Failed to load sd list',
      })
    }
  }, [sdError])

  return (
    <>
      {(form.getFieldValue('diagnosis') || !form.getFieldValue('diagnosis')) && (
        <Form.Item {...lt} label="MAIN diagnosis">
          {form.getFieldDecorator('diagnosis')(
            <Select
              mode="tags"
              allowClear
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more diagnosis"
            >
              {sdData?.getPrescriptionDiagnosis.edges.map(({ node }) => {
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {node.name}
                  </Select.Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      )}
    </>
  )
}

const GetTest = ({ form }) => {
  const [sdText, setSdText] = useState('')
  const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_TESTS_QUERY, {
    variables: {
      val: sdText,
    },
  })

  useEffect(() => {
    if (sdError) {
      notification.error({
        message: 'Failed to load sd list',
      })
    }
  }, [sdError])

  return (
    <>
      {(form.getFieldValue('tests') || !form.getFieldValue('tests')) && (
        <Form.Item {...lt} label="MAIN tests">
          {form.getFieldDecorator('tests')(
            <Select
              mode="tags"
              allowClear
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more tests"
            >
              {sdData?.getPrescriptionTests.edges.map(({ node }) => {
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {node.name}
                  </Select.Option>
                )
              })}
            </Select>,
          )}
        </Form.Item>
      )}
    </>
  )
}

const BankDetails = props => {
  function onDateChange(date, dateString) {
    console.log(date, dateString)
  }
  const { form, details } = props
  console.log('The state', props)
  console.log('The form', form)
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatchOfPrescription = useDispatch()
  console.log('THE LOCAL STATE for getting prescription', prescriptions)

  const [productsState, productsDispatch] = useReducer(productReducer, [])

  const [subTotal, setSubTotal] = useState(0)
  const role = useSelector(state => state.user.role)

  useEffect(() => {
    dispatchOfPrescription({
      type: 'prescriptions/SET_SPECIFIC_LEARNER',
      payload: props.details,
    })
    dispatchOfPrescription({
      type: actionPrescription.GET_LASTEST_PRESCRIPTIONS,
      payload: {
        /**Sending student's ID */
        value: details.id,
      },
    })
    dispatchOfPrescription({
      type: actionPrescription.GET_PRESCRIPTIONS,
      payload: {
        value: details.id,
      },
    })
  }, [])

  useEffect(() => {
    console.log('THE PRESCRIPTION VALUE', prescriptions)
    if (prescriptions.isSpecificPrescription) {
      let listOfMedicineObject = prescriptions.SpecificPrescription.medicineItems.edges
      /**Add key in the product_state */
      let x = addNevObject(listOfMedicineObject)
      productsDispatch({ type: 'SET_PRODUCTS', payload: x })
      // Once the meds are imported we fill all those values

      form.setFieldsValue({
        height: prescriptions.SpecificPrescription.height,
        weight: prescriptions.SpecificPrescription.weight,
        temperature: prescriptions.SpecificPrescription.temperature,
        headCircumference: prescriptions.SpecificPrescription.headCircumference,
        complaints: prescriptions.SpecificPrescription.complaints.edges.map(
          element => element.node.id,
        ),
        diagnosis: prescriptions.SpecificPrescription.diagnosis.edges.map(
          element => element.node.id,
        ),
        tests: prescriptions.SpecificPrescription.tests.edges.map(element => element.node.id),
        advice: prescriptions.SpecificPrescription.advice,
        testDate: moment(prescriptions.SpecificPrescription.testDate),
      })
    }
  }, [prescriptions.SpecificPrescription])

  function onChangeInputNumber(value) {
    console.log('changed', value)
  }

  function onChangeNextVisitVal(e) {
    console.log(`radio checked:${e.target.value}`)
  }

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      console.log('THE LIST OF PRESCRIPTION', productsState)
      console.log('THE SUBMIT 🎉✨', err, values)
      console.log(details.id, vaules, productsState, 'prd')
      // dispatchOfPrescription({
      //   type: actionPrescription.CREATE_PRESCRIPTION,
      //   payload: {
      //     id: details.id,
      //     values: values,
      //     data: productsState,
      //   },
      // })
    })
  }

  const [testTime, setTestTime] = useState('')
  console.log(testTime)
  const handelTestTime = e => {
    console.log(e.target.value)
    setTestTime(e.target.value)
  }

  return (
    <div>
      <Layout>
        <Content>
          {/* onSubmit={e => handleFormSubmit(e)} */}
          <Form className="update-bank-details">
            <Divider orientation="left">General Details</Divider>
            <Form.Item {...lt} label="Name">
              {form.getFieldDecorator('name')(<Input className="vital_input" placeholder="cm" />)}
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item {...layout1} label="Height">
                  {form.getFieldDecorator('height')(
                    <Input className="vital_input" suffix="cm" placeholder="Enter height" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...layout1} label="Weight">
                  {form.getFieldDecorator('weight')(
                    <Input className="vital_input" suffix="Kg" placeholder="Enter weight" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...layout1} label="Temperature">
                  {form.getFieldDecorator('temperature')(
                    <Input
                      className="vital_input"
                      suffix="C"
                      placeholder="Enter body temperature"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...layout1} label="Head Circumference">
                  {form.getFieldDecorator('headCircumference')(
                    <Input
                      suffix="cm"
                      className="vital_input"
                      placeholder="Enter head circumference"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <GetComplaints form={form} />
            <GetDiagnosis form={form} />
            <GetTest form={form} />
            {prescriptions.loadingPrescriptions !== true &&
            prescriptions.isSpecificPrescription !== false ? (
              <>
                <PrescriptionItemContext.Provider value={productsDispatch}>
                  <PrescriptionItemTable
                    style={{ marginTop: 25 }}
                    totalAmount={subTotal}
                    products={productsState}
                    dispatch={productsDispatch}
                  />
                </PrescriptionItemContext.Provider>
              </>
            ) : (
              <>
                {prescriptions.PrescriptionsList.length === 0 ? (
                  <>
                    <PrescriptionItemContext.Provider value={productsDispatch}>
                      <PrescriptionItemTable
                        style={{ marginTop: 25 }}
                        totalAmount={subTotal}
                        products={productsState}
                        dispatch={productsDispatch}
                      />
                    </PrescriptionItemContext.Provider>
                  </>
                ) : (
                  <>
                    <Spin size="large" />
                  </>
                )}
              </>
            )}
            <div className="prescription_footer_section">
              <div className="advice_contianer">
                <div style={{ width: '85%' }}>
                  <Form.Item {...layout1} label="Advice">
                    {form.getFieldDecorator('advice')(
                      <TextArea
                        placeholder="Advice"
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </div>
              </div>
            </div>
            <div style={{ marginLeft: '4%' }}>
              <Form.Item {...layout12} label="Test Date">
                {form.getFieldDecorator('testDate')(<DatePicker test />)}
              </Form.Item>
            </div>
            <Row style={{ marginLeft: '6%' }} type="flex" justify="start">
              <Col span={5}>
                <Form.Item {...layout11} label="Next Visit">
                  {form.getFieldDecorator('nextVisitNumber')(
                    <InputNumber min={1} max={12} onChange={onChangeInputNumber} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item style={{ marginTop: '-2%' }}>
                  {form.getFieldDecorator('nextVisitVal')(
                    <Radio.Group onChange={onChangeNextVisitVal}>
                      <Radio.Button value="days">days</Radio.Button>
                      <Radio.Button value="weeks">weeks</Radio.Button>
                      <Radio.Button value="months">months</Radio.Button>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <span
                style={{
                  fontWeight: '900',
                  fontSize: '16px',
                  marginLeft: '-2%',
                  marginTop: '0.5%',
                }}
              >
                OR
              </span>
              <Col span={8}>
                <Form.Item {...layout13} label="Next Visit Date">
                  {form.getFieldDecorator('nextVisitDate')(<DatePicker />)}
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0',
              }}
            >
              <Popconfirm
                title="Are you sure all the details filled are correct ?"
                onConfirm={handleSubmitt}
              >
                <Button loading={false} type="primary" style={{ margin: 5 }}>
                  ADD
                </Button>
              </Popconfirm>
              <Button onClick={() => props.closeAddDrawer()} type="ghost" style={{ margin: 5 }}>
                Cancel
              </Button>
            </div>
          </Form>
          <div className="visit_history_section">
            <div className="vist_title">
              <Title level={2}>14 Visits</Title>
              <Text>Since14-Mar-2020</Text>
            </div>
            <div className="visit_content_body">
              <div className="visit_content_header">
                <Title level={4}>17-Mar-2021</Title>
                <span>By: Dr.Prashantay</span>
              </div>
              <div className="content_body">
                <p>Diagnosis: FEBRILE SEIZURES DEVELOPMETAL DELAY</p>
                <p>Rx</p>
                {prescriptions.loadingPrescriptions !== true &&
                prescriptions.isSpecificPrescription !== false ? (
                  <>
                    <PrescriptionItemContext.Provider value={productsDispatch}>
                      <PrescriptionVisitTable
                        style={{ marginTop: 25 }}
                        totalAmount={subTotal}
                        products={productsState}
                        dispatch={productsDispatch}
                      />
                    </PrescriptionItemContext.Provider>
                  </>
                ) : (
                  <>
                    <Spin size="large" />
                  </>
                )}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)
