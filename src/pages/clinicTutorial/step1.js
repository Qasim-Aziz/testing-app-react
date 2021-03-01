/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Card, Row, Col, Typography, Drawer, Button } from 'antd'
import ReactPlayer from 'react-player'
import { usePrevious } from 'react-delta'
import { Link } from 'react-router-dom'
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AddVideoForm from 'pages/ClinicProfile/VideoTutorial/AddVideoForm'
import UpdateAddVideoForm from 'pages/ClinicProfile/VideoTutorial/UpdateAddVideoForm'
import { CLINIC_MODULES, REMOVE_VIDEO, DELETE_MODULE } from 'pages/ClinicProfile/query'
import VideoModuleForm from '../ClinicProfile/VideoTutorial/VideoModuleForm'
import { GET_VIDEO_LIVERY, LIBERARY_DETAILS, CLINIC_QUERY } from './query'
import './style.scss'


const { Title, Text } = Typography

export default () => {
  const [selectedLibrary, setSelectedLibrary] = useState()
  const [selectedLibraryName, setSelectedLibraryName] = useState()
  const [playingUrl, setPlayingUrl] = useState()
  const [updateVideo, setUpdateVideo] = useState()

  const [visible, setVisible] = useState(false)
  const [newMasterDrawer, setNewMasterDrawer] = useState(false)

  const { data: schoolData, loading: schoolLoading, error: schoolError } = useQuery(CLINIC_QUERY)
  const deleteVideoId = useRef()
  const deleteVideoLiberaryId = useRef()
  const deleteModuleId = useRef()

  const { data, error, loading } = useQuery(GET_VIDEO_LIVERY, {
    skip: !schoolData,
    variables: {
      clinicId: schoolData?.schooldetail.id,
    },
  })
  const {
    data: liberaryDetails,
    error: liberaryDetailsError,
    laoding: liberaryDetailsLoading,
  } = useQuery(LIBERARY_DETAILS, {
    skip: !selectedLibrary,
    variables: {
      id: selectedLibrary,
    },
  })

  const [
    deleteModule,
    { data: deleteModuleData, error: deleteModuleError, loading: deleteModuleLoading },
  ] = useMutation(DELETE_MODULE, {
    update(cache) {
      const cacheModules = cache.readQuery({
        query: CLINIC_MODULES,
        variables: {
          clinicId: schoolData?.schooldetail.id,
        },
      })
      cache.writeQuery({
        query: CLINIC_MODULES,
        variables: {
          clinicId: schoolData?.schooldetail.id,
        },
        data: {
          getClinicLibrary: {
            edges: cacheModules.getClinicLibrary.edges.filter(({ node }) => {
              return node.id !== deleteModuleId.current
            }),
            __typename: 'ClinicVideoLibraryTypeConnection',
          },
        },
      })
    },
  })

  const [
    deleteVideo,
    { data: deleteVideoData, error: deleteVideoError, loading: deleteVideoLoading },
  ] = useMutation(REMOVE_VIDEO, {
    update(cache) {
      const cacheModules = cache.readQuery({
        query: CLINIC_MODULES,
        variables: {
          clinicId: schoolData?.schooldetail.id,
        },
      })

      cache.writeQuery({
        query: CLINIC_MODULES,
        data: {
          getClinicLibrary: {
            edges: cacheModules.getClinicLibrary.edges.map(({ node }) => {
              console.log(node.id)
              console.log(deleteVideoLiberaryId.current)
              console.log(node.id === deleteVideoLiberaryId.current)
              if (node.id === deleteVideoLiberaryId.current) {
                console.log(node)
                node.videos.edges = node.videos.edges.filter(
                  ({ node1 }) => node1.id !== deleteVideoId.current,
                )
              }
              return { node }
            }),
            __typename: 'ClinicVideoLibraryTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      setSelectedLibrary(data.getClinicLibrary.edges[0]?.node.id)
      setSelectedLibraryName(data.getClinicLibrary.edges[0]?.node.name)
    }
  }, [data])

  useEffect(() => {
    if (liberaryDetails && liberaryDetails.getLibraryDetails.videos.edges.length > 0) {
      setPlayingUrl(liberaryDetails.getLibraryDetails.videos.edges[0].node.url)
    } else {
      setPlayingUrl('')
    }
  }, [liberaryDetails])

  const prevSelectedLibrary = usePrevious(selectedLibrary)

  const showDrawer = () => {
    setVisible(true)
  }

  if (loading || schoolLoading) {
    return <h3>Loading...</h3>
  }

  if (error || schoolError) {
    return <h4 style={{ color: 'red' }}>Opps their are something is wrong</h4>
  }

  if (!data.getClinicLibrary.edges[0]) {
    return (
      <h3 style={{ textAlign: 'center', marginTop: 40 }}>
        Their are no clinic tutorial module
        <br />
        You can create form{' '}
        <Link to="/clinicVideoTutorials" style={{ color: 'blue' }}>
          here
        </Link>
      </h3>
    )
  }

  return (
    <div>
      <h2>Clinic Tutorials</h2>
      <div style={{ paddingHorizontal: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 8, height: 350, maxHeight: 349 }}>
            <ReactPlayer url={playingUrl || ''} controls width="100%" height="350px" />
          </div>
          <div style={{ flex: 4, padding: 10, backgroundColor: '#f9f9f9', marginLeft: 5 }}>
            <div
              style={{
                marginBottom: 5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '500', marginLeft: 10 }}>
                More Videos in <b>{selectedLibraryName}</b>
              </span>
              <Button type="primary" size="small" onClick={() => showDrawer()}>
                Add Video
              </Button>
            </div>

            <div
              style={{ height: 320, maxHeight: 319, overflowY: 'scroll' }}
              className="scrollClass"
            >
              {liberaryDetailsLoading && selectedLibrary !== prevSelectedLibrary && (
                <h3>Loading...</h3>
              )}
              {liberaryDetailsError && (
                <h4 style={{ color: 'red' }}>Failed to load library details</h4>
              )}

              {liberaryDetails &&
                liberaryDetails.getLibraryDetails.videos.edges.map(({ node }) => (
                  <div>
                    <Card
                      onClick={() => {
                        setPlayingUrl(node.url)
                      }}
                      hoverable
                      style={{ margin: '5px 5px 5px 0', borderRadius: '10px' }}
                      cover={
                        <ReactPlayer
                          light
                          url={node.url}
                          controls
                          playing={false}
                          width="100%"
                          height="180px"
                        />
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Title
                          level={4}
                          style={{
                            marginBottom: '0',
                            color: '#000',
                            fontWeight: '700',
                            fontSize: 13,
                            // marginRight: '5px',
                          }}
                        >
                          {node.name}
                        </Title>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Button type="link" size="small" style={{ color: 'red', marginRight: 5 }}>
                            <DeleteOutlined />
                          </Button>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              console.log('--0-0-0-0-0')
                              setUpdateVideo(node)
                            }}
                          >
                            <EditOutlined />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}

              {/* {liberaryDetails && liberaryDetails.getLibraryDetails.videos.edges.length === 0 ?
                <h3 style={{ textAlign: 'center', marginTop: 40 }}>
                  Their are no videos added in this module
                    <br />
                    You can add form{' '}
                  <Link to="/clinicProfile/" style={{ color: 'blue' }}>
                    here
                  </Link>
                </h3>
                : null
              } */}
            </div>
          </div>
        </div>

        <div
          className="scrollClass"
          style={{
            marginTop: 10,
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '100%',
            overflowX: 'scroll',
          }}
        >
          <button
            type="button"
            onClick={() => setNewMasterDrawer(true)}
            style={{
              marginRight: 10,
              minWidth: 100,
              maxWidth: 100,
              backgroundColor: '#FFF',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <FolderAddOutlined style={{ fontSize: 50, color: '#000' }} />
          </button>

          {data.getClinicLibrary.edges.map(({ node }) => {
            return selectedLibrary === node.id ? (
              <div
                style={{
                  marginRight: 10,
                  minWidth: 300,
                  maxWidth: 300,
                  backgroundColor: '#89b6d8',
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <p className="mb-0" style={{ fontSize: '18px', fontWeight: '400' }}>
                    {node.name}
                  </p>
                  <div>
                    <Button
                      type="link"
                      size="small"
                      style={{ color: 'red', marginRight: 5 }}
                      onClick={() => {
                        if (node.id !== deleteModuleId.current) {
                          deleteModuleId.current = node.id
                          deleteModule({
                            variables: {
                              id: node.id,
                            },
                          })
                        }
                      }}
                    >
                      <DeleteOutlined />
                    </Button>
                    <Button type="link" size="small">
                      <EditOutlined />
                    </Button>
                  </div>
                </div>
                <p className="" style={{ fontSize: '13px', lineHeight: '1.2', color: '#FFF' }}>
                  {node.description}
                </p>
              </div>
            ) : (
              <div
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                  marginRight: '10px',
                  borderRadius: '10px',
                }}
                key={node.id}
                role="button"
                tabIndex="0"
                onClick={() => {
                  setSelectedLibrary(node.id)
                  setSelectedLibraryName(node.name)
                }}
                onKeyDown={() => {}}
              >
                <div
                  style={{
                    minWidth: 300,
                    maxWidth: 300,
                    backgroundColor: '#FFF',
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p className="mb-0" style={{ fontSize: '18px', fontWeight: '400' }}>
                      {node.name}
                    </p>
                    <div>
                      <Button
                        type="link"
                        size="small"
                        style={{ color: 'red', marginRight: 5 }}
                        onClick={() => {
                          if (node.id !== deleteModuleId.current) {
                            deleteModuleId.current = node.id
                            deleteModule({
                              variables: {
                                id: node.id,
                              },
                            })
                          }
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                      <Button type="link" size="small">
                        <EditOutlined />
                      </Button>
                    </div>
                  </div>
                  <p className="" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    {node.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Drawer
        title="Create a new video module"
        placement="right"
        width={400}
        closable={false}
        onClose={() => setNewMasterDrawer(false)}
        visible={newMasterDrawer}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <VideoModuleForm clinicId={schoolData?.schooldetail.id} setOpen={setNewMasterDrawer} />
        </div>
      </Drawer>

      <Drawer
        title="Update Video"
        placement="right"
        width={550}
        closable={false}
        onClose={() => setUpdateVideo(null)}
        visible={updateVideo}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <UpdateAddVideoForm
            clinicId={schoolData?.schooldetail.id}
            setOpen={setUpdateVideo}
            videoDetails={updateVideo}
          />
        </div>
      </Drawer>

      <Drawer
        title="Add a video"
        placement="right"
        width={550}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <AddVideoForm
            clinicId={schoolData?.schooldetail.id}
            liberaryId={selectedLibrary}
            setOpen={setVisible}
          />
        </div>
      </Drawer>
    </div>
  )
}
