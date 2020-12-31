import React from 'react'
import { Typography, Row, Col, Layout } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import LeftSideFrom from './LeftSideFrom'
import MiddleSection from './MiddleSection'
import RigheSection from './RigheSection'
import defaultProfileImg from './defaultProfileImg.jpg'
import './index.scss'

const { Title, Text } = Typography
const { Content } = Layout

const QUERY = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
      lastname
      currentAddress
      family {
        members {
          edges {
            node {
              id
              memberName
              relationship {
                name
              }
            }
          }
        }
      }
      email
      parentMobile
    }
  }
`

export default () => {
  const studentId = localStorage.getItem('studentId')

  const { data, error, loading } = useQuery(QUERY, {
    variables: {
      studentId,
    },
  })

  if (loading){
    return 'Loading settings...'
  }

  return (
    <Authorize roles={['parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Parent" />
      <Layout style={{ padding: '0px' }}>
        <Content style={{ padding: '0px 20px', maxWidth: 1300, width: '100%', margin: '0px auto' }}>
          <div>
            {data && (
              <>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <img
                    src={defaultProfileImg}
                    alt=""
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      marginRight: 25,
                    }}
                  />
                  <div>
                    <Title
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        lineHeight: '33px',
                        margin: 0,
                      }}
                    >
                      {`${data.student.firstname}`}
                      {data.student.lastname && data.student.lastname}
                    </Title>
                    <Text
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '19px',
                        margin: 0,
                      }}
                    >
                      {`${data.student.currentAddress}`}
                    </Text>
                  </div>
                </div>

                <Row
                  gutter={[47, 0]}
                  style={{
                    marginTop: 41,
                  }}
                >
                  <Col span={6}>
                    <LeftSideFrom />
                  </Col>
                  <Col span={9}>
                    {data.student && data.student.family ?
                      <MiddleSection familyMembers={data.student.family.members.edges} />
                      :
                      ''
                    }
                  </Col>
                  <Col span={9}>
                    {data && (
                      <RigheSection email={data.student.email} phoneNo={data.student.parentMobile} />
                    )}
                  </Col>
                </Row>
              </>

            )}

          </div>
        </Content>
      </Layout>
    </Authorize>
  )
}
