import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Drawer } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import Assessments from '../../pages/LearnersProgram/LearnerAssessments'
import LearnerSelect from '../LearnerSelect'

const AssessmentsTab = props => {
  const dispatch = useDispatch()
  const selectedLearnerId = useSelector(state => state.learnersprogram.SelectedLearnerId)
  const learners = useSelector(state => state.learnersprogram.Learners)
  const user = useSelector(state => state.user)
  const student = useSelector(state => state.student)
  const [studentName, setStudentName] = useState('')
  const [visibleFilter, setVisibleFilter] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })
  }, [])

  useEffect(() => {
    if (learners.length !== 0 && student.StudentName.length === 0) {
      let selectedStu
      if (localStorage.getItem('studentId')) {
        const stuId = JSON.parse(localStorage.getItem('studentId'))
        selectedStu = learners.filter(item => item.node.id === stuId)
      } else {
        // eslint-disable-next-line prefer-destructuring
        selectedStu = learners
      }
      setStudentName(selectedStu[0].node.firstname)
    }
  }, [learners])

  const showDrawerFilter = () => {
    setVisibleFilter(true)
  }

  const onCloseFilter = () => {
    setVisibleFilter(false)
  }

  return (
    <>
      <div className="profileTab-heading">
        <p>Assessment</p>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        className="Assessment-container"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', margin: '8px 0 0 5px' }}>
            {student.StudentName.length === 0 ? studentName : student.StudentName}
          </span>
          {user?.role !== 'parents' && (
            <Button onClick={showDrawerFilter} size="large">
              <FilterOutlined />
            </Button>
          )}
          <Drawer
            visible={visibleFilter}
            onClose={onCloseFilter}
            width={350}
            title="Select Learner"
            placement="right"
          >
            <LearnerSelect />
          </Drawer>
        </div>
        <Assessments key={selectedLearnerId} />
      </div>
    </>
  )
}
export default AssessmentsTab
