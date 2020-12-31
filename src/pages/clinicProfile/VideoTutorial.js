/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import { Table, Drawer, Tag, Button, notification } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { PlusOutlined } from '@ant-design/icons'
import AddVideoForm from './VideoTutorial/AddVideoForm'
import VideoModuleForm from './VideoTutorial/VideoModuleForm'
import { CLINIC_MODULES, DELETE_MODULE, REMOVE_VIDEO, CLINIC_QUERY } from './query'
import UpdateModuleForm from './VideoTutorial/UpdateModuleForm'
import UpdateAddVideoForm from './VideoTutorial/UpdateAddVideoForm'
import LoadingComponent from '../staffProfile/LoadingComponent'

const VideoTutorial = () => {
  const [visible, setVisible] = useState(false)
  const [newMasterDrawer, setNewMasterDrawer] = useState(false)
  const [liberaryId, setLiberaryId] = useState('')
  const [updateModule, setUpdateModule] = useState()
  const [updateVideo, setUpdateVideo] = useState()
  const deleteVideoId = useRef()
  const deleteVideoLiberaryId = useRef()
  const deleteModuleId = useRef()

  const { data: schoolData, loading: schoolLoading, error: schoolError } = useQuery(CLINIC_QUERY)

  const { loading, error, data } = useQuery(CLINIC_MODULES, {
    skip: !schoolData,
    variables: {
      clinicId: schoolData?.schooldetail.id,
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
                  ({ node }) => node.id !== deleteVideoId.current,
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
    if (deleteModuleData) {
      notification.success({
        message: 'Delete Video Module Sucessfully',
      })
    }
    if (deleteModuleError) {
      notification.error({
        message: 'Delete Video Module Failed',
      })
    }
  }, [deleteModuleData, deleteModuleError])

  useEffect(() => {
    if (deleteVideoData) {
      notification.success({
        message: 'Delete Video Sucessfully',
      })
    }
    if (deleteVideoError) {
      notification.error({
        message: 'Delete Video Failed',
      })
    }
  }, [deleteVideoData, deleteVideoError])

  const showDrawer = (e, liId) => {
    setVisible(true)
    setLiberaryId(liId)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onNewMasterDrawerClose = () => {
    setNewMasterDrawer(false)
  }

  if (loading || schoolLoading) {
    return <LoadingComponent />
  }
  if (error || schoolError) {
    return <h4 style={{ color: 'red' }}>Opps their are something wrong</h4>
  }

  const columns = [
    {
      title: 'Video Module Name',
      dataIndex: 'node.name',
      key: 'node.name',
    },
    {
      title: 'Description',
      dataIndex: 'node.description',
      key: 'node.description',
      width: '200',
    },
    {
      title: 'Action',
      key: 'operation',
      width: '200',
      render: obj => (
        <span>
          <Tag
            style={{
              cursor: 'pointer',
            }}
          >
            <a onClick={e => showDrawer(e, obj.node.id)}>Add Video</a>
          </Tag>
          <Tag
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setUpdateModule(obj.node)
            }}
          >
            <a>Edit</a>
          </Tag>
          <Tag
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              if (obj.node.id !== deleteModuleId.current) {
                deleteModuleId.current = obj.node.id
                deleteModule({
                  variables: {
                    id: obj.node.id,
                  },
                })
              }
            }}
            disable={obj.node.id === deleteModuleId.current && deleteModuleLoading}
          >
            {obj.node.id === deleteModuleId.current && deleteModuleLoading
              ? 'Deleting...'
              : 'Delete'}
          </Tag>
        </span>
      ),
    },
  ]

  const expandedRowRender = record => {
    const columns = [
      {
        title: 'Video Name',
        dataIndex: 'node.name',
        key: 'node.id',
      },
      {
        title: 'Video url',
        dataIndex: 'node.url',
        key: 'node.url',
      },
      {
        title: 'Actions',
        render(obj) {
          return (
            <div>
              <Tag
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setUpdateVideo(obj.node)
                }}
              >
                Edit
              </Tag>
              <Tag
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  deleteVideoId.current = obj.node.id
                  deleteVideoLiberaryId.current = obj.node.liberaryId
                  if (obj.node.id !== deleteVideo) {
                    deleteVideo({
                      variables: {
                        videoId: obj.node.id,
                        liberaryID: obj.node.liberaryId,
                      },
                    })
                  }
                }}
              >
                {deleteVideoId.current === obj.node.id && deleteVideoLoading
                  ? 'Deleting'
                  : 'Delete'}
              </Tag>
            </div>
          )
        },
      },
    ]
    return (
      <Table
        columns={columns}
        dataSource={record.node.videos.edges.map(({ node }) => {
          return {
            node: {
              liberaryId: record.node.id,
              ...node,
            },
          }
        })}
      />
    )
  }

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              type="primary"
              style={{ marginBottom: 10 }}
              onClick={() => setNewMasterDrawer(true)}
            >
              ADD VIDEO
              <PlusOutlined />
            </Button>
          </div>
        </div>

        <div>
          {data && (
            <Table
              dataSource={data.getClinicLibrary.edges}
              columns={columns}
              bordered
              expandedRowRender={expandedRowRender}
            />
          )}
        </div>
      </div>

      <Drawer
        title="Add a video"
        placement="right"
        width={550}
        closable={false}
        onClose={onClose}
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
            liberaryId={liberaryId}
            setOpen={setVisible}
          />
        </div>
      </Drawer>
      <Drawer
        title="Create a new video module"
        placement="right"
        width={400}
        closable={false}
        onClose={onNewMasterDrawerClose}
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
        title="Update Tutorial Module"
        placement="right"
        width={400}
        closable={false}
        onClose={() => setUpdateModule(null)}
        visible={updateModule}
      >
        <div
          style={{
            padding: '5px 30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <UpdateModuleForm
            clinicId={schoolData?.schooldetail.id}
            setOpen={setUpdateModule}
            module={updateModule}
          />
        </div>
      </Drawer>
    </div>
  )
}

export default VideoTutorial
