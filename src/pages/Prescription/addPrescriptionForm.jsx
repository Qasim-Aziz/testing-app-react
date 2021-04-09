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
  notification,
  Popconfirm,
  Card,
  Avatar,
  Table,
} from 'antd'
import { connect, useSelector, useDispatch } from 'react-redux'
import PrescriptionTable from './PrescriptionTableComponent'
/*The below imports are commented because we don't use those anymore */
import actionPrescription from '../../redux/prescriptions/actions'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { PrescriptionItemContext } from './context'
import productReducer from './reducer'
import PrescriptionItemTable from './prescriptionItemTable'

const { Header, Content } = Layout
const { Text, Title } = Typography
const { Meta } = Card

const MedicineTable = props => {
  /* inputFields 👉 array of objects */

  const [inputFields, setInputFields] = useState([
    {
      name: '', // ENCORATE 100ML
      medicineType: '', // SYP
      dosage: '', // 1-1-1
      unit: '', // ml
      when: '', // Before Breakfast
      frequency: '', // Daily
      duration: '', // 30 days
    },
  ])

  const handleSubmit = e => {
    e.preventDefault()
    console.log('InputFields', inputFields)
  }

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map(i => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i
    })
    setInputFields(newInputFields)
  }
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { name: '', medicineType: '', dosage: '', unit: '', when: '', frequency: '', duration: '' },
    ])
  }

  const handleRemoveFields = id => {
    const values = [...inputFields]
    values.splice(
      values.findIndex(value => value.id === id),
      1,
    )
    setInputFields(values)
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 5,
    },
    {
      title: 'Name',
      editable: true,
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Medicine Type',
      editable: true,
      dataIndex: 'type',
      width: 10,
    },
    {
      title: 'Dosage',
      editable: true,
      dataIndex: 'type',
      width: 10,
    },
    {
      title: 'Unit',
      editable: true,
      dataIndex: 'type',
      width: 5,
    },
    {
      title: 'When',
      editable: true,
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Frequency',
      editable: true,
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Duration',
      editable: true,
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Duration',
      width: 50,
      render: row => {
        console.log('THE ROW VALUE', row)
        return <Button onClick={handleRemoveFields(index)}>DELETE</Button>
      },
    },
  ]

  return <div></div>
}

