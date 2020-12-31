import React from 'react'
import { Card, Typography } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
import cardImg1 from '../../images/cardImg1.jpg'

const { Title, Text } = Typography

class TutorialStep3 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      projects: [],
      selectedProjectId: '',
      selectedProjectName: '',
      basic: [],
      intermediate: [],
      advanced: [],
    }
  }

  componentDidMount() {
    let spid = ''
    client
      .query({
        query: gql`
          query {
            VimeoProject {
              edges {
                node {
                  id
                  name
                  url
                }
              }
            }
          }
        `,
      })
      .then(result => {
        console.log(result.data)
        spid = result.data.VimeoProject.edges[0].node.id
        this.setState({
          isLoading: false,
          projects: result.data.VimeoProject.edges,
          selectedProjectId: result.data.VimeoProject.edges[0].node.id,
          selectedProjectName: result.data.VimeoProject.edges[0].node.name,
        })
      })
    this.getSelectedProjectVideos(spid)
  }

  getSelectedProjectVideos = projectId => {
    const { selectedProjectId } = this.state
    client
      .query({
        query: gql`query { 
    VimeoVideos(project:"${projectId}", category:"Basic")
    {
        edgeCount
        edges {
            node {
                id
                status
                name
                url
                duration
                thubUrl
                description
                videoLike
                {
                    edgeCount
                }
                comment
                {
                    edgeCount
                     edges {
                        node {
                            user
                            {
                                id
                                username
                            }
                            comment
                            date
                        }
                    }
                }
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(result.data)
        this.setState({
          basic: result.data.VimeoVideos.edges,
        })
      })

    client
      .query({
        query: gql`query { 
    VimeoVideos(project:"${projectId}", category:"Intermediate")
    {
        edgeCount
        edges {
            node {
                id
                status
                name
                url
                duration
                thubUrl
                description
                videoLike
                {
                    edgeCount
                }
                comment
                {
                    edgeCount
                     edges {
                        node {
                            user
                            {
                                id
                                username
                            }
                            comment
                            date
                        }
                    }
                }
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(result.data)
        this.setState({
          intermediate: result.data.VimeoVideos.edges,
        })
      })

    client
      .query({
        query: gql`query { 
    VimeoVideos(project:"${projectId}", category:"Advanced")
    {
        edgeCount
        edges {
            node {
                id
                status
                name
                url
                duration
                thubUrl
                description
                videoLike
                {
                    edgeCount
                }
                comment
                {
                    edgeCount
                     edges {
                        node {
                            user
                            {
                                id
                                username
                            }
                            comment
                            date
                        }
                    }
                }
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(result.data)
        this.setState({
          advanced: result.data.VimeoVideos.edges,
        })
      })
  }

  secondsToHms = d => {
    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay + sDisplay
  }

  render() {
    const {
      isLoading,
      projects,
      selectedProjectId,
      selectedProjectName,
      basic,
      intermediate,
      advanced,
    } = this.state
    if (isLoading) {
      return <div>Loding...</div>
    }
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
                {projects.map(project => {
                  return selectedProjectId === project.node.id ? (
                    <Card
                      hoverable
                      style={{
                        background: '#E58425',
                        color: '#FFFFFF',
                        boxShadow: '0px 2px 10px -5px #111',
                        border: '1px solid #FFFFFF',
                        borderRadius: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      <p
                        className="mb-0"
                        style={{ fontSize: '26px', fontWeight: '700', lineHeight: '1.2' }}
                      >
                        {project.node.name}
                      </p>
                      <p className="" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                        {project.node.description}
                      </p>
                    </Card>
                  ) : (
                    <div
                      role="button"
                      tabIndex="0"
                      onClick={() =>
                        this.setState({
                          selectedProjectId: project.node.id,
                          selectedProjectName: project.node.name,
                        })
                      }
                      onKeyDown={this.handleKeyDown}
                    >
                      <Card
                        hoverable
                        style={{
                          background: '#FFFFFF',
                          color: '#000000',
                          boxShadow: '0px 1px 10px -5px #111',
                          border: '1px solid #FFFFFF',
                          borderRadius: '10px',
                          marginBottom: '20px',
                        }}
                      >
                        <p
                          className="mb-0"
                          style={{ fontSize: '26px', fontWeight: '700', lineHeight: '1.2' }}
                        >
                          {project.node.name}
                        </p>
                        <p className="" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                          {project.node.description}
                        </p>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="col-sm-12 col-md-8">
              <div className="row">
                <div className="col-sm-12 col-md-12">
                  <div className="">
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>
                      {selectedProjectName} Basic
                    </span>
                  </div>
                  <div className="d-flex flex-row flex-nowrap overflow-auto">
                    {basic &&
                      basic.length > 0 &&
                      basic.map(video => (
                        <div className="col-sm-6 col-md-4">
                          <Link
                            to={{
                              pathname: '/tutorials/step2',
                              videoId: video.node.id,
                              projectId: selectedProjectId,
                            }}
                          >
                            <Card
                              hoverable
                              style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                              cover={
                                <img
                                  alt="example"
                                  src={video.node.thubUrl}
                                  style={{ height: '150px' }}
                                />
                              }
                            >
                              <Title
                                level={4}
                                style={{
                                  marginBottom: '0',
                                  color: '#777777',
                                  fontWeight: '700',
                                  marginRight: '5px',
                                }}
                              >
                                {video.node.description}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                {this.secondsToHms(video.node.duration)}
                              </Text>
                            </Card>
                          </Link>
                        </div>
                      ))}
                  </div>
                  <div className="">
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>
                      {selectedProjectName} Intermediate
                    </span>
                  </div>
                  <div className="d-flex flex-row flex-nowrap overflow-auto">
                    {intermediate &&
                      intermediate.length > 0 &&
                      intermediate.map(video => (
                        <div className="col-sm-6 col-md-4">
                          <Link
                            to={{
                              pathname: '/tutorials/step2',
                              videoId: video.node.id,
                              projectId: selectedProjectId,
                            }}
                          >
                            <Card
                              hoverable
                              style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                              cover={
                                <img
                                  alt="example"
                                  src={video.node.thubUrl}
                                  style={{ height: '150px' }}
                                />
                              }
                            >
                              <Title
                                level={4}
                                style={{
                                  marginBottom: '0',
                                  color: '#777777',
                                  fontWeight: '700',
                                  marginRight: '5px',
                                }}
                              >
                                {video.node.description}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                {this.secondsToHms(video.node.duration)}
                              </Text>
                            </Card>
                          </Link>
                        </div>
                      ))}
                  </div>
                  <div className="">
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>
                      {selectedProjectName} Advanced
                    </span>
                  </div>
                  <div className="d-flex flex-row flex-nowrap overflow-auto">
                    {advanced &&
                      advanced.length > 0 &&
                      advanced.map(video => (
                        <div className="col-sm-6 col-md-4">
                          <Link
                            to={{
                              pathname: '/tutorials/step2',
                              videoId: video.node.id,
                              projectId: selectedProjectId,
                            }}
                          >
                            <Card
                              hoverable
                              style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                              cover={
                                <img
                                  alt="example"
                                  src={video.node.thubUrl}
                                  style={{ height: '150px' }}
                                />
                              }
                            >
                              <Title
                                level={4}
                                style={{
                                  marginBottom: '0',
                                  color: '#777777',
                                  fontWeight: '700',
                                  marginRight: '5px',
                                }}
                              >
                                {video.node.description}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                {this.secondsToHms(video.node.duration)}
                              </Text>
                            </Card>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TutorialStep3
