/* eslint-disable no-lonely-if */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react'
import { Row, Col, Typography, Button, Progress, notification } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { history } from 'index'
import { Spinner } from 'reactstrap'
import { SUMMERY, GET_CODE_DETAILS, SEND_RESPONSE, QUIT } from './query'

const { Text } = Typography

export default ({ selectedQ, data, setSelectedQ, learner }) => {
  console.log(selectedQ, '.........................................')
  const peakId = localStorage.getItem('peakId')
  const [allreadyAnswere, setAllReadyAnswer] = useState(null)

  const { data: summeryData, loading: summeryLoading, refetch } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: peakId,
    },
  })

  const { data: quartionData, error: quartionError, loading: quartionLoading } = useQuery(
    GET_CODE_DETAILS,
    {
      variables: {
        id: selectedQ?.id,
      },
    },
  )

  const [sendResponse, { error: sendResponseError, loading: sendResponseLoading }] = useMutation(
    SEND_RESPONSE,
    {
      update(cache) {
        if (allreadyAnswere === null && summeryData) {
          if (!summeryData.peakDataSummary.lastRecord) {
            refetch()
          }
          const summeryCacheData = cache.readQuery({
            query: SUMMERY,
            variables: {
              program: peakId,
            },
          })

          cache.writeQuery({
            query: SUMMERY,
            variables: {
              program: peakId,
            },
            data: {
              peakDataSummary: {
                ...summeryCacheData.peakDataSummary,
                totalAttended: summeryCacheData.peakDataSummary.totalAttended + 1,
              },
            },
          })
        }
      },
    },
  )

  const [
    finishAssignment,
    { data: finishRes, error: finishError, loading: quitLoading },
  ] = useMutation(QUIT, {
    variables: {
      programId: peakId,
    },
  })

  useEffect(() => {
    if (quartionData && summeryData) {
      const yes = summeryData.peakDataSummary.edges[0]?.node.yes.edges.find(({ node }) => {
        return node.id === quartionData.peakCodeDetails.id
      })
      if (yes) {
        setAllReadyAnswer('y')
      } else {
        const no = summeryData.peakDataSummary.edges[0]?.node.no.edges.find(({ node }) => {
          return node.id === quartionData.peakCodeDetails.id
        })
        if (no) {
          setAllReadyAnswer('n')
        } else {
          setAllReadyAnswer(null)
        }
      }
    }
  }, [quartionData, summeryData])

  useEffect(() => {
    if (summeryData && data && !selectedQ) {
      if (summeryData?.peakDataSummary?.lastRecord) {
        let selectFullData
        // const s = data?.peakGetCodes?.edges.forEach(({ node }, index) => {
        //   if (node.id === summeryData.peakDataSummary.lastRecord.id) {
        //     selectFullData = {
        //       id: data?.peakGetCodes?.edges[index + 1]?.node.id,
        //       index: index + 1,
        //     }
        //   }
        // })
        if (selectFullData?.id) {
          setSelectedQ(selectFullData)
        } else {
          setSelectedQ({
            id: data?.peakGetCodes?.edges[0]?.node.id,
            index: 0,
          })
        }
      } else {
        setSelectedQ({ id: data?.peakGetCodes?.edges[0]?.node.id, index: 0 })
      }
    }
  }, [summeryData, data, selectedQ, setSelectedQ])

  useEffect(() => {
    if (finishRes) {
      history.push('/peakResult')
    }
    if (finishError) {
      notification.error({
        message: 'Error to quit PEAK assigment',
      })
    }
  }, [finishRes, finishError])

  useEffect(() => {
    if (sendResponseError) {
      notification.error({
        message: "Their are something wrong. Can't send response",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendResponseError])

  const nextQua = nowIndex => {
    const id = data[nowIndex + 1]?.node.id
    // console.log(id,'idddddddddddddddddddd');
    if (id) {
      setSelectedQ({ id, index: nowIndex + 1 })
    }
  }

  const prevQua = nowIndex => {
    const id = data[nowIndex - 1]?.node.id
    if (id) {
      setSelectedQ({ id, index: nowIndex - 1 })
    }
  }

  const handleSendRes = ans => () => {
    sendResponse({
      variables: {
        programId: peakId,
        yes: ans === 'y' ? [selectedQ.id] : [],
        no: ans === 'n' ? [selectedQ.id] : [],
      },
    })
  }
  return (
    <>
      <div style={{ position: 'relative' }}>
        {(quartionLoading || summeryLoading) && (
          <div
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: 350,
              zIndex: 10000,
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner style={{ color: 'rgb(229, 132, 37)', width: 40, height: 40 }} />
          </div>
        )}
        {quartionError && selectedQ && (
          <h4 style={{ color: 'red' }}>Opps failed to load question data</h4>
        )}
        {!quartionLoading && !quartionError && quartionData && selectedQ && (
          <div style={{ minHeight: 350 }}>
            <Row>
              {/* <Col span={10}>
                <img
                  src={cardImg}
                  alt=""
                  style={{
                    height: 200,
                    borderRadius: 10,
                    width: '100%',
                  }}
                />
              </Col> */}
              {!quartionLoading && (
                <Col span={24}>
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E4E9F0',
                      boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                      borderRadius: 10,
                      padding: '16px 12px',
                      alignItems: 'center',
                      display: 'block',
                      width: '100%',
                      marginBottom: '20px',
                      lineHeight: '27px',
                      marginTop: '10px',
                      minHeight: '140px',
                    }}
                  >
                    <Text
                      style={{ marginTop: 0, fontSize: 15, fontWeight: 700, lineHeight: '20px' }}
                    >
                      Question {quartionData.peakCodeDetails.code}:{' '}
                      {quartionData.peakCodeDetails.instructions}
                    </Text>
                    <p>{quartionData.peakCodeDetails.description}</p>
                    <Text style={{ marginTop: 0, fontSize: 15, fontWeight: 700 }}>
                      Expected Response:
                    </Text>
                    {/* <Text style={{ fontSize: 18, display: 'inline-block' }}>
                  &nbsp;{quartionData.peakCodeDetails.expRes}
                  </Text> */}
                    <span>&nbsp;{quartionData.peakCodeDetails.expRes}</span>
                  </div>
                </Col>
              )}
            </Row>
            <div
              style={{
                marginTop: 20,
                textAlign: 'right',
              }}
            >
              {sendResponseLoading && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#f9f9f9',
                    color: '#000',
                    padding: '3px',
                  }}
                >
                  Recording response...
                </div>
              )}
              <Button
                style={{
                  padding: '5px 20px',
                  borderRadius: 4,
                  height: 60,
                  background: allreadyAnswere === 'y' ? '#4BAEA0' : '#fff',
                }}
                onClick={handleSendRes('y')}
              >
                <Text
                  style={{
                    color: allreadyAnswere === 'y' ? '#fff' : '#4BAEA0',
                    fontSize: 15,
                    margin: 0,
                  }}
                >
                  &nbsp;&nbsp;{learner}
                  {'  '}gives an Expected Response &nbsp;&nbsp;
                </Text>
              </Button>
              <br />
              <Button
                style={{
                  height: 60,
                  // width: 300,
                  padding: '5px 20px',
                  borderRadius: 4,
                  marginTop: 10,
                  background: allreadyAnswere === 'n' ? '#FF8080' : '#fff',
                }}
                onClick={handleSendRes('n')}
              >
                <Text
                  style={{
                    color: allreadyAnswere === 'n' ? '#fff' : '#FF8080',
                    fontSize: 15,
                    margin: 0,
                  }}
                >
                  {`${learner}`}
                  {'  '}gives an Unexpected Response
                </Text>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 40, textAlign: 'right' }}>
        <Button style={{ marginLeft: 'auto', height: 35 }} onClick={() => prevQua(selectedQ.index)}>
          <ArrowLeftOutlined style={{ fontSize: 14, color: '#000', marginTop: 4 }} />
        </Button>
        <Button style={{ marginLeft: 6, height: 35 }} onClick={() => nextQua(selectedQ.index)}>
          <ArrowRightOutlined style={{ fontSize: 14, color: '#000', marginTop: 4 }} />
        </Button>
        <Button
          type="danger"
          style={{
            marginLeft: 6,
            height: 35,
            width: 100,
            fontSize: 14,
            fontWeight: 'bold',
            background:
              selectedQ?.index === summeryData?.peakDataSummary.total - 1 ? 'green' : '#FF8080',
          }}
          loading={quitLoading}
          onClick={() => {
            if (selectedQ?.index === summeryData?.peakDataSummary.total - 1) {
              finishAssignment()
            } else {
              history.push('/peakReport')
            }
          }}
        >
          {selectedQ?.index === summeryData?.peakDataSummary.total - 1 ? 'Finish' : 'Quit'}
        </Button>

        {summeryData && (
          <div
            style={{
              background: '#F0F6FF',
              padding: '7px 17px',
              borderRadius: 4,
              width: '100%',
              marginTop: '10px',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: '#8C98AA',
              }}
            >
              {summeryData.peakDataSummary.totalAttended}&nbsp;/&nbsp;
              {summeryData.peakDataSummary.total} answered
            </Text>
            <Progress
              percent={
                (summeryData.peakDataSummary.totalAttended / summeryData.peakDataSummary.total) *
                100
              }
              size="small"
              showInfo={false}
            />
          </div>
        )}
      </div>
    </>
  )
}
