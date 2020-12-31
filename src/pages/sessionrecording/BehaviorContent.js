/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Layout, Typography, Button } from 'antd'
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

  return (
    <div>
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
          <Row gutter={[46, 0]}>
            <Col span={9}>
              <Title
                style={{
                  marginLeft: '30px',
                  fontSize: '25px',
                  lineHeight: '41px',
                }}
              >
                {newTampletFromOpen ? 'New Behavior Templates' : 'Behavior Templates'}
              </Title>
              <div
                style={{
                  background: '#F9F9F9',
                  borderRadius: 10,
                  padding: '30px',
                  paddingBottom: '20px',
                }}
              >
                {updateTempId ? (
                  <UpdateTemplateForm tempId={updateTempId} setUpdateTempId={setUpdateTempId} />
                ) : (
                  <div>
                    {newTampletFromOpen ? (
                      <TemplateForm
                        setNewTampletFromOpen={setNewTamplateFromOpen}
                        setNewTamplate={setNewTamplate}
                      />
                    ) : (
                      <div>
                        {dancleTemplateLoading ? (
                          <div
                            style={{
                              height: 'calc(100vh - 320px)',
                              minHeight: 'calc(100vh - 320px)',
                            }}
                          >
                            Loading...
                          </div>
                        ) : (
                          <Scrollbars
                            style={{
                              height: 'calc(100vh - 320px)',
                              minHeight: 'calc(100vh - 320px)',
                            }}
                            autoHide
                          >
                            {dancleTemplateError && 'Opps their is something wrong'}

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
                                  setSelectTamplate={setSelectTamplate}
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
                            setNewTamplateFromOpen(true)
                          }}
                          style={{
                            width: '100%',
                            height: 40,
                            background: '#0B35B3',
                            boxShadow:
                              '0px 2px 4px rgba(96, 97, 112, 0.16), 0px 0px 1px rgba(40, 41, 61, 0.04) !importent',
                            borderRadius: 8,
                            fontSize: 17,
                            fontWeight: 'bold',
                            marginTop: 10,
                          }}
                        >
                          New Template
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Col>
            <Col span={15}>
              <div
                style={{
                  marginTop: 25,
                }}
              >
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
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  )
}
