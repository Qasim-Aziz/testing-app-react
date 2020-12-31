/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography, Drawer, Tooltip, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import Calendar from 'components/Calander'
import ABCCard from './ABCCard'
import AbcForm from './AbcForm'
import { ABC, STUDNET_INFO } from './query'
import UpdateAbcForm from './UpdateAbcForm'
import FilterComp from '../../components/FilterCard/FilterComp'

const { Content } = Layout
const { Title } = Typography

const AbcDataPage = props => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [updateAbc, setUpdateAbc] = useState()
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const studentId = localStorage.getItem('studentId')

  const { data, loading, error, refetch } = useQuery(ABC, {
    variables: {
      studentId,
      date,
    },
    fetchPolicy: 'network-only'
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const handleSelectDate = (newDate, value) => {
    setDate(moment(value).format('YYYY-MM-DD'))
  }

  const showDrawer = () => {
    updateDrawerForm(true)
  }

  const onClickClose = () => {
    updateDrawerForm(false)
  }
  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])
  return (
    <Authorize roles={['school_admin', 'parents', 'therapist']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            padding: '0px 20px',
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Row>
            <Col>
              {/* <Calendar value={date} handleOnChange={handleSelectDate} /> */}
              {filter && <FilterComp handleSelectDate={handleSelectDate} />}
              <div>
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && 'Opps their something wrong'}
                      {data?.getABC.edges.map(({ node }) => {
                        return (
                          <ABCCard
                            key={node.id}
                            style={{ marginTop: 20 }}
                            time={node.time}
                            behavior={node.behavior.edges}
                            // location={node.location.edges}
                            environment={node.environments}
                            id={node.id}
                            date={date}
                            setUpdateAbc={setUpdateAbc}
                            node={node}
                            refetchAbc={refetch}
                            openDrawer={openDrawer}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Drawer
              title={updateAbc ? 'Update ABC Data' : 'New ABC Data'}
              width="52%"
              placement="right"
              closable="true"
              visible={showDrawerForm && TabCheck === 'ABC Data'}
              onClose={closeDrawer}
            >
              {updateAbc ? (
                <UpdateAbcForm
                  updateAbc={updateAbc}
                  setUpdateAbc={setUpdateAbc}
                  closeDrawer={closeDrawer}
                />
              ) : (
                <AbcForm refetchAbc={refetch} />
              )}
            </Drawer>
            <Col span={8} style={{ display: 'none' }}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                {updateAbc ? 'Update ABC Data' : 'New ABC Data'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                {updateAbc ? (
                  <UpdateAbcForm updateAbc={updateAbc} setUpdateAbc={setUpdateAbc} />
                ) : (
                  <AbcForm refetchAbc={refetch} />
                )}
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}

export default AbcDataPage
