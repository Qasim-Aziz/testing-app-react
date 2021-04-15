/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, notification, Popover, Tabs } from 'antd'
import DataTable from 'react-data-table-component'

const customStyles = {
	header: {
		style: {
			maxHeight: '50px',
		},
	},
	headRow: {
		style: {
			borderTopStyle: 'solid',
			borderTopWidth: '1px',
			borderTopColor: '#ddd',
			backgroundColor: '#f5f5f5',
		},
	},
	headCells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				borderRightColor: '#ddd',
			},
			height: '40px',
			padding: '12px 8px 12px',
			fontWeight: 'bold',
		},
	},
	cells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				borderRightColor: '#ddd',
			},
			padding: '6px 8px',
			fontSize: '12px',
		},
	},
	pagination: {
		style: {
			position: 'absolute',
			top: '-4px',
			right: '5px',
			borderTopStyle: 'none',
			minHeight: '35px',
		},
	},
	table: {
		style: {
			paddingBottom: '16px',
			top: '16px',
		},
	},
}

export default () => {

	const columns = [
		{
			name: 'Name',
			selector: 'firstname',
			sortable: true,
			width: '150px',
			cell: row => (
				<Button
					onClick={() => this.info(row)}
					type="link"
					style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
				>
					{row.firstname} {row.lastname}
				</Button>
			),
		},
		{
			name: 'Email',
			selector: 'email',
			sortable: true,
			maxWidth: '180px',
			minWidth: '180px',
			cell: row => <span>{row.email ? row.email : ''}</span>,
		},

		{
			name: 'Contact No',
			selector: 'mobileno',
			maxWidth: '120px',
		},

		{
			name: 'Date of Birth',
			selector: 'dob',
			sortable: true,
			width: '120px',
			cell: row => <span>{row.dob ? row.dob : ''}</span>,
		},
		{
			name: 'Language',
			selector: 'language',
			cell: row => <span>{row.language ? row.language.name : ''}</span>,
			maxWidth: '90px',
			minWidth: '90px',
		},
		{
			name: 'Case Manager',
			selector: 'caseManager',
			cell: row => <span>{row.caseManager ? row.caseManager.name : ''}</span>,
			maxWidth: '120px',
		},
		{
			name: 'Client Id',
			selector: 'clientId',
			maxWidth: '90px',
			minWidth: '90px',
		},
		{
			name: 'Gender',
			selector: 'gender',
			maxWidth: '90px',
			minWidth: '90px',
			cell: row => <span style={{ textTransform: 'capitalize' }}>{row.gender}</span>,
		},
		{
			name: 'Category',
			selector: 'category',
			maxWidth: '80px',
			cell: row => <span>{row.category?.category}</span>,
		},

		{
			name: 'Clinic Location',
			selector: 'clinicLocation',
			cell: row => <span>{row.clinicLocation ? row.clinicLocation.location : ''}</span>,
			width: '140px',
		},

		{
			name: 'Address',
			selector: 'currentAddress',
			maxWidth: '160px',
		},
		{
			name: 'Assessments',
			ignoreRowClick: true,
			button: true,
			width: '210px',
			cell: obj => (
				<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
					<Button
						onClick={() => this.showAssessments(obj)}
						style={{
							padding: '0px',
							color: '#0190fe',
							border: 'none',
							fontSize: '11px',
						}}
					>
						Assessments
					</Button>
					<Button
						onClick={() => this.showProgram(obj)}
						style={{
							padding: '0px',
							color: '#0190fe',
							border: 'none',
							fontSize: '11px',
						}}
					>
						Program
					</Button>
					<Button
						onClick={() => this.showSession(obj)}
						style={{
							padding: '0px',
							color: '#0190fe',
							border: 'none',
							fontSize: '11px',
						}}
					>
						Session
					</Button>
				</div>
			),
		},
	]

	return (
		<>
			<DataTable
				title="Learners List"
				columns={columns}
				theme="default"
				dense={true}
				key="id"
				keyField="id"
				pagination={true}
				data={[]}
				customStyles={customStyles}
				noHeader={true}
				progressPending={false}
				paginationServer={true}
				paginationTotalRows={10}
				paginationRowsPerPageOptions={[10, 20, 50, 80, 100]}


			/>

		</>
	)
}
