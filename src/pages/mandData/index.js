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
} from 'antd'
import { MinusOutlined, PlusOutlined, LineChartOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import Calendar from 'components/Calander'
import './index.scss'
import { ResponsiveLine } from '@nivo/line'
import FilterComp from '../../components/FilterCard/FilterComp'
import GraphComponent from './graphComponent'

const { Content } = Layout
const { Title, Text } = Typography

const MAND_DATA = gql`
  query getMandData($studentId: ID!, $dateGte: Date!, $dateLte: Date!) {
    getMandData(dailyClick_Student: $studentId, dateGte: $dateGte, dateLte: $dateLte) {
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
  mutation createDailyClick($studentId: ID!, $mandTitle: String!) {
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

  const [date, setDate] = useState({
    gte: moment()
      .subtract(4, 'weeks')
      .format('YYYY-MM-DD'),
    lte: moment().format('YYYY-MM-DD'),
  })
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
      dateGte: date.gte,
      dateLte: date.lte,
    },
  })

  const [recodeMandData, { data: mandNewData, error: mandNewDataError }] = useMutation(
    RECORD_MAND_DATA,
  )

  const [
    createNewMand,
    { data: newMandRes, error: newMandError, loading: newMandLoading },
  ] = useMutation(CREATE_NEW_MAND, {
    variables: {
      studentId,
      mandTitle,
    },
  })

  useEffect(() => {
    if (mandNewData || newMandCreated) {
      refetch()
      setNewMandCreated(false)
    }
  }, [mandNewData, newMandCreated, refetch])

  useEffect(() => {
    if (mandNewData) {
      console.log(mandNewData)
    }
  }, [mandNewData])

  useEffect(() => {
    if (newMandRes) {
      notification.success({
        message: 'Mand Data',
        description: 'New Mand Created Successfully',
      })
      setMandTitle('')
      setNewMandCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMandRes])

  useEffect(() => {
    if (newMandError) {
      notification.error({
        message: 'Opps I cant create new mand for some reson',
      })
    }
  }, [newMandError])

  useEffect(() => {
    if (mandNewDataError) {
      console.log(mandNewDataError)
    }
  }, [mandNewDataError])

  const handleSelectDate = (newDate, value) => {
    setDate({
      gte: moment(value[0]).format('YYYY-MM-DD'),
      lte: moment(value[1]).format('YYYY-MM-DD'),
    })
  }

  const searchValHandler = e => {
    console.log(e.target.value)
    setSearchVal(e.target.value)
  }

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

  const showDrawer = () => {
    updateDrawerForm(true)
  }

  const onClickClose = () => {
    updateDrawerForm(false)
  }

  useEffect(() => {
    updateDrawerForm(openRightdrawer)
  }, [openRightdrawer])

  useEffect(() => {
    if (data && searchVal) {
      const filteredData = data?.getMandData.edges.filter(item =>
        item.node.dailyClick.measurments.toLowerCase().includes(searchVal),
      )
      console.log(filteredData)
      setMandData({
        getMandData: {
          edges: filteredData,
        },
      })
    } else setMandData(data)
  }, [data, searchVal])

  // const [
  //   getSelectedMand,
  //   { data: selectedStaffData, error: selectedStaffError, loading: selectedStaffLoading },
  // ] = useLazyQuery(MAND_INFO)

  // useEffect(() => {
  //   if(newGraphDrawer){
  //     getSelectedMand({
  //       variables: {
  //         mandId: activeMand,
  //         date: date
  //       },
  //     })
  //     // alert('True');
  //   }
  // }, [newGraphDrawer, activeMand, date, getSelectedMand])
  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 17,
      offset: 1,
    },
  }
  const formTailLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8, offset: 6 },
  }

  return (
    <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
      <Helmet title="Dashboard Alpha" />
      <FilterComp
        handleSelectDate={handleSelectDate}
        searchVal={searchVal}
        searchValHandler={searchValHandler}
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
              <div>
                <div
                  style={{
                    marginTop: 17,
                  }}
                >
                  {/* {data &&
                    <pre>
                      {JSON.stringify(data.getClickData.edges, null, 2)}
                    </pre>} */}
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                      {mandData &&
                        mandData.getMandData.edges.map(({ node }, index) => {
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
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 16,
                                    margin: 0,
                                  }}
                                >
                                  {studnetInfo && studnetInfo.student.firstname}&apos;s requests for{' '}
                                  {node.dailyClick.measurments}
                                </div>

                                <Button
                                  style={{ marginLeft: 'auto' }}
                                  onClick={() => {
                                    let newDailyClickData = dailyClickData
                                    if (dailyClickData > 0) {
                                      newDailyClickData -= 1
                                      console.log(node)
                                      recodeMandData({
                                        variables: {
                                          id: node.dailyClick.id,
                                          data: newDailyClickData,
                                          date: node.date,
                                        },
                                      })
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
                                    console.log(node)
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
              </div>
            </Col>
            <Drawer
              title="New Mand Data"
              width="50%"
              placement="right"
              closable="true"
              visible={showDrawerForm && TabCheck === 'Mand Data'}
              onClose={closeDrawer}
            >
              <Form
                onSubmit={e => SubmitForm(e)}
                name="control-ref"
                {...formItemLayout}
                colon={false}
              >
                <Form.Item label={<span style={{ fontSize: '16px' }}>Enter Item Name</span>}>
                  <Input
                    value={mandTitle}
                    onChange={e => setMandTitle(e.target.value)}
                    placeholder="Enter Item Name"
                    name="mandTitle"
                    required
                  />
                </Form.Item>

                <Form.Item {...formTailLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: 180,
                      height: 40,
                      borderRadius: 0,
                    }}
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
                <Form onSubmit={e => SubmitForm(e)} name="control-ref" style={{ marginLeft: 0 }}>
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
                      style={{
                        width: '100%',
                        height: 40,
                        marginTop: 0,
                        fontSize: 14,
                        background: '#0B35B3',
                      }}
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
