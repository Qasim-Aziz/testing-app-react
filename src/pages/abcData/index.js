/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Layout, Typography, Drawer, Tooltip, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import { DRAWER } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import Calendar from 'components/Calander'
import ABCCard from './ABCCard'
import AbcForm from './AbcForm'
import { ABC, STUDNET_INFO } from './query'
import UpdateAbcForm from './UpdateAbcForm'
import FilterComp from '../../components/FilterCard/FilterComp'

const { Content } = Layout
const { Title } = Typography

const AbcDataPage = props => {
  const [date, setDate] = useState({
    gte: moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
    lte: moment().format('YYYY-MM-DD'),
  })
  const [updateAbc, setUpdateAbc] = useState()
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props

  const studentId = localStorage.getItem('studentId')

  const { data, loading, error, refetch } = useQuery(ABC, {
    variables: {
      studentId,
      dateGte: date.gte,
      dateLte: date.lte,
    },
    fetchPolicy: 'network-only',
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const handleSelectDate = (newDate, value) => {
    setDate({
      gte: moment(value[0]).format('YYYY-MM-DD'),
      lte: moment(value[1]).format('YYYY-MM-DD'),
    })
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
      <FilterComp
        handleSelectDate={handleSelectDate}
        startDate={date.gte}
        endDate={date.lte}
        rangePicker
      />
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
              <div
                style={{
                  marginTop: 17,
                }}
              >
                {loading ? (
                  <LoadingComponent />
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
            </Col>
            <Drawer
              title={updateAbc ? 'Update ABC Data' : 'New ABC Data'}
              width={DRAWER.widthL2}
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
                <AbcForm refetchAbc={refetch} closeDrawer={closeDrawer} />
              )}
            </Drawer>
          </Row>
        </Content>
      </Layout>
    </Authorize>
  )
}

export default AbcDataPage
