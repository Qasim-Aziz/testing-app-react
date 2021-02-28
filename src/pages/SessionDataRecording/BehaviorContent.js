/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography, Button, Drawer, notification } from 'antd'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Scrollbars from 'react-custom-scrollbars'
import Search from 'antd/lib/input/Search'
import { useSelector } from 'react-redux'
import BehaviourCard from 'components/Behavior/BehaviorCard'
import TemplateForm from 'pages/BehaviourData/Templateform'
import UpdateTemplateForm from 'pages/BehaviourData/UpdateTemplateForm'
import TamplateCard from './Behaviour/TamplateCard'
import UpdateBehaviour from './Behaviour/UpdateBehaviour'

const { Content } = Layout
const { Title, Text } = Typography
const BEHAVIOUR_RECORD_DATA = gql`
  query getDecelData($studentId: ID!, $session: ID!) {
    getDecelData(template_Student: $studentId, session: $session) {
      edges {
        node {
          id
          irt
          note
          duration
          template {
            id
            behavior {
              behaviorName
            }
          }
          status {
            id
            statusName
          }
          frequency {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`

const GET_TEMPLETES = gql`
  query getTemplate($studentId: ID!) {
    getTemplate(student: $studentId) {
      edges {
        node {
          id
          behavior {
            id
            behaviorName
            definition
          }
          status {
            id
            statusName
          }
          environment {
            edges {
              node {
                id
              }
            }
          }
          measurments {
            edges {
              node {
                id
                measuringType
              }
            }
          }
          behaviorDescription
        }
      }
    }
  }
`

