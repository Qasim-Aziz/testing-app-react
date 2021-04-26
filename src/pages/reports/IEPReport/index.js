/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import groupObj from '@hunters/group-object'
import moment from 'moment'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import { Row, Col, DatePicker, Button, Table } from 'antd'
import { GOAL_STATUS, DOMAIN_MASTERED, GOALS_DETAILS, TARGET, DEFAULT_GOALS } from './query'

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
// therapist shift time
//  reminder for repitition of srs2 and vbmapp

function Index({ showDrawerFilter, selectedStudentId }) {
  const [metLongGoals, setMetLongGoals] = useState(null)
  const [longTableData, setLongTableData] = useState(null)
  const [shortTableData, setShortTableData] = useState(null)

  const [start, setStart] = useState(
    moment('2017-01-01')
      .startOf('M')
      .format('YYYY-MM-DD'),
  )
  const [end, setEnd] = useState(moment().format('YYYY-MM-DD'))

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
        status: [
          'R29hbFN0YXR1c1R5cGU6Mg==',
          'R29hbFN0YXR1c1R5cGU6Mw==',
          'R29hbFN0YXR1c1R5cGU6NQ==',
          'R29hbFN0YXR1c1R5cGU6Ng==',
          'R29hbFN0YXR1c1R5cGU6NA==',
        ],
        start,
        end,
      },
    },
  )

  // const { data: targetData, loading: targetLoading, error: targetError } = useQuery(DEFAULT_GOALS, {
  //   variables: {
  //     studentId: selectedStudentId,
  //   },
  // })

  // console.log(targetData, targetLoading, targetError, ' target data')

  useEffect(() => {
    if (longGoalsDetails) {
      const temp = []
      const tempLong = []
      let tempShort = []

      longGoalsDetails.goalsLongProgressReport.map(item => {
        console.log(item, 'long goal --------------------------')
        const endDate = moment(item.goal.dateEnd)
        const today = moment().startOf('M')
        const sixMonths = moment().add(6, 'M')

        if (today <= endDate && endDate < sixMonths) {
          tempLong.push({
            goal: item.goal.goalName,
            key: Math.random(),
            goalId: item.goal.id,
            dateInitiated: item.goal.dateInitialted,
            dateEnd: item.goal.dateEnd,
            status: item.goal.goalStatus.status,
            dateMastered: item.dateMastered,
            masteryDays: item.masteryDays,
          })
        }
        item.goal.shorttermgoalSet?.edges.map(short => {
          console.log(short.node, 'short ??????????????')
          const endShort = moment(short.node.dateEnd)

          if (today <= endShort && endShort < sixMonths) {
            tempShort.push({
              key: Math.random(),
              shortGoal: short.node.goalName,
              shortGoalId: short.node.id,
              status: short.node.goalStatus.status,
              longGoal: item.goal.goalName,
              longGoalId: item.goal.id,
              dateInitiated: short.node.dateInitialted,
              dateEnd: short.node.dateEnd,
              dateMastered: short.node.masterDate,
            })
          }
          short.node.targetAllocateSet?.edges.map(({ node: target }) =>
            target.targetStatus.statusName === 'Mastered'
              ? temp.push({
                  dateMastered: target.masterDate,
                  targetName: target.targetAllcatedDetails.targetName,
                  shortGoal: short.node.goalName,
                  longGoal: item.goal.goalName,
                  longGoalId: item.goal.id,
                  shortGoalId: short.node.id,
                  targetId: target.targetAllcatedDetails.id,
                  key: target.id,
                })
              : null,
          )
        })
      })
      // console.log(tempLong)
      // console.log(temp)

      console.log(tempShort)
      const groupedData = groupObj.group(tempShort, 'longGoal')
      const keys = Object.keys(groupedData)
      tempShort = []
      keys.map(key => {
        let tt = groupedData[key]
        tt.forEach((t, index) => {
          index === 0 ? tempShort.push(t) : tempShort.push({ ...t, longGoal: null })
        })
      })

      setMetLongGoals(temp)
      setShortTableData(tempShort)
      setLongTableData(tempLong)
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
      title: 'Target Name',
      dataIndex: 'targetName',
    },
    {
      title: 'Short Term Goal',
      dataIndex: 'shortGoal',
    },
    {
      title: 'Date Mastered',
      dataIndex: 'dateMastered',
    },
  ]

  const longCol = [
    {
      title: 'Goal Name',
      dataIndex: 'goal',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Date Initiated',
      dataIndex: 'dateInitiated',
    },
    {
      title: 'Date End',
      dataIndex: 'dateEnd',
    },
  ]

  const shortCol = [
    {
      title: 'Long Term Goal',
      dataIndex: 'longGoal',
    },
    {
      title: 'Short Term Goal',
      dataIndex: 'shortGoal',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Date Initiated',
      dataIndex: 'dateInitiated',
    },
    {
      title: 'Date End',
      dataIndex: 'dateEnd',
    },
  ]
  function disabledDate(current) {
    return current && current >= moment().endOf('M')
  }

  // console.log(domainData, domainLoading, domainError, 'doamin')
  // console.log(data, loading, error)
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
            <Table
              columns={columns}
              loading={longGoalsLoading}
              dataSource={metLongGoals}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['20', '30', '50', '100'],
                position: 'top',
              }}
            />
          </div>
        </Col>
        <Col sm={24}>
          <div style={{ margin: '20px 0 0 10px' }}>
            <Table
              columns={longCol}
              loading={longGoalsLoading}
              dataSource={longTableData}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['20', '30', '50', '100'],
                position: 'top',
              }}
            />
          </div>
        </Col>
        <Col sm={24}>
          <div style={{ margin: '20px 0 0 10px' }}>
            <Table
              columns={shortCol}
              loading={longGoalsLoading}
              dataSource={shortTableData}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['20', '30', '50', '100'],
                position: 'top',
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Index