const BankDetails = props => {
  const { form, details } = props
  console.log('The state', props)
  const prescriptions = useSelector(state => state.prescriptions)
  const dispatchOfPrescription = useDispatch()
  console.log('THE LOCAL STATE for getting prescription', prescriptions, dispatchOfPrescription)
  /* productsState ==> holds the array of all the medicines in the list 
     productsDispatch ==> The local "Reducer" for updating the reducer which will hold each row items 
     ⭐ NOTE: Here we have defined the initialState of the reducer to an empty array but 
              we need to pass the latest prescription details.
  */
  useEffect(() => {
    console.log(
      '******************* THE COMPONENT Did mount method ie it will run only once ******************* ',
    )
  }, [])

  const [productsState, productsDispatch] = useReducer(productReducer, [])
  const [subTotal, setSubTotal] = useState(0)
  const role = useSelector(state => state.user.role)
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

  const handleSubmitt = e => {
    e.preventDefault()
    console.log('submit✌✌✌✌✌✌✌✌✌')
    form.validateFields((err, values) => {
      console.log('THE LIST OF PRESCRIPTION', productsState)
      console.log('THE SUBMIT 🎉✨', err, values)
      dispatchOfPrescription({
        type: actionPrescription.CREATE_PRESCRIPTION,
        payload: {
          id: details.id,
          value: values,
          data: productsState,
        },
      })
    })
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    console.log('submitedddd')
    // const data = new

    form.validateFields((err, values) => {
      console.log('THE LIST OF PRESCRIPTION', productsState)
      console.log('THE SUBMIT 🎉✨', err, values)
    })
  }

  const handleChange = value => {
    console.log(`Selected: ${value}`)
  }

  const children = []
  return (
    <div>
      <Layout>
        <Content>
          <Form className="update-bank-details" onSubmit={e => handleFormSubmit(e)}>
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
                        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                          Enrollment Status &nbsp;{' '}
                          {details.isActive ? (
                            <span style={customSpanStyle}>Active</span>
                          ) : (
                            <span style={inActiveSpanStyle}>In-Active</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                          <span>{details ? details.email : ''}</span>
                        </p>
                      </div>
                    </div>
                  }
                />
              </Card>
            </div>
            <br />
            <Divider orientation="left">Vitals</Divider>
            <div style={{ display: 'flow-root' }}>
              <div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
                <Form.Item style={itemStyle2} label="Height">
                  {form.getFieldDecorator('height')(
                    <Input placeholder="cm" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
              <div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
                <Form.Item style={itemStyle2} label="Weight">
                  {form.getFieldDecorator('weight')(
                    <Input placeholder="Kg" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
              <div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
                <Form.Item style={itemStyle2} label="Temperature">
                  {form.getFieldDecorator('temperature')(
                    <Input
                      placeholder="Celcious"
                      style={{ ...inputStyle2, marginLeft: '15px' }}
                    ></Input>,
                  )}
                </Form.Item>
              </div>
              <div style={{ display: 'inline-block', float: 'left', width: '350px' }}>
                <Form.Item style={itemStyle2} label="Head Circumference">
                  {form.getFieldDecorator('headCircumference')(
                    <Input placeholder="cm" style={inputStyle2}></Input>,
                  )}
                </Form.Item>
              </div>
            </div>
            {/* There will be a predefined list of complaints which the user will select  */}
            <Form.Item {...layout1} label="Complaints">
              {form.getFieldDecorator('complaints')(
                <Select
                  mode="tags"
                  style={inputStyle3}
                  placeholder="Please select"
                  initialValue={['a10', 'c12']}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>,
              )}
            </Form.Item>

            <Form.Item {...layout1} label="Diagnosis">
              {form.getFieldDecorator('diagnosis')(
                <Select
                  mode="tags"
                  style={inputStyle3}
                  placeholder="Please select"
                  initialValue={['a10', 'c12']}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>,
              )}
            </Form.Item>
            {
              /*[Explaination]
               *  The "Global-State" for "PrescriptionItemTable" component is the "productState"
               * @productDispatch ==> The setter function of product state
               * @totalAmount ==> The count of list item which is initially set to zero
                   (Further understanding would be mentioned inside the "PrescriptionItemTable")
               */

              <PrescriptionItemContext.Provider value={productsDispatch}>
                <PrescriptionItemTable
                  style={{ marginTop: 25 }}
                  totalAmount={subTotal}
                  products={productsState}
                  dispatch={productsDispatch}
                />
              </PrescriptionItemContext.Provider>
            }
            {/* ********************* I was trying my own stuff but this didn't workout ********************* */}
            {/* <div style={{ display: 'block', marginTop: 40 }}>
              <PrescriptionTable />
              {/* <MedicineTable
                data={() => (
                  <Form.Item>
                    <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                )}
              /> * /}
            </div> */}
            {/* ****************************************** END ****************************************** */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <Popconfirm
                title="Are you sure all the details filled are correct ?"
                onConfirm={handleSubmitt}
              >
                <Button loading={false} type="primary" htmlType="submit" style={{ margin: 5 }}>
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
          {/* ************************************************************************************** */}
          {/* <Divider orientation="left">Meds</Divider>
          <div style={{ display: 'block', marginTop: 40 }}>
            <MedicineTable />
            {/* <PrescriptionItemContext.Provider value={productsDispatch}>
                <PrescriptionItemTable
                  style={{ marginTop: 25 }}
                  totalAmount={subTotal}
                  products={productsState}
                  dispatch={productsDispatch}
                />
              </PrescriptionItemContext.Provider> * /}
          </div> */}
        </Content>
      </Layout>
    </div>
  )
}

export default Form.create()(BankDetails)

/*
  <PrescriptionItemContext.Provider value={productsDispatch}>
    <PrescriptionItemTable
      style={{ marginTop: 25 }}
      totalAmount={subTotal}
      products={productsState}
      dispatch={productsDispatch}
    />
  </PrescriptionItemContext.Provider>
*/

/*
    let countryState = ''
  let country = ''
  let DrName = ''
  let designation = ''
  if (role === 'school_admin') {
    const reduxCountry = useSelector(state => state.user.clinicCountry)
    if (reduxCountry) country = reduxCountry
    DrName = useSelector(state => state.user.clinicName)
    designation = 'Clinic Head'
  }
  if (role === 'therapist') {
    const reduxCountry = useSelector(state => state.user.staffCountry)
    const reduxState = useSelector(state => state.user.staffState)
    if (reduxCountry) country = reduxCountry
    if (reduxState) countryState = reduxState
    DrName = useSelector(state => state.user.staffName)
    designation = useSelector(state => state.user.staffName.designation)
  }


*/

/*
<form className="table-form" onSubmit={handleSubmit}>
        <table border="1" cellSpacing="10">
          <thead>
            <tr bgcolor="tomato">
              <th>Name</th>
              <th>Med Type</th>
              <th>Dosage</th>
              <th>Unit</th>
              <th>When</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Function</th>
            </tr>
          </thead>
          <tbody>
            {inputFields.map((inputField, index) => (
              <tr key={index}>
                {console.log('THE INPUT FIELDs 🚩', inputField)}
                <td>{inputField.name}</td>
                <td>{inputField.medicineType}</td>
                <td>{inputField.dosage}</td>
                <td>{inputField.unit}</td>
                <td>{inputField.when}</td>
                <td>{inputField.frequency}</td>
                <td>{inputField.duration}</td>
                <td>
                  {
                    <>
                      <PlusOutlined />
                      <DeleteOutlined />
                    </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Button
          className="button-class"
          // variant="contained"
          // color="primary"
          type="submit"
          // endIcon={<Icon>send</Icon>}
          onClick={handleSubmit}
        >
          Send
        </Button> * /}
        {props.data()}
      </form>
*/
