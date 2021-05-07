/* eslint-disable */

import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  notification,
  Popconfirm,
  Radio,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd'
import LoadingComponent from 'components/LoadingComponent'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useDispatch, useSelector } from 'react-redux'
import { CANCEL_BUTTON, FORM, SUBMITT_BUTTON } from '../../assets/styles/globalStyles'
import actionPrescription from '../../redux/prescriptions/actions'
import { PrescriptionItemContext } from './context'
import './index.scss'
import PrescriptionItemTable from './prescriptionItemTable'
import PrescriptionVisitTable from './PrescriptionVisit/PrescriptionVisitTable'
import { GET_COMPLAINT_QUERY, GET_DIAGNOSIS_QUERY, GET_TESTS_QUERY } from './query'
import productReducer from './reducer'
// import OtpInput from 'react-otp-input'

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

const tl = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
}

function addNevObject(val) {
  let theMainArray = []
  val.map((item, index) => {
    let some_random = {}
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
  const { form, details } = props
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatchOfPrescription = useDispatch()
  const [otp, setOtp] = useState()
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
    if (prescriptions.isSpecificPrescription) {
      let listOfMedicineObject = prescriptions.SpecificPrescription.medicineItems.edges
      let x = addNevObject(listOfMedicineObject)
      productsDispatch({ type: 'SET_PRODUCTS', payload: x })

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

  const handleSubmitt = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      dispatchOfPrescription({
        type: actionPrescription.CREATE_PRESCRIPTION,
        payload: {
          id: details.id,
          values: values,
          data: productsState,
        },
      })
    })
  }

  const [testTime, setTestTime] = useState('')

  // if (prescriptions.loadingPrescriptions) {
  //   return <LoadingComponent />
  // }

  return (
    <div>
      <Layout>
        <Content>
          <Form>
            <Divider orientation="left">General Details</Divider>
            <Row style={{ marginBottom: 9 }}>
              <Col
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingRight: 6,
                  fontWeight: 700,
                  color: 'black',
                }}
                span={4}
              >
                Name:
              </Col>
              <Col style={{ paddingLeft: 4 }} span={18}>
                {details.firstname} {details.lastname}
              </Col>
            </Row>
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
            <Form.Item {...lt} label="Advice">
              {form.getFieldDecorator('advice')(
                <TextArea placeholder="Advice" autoSize={{ minRows: 4, maxRows: 6 }} allowClear />,
              )}
            </Form.Item>
            <Form.Item {...lt} label="Test Date">
              {form.getFieldDecorator('testDate')(<DatePicker test />)}
            </Form.Item>
            <Form.Item {...lt} label="Next Visit Date">
              {form.getFieldDecorator('nextVisitDate')(<DatePicker />)}
            </Form.Item>
            <Form.Item {...tl}>
              <Popconfirm
                title="Are you sure all the details filled are correct ?"
                onConfirm={handleSubmitt}
              >
                <Button
                  loading={prescriptions.loadingPrescriptions}
                  type="primary"
                  style={SUBMITT_BUTTON}
                >
                  ADD
                </Button>
              </Popconfirm>
              <Button onClick={() => props.closeAddDrawer()} type="ghost" style={CANCEL_BUTTON}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
          {/* <OtpInput
            value={otp}
            onChange={t => setOtp(t)}
            numInputs={6}
            separator={<span>-</span>}
          /> */}
          {/* <div className="visit_history_section">
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
          </div> */}
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)
