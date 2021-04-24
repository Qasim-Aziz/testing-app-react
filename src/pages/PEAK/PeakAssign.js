/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Row, Col, Typography, Select, Tabs, Radio } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { COLORS } from 'assets/styles/globalStyles'
import LoadingComponent from 'components/LoadingComponent'
import PeakQuartionsList from './PeakQuartionsList'
import PeakQuartionView from './PeakQuartionView'
import { STUDNET_INFO, SUMMERY } from './query'

const { Content } = Layout

const { Text } = Typography

const GET_PEAK_CODES = gql`
  query($type: String!) {
    peakGetCodes(peakType: $type) {
      edges {
        node {
          id
          peakType
          code
          description
          instructions
          expRes
        }
      }
    }
  }
`

export default () => {
  const [selectedQ, setSelectedQ] = useState()
  const peakId = localStorage.getItem('peakId')
  const studentId = localStorage.getItem('studentId')
  const peakType = localStorage.getItem('peakType')
  const [answeredQuCount, setAnsweredQuCount] = useState(0)
  const [selecteFilter, setSelectedFilter] = useState('all')
  const [code, setCode] = useState([])
  const [alldata, setAllData] = useState(null)
  const scrollbarRef = useRef()
  const [load, setLoad] = useState(false)
  const [type, setType] = useState(false)
  const [radioValue, setRadioValue] = useState('all')

  const { data, error, loading } = useQuery(GET_PEAK_CODES, {
    variables: {
      type: peakType,
    },
  })

  const { data: studnetInfo } = useQuery(STUDNET_INFO, {
    variables: {
      studentId,
    },
  })
  const { data: summeryData, loading: summeryLoading, refetch } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: peakId,
    },
  })

  useEffect(() => {
    if (selectedQ) {
      // console.log('selectQ', selectedQ)
      scrollbarRef.current.scrollTop(selectedQ.index * 86 - 250)
    }
    if (data && summeryData) {
      setAllData(data)
      handleChange(selecteFilter)
    }

    // setCode(data)
  }, [selectedQ, data, summeryData])

  const handelSelectQ = (id, index) => () => {
    console.log(id, index)
    setSelectedQ({ id, index })
  }

  const handleChange = value => {
    setRadioValue(value)
    if (value === 'no') {
      if (data && summeryData) {
        if (summeryData?.peakDataSummary?.edges[0]?.node?.no?.edges?.length > 0) {
          const ar = []
          console.log(data, summeryData)
          const dd = summeryData?.peakDataSummary?.edges[0]?.node.no.edges.forEach(e => {
            const d = data?.peakGetCodes?.edges.filter(el => el.node.id === e.node.id)
            if (d) {
              ar.push(d[0])
            }
          })
          const r = ar.filter(eee => eee?.node?.id === selectedQ?.id)
          if (!r[0]) {
            setSelectedQ({ id: ar[0]?.node?.id, index: 0 })
          }
          if (!selectedQ) {
            setSelectedQ({ id: ar[0]?.node?.id, index: 0 })
          }

          setCode(ar)
          setType(false)
        }
      }
    }
    if (value === 'yes') {
      if (data && summeryData) {
        if (summeryData?.peakDataSummary?.edges[0]?.node?.yes?.edges?.length > 0) {
          const ar = []
          console.log(data, summeryData)
          const dd = summeryData?.peakDataSummary?.edges[0]?.node.yes.edges.forEach(e => {
            const d = data?.peakGetCodes?.edges.filter(el => el.node.id === e.node.id)
            if (d) {
              ar.push(d[0])
            }
          })
          const r = ar.filter(eee => eee.node.id === selectedQ.id)
          if (!r[0]) {
            setSelectedQ({ id: ar[0]?.node?.id, index: 0 })
          }
          if (!selectedQ) {
            setSelectedQ({ id: ar[0]?.node?.id, index: 0 })
          }

          setCode(ar)
          setType(false)
        }
      }
    }

    if (value === 'all') {
      if (data && summeryData) {
        const ar = []
        const mar = []
        const f = data?.peakGetCodes?.edges?.forEach(e => {
          mar.push(e)
        })
        const marr = []
        const tt = summeryData?.peakDataSummary?.edges[0]?.node.yes.edges?.forEach(e => {
          marr.push(e)
        })
        const t = summeryData?.peakDataSummary?.edges[0]?.node.no.edges?.forEach(e => {
          marr.push(e)
        })
        marr.forEach(e => {
          const dd = mar.filter((ee, i) => ee.node.id === e.node.id)
          const index = mar.indexOf(dd[0])
          if (dd[0]) {
            mar.splice(index, 1)
          }
        })
        const r = mar.filter(eee => eee.node.id === selectedQ?.id)
        if (!r[0]) {
          setSelectedQ({ id: mar[0]?.node?.id, index: 0 })
        }
        if (!selectedQ) {
          setSelectedQ({ id: mar[0]?.node?.id, index: 0 })
        }

        setCode(mar)
        setLoad(true)
        setType(false)
      }
    }
    if (value === 'alll') {
      if (data && summeryData) {
        const ar = []
        const mar = []
        const f = data?.peakGetCodes?.edges?.forEach(e => {
          mar.push(e)
        })
        if (!selectedQ) {
          setSelectedQ({ id: summeryData?.peakDataSummarynode?.lastRecord?.id, index: 0 })
        }

        setCode(mar)
        setLoad(true)
        setType(true)
      }
    }
    setSelectedFilter(value)
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <Layout>
      <Content
        style={{
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        <Row>
          <Col sm={24}>
            <Radio.Group
              value={radioValue}
              onChange={e => {
                handleChange(e.target.value)
              }}
              style={{ marginBottom: 16, float: 'right' }}
            >
              <Radio.Button value="yes">Correct</Radio.Button>
              <Radio.Button value="no">Incorrect</Radio.Button>
              <Radio.Button value="all">Unanswered</Radio.Button>
              <Radio.Button value="alll">All</Radio.Button>
            </Radio.Group>
          </Col>
          <Col sm={17}>
            <div
              style={{
                marginLeft: 10,
                height: 'calc(100vh - 150px)',
                overflow: 'auto',
                padding: 20,
                borderRadius: 5,
                border: '2px solid rgb(249, 249, 249)',
              }}
            >
              {studnetInfo && (
                <Text
                  style={{
                    marginBottom: 20,
                    fontSize: 24,
                    marginTop: 15,
                    marginLeft: 5,
                    color: '#000',
                  }}
                >
                  {studnetInfo.student.firstname}&apos;s - PEAK Assessment
                </Text>
              )}

              {selectedQ && (
                <PeakQuartionView
                  selectedQ={selectedQ}
                  data={code}
                  //  fil={selecteFilter}
                  learner={studnetInfo?.student?.firstname}
                  setSelectedQ={setSelectedQ}
                  setAnsweredQuCount={setAnsweredQuCount}
                  answeredQuCount={answeredQuCount}
                  scrollbarRef={scrollbarRef}
                />
              )}
            </div>
          </Col>

          <Col span={7}>
            <div
              style={{
                padding: 10,
                borderRadius: 5,
                background: COLORS.palleteLight,
                height: 'calc(100vh - 150px)',
                overflow: 'auto',
                marginLeft: 10,
              }}
            >
              {selectedQ && (
                <PeakQuartionsList
                  selectedQ={selectedQ}
                  learner={studnetInfo?.student?.firstname}
                  data={code}
                  // fil={selecteFilter}
                  type={type}
                  handelSelectQ={handelSelectQ}
                  scrollbarRef={scrollbarRef}
                />
              )}
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
