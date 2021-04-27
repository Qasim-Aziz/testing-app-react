/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import { EditOutlined } from '@ant-design/icons'
import {
	Button,
	Card,
	Col,
	Drawer,
	Form,
	Icon,
	Input,
	Radio,
	Row,
	Select,
	Tabs,
	Typography,
	Table,
	Layout,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import GoalCard from 'components/GoalCard'
import EditTargetAllocationNewDrawer from 'components/TargetAllocation/EditTargetAllocation'
import TargetAllocationNewDrawer from 'components/TargetAllocation/TargetAllocation'
import { arrayNotNull, capitalize, notNull } from 'utilities'
import { COLORS, DRAWER, FONT } from 'assets/styles/globalStyles'
import LoadingComponent from '../../staffProfile/LoadingComponent'
import AddLongAndShortGoal from '../AddLongAndShortGoal'
import AllocatedTarget from './AllocatedTarget'
import EquivalenceDrawer from './EquivalenceTargetAllocationDrawer'
import CogniAbleDrawer from './FromCogniable'
import {
	getDefaultGoals,
	getGoalResponsibility,
	getGoalStatus,
	getLongTermGoals,
	getPatients,
} from './TargetAllocation.query'
import TargetAvailableDrawer from './TargetAllocationDrawer'
import './style.scss'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Content } = Layout


const categoryArray = [
	{
		"id": 1,
		"name": "SRS2"
	},
	{
		"id": 2,
		"name": "IISA"
	},
	{
		"id": 3,
		"name": "SRS"
	},
	{
		"id": 4,
		"name": "SRS4"
	},
]

const studentResponse = [
	{
		"id": 1,
		"studentName": "Aryan",
		"similarityScore": 23,
		"age": 12,
		"gender": 'male',
		"targets": [
			{
				"id": 1,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},
			{
				"id": 2,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},
			{
				"id": 3,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},

		]
	},
	{
		"id": 2,
		"studentName": "Mayank",
		"similarityScore": 23,
		"age": 12,
		"gender": 'male',
		"targets": [],
	},
	{
		"id": 3,
		"studentName": "Chintu",
		"similarityScore": 23,
		"age": 12,
		"gender": 'male',
		"targets": [
			{
				"id": 1,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},
			{
				"id": 2,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},
			{
				"id": 3,
				"targetName": " I'm first Target",
				"StudentName": "Aryan"
			},

		]
	},
	{
		"id": 4,
		"studentName": "Yo Yo",
		"similarityScore": 23,
		"age": 12,
		"gender": 'male',
		"targets": [],
	},

]

const AssessmentContent = () => {
	let stdId = ''
	if (!(localStorage.getItem('studentId') === null) && localStorage.getItem('studentId')) {
		stdId = JSON.parse(localStorage.getItem('studentId'))
	}
	const dispatch = useDispatch()
	dispatch({
		type: 'user/GET_STUDENT_NAME',
	})

	



	const getExpandedRowRender = row => (
    <Table
      rowKey="id"
      dataSource={row.targets}
      columns={getGridColumns(true)}
      bordered
      showHeader
      pagination={false}
      size="small"
    />
  )


	const getGridColumns = (isForNestedGrid) => {

		if (isForNestedGrid)
      return [
        {
          title: 'Student Name',
          dataIndex: 'StudentName',
        },
        {
          title: 'Target Name',
          dataIndex: 'targetName',
        },
      ]

    return [
      {
        title: 'Student Name',
        dataIndex: 'studentName',
      },
      {
        title: 'Similarity Score',
        dataIndex: 'similarityScore',
        align: 'right',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        align: 'right',
			},
			{
        title: 'Gender',
        dataIndex: 'gender',
        align: 'right',
      },
    ]
	}



	return (
		<>
			<div
				style={{
					// border: '2px solid #ccc',
					padding: 10,
					height: 650,
					background: '#fff',
					overflow: 'auto',
				}}
			>

				{categoryArray.map(item =>
					<div>
						<Text style={{padding: 10, margin: 0}}>{item.name}</Text>
						<Table
							className="frequencyTable"
							rowKey="date"
							columns={getGridColumns()}
							dataSource={studentResponse}
							expandedRowRender={getExpandedRowRender}
							expandRowByClick
							// pagination={{
							// 	defaultPageSize: 25,
							// 	position: 'top',
							// 	showSizeChanger: false,
							// 	pageSizeOptions: ['25', '50', '100', '250'],
							// }}
							size="small"
							bordered
						/>
					</div>
				)}

			</div>
		</>
	)
}

export default AssessmentContent
