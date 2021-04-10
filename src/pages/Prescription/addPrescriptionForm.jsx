/* eslint-disable */

/**[Explaination]
 * This component is a part of the "Prescription" component wherein
 *  - Only the authenticated & allowed users which are doctors/therapist can have access
 *  - The Parent of a particular learner can view their child's prescription and take a printout of it in a pdf formart
 * How is component structured
 *  - In antD we already have Editable-Row & Editable-Cell Table component
 *    • wherein we can edit every row
 *    • and delete each row
 *    • Once all values in the prescription table are set we will send save & dispatch that the entire array of objects
 *      to the API for CRUD application
 *  - NOTE:
 */

import React, { useEffect, useState, useReducer } from 'react'
import {
  Form,
  Button,
  Input,
  Select,
  Layout,
  Typography,
  Divider,
  Switch,
  Icon,
  InputNumber,
  Radio,
  notification,
  DatePicker,
  Popconfirm,
  Card,
  Avatar,
  Spin,
} from 'antd'
import { useQuery } from 'react-apollo'
import { connect, useSelector, useDispatch } from 'react-redux'
import PrescriptionTable from './PrescriptionTableComponent'
/*The below imports are commented because we don't use those anymore */
import actionPrescription from '../../redux/prescriptions/actions'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { PrescriptionItemContext } from './context'
import productReducer from './reducer'
import { GET_COMPLAINT_QUERY, GET_DIAGNOSIS_QUERY, GET_TESTS_QUERY } from './query'
import PrescriptionItemTable from './prescriptionItemTable'

const { Header, Content } = Layout
const { Text, Title } = Typography
const { Meta } = Card
const { TextArea } = Input

/* Some static css */
const itemStyle = {
  display: 'flex',
  marginRight: '25px',
  justifyContent: 'flex-end',
  marginTop: -15,
}
const itemStyle2 = {
  display: 'flex',
  marginRight: '25px',
  // justifyContent: 'flex-end',
  marginTop: -15,
}
const itemStyle3 = {
  display: 'flex',
  marginRight: '25px',
  // justifyContent: 'flex-end',
  marginTop: -15,
}

const inputStyle = {
  width: '200px',
  borderRadius: 0,
  border: 'none',
  borderBottom: '2px solid',
}
const inputStyle2 = {
  width: '160px',
  borderRadius: 0,
  border: 'none',
  borderBottom: '2px solid',
}
const inputStyle3 = {
  borderRadius: 0,
}

const layout1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}

