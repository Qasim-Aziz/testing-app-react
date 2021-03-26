/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, notification, Popover, Tabs } from 'antd'
import DataTable from 'react-data-table-component'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import PrescriptionList from './prescriptionList'
import AddPrescription from './addPrescriptionForm'


const { Content } = Layout
const { Column } = Table
const { TabPane } = Tabs

export default () => {
	const [addPrescriptionDrawer, setAddPrescriptionDrawer] = useState(false)

	const paymentDetailsButton = (
		<Button style={{ backgroundColor: '#07a7fc', borderColor: '#07a7fc', color: 'white', fontWeight: '5px' }} onClick={() => setAddPrescriptionDrawer(true)}>Add Prescription</Button>
	)

	return (
		<>
			<Helmet title="Prescription" />
			<Layout style={{ padding: '0px' }}>
				<Tabs tabBarExtraContent={paymentDetailsButton}>
					<TabPane tab="Prescriptions" key="Prescriptions">
						<PrescriptionList />
					</TabPane>
				</Tabs>
			</Layout>
			<Drawer
				width="80%"
				title="Add Prescription"
				closable={true}
				visible={addPrescriptionDrawer}
				onClose={() => setAddPrescriptionDrawer(false)}
				destroyOnClose
			>
				<AddPrescription setAddPrescriptionDrawer={setAddPrescriptionDrawer} />
			</Drawer>

		</>
	)
}
