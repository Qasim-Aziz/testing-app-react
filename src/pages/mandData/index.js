/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import {
  Row,
  Col,
  Layout,
  Typography,
  Form,
  Input,
  Button,
  notification,
  Tooltip,
  Drawer,
  DatePicker,
  Tabs,
} from 'antd'
import { MinusOutlined, PlusOutlined, LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import './index.scss'
import { COLORS, DRAWER, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import FilterComp from '../../components/FilterCard/FilterComp'
import GraphComponent from './graphComponent'

const { Content } = Layout
const { Title, Text } = Typography
const { layout, tailLayout } = FORM

const MAND_DATA = gql`
  query getMandData($studentId: ID!, $date: Date!) {
    getMandData(dailyClick_Student: $studentId, date: $date) {
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
  }
`

const GET_CLICK_DATA = gql`
  query($date: Date, $student: ID) {
    getClickData(student: $student, date: $date) {
      edges {
        node {
          id
          measurments
          createdAt
        }
      }
    }
  }
`

const RECORD_MAND_DATA = gql`
  mutation recordMand($id: ID!, $data: Int!, $date: Date!) {
    recordMand(input: { dailyData: { dailyClick: $id, date: $date, data: $data } }) {
      details {
        id
        date
        data
        dailyClick {
          id
          measurments
        }
      }
    }
  }
`

const CREATE_NEW_MAND = gql`
  mutation($studentId: ID!, $mandTitle: String!) {
    createDailyClick(input: { clickData: { student: $studentId, measurments: $mandTitle } }) {
      details {
        id
        measurments
        student {
          id
          firstname
        }
      }
    }
  }
`

const STUDNET_INFO = gql`
  query student($studentId: ID!) {
    student(id: $studentId) {
      firstname
    }
  }
`

const MandDataPage = props => {
  const [newGraphDrawer, setGraphDrawer] = useState(false)
  const { openRightdrawer, closeDrawer, handleFilterToggle, filter, TabCheck } = props

  const [activeMand, setActiveMand] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [mandData, setMandData] = useState(null)
  const [mandCards, setMandCards] = useState(null)
  const [originalMandCards, setOriginalMandCards] = useState(null)
  const [date, setDate] = useState(moment())
  const [newMandCreated, setNewMandCreated] = useState(false)
  const [mandTitle, setMandTitle] = useState('')
  const studentId = localStorage.getItem('studentId')
  const [showDrawerForm, updateDrawerForm] = useState(false)

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })

  const { data, loading, error, refetch } = useQuery(MAND_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      studentId,
      date: date.format('YYYY-MM-DD'),
    },
  })

  const [recodeMandData] = useMutation(RECORD_MAND_DATA)

  const [createNewMand, { data: newMandRes, loading: newMandLoading }] = useMutation(
    CREATE_NEW_MAND,
    {
      variables: {
        studentId,
        mandTitle,
      },
    },
  )

  const { data: clickData, loading: clickDataLoading, error: clickDataError } = useQuery(
    GET_CLICK_DATA,
    {
      variables: {
        student: studentId,
        date: date.format('YYYY-MM-DD'),
      },
    },
  )

  useEffect(() => {
    if (newMandRes) {
      notification.success({
        message: 'Mand Data',
        description: 'New Mand Created Successfully',
      })
      refetch()
      setMandTitle('')
      setNewMandCreated(true)
      closeDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMandRes])

  const SubmitForm = e => {
    e.preventDefault()
    createNewMand()
  }

  const openGraphDrawer = values => {
    setGraphDrawer(state => !state)
    if (!newGraphDrawer) {
      setActiveMand(values.variables.mandId)
    }
  }

  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])

  useEffect(() => {
    if (data) {
      const filteredData = data?.getMandData.edges.filter(item =>
        item.node.dailyClick.measurments.toLowerCase().includes(searchVal),
      )
      setMandData(filteredData)
    } else {
      setMandData(data?.getMandData.edges)
    }
    if (originalMandCards && originalMandCards.length > 0) {
      const ftd = originalMandCards.filter(item =>
        item.node.measurments.toLowerCase().includes(searchVal),
      )
      setMandCards(ftd)
    } else {
      setMandCards(originalMandCards)
    }
  }, [data, searchVal])

  useEffect(() => {
    if (clickData?.getClickData && data?.getMandData) {
      const gg = clickData.getClickData.edges.filter(item => {
        const tt = data.getMandData.edges
        for (let i = 0; i < tt.length; i++) {
          if (tt[i].node.dailyClick.id === item.node.id) {
            return false
          }
        }
        return true
      })

      setMandCards(gg)
      setOriginalMandCards(gg)
    }
  }, [clickData, data])

  const container = {
    background: COLORS.palleteLight,
    position: 'relative',
    display: 'flex',
    height: '50px',
    padding: '2px 8px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  }
  const Headstyle = {
    fontSize: '16px',
    paddingTop: '7px',
    color: 'blaxk',
    marginRight: '10px',
  }

  return (
    <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <div style={container}>
        <span>
          <span style={Headstyle}>Date : </span>
          <DatePicker
            defaultValue={date}
            onChange={e => (e ? setDate(e) : null)}
            style={{ width: '240px', marginRight: 40 }}
          />
        </span>
        <span>
          <span style={Headstyle}>Mand : </span>
          <Input.Search
            allowClear
            style={{ width: '200px', marginRight: 40 }}
            placeholder="Search..."
            onChange={e => setSearchVal(e.target.value)}
          />
        </span>
      </div>
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
              <Tabs>
                <Tabs.TabPane tab="Records" key="Records">
                  <div style={{ marginTop: 17 }}>
                    {loading ? (
                      <LoadingComponent />
                    ) : (
                      <>
                        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                        {mandData &&
                          mandData.map(({ node }, index) => {
                            // eslint-disable-next-line no-shadow
                            const dailyClickData = node.data
                            return (
                              <div
                                id={node.id}
                                key={node.id}
                                style={{
                                  background: '#FFFFFF',
                                  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                                  borderRadius: 10,
                                  padding: '10px',
                                  position: 'relative',
                                  marginTop: index !== 0 ? 10 : 0,
                                  width: '1108px',
                                  border: '2px solid #2a8ff7',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <div style={{ fontSize: 16, margin: 0 }}>
                                    {studnetInfo && studnetInfo.student.firstname}&apos;s requests
                                    for {node.dailyClick.measurments}
                                  </div>

                                  <Button
                                    style={{ marginLeft: 'auto' }}
                                    onClick={() => {
                                      let newDailyClickData = dailyClickData
                                      if (dailyClickData > 0) {
                                        newDailyClickData -= 1
                                        recodeMandData({
                                          variables: {
                                            id: node.dailyClick.id,
                                            data: newDailyClickData,
                                            date: node.date,
                                          },
                                        })
                                          .then(res => {
                                            notification.success({
                                              message: 'Data recorded successfully',
                                            })
                                            refetch()
                                            setNewMandCreated(false)
                                          })
                                          .catch(err => console.error(err, 'err'))
                                      }
                                    }}
                                  >
                                    <MinusOutlined />
                                  </Button>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      lineHeight: '19px',
                                      color: '#2E2E2E',
                                      marginLeft: 9,
                                      marginRight: 19,
                                    }}
                                  >
                                    {dailyClickData}
                                  </Text>
                                  <Button
                                    onClick={() => {
                                      recodeMandData({
                                        variables: {
                                          id: node.dailyClick.id,
                                          date: node.date,
                                          data: dailyClickData + 1,
                                        },
                                      })
                                    }}
                                  >
                                    <PlusOutlined />
                                  </Button>
                                  <Tooltip title="Mand Graph">
                                    <Button
                                      style={{
                                        marginLeft: 9,
                                      }}
                                      onClick={() => {
                                        openGraphDrawer({
                                          variables: {
                                            mandId: node.id,
                                          },
                                        })
                                      }}
                                    >
                                      <LineChartOutlined />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </div>
                            )
                          })}
                      </>
                    )}
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Mand" key="Mand">
                  <div style={{ marginTop: 17 }}>
                    {clickDataLoading ? (
                      <LoadingComponent />
                    ) : (
                      <>
                        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                        {mandCards &&
                          mandCards.map(({ node }, index) => {
                            // eslint-disable-next-line no-shadow
                            const dailyClickData = 0
                            return (
                              <div
                                id={node.id}
                                key={node.id}
                                style={{
                                  background: '#FFFFFF',
                                  boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                                  borderRadius: 10,
                                  padding: '10px',
                                  position: 'relative',
                                  marginTop: index !== 0 ? 10 : 0,
                                  width: '1108px',
                                  border: '2px solid #2a8ff7',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <div style={{ fontSize: 16, margin: 0 }}>
                                    {studnetInfo && studnetInfo.student.firstname}&apos;s requests
                                    for {node.measurments}
                                  </div>
                                  <Button
                                    onClick={() => {
                                      recodeMandData({
                                        variables: {
                                          id: node.id,
                                          date: moment().format('YYYY-MM-DD'),
                                          data: dailyClickData + 1,
                                        },
                                      })
                                    }}
                                  >
                                    Record
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                      </>
                    )}
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </Col>
            <Drawer
              title="New Mand Data"
              width={DRAWER.widthL2}
              placement="right"
              closable
              visible={showDrawerForm && TabCheck === 'Mand Data'}
              onClose={closeDrawer}
            >
              <Form onSubmit={e => SubmitForm(e)} name="control-ref" {...layout} colon={false}>
                <Form.Item label="Enter Item Name">
                  <Input
                    value={mandTitle}
                    onChange={e => setMandTitle(e.target.value)}
                    placeholder="Enter Item Name"
                    name="mandTitle"
                    required
                  />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={SUBMITT_BUTTON}
                    loading={newMandLoading}
                  >
                    Save Mand
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>
            <Col span={8} style={{ display: 'none' }}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '30px',
                  lineHeight: '41px',
                }}
              >
                New Mand
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                }}
              >
                <Form {...layout} onSubmit={e => SubmitForm(e)} name="control-ref">
                  <Form.Item label="Enter Item Name">
                    <Input
                      value={mandTitle}
                      onChange={e => setMandTitle(e.target.value)}
                      placeholder="Item Name"
                      name="mandTitle"
                      required
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={SUBMITT_BUTTON}
                      loading={newMandLoading}
                    >
                      Save Mand
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
          <Drawer
            handler={false}
            width="900px"
            visible={newGraphDrawer}
            placement="right"
            onClose={openGraphDrawer}
            title="Mand Graph"
          >
            <div
              style={{
                minHeight: 400,
                height: 400,
                background: '#fff',
                padding: '30px 40px',
                paddingTop: 0,
              }}
            >
              <GraphComponent
                key={activeMand}
                mandId={activeMand}
                studentId={studentId}
                date={date}
              />
            </div>
          </Drawer>
        </Content>
      </Layout>
    </Authorize>
  )
}

export default MandDataPage
