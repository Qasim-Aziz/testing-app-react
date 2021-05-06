/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { useQuery } from 'react-apollo'
import AllFilesData from './AllFilesData'
import { GET_STAFF_DATA, GET_STUDENT_DATA } from './query'

const AllFiles = ({ learnerId, staffId, isLearnerById, isStaffById, handleUserName }) => {
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
          handleUserName={handleUserName}
        />
      </div>
    </>
  )
}

export default AllFiles
