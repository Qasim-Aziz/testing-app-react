import React from 'react'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LastAssessmentResult from './LastAssignmentsResult'

const { Text } = Typography

const STUDNET_INFO = gql`
  query student($student: ID!) {
    student(id: $student) {
      firstname
      lastname
    }
  }
`

export default ({ pageTitle, style, lastAssessment = false, questions }) => {
  const { data: studentData } = useQuery(STUDNET_INFO, {
    variables: {
      student: localStorage.getItem('studentId'),
    },
  })
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          ...style,
        }}
      >
        <Text style={{ fontSize: 20, color: '#000' }}>
          {studentData?.student.firstname} {studentData?.student.lastname}&apos;s - {pageTitle}
        </Text>
        &nbsp;
        {lastAssessment && <LastAssessmentResult questions={questions} />}
        {/* <Text style={{ fontSize: 20, color: '#000' }}>{pageTitle}</Text> */}
      </div>
      <hr />
    </>
  )
}
