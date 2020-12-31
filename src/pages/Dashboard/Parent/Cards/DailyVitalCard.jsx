import React from 'react'
import { Typography, Empty, Badge } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import Spinner from '../../Spinner'

const { Text } = Typography

const DAILY_VITALS = gql`
  query GetDailyVitals($studentId: ID!) {
    meal: getFood(student: $studentId, last: 5) {
      edges {
        node {
          id
          mealType
          mealName
          date
          foodType {
            name
          }
        }
      }
    }
    mand: getMandData(dailyClick_Student: $studentId, last: 5) {
      edges {
        node {
          id
          data
          date
          dailyClick {
            id
            measurments
          }
        }
      }
    }
    medical: getMedication(student: $studentId, last: 5) {
      edges {
        node {
          id
          date
          condition
          severity {
            name
          }
        }
      }
    }
    toilet: getToiletData(student: $studentId, success: true, last: 5) {
      edges {
        node {
          id
          date
          time
          success
          urination
          bowel
        }
      }
    }
    abc: getABC(studentId: $studentId, date: "2020-04-12") {
      edges {
        node {
          id
          date
          frequency
          time
          Intensiy
          response
          Duration
        }
      }
    }
    behaviour: getBehaviour(studentId: $studentId) {
      edges {
        node {
          id
          behaviorName
          definition
          time
        }
      }
    }
  }
`

const SingleRecord = ({ type, data }) => {
  let row = (
    <div style={{ color: '#222', textAlign: 'center' }}>Not found any handler for this type.</div>
  )

  switch (type) {
    case 'meal': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>{data.mealName}</span>
            <span style={{ color: '#888' }}> - {data.foodType.name}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <Badge count={data.mealType} className="processing-badge" />
            <span style={{ marginLeft: 5, color: '#222' }}>{data.date}</span>
          </span>
        </>
      )
      break
    }
    case 'mand': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>{data.data}</span>
            <span style={{ color: '#888' }}> - {data.dailyClick.measurments}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <span style={{ marginLeft: 5, color: '#222' }}>{data.date}</span>
          </span>
        </>
      )
      break
    }
    case 'medical': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>{data.condition}</span>
            <span style={{ color: '#888' }}> - {data.severity.name}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <span style={{ marginLeft: 5, color: '#222' }}>{data.date}</span>
          </span>
        </>
      )
      break
    }
    case 'toilet': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>
              {moment(data.date).format('YYYY-MM-DD')}
            </span>
            <span style={{ color: '#888' }}> - {data.time}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <Badge
              count={data.success ? 'Success' : 'Failed'}
              className={data.success ? 'success-badge' : 'danger-badge'}
            />
          </span>
        </>
      )
      break
    }
    case 'abc': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>
              {moment(data.date).format('YYYY-MM-DD')}
            </span>
            <span style={{ color: '#888' }}> - {data.time}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <span style={{ marginLeft: 5, color: '#222' }}>{data.Intensiy}</span>
          </span>
        </>
      )
      break
    }
    case 'behaviour': {
      row = (
        <>
          <div style={{ flex: 3 }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>{data.behaviorName}</span>
            <span style={{ color: '#888' }}> - {data.definition}</span>
          </div>
          <span style={{ flex: 1.5, color: '#222', textAlign: 'right' }}>
            <span style={{ marginLeft: 5, color: '#222' }}>
              {moment(data.time).format('YYYY-MM-DD hh:mm')}
            </span>
          </span>
        </>
      )
      break
    }
    default:
      row = (
        <div style={{ color: '#222', textAlign: 'center' }}>
          Not found any handler for this type.
        </div>
      )
  }
  return (
    <a className="hover_me_item single-row" href="#/therapistStudentDailyVitals">
      {row}
    </a>
  )
}

const DailyVitalCard = ({ type }) => {
  const studentId = localStorage.getItem('studentId')
  const { loading, data, error } = useQuery(DAILY_VITALS, {
    variables: {
      studentId,
    },
    errorPolicy: 'all',
    onError(err) {
      console.log(err);
    },
  })
  const filtered = data && data[type]?.edges

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {filtered && filtered.length === 0 && <Empty />}
      {filtered &&
        filtered.map(({ node }, index) => (
          <div
            key={node.id}
            style={{ borderBottom: index === filtered.length - 1 ? 'none' : '1px solid #ddd' }}
          >
            <SingleRecord type={type} data={node} />
          </div>
        ))}
      {filtered && filtered.length === 5 && (
        <div className="more-row">
          <a href="#/therapistStudentDailyVitals">
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>More...</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default DailyVitalCard
