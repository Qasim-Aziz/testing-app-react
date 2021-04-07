/* eslint-disable camelcase */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable yoda */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from 'react-apollo'
import HeaderComponent from 'components/HeaderComponent'
import moment from 'moment'
import {
  Typography,
  Row,
  Layout,
  Col,
  Card,
  Tabs,
  Table,
  Tag,
  Select,
  Button,
  Progress,
} from 'antd'
import Triangle from './PeakTriangle'
import TableReport from './TableDGReport'

const { Content } = Layout
const { Option } = Select
const { Title, Text } = Typography
const { TabPane } = Tabs

const STUDENT_NAME_BY_ID = gql`query StudentDetails ($id: ID!) {
	student(id: $id) {
		id
		firstname
		internalNo
		mobileno
		email
		dob
		caseManager {
			id
			name
			email
			contactNo
		}
		category {
			id
			category
		}
	}
}
`

const SUMMERY = gql`
  query($program: ID!) {
    peakDataSummary(program: $program) {
      total
      totalAttended
      totalCorrect
      totalIncorrect
      totalNoResponse
      totalSkipped
      totalSuggested
      edges {
        node {
          id
          yes {
            edges {
              node {
                id
                code
              }
            }
          }
          no {
            edges {
              node {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`

export default () => {
  const programId = localStorage.getItem('peakId')
  const studentId = localStorage.getItem('studentId')
  const peakType = localStorage.getItem('peakType')
  const assesor = localStorage.getItem('userName')

  const [studentName, setStudentName] = useState('')

  if (studentId) {
    const studentQuery = useQuery(STUDENT_NAME_BY_ID, {
      fetchPolicy: 'network-only',
      variables: {
        id: studentId,
      },
    },
    )

    useEffect(() => {
      if (studentQuery && studentQuery.data) {
        setStudentName(studentQuery.data.student.firstname)
      }
    }, [studentQuery])
  }

  const { data: sumdata, loading, error } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: programId,
    },
  })


  const ProgressCard = ({ color, value, title }) => {
    return (
      <Col span={8}>
        <Card style={{ padding: 10, height: 90 }}>
          <div>
            <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
            <Text
              style={{
                color: '#000',
                fontWeight: 600,
                fontSize: 13,
                marginLeft: 10,
              }}
            >
              {title}
            </Text>
          </div>
          <Progress
            percent={(value / sumdata.peakDataSummary.total) * 100}
            strokeColor={color}
            showInfo={false}
          />
        </Card>
      </Col>
    )
  }

  return (
    <Layout style={{ padding: '0px' }}>
      <Content>
        <HeaderComponent
          leftContent="&nbsp;"
          centerContent={<span>{studentName}&apos;s PEAK Report</span>}
          rightContent="&nbsp;"
        />

        <Tabs defaultActiveKey="1" type="card" style={{ margin: 10 }}>
          <TabPane tab="Trinagle Report" key="1">
            <Triangle />
          </TabPane>
          <TabPane tab="Table Report" key="2">
            <TableReport />
          </TabPane>
          <TabPane tab="Report Summary" key="3">
            <div
              style={{
                maxWidth: 1300,
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Row style={{ marginTop: 45 }} gutter={[20, 30]}>
                <ProgressCard
                  color="#4CDE49"
                  title="Total Line Item"
                  value={sumdata?.peakDataSummary.total}
                />
                <ProgressCard
                  color="#E58425"
                  title="Total Attended"
                  value={sumdata?.peakDataSummary.totalAttended}
                />
                <ProgressCard
                  color="#4CDE49"
                  title="Correct Answers"
                  value={sumdata?.peakDataSummary.totalCorrect}
                />
                <ProgressCard
                  color="#FF7474"
                  title="Incorrect Answers"
                  value={sumdata?.peakDataSummary.totalIncorrect}
                />
                <ProgressCard
                  color="#B7B7B7"
                  title="No Response"
                  value={sumdata?.peakDataSummary.totalNoResponse}
                />
                <ProgressCard
                  color="#E58425"
                  title="Suggest Target"
                  value={sumdata?.peakDataSummary.totalSuggested}
                />
                <ProgressCard
                  color="#D54015"
                  title="Skip Question"
                  value={sumdata?.peakDataSummary.totalSkipped}
                />
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  )
}