/* The below function is a helper function */
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
        <Form.Item {...layout1} label="MAIN Complaints">
          {form.getFieldDecorator('complaints')(
            <Select
              mode="tags"
              allowClear
              size="large"
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more sd"
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
        <Form.Item {...layout1} label="MAIN diagnosis">
          {form.getFieldDecorator('diagnosis')(
            <Select
              mode="tags"
              allowClear
              size="large"
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more sd"
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
        <Form.Item {...layout1} label="MAIN tests">
          {form.getFieldDecorator('tests')(
            <Select
              mode="tags"
              allowClear
              size="large"
              notFoundContent={sdLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={v => {
                setSdText(v)
              }}
              loading={sdLoading}
              // disabled={form.getFieldValue('complaints')?.length > 0}
              placeholder="Search for find more sd"
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
  console.log('The state', props)
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatchOfPrescription = useDispatch()
  console.log('THE LOCAL STATE for getting prescription', prescriptions)
  /* productsState ==> holds the array of all the medicines in the list 
     productsDispatch ==> The local "Reducer" for updating the reducer which will hold each row items 
     ⭐ NOTE: Here we have defined the initialState of the reducer to an empty array but 
              we need to pass the latest prescription details.
  */

  const [productsState, productsDispatch] = useReducer(productReducer, [])

  const [subTotal, setSubTotal] = useState(0)
  const role = useSelector(state => state.user.role)

  useEffect(() => {
    console.log('******************* THE COMPONENT Did mount method ie it will run only once ')
    dispatchOfPrescription({
      type: actionPrescription.GET_LASTEST_PRESCRIPTIONS,
      payload: {
        /**Sending student's ID */
        value: details.id,
      },
    })
    console.log('THE VALUES')
  }, [])

  /*[Explaination]
    This effect will only run if the prescription values are set.
    When this run what it does you may think???
    1. It sets the productState (aka list-of-meds-objects) with the latest prescriptions
    2. It will then, fill the form page with the latest prescription details
  */

  useEffect(() => {
    console.log('THE PRESCRIPTION VALUE', prescriptions)
    if (prescriptions.SpecificPrescription) {
      let listOfMedicineObject = prescriptions.SpecificPrescription.medicineItems.edges
      console.log('THE LIST OF MEDS 💊💊💊💊💊', listOfMedicineObject)
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
    console.log('submit✌✌✌✌✌✌✌✌✌')
    form.validateFields((err, values) => {
      console.log('THE LIST OF PRESCRIPTION', productsState)
      console.log('THE SUBMIT 🎉✨', err, values)
      dispatchOfPrescription({
        type: actionPrescription.CREATE_PRESCRIPTION,
        payload: {
          // Student's ID
          id: details.id,
          // vitals' values & array of complaints/tests/diagnosis
          values: values,
          // medicines array
          data: productsState,
        },
      })
    })
  }

  const arrayOfOptions = []

  const handleChange = value => {
    console.log(`Selected: `, value)
    console.log('THE TYPE OF val', typeof value)
    const lastItem = value[value.length - 1]

    console.log('THE VALUESSSSSS ', lastItem)
  }

  const EachSearchSelect = val => {
    console.log(`Selected ====>: ${val}`)
  }

  const children = []
  return (
    <div>
      <Layout>
        <Content>
          {/* onSubmit={e => handleFormSubmit(e)} */}
          <Form className="update-bank-details">
            <Divider orientation="left">General Details</Divider>
            <div>
              <Card
                style={{
                  textAlign: 'center',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Meta
                  avatar={
                    <Avatar
                      src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
                      style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid #f6f7fb',
                      }}
                    />
                  }
                  title={
                    <h5 style={{ marginTop: '20px' }}>
                      {details ? details.firstname : ''} {details ? details.lastname : ''}
                      <span
                        style={{
                          float: 'right',
                          fontSize: '12px',
                          padding: '5px',
                          color: '#0190fe',
                        }}
                      >
                        {details.isActive === true ? (
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            defaultChecked
                            // onChange={this.learnerActiveInactive}
                          />
                        ) : (
                          <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            // onChange={this.learnerActiveInactive}
                          />
                        )}
                      </span>
                    </h5>
                  }
                  description={
                    <div>
                      <div>
                        <p
                          style={{
                            fontSize: '13px',
                            marginBottom: '4px',
                          }}
                        >
                          Enrollment Status &nbsp;{' '}
                          {details.isActive ? (
                            <span style={customSpanStyle}>Active</span>
                          ) : (
                            <span style={inActiveSpanStyle}>In-Active</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '13px',
                            marginBottom: '4px',
                          }}
                        >
                          <span>{details ? details.email : ''}</span>
                        </p>
                      </div>
                    </div>
                  }
                />
              </Card>
            </div>
            <br />
            {/* <Button type="primary" onClick={getComplaints('adhd')}>
              Click me
            </Button> */}
            <Divider orientation="left">Vitals</Divider>
            <div style={{ display: 'flow-root' }}>
              <div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  width: '250px',
                }}
              >
                <Form.Item style={itemStyle2} label="Height">
                  {form.getFieldDecorator('height')(
                    <Input placeholder="cm" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  width: '250px',
                }}
              >
                <Form.Item style={itemStyle2} label="Weight">
                  {form.getFieldDecorator('weight')(
                    <Input placeholder="Kg" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  width: '300px',
                }}
              >
                <Form.Item style={itemStyle2} label="Temperature">
                  {form.getFieldDecorator('temperature')(
                    <Input
                      placeholder="Celcious"
                      style={{ ...inputStyle2, marginLeft: '15px' }}
                    ></Input>,
                  )}
                </Form.Item>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  width: '350px',
                }}
              >
                <Form.Item style={itemStyle2} label="Head Circumference">
                  {form.getFieldDecorator('headCircumference')(
                    <Input placeholder="cm" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
            </div>
            {/* The complaints list */}
            <GetComplaints form={form} />
            {/* The diagnosis list */}
            <GetDiagnosis form={form} />
            {/* The test list */}
            <GetTest form={form} />
            {prescriptions.loadingPrescriptions !== true &&
            prescriptions.isSpecificPrescription !== false ? (
              <>
                {/*[Explaination]
                  *  The "Global-State" for "PrescriptionItemTable" component is the "productState"
                  * @productDispatch ==> The setter function of product state
                  * @totalAmount ==> The count of list item which is initially set to zero
                      (Further understanding would be mentioned inside the "PrescriptionItemTable")
                  */}
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
              <>Display Loading</>
            )}
            {/* advice:"Test Advice"
            nextVisit:"2 Days"
            nextVisitDate:"2021-04-01"
            testDate:"2021-04-01" */}
            <Form.Item {...layout1} label="Advice">
              {form.getFieldDecorator('advice')(
                <TextArea placeholder="Advice" autoSize={{ minRows: 2, maxRows: 5 }} allowClear />,
              )}
            </Form.Item>
            <Form.Item {...layout1} label="Next Visit">
              {form.getFieldDecorator('nextVisitNumber')(
                <InputNumber min={0} max={1000} onChange={onChangeInputNumber} />,
              )}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('nextVisitVal')(
                <Radio.Group onChange={onChangeNextVisitVal}>
                  <Radio.Button value="days">days</Radio.Button>
                  <Radio.Button value="weeks">weeks</Radio.Button>
                  <Radio.Button value="months">months</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item {...layout1} label="Next Visit Date">
              {form.getFieldDecorator('nextVisitDate')(<DatePicker />)}
            </Form.Item>
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
                  {/* htmlType="submit" */}
                  Update
                </Button>
              </Popconfirm>
              <Button type="ghost" style={{ margin: 5 }}>
                Cancel
              </Button>
            </div>
            {/* <Form.Item>
              <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item> */}
          </Form>
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)
