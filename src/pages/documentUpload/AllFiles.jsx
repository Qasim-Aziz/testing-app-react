/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import gql from 'graphql-tag'
import React from 'react'
import { useQuery } from 'react-apollo'
import AllFilesData from './AllFilesData'

const GET_STUDENT_DATA = gql`
  query($id: ID!) {
    student(id: $id) {
      id
      firstname
      files {
        edges {
          node {
            id
            file
            fileName
            fileDescription
          }
        }
      }
    }
  }
`

const GET_STAFF_DATA = gql`
  query($id: ID!) {
    staff(id: $id) {
      id
      name
      files {
        edges {
          node {
            id
            file
            fileName
            fileDescription
          }
        }
      }
    }
  }
`

const AllFiles = ({ learnerId, staffId, isLearnerById, isStaffById }) => {
  const std = JSON.parse(localStorage.getItem('studentId'))
  const therapistId = JSON.parse(localStorage.getItem('therapistId'))
  const { data } = useQuery(GET_STUDENT_DATA, {
    variables: {
      id: learnerId ? learnerId : std,
    },
  })

  const { data: staffData } = useQuery(GET_STAFF_DATA, {
    variables: {
      id: staffId ? staffId : therapistId ? therapistId : '',
    },
  })

  return (
    <>
      <div className="all_file_container">
        <AllFilesData
          learnerId={learnerId}
          isLearnerById={isLearnerById}
          staffData={staffData}
          studentData={data}
          isStaffById={isStaffById}
          staffId={staffId}
        />
      </div>
    </>
  )
}

export default AllFiles