export default () => {
  const [newTamplate, setNewTamplate] = useState(false)
  const [newTampletFromOpen, setNewTamplateFromOpen] = useState(false)
  const studentId = localStorage.getItem('studentId')
  const [selectTamplate, setSelectTamplate] = useState()
  const [updateTempId, setUpdateTempId] = useState()
  const [viewBehaviorRecordData, setViewBehaviorRecordData] = useState()
  const [newRecord, setNewRecord] = useState()
  const [deleteTem, setDeleteTem] = useState()
  const [tamplateList, setTamplateList] = useState()
  const [filterTemText, setFilterTemText] = useState('')
  const [updateBehavior, setUpdateBehavior] = useState()
  const [deleteBehaviour, setDeleteBehaviour] = useState()

  const sessionId = useSelector(state => {
    return state.sessionrecording.ChildSession?.id
  })

  const { data, loading, error } = useQuery(BEHAVIOUR_RECORD_DATA, {
    fetchPolicy: 'no-cache',
    variables: {
      studentId,
      session: sessionId,
    },
  })

  const {
    data: dancleTemplateData,
    error: dancleTemplateError,
    loading: dancleTemplateLoading,
    refetch: refetchDancleTemplate,
  } = useQuery(GET_TEMPLETES, {
    variables: {
      studentId,
    },
  })

  useEffect(() => {
    if (dancleTemplateData) {
      console.log(dancleTemplateData)
    }
  }, [dancleTemplateData])

  useEffect(() => {
    if (deleteBehaviour) {
      setViewBehaviorRecordData(state => {
        return state.filter(beh => beh.node.id !== deleteBehaviour)
      })
      setDeleteBehaviour(null)
    }
  }, [deleteBehaviour])

  useEffect(() => {
    if (filterTemText.length > 0) {
      const searchText = filterTemText.trim().toLowerCase()
      const filteredTem = tamplateList.filter(tem => {
        return tem.node.behavior.behaviorName.toLowerCase().match(searchText)
      })
      setTamplateList(filteredTem)
    }
    if (filterTemText.length === 0 && dancleTemplateData) {
      setTamplateList([...dancleTemplateData.getTemplate.edges])
    }
  }, [filterTemText, dancleTemplateData])

  useEffect(() => {
    if (updateBehavior) {
      setViewBehaviorRecordData(state => {
        const newState = state.map(beh => {
          if (beh.node.id === updateBehavior.id) {
            beh.node = updateBehavior
          }
          return beh
        })
        return newState
      })
    }
  }, [updateBehavior])

  useEffect(() => {
    if (data) {
      setViewBehaviorRecordData([...data.getDecelData.edges])
    }
  }, [data])

  useEffect(() => {
    if (deleteTem) {
      setTamplateList(state => {
        return state.filter(({ node }) => node.id !== deleteTem)
      })
      setDeleteTem(null)
      setViewBehaviorRecordData(state => {
        return state.filter(({ node }) => node.template.id !== deleteTem)
      })
    }
  }, [deleteTem])

  useEffect(() => {
    if (newRecord) {
      setViewBehaviorRecordData(state => {
        return [newRecord, ...state]
      })
    }
  }, [newRecord])

  useEffect(() => {
    if (dancleTemplateData) {
      return setTamplateList([...dancleTemplateData.getTemplate.edges])
    }
  }, [dancleTemplateData])

  useEffect(() => {
    if (newTamplate) {
      setTamplateList(state => {
        return [newTamplate, ...state]
      })
      setNewTamplate(null)
      setNewTamplateFromOpen(false)
    }
  }, [newTamplate])

  const checkIsBehaviorAlreadyExist = newId => tamplateList.some(x => x.node.behavior.id === newId)

  const onCreatingTemplate = () => {
    refetchDancleTemplate({
      variables: {
        studentId,
      },
    })
    setNewTamplateFromOpen(false)
  }

  const closeUpdateDrawer = () => {
    setUpdateTempId(null)
  }

  const selectRecord = id => {
    setSelectTamplate(id)
    setNewTamplateFromOpen(false)
    setUpdateTempId(null)
  }

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Content
          style={{
            maxWidth: 1300,
            width: '100%',
            margin: '0px auto',
          }}
        >
          <Row gutter={[46, 0]}>
            <Col span={8}>
              <Title
                style={{
                  fontSize: '25px',
                  lineHeight: '41px',
                  marginLeft: '15px',
                  marginTop: '12px',
                }}
              >
                {newTampletFromOpen ? 'New Behavior Templates' : 'Behavior Templates'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '12px',
                }}
              >
                <div>
                  {dancleTemplateLoading ? (
                    <div
                      style={{
                        height: 440,
                      }}
                    >
                      Loading...
                    </div>
                  ) : (
                    <Scrollbars
                      style={{
                        height: 440,
                      }}
                      autoHide
                    >
                      {dancleTemplateError &&
                        notification.error({
                          messaage: 'Something went wrong',
                          description: 'Unable to refetch decel templates',
                        })}

                      <Search
                        placeholder="Search by template name"
                        size="large"
                        style={{
                          width: '99.70%',
                          marginLeft: 'auto',
                          marginBottom: 10,
                          marginRight: 'auto',
                        }}
                        value={filterTemText}
                        onChange={e => setFilterTemText(e.target.value)}
                      />

                      {tamplateList?.length === 0 && (
                        <div
                          style={{
                            width: '100%',
                            height: '70%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              textAlign: 'center',
                            }}
                          >
                            There is no behavior template <br />
                            Please create one.
                          </Text>
                        </div>
                      )}

                      {tamplateList?.map(({ node }, index) => {
                        return (
                          <TamplateCard
                            key={node.id}
                            id={node.id}
                            behaviourName={node.behavior.behaviorName}
                            description={node.behaviorDescription}
                            status={node.status.statusName}
                            envsNum={node.environment.edges.length}
                            style={{
                              marginTop: index === 0 ? 0 : 20,
                            }}
                            setSelectTamplate={selectRecord}
                            setDeleteTem={setDeleteTem}
                            setUpdateTempId={setUpdateTempId}
                          />
                        )
                      })}
                    </Scrollbars>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      setUpdateTempId(null)
                      setNewTamplateFromOpen(true)
                    }}
                    style={{
                      width: '100%',
                      height: 40,
                      background: '#0B35B3',
                      boxShadow:
                        '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                      borderRadius: 5,
                      fontSize: 17,
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}
                  >
                    New Template
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <Scrollbars style={{ height: 560 }} autoHide>
                  {updateTempId ? (
                    <div style={{ paddingRight: '15px' }}>
                      <UpdateTemplateForm
                        tempId={updateTempId}
                        setUpdateTempId={setUpdateTempId}
                        closeUpdateDrawer={closeUpdateDrawer}
                      />
                    </div>
                  ) : newTampletFromOpen ? (
                    <div style={{ paddingRight: '15px' }}>
                      <TemplateForm
                        onCreatingTemplate={onCreatingTemplate}
                        isBehaviorAlreadyExist={checkIsBehaviorAlreadyExist}
                        cancel={setNewTamplateFromOpen}
                      />
                    </div>
                  ) : (
                    <div>
                      {selectTamplate && (
                        <UpdateBehaviour
                          setNewTamplateFromOpen={setNewTamplateFromOpen}
                          selectTamplate={selectTamplate}
                          setNewRecord={setNewRecord}
                          setSelectTamplate={setSelectTamplate}
                          setUpdateBehavior={setUpdateBehavior}
                        />
                      )}
                      {!selectTamplate && (
                        <div>
                          {loading ? (
                            'Loading...'
                          ) : (
                            <>
                              {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                              {data &&
                                viewBehaviorRecordData &&
                                viewBehaviorRecordData.map(({ node }, index) => {
                                  return (
                                    <BehaviourCard
                                      key={node.id}
                                      id={node.id}
                                      behaviorName={node.template.behavior.behaviorName}
                                      time={node.duration}
                                      note={node.note}
                                      irt={node.irt}
                                      frequently={node.frequency.edges.length}
                                      style={{ marginTop: index === 0 ? 0 : 20 }}
                                      setDeleteBehaviour={setDeleteBehaviour}
                                    />
                                  )
                                })}
                              {data && viewBehaviorRecordData?.length === 0 && (
                                <Text>Record a behavior</Text>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Scrollbars>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  )
}
