import React, { useState } from 'react'
import { Row, Col, Card, Typography } from 'antd'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import { LIBERARY_DETAILS } from './query'

const { Title, Text } = Typography

export default ({ location }) => {
  const [selectVideo, setSelectVideo] = useState({
    id: location.videoId,
    url: location.videoUrl,
    name: location.videoTitle,
    description: location.description,
  })

  const { data: liberaryDetails, laoding: liberaryDetailsLoading } = useQuery(LIBERARY_DETAILS, {
    variables: {
      id: location.liberaryId,
    },
  })

  if (!location.videoUrl) {
    return (
      <h3 style={{ textAlign: 'center' }}>
        Please select a video first from
        <Link to="/clinicTutorial/step1" style={{ color: 'blue' }}>
          here
        </Link>
      </h3>
    )
  }

  return (
    <div>
      <Row gutter={[100, 0]}>
        <Col span={16}>
          <ReactPlayer url={selectVideo.url} controls width="100%" height={400} />
          <Title style={{ marginTop: 35, fontSize: 24 }}>Title: {selectVideo.name}</Title>
          <Text style={{ marginTop: 15 }}>Desription: {selectVideo.description}</Text>
        </Col>
        <Col span={8}>
          <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Upcoming Videos</Text>
          {liberaryDetailsLoading && <h4 style={{ marginTop: 20 }}>Loading...</h4>}
          <Scrollbars autoHide style={{ height: 'calc(100vh - 200px)' }}>
            {liberaryDetails?.getLibraryDetails.videos.edges.map(({ node }) => {
              return (
                <Card
                  hoverable
                  style={{
                    margin: '5px 5px 5px 0',
                    borderRadius: '10px',
                    display: 'flex',
                    overflow: 'hidden',
                    background: selectVideo.id === node.id ? '#eca661' : '#fff',
                  }}
                  bodyStyle={{ display: 'flex', padding: 10 }}
                  onClick={() => {
                    setSelectVideo({
                      id: node.id,
                      url: node.url,
                      name: node.name,
                      description: node.description,
                    })
                  }}
                >
                  <div style={{ borderRadius: 10, marginRight: 15, overflow: 'hidden' }}>
                    <ReactPlayer url={node.url} controls width="121px" height="75px" light />
                  </div>

                  <Title
                    level={4}
                    style={{
                      marginBottom: '0',
                      fontWeight: '700',
                      marginRight: '5px',
                      color: selectVideo.id === node.id ? '#fff' : '#777777',
                    }}
                  >
                    {node.name}
                  </Title>
                </Card>
              )
            })}
          </Scrollbars>
        </Col>
      </Row>
    </div>
  )
}
