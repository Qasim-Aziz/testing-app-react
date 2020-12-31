import React, { useEffect, useState } from 'react'
import { Select, Typography, Button } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Scrollbars from 'react-custom-scrollbars'
import EmployeCard from './EmployeCard'
import CreateStaffForm from './CreateStaffForm'

const { Title, Text } = Typography
const { Option } = Select

const EMPLOYES = gql`
  query {
    employee: staffs {
      edges {
        node {
          id
          name
          designation
        }
      }
    }
  }
`

const EmployesCard = ({ style, activeEm, setActiveEm }) => {
  const { loading, data, error } = useQuery(EMPLOYES)
  const [staffForm, setStaffForm] = useState(false)

  useEffect(() => {
    if (data) {
      if(data.employee.edges.length > 0)
      {
        setActiveEm(data.employee.edges[0].node.id)
      }     
    }
  }, [data, setActiveEm])

  return (
    <div
      style={{
        background: '#f9f9f9',
        borderRadius: 10,
        padding: '32px 27px 20px',
        ...style,
      }}
    >
      {loading ? (
        <div style={{ minHeight: 'calc(100vh - 202px)' }}>Loading...</div>
      ) : (
        <>
          {error && (
            <div style={{ minHeight: 'calc(100vh - 202px)' }}>
              <Text type="danger">Opp&apos;s their is something wrong</Text>
            </div>
          )}
          {data && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Title
                  style={{
                    fontSize: 20,
                    lineHeight: '27px',
                  }}
                >
                  Staff List
                </Title>
                <Select
                  style={{
                    width: 200,
                    height: 40,
                  }}
                  size="large"
                  placeholder="Staff  List"
                  showSearch
                  optionFilterProp="name"
                  onChange={value => setActiveEm(value)}
                >
                  {data.employee.edges.map(({ node }) => {
                    return (
                      <Option value={node.id} name={node.name}>
                        {node.name}
                      </Option>
                    )
                  })}
                </Select>
              </div>

              <Scrollbars
                autoHide
                style={{
                  height: 'calc(100vh - 320px)',
                }}
              >
                {data.employee.edges.map(({ node }, index) => {
                  return (
                    <EmployeCard
                      key={node.key}
                      name={node.name}
                      designation={node.designation}
                      profileImg={node.profileImg}
                      leaveRequest={node.leaveRequest}
                      status={node.cfStatus}
                      active={node.id === activeEm}
                      style={{ marginTop: index !== 0 ? 18 : 0 }}
                      onClick={() => {
                        setActiveEm(node.id)
                      }}
                    />
                  )
                })}
              </Scrollbars>
              <Button
                type="primary"
                style={{
                  marginTop: 20,
                  fontSize: 16,
                  lineHeight: '22px',
                  width: '100%',
                  height: 40,
                  color: 'rgba(11, 53, 179, 0.65)',
                  background: '#FFFFFF',
                  border: '1px solid #0B35B3',
                  borderRadius: 4,
                }}
                onClick={() => setStaffForm(true)}
              >
                Add New Staff
              </Button>
              <CreateStaffForm open={staffForm} setOpen={setStaffForm} />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default EmployesCard
