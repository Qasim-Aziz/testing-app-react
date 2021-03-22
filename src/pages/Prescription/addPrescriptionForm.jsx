/* eslint-disable */
import React, { useEffect, useState, useReducer } from 'react'
import {
	Form,
	Button,
	Input,
	Select,
	Layout,
	Typography,
	Divider,
	notification,
	Popconfirm,
	Card,
	Avatar
} from 'antd'
import { useSelector } from 'react-redux'
import { PrescriptionItemContext } from './context'
import productReducer from './reducer'
import PrescriptionItemTable from './prescriptionItemTable'


const { Header, Content } = Layout
const { Text, Title } = Typography
const { Meta } = Card

const itemStyle = {
	display: 'flex',
	marginRight: '25px',
	justifyContent: 'flex-end',
	marginTop: -15
}
const itemStyle2 = {
	display: 'flex',
	marginRight: '25px',
	// justifyContent: 'flex-end',
	marginTop: -15
}
const itemStyle3 = {
	display: 'flex',
	marginRight: '25px',
	// justifyContent: 'flex-end',
	marginTop: -15
}

const inputStyle = {
	width: '200px',
	borderRadius: 0,
	border: 'none',
	borderBottom: '2px solid'
}
const inputStyle2 = {
	width: '160px',
	borderRadius: 0,
	border: 'none',
	borderBottom: '2px solid'
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

const BankDetails = ({ form, setBankDetailsDrawer }) => {

	const [productsState, productsDispatch] = useReducer(productReducer, [])
	const [subTotal, setSubTotal] = useState(0)

	const role = useSelector(state => state.user.role)
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


	const handleSubmitt = e => {
		console.log('submit')
	}

	const handleChange =(value) => {
		console.log(`Selected: ${value}`);
	}

	const children = [];


	return (
		<div>
			<Layout>
				<Content>
					<Form className="update-bank-details">
						{/* <Divider orientation="left">General Details</Divider> */}
						<div style={{ display: 'flow-root' }}>
							<div style={{ display: 'inline-block', float: 'left', width: '300px' }}>
								<Meta
									style={{ marginBottom: -8 }}
									avatar={<Avatar icon="user" />}
									title={<><Title style={{ marginBottom: 0 }} level={4}>{DrName}</Title><Text type="warning">{designation}</Text></>}
									description={`${country}, ${countryState}`}
								/>
							</div>
							<div style={{ display: 'inline-block', float: 'right', width: '400px' }}>
								<Form.Item style={itemStyle} label="Learner">
									{form.getFieldDecorator('learnerName', {
										rules: [{ required: true, message: 'Please provide learner name' }],
									})(<Input placeholder="Name" style={inputStyle}></Input>)}
								</Form.Item>
							</div>
						</div>
						<br />
						<Divider orientation="left">Vitals</Divider>
						<div style={{ display: 'flow-root' }}>
							<div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
								<Form.Item style={itemStyle2} label="Height">
									{form.getFieldDecorator('height')(<Input placeholder="cm" style={inputStyle2}></Input>)}
								</Form.Item>
							</div>
							<div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
								<Form.Item style={itemStyle2} label="Weight">
									{form.getFieldDecorator('weight')(<Input placeholder="Kg" style={inputStyle2}></Input>)}
								</Form.Item>
							</div>
							<div style={{ display: 'inline-block', float: 'left', width: '250px' }}>
								<Form.Item style={itemStyle2} label="Temperature">
									{form.getFieldDecorator('temperature')(<Input placeholder="Celcious" style={inputStyle2}></Input>)}
								</Form.Item>
							</div>
							<div style={{ display: 'inline-block', float: 'left', width: '350px' }}>
								<Form.Item style={itemStyle2} label="Head Circumference">
									{form.getFieldDecorator('headCircumference')(<Input placeholder="cm" style={inputStyle2}></Input>)}
								</Form.Item>
							</div>
						</div>
						<Form.Item {...layout1} label="Complaints">
							{form.getFieldDecorator('complaints')(
								<Select
									mode="tags"
									style={inputStyle3}
									placeholder="Please select"
									defaultValue={['a10', 'c12']}
									onChange={handleChange}
									style={{ width: '100%' }}
								>
									{children}
								</Select>
							)}
						</Form.Item>

						<Form.Item {...layout1} label="Diagnosis">
							{form.getFieldDecorator('diagnosis')(
								<Select
									mode="tags"
									style={inputStyle3}
									placeholder="Please select"
									defaultValue={['a10', 'c12']}
									onChange={handleChange}
									style={{ width: '100%' }}
								>
									{children}
								</Select>
							)}
						</Form.Item>


						<div style={{ display: 'block', marginTop: 40 }}>
							<PrescriptionItemContext.Provider value={productsDispatch}>
								<PrescriptionItemTable
									style={{ marginTop: 25 }}
									totalAmount={subTotal}
									products={productsState}
									dispatch={productsDispatch}
								/>
							</PrescriptionItemContext.Provider>
						</div>



						<div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
							<Popconfirm
								title="Are you sure all the details filled are correct ?"
								onConfirm={handleSubmitt}
							>
								<Button
									loading={false}
									type="primary"
									htmlType="submit"
									style={{ margin: 5 }}
								>
									Update
                </Button>
							</Popconfirm>
							<Button type="ghost" style={{ margin: 5 }}>
								Cancel
              </Button>
						</div>
					</Form>
				</Content>
			</Layout>
		</div>
	)
}

export default Form.create()(BankDetails)
