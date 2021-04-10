import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import { Row, Col, DatePicker, Button, Table } from 'antd'
import { GOAL_STATUS, DOMAIN_MASTERED, GOALS_DETAILS } from './query'

const { MonthPicker } = DatePicker

const filterCardStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: '10px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
  backgroundColor: COLORS.palleteLight,
}
const parentLabel = { fontSize: '15px', color: '#000', marginRight: '6px' }

const graphHead = {
  textAlign: 'center',
  padding: 5,
  backgroundColor: COLORS.palleteLight,
  color: 'black',
}
const dateFormat = 'YYYY-MM-DD'

function Index({ showDrawerFilter, selectedStudentId }) {
  const [metLongGoals, setMetLongGoals] = useState(null)

  const [start, setStart] = useState(
    moment('2017-01-01')
      .startOf('M')
      .format('YYYY-MM-DD'),
  )
  const [end, setEnd] = useState(
    moment('2022-10-02')
      .endOf('M')
      .format('YYYY-MM-DD'),
  )

  const { data, loading, error } = useQuery(GOAL_STATUS, {
    variables: { studentId: selectedStudentId },
  })

  const { data: domainData, loading: domainLoading, error: domainError } = useQuery(
    DOMAIN_MASTERED,
    {
      variables: {
        studentId: selectedStudentId,
        dateGte: start,
        dateLte: end,
      },
    },
  )

  const { data: longGoalsDetails, loading: longGoalsLoading, error: longGoalsError } = useQuery(
    GOALS_DETAILS,
    {
      variables: {
        studentId: selectedStudentId,
        status: ['R29hbFN0YXR1c1R5cGU6NA=='],
        start,
        end,
      },
    },
  )

  useEffect(() => {
    if (longGoalsDetails) {
      let temp = []

      temp = longGoalsDetails.goalsLongProgressReport.map(item => ({
        masteryDays: item.masteryDays,
        dateMastered: item.dateMastered,
        goalName: item.goal.goalName,
        dateInitiated: item.goal.dateInitialted,
        dateEnd: item.goal.dateEnd,
      }))
      temp.sort((a, b) => new Date(a.dateEnd) - new Date(b.dateEnd))
      setMetLongGoals(temp)
    }
  }, [longGoalsDetails])

  const handleMonthChange = val => {
    if (val) {
      const month = moment(val, 'YYYY-MM-DD').format('YYYY-MM')
      const currentMonth = moment().format('YYYY-MM')
      if (month === currentMonth) {
        setStart(val.format('YYYY-MM-DD'))
        setEnd(moment().format('YYYY-MM-DD'))
      } else {
        setStart(val.format('YYYY-MM-DD'))
        setEnd(
          moment(val)
            .endOf('M')
            .format('YYYY-MM-DD'),
        )
      }
    }
  }

  const columns = [
    {
      title: 'Goal Name',
      dataIndex: 'goalName',
    },
    {
      title: 'Date Initiated',
      dataIndex: 'dateInitiated',
    },
    {
      title: 'Date End',
      dataIndex: 'dateEnd',
    },
    {
      title: 'Date Mastered',
      dataIndex: 'dateMastered',
    },
    {
      title: 'Mastery Days',
      dataIndex: 'masteryDays',
    },
  ]

  function disabledDate(current) {
    return current && current >= moment().endOf('M')
  }

  console.log(domainData, domainLoading, domainError, 'doamin')
  console.log(data, loading, error)
  console.log(metLongGoals, 'metlonggoals')
  return (
    <div>
      <Row>
        <Col sm={24}>
          <div style={filterCardStyle}>
            <span style={{ float: 'left' }}>
              <span style={parentLabel}>Month: </span>
              <MonthPicker
                defaultValue={moment(start)}
                disabledDate={disabledDate}
                onChange={handleMonthChange}
              />
            </span>
          </div>
        </Col>
        <Col sm={24}>
          <div style={{ margin: '10px 0 0 10px' }}>
            <Table columns={columns} loading={longGoalsLoading} dataSource={metLongGoals} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Index
