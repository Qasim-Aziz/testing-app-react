import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography, Drawer, Tooltip, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import ToiletCard from './ToiletCard'
import ToiletForm from './Toiletform'
import UpdateToiletForm from './UpdateToiletForm'
import FilterComp from '../../components/FilterCard/FilterComp'
import { TOILET_DATA } from './query'

const { Content } = Layout
const { Title } = Typography

const STUDNET_INFO = gql`
  query student($student: ID!) {
    student(id: $student) {
      firstname
    }
  }
`

const ToiletDataPage = props => {
  const [date, setDate] = useState({
    gte: moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
    lte: moment().format('YYYY-MM-DD'),
  })
  const [newToiletDate, setNewToiletDate] = useState(date)
  const [newToiletDataCreated, setNewToiletDataCreated] = useState(false)
  const [updateToilet, setUpdateToilet] = useState()
  const studentId = localStorage.getItem('studentId')
  const [showDrawerForm, updateDrawerForm] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck, openDrawer } = props
  const { data, loading, error, refetch } = useQuery(TOILET_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      student: studentId,
      dateGte: date.gte,
      dateLte: date.lte,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      student: studentId,
    },
  })

  useEffect(() => {
    if (newToiletDate === date && newToiletDataCreated) {
      refetch()
      setNewToiletDataCreated(false)
    }
  }, [newToiletDate, refetch, date, newToiletDataCreated])

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
    <div>
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
          <Row gutter={[46, 0]}>
            <Col span={24}>
              {/* <Calendar value={date} handleOnChange={handleSelectDate} /> */}
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
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {data &&
                        data.getToiletData.edges.map(({ node }, index) => {
                          return (
                            <ToiletCard
                              dataObj={node}
                              key={node.id}
                              id={node.id}
                              urination={node.urination}
                              bowel={node.bowel}
                              prompted={node.prompted}
                              time={node.time}
                              waterValue={node.waterIntake}
                              style={{ marginTop: index === 0 ? 0 : 10 }}
                              setUpdateToilet={setUpdateToilet}
                              selectDate={date}
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
              title={updateToilet ? 'Update Toilet Data' : 'Record Toilet Data'}
              width="52%"
              placement="right"
              closable="true"
              visible={showDrawerForm && TabCheck === 'Toilet Data'}
              onClose={closeDrawer}
            >
              {updateToilet ? (
                <UpdateToiletForm
                  data={updateToilet}
                  selectDate={date}
                  setOpen={setUpdateToilet}
                  refetch={refetch}
                  closeDrawer={closeDrawer}
                />
              ) : (
                <ToiletForm
                  handleNewToiletDate={newDate => {
                    setNewToiletDate(newDate)
                  }}
                  selectDate={date}
                  setNewToiletCreated={setNewToiletDataCreated}
                />
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
                {updateToilet ? 'Update Toilet Data' : 'Record Toilet Data'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                {updateToilet ? (
                  <UpdateToiletForm
                    data={updateToilet}
                    selectDate={date}
                    setOpen={setUpdateToilet}
                    refetch={refetch}
                  />
                ) : (
                  <ToiletForm
                    handleNewToiletDate={newDate => {
                      setNewToiletDate(newDate)
                    }}
                    selectDate={date}
                    setNewToiletCreated={setNewToiletDataCreated}
                  />
                )}
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  )
}

export default ToiletDataPage
