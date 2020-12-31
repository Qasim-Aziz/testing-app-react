import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Typography, Progress, Row, Col } from 'antd'

const { Title, Text } = Typography

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

const Card = ({ children, style }) => {
  return (
    <div
      style={{
        border: '1px solid #E4E9F0',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default () => {
  const programId = localStorage.getItem('peakId')

  const { data, loading, error } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: programId,
    },
  })

  if (loading) {
    return <h4>Loading...</h4>
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const ProgressCard = ({ color, value, title }) => {
    return (
      <Col span={4}>
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
            percent={(value / data.peakDataSummary.total) * 100}
            strokeColor={color}
            showInfo={false}
          />
        </Card>
      </Col>
    )
  }

  return (
    <div
      style={{
        maxWidth: 1300,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 450 }}>
          <Card style={{ padding: 10, height: 90 ,marBottom:20}}>
            <div>
              <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#4cde49' }}>{data.peakDataSummary.total}</Text>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 600,
                  fontSize: 13,
                  marginLeft: 10,
                }}
              >
                Total Line item
              </Text>
            </div>
            <Progress
              percent={100}
              strokeColor="#4cde49"
              showInfo={false}
            />
          </Card>
          <Card style={{ padding: 10, height: 90 ,marginTop:20}}>
            <div>
              <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#e58425' }}>{data.peakDataSummary.totalAttended}</Text>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 600,
                  fontSize: 13,
                  marginLeft: 10,
                }}
              >
                Total Attended Items
              </Text>
            </div>
            <Progress
              percent={(data.peakDataSummary.totalAttended / data.peakDataSummary.total) * 100}
              strokeColor="#e58425"
              showInfo={false}
            />
          </Card>
          {/* <Card
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              height: 148,
              flexDirection: 'column',
            }}
          >
            <Title style={{ fontSize: 24, fontWeight: 600, color: '#FFB164' }}>
              Total Attended Items
            </Title>
            <Text style={{ fontSize: 24, fontWeight: 600, color: '#FFB164' }}>
              {data.peakDataSummary.total}
            </Text>
          </Card>
          <Card
            style={{
              marginTop: 29,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFB164',
              color: '#fff',
              height: 148,
              flexDirection: 'column',
            }}
          >
            <Title style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>
              Total Attended Items
            </Title>
            <Text style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>
              {data.peakDataSummary.totalAttended}
            </Text>
          </Card> */}
        </div>
        <div
          style={{
            width: 794,
            border: '1px solid #E4E9F0',
            borderRadius: 10,
            background: '#fff',
            height: 326,
            boxSizing: 'border-box',
          }}
        >
          grap
        </div>
      </div>
      <Row style={{ marginTop: 45 }} gutter={[20, 30]}>
        <ProgressCard
          color="#4CDE49"
          title="Correct Answers"
          value={data.peakDataSummary.totalCorrect}
        />
        <ProgressCard
          color="#FF7474"
          title="Incorrect Answers"
          value={data.peakDataSummary.totalIncorrect}
        />
        <ProgressCard
          color="#B7B7B7"
          title="No Response"
          value={data.peakDataSummary.totalNoResponse}
        />
        <ProgressCard
          color="#E58425"
          title="Suggest Target"
          value={data.peakDataSummary.totalSuggested}
        />
        <ProgressCard
          color="#D54015"
          title="Skip Question"
          value={data.peakDataSummary.totalSkipped}
        />
      </Row>
    </div>
  )
}
