import React, { useEffect, useState } from 'react'
import { List, Button, Skeleton, Card, Input, notification, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import './form.css'
import LoadingComponent from './LoadingComponent'

const SCHOOL_LOCARIONS = gql`
  query {
    schoolLocation {
      edges {
        node {
          id
          location
          isActive
        }
      }
    }
  }
`

const CREATE_LOCATION = gql`
  mutation clinicLocation($location: String!) {
    clinicLocation(input: { location: $location }) {
      location {
        id
        location
        isActive
      }
      __typename
    }
  }
`

const UPDATE_LOCATION = gql`
  mutation($id: ID!, $location: String!) {
    updateLocation(input: { id: $id, location: $location }) {
      location {
        id
        location
      }
    }
  }
`

const Location = () => {
  const { data, loading, error } = useQuery(SCHOOL_LOCARIONS)
  const [newLocationName, setNewLocationName] = useState('')
  const [updateLocationId, setUpdateLocationId] = useState()
  const [updateLocationName, setUpdateLocationName] = useState()
  const [isAddLocationDrawerOpened, setIsAddLocationDrawerOpened] = useState(false)
  const [isEditLocationDrawerOpened, setIsEditLocationDrawerOpened] = useState(false)

  const [
    createLocation,
    { data: createLocationData, error: createLoactionError, loading: createLocationLoading },
  ] = useMutation(CREATE_LOCATION, {
    variables: {
      location: newLocationName,
    },
    update(cache, { data: updateData }) {
      const schoolLocation = cache.readQuery({ query: SCHOOL_LOCARIONS })
      cache.writeQuery({
        query: SCHOOL_LOCARIONS,
        data: {
          schoolLocation: {
            edges: [
              { node: updateData.clinicLocation.location },
              ...schoolLocation.schoolLocation.edges,
            ],
          },
        },
      })
    },
  })

  const [
    updateLocation,
    { data: updateLocationData, error: updateLoactionError, loading: updateLocationLoading },
  ] = useMutation(UPDATE_LOCATION)

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Location data loading faild',
      })
    }
  }, [error])

  useEffect(() => {
    if (createLocationData) {
      setNewLocationName('')
      setIsAddLocationDrawerOpened(false)
      notification.success({
        message: 'New location created sucessfully',
      })
    }
    if (createLoactionError) {
      notification.error({
        message: 'New location create failed',
      })
    }
  }, [createLocationData, createLoactionError])

  useEffect(() => {
    if (updateLocationData) {
      notification.success({
        message: 'Location update sucessfully',
      })
      setIsEditLocationDrawerOpened(false)
      setUpdateLocationId(null)
      setUpdateLocationName(null)
    }
    if (updateLoactionError) {
      notification.error({
        message: updateLoactionError.message,
      })
    }
  }, [updateLocationData, updateLoactionError])

  const handleAddNewLocation = () => {
    if (newLocationName.length > 0) {
      createLocation()
    } else {
      notification.info({
        message: 'Please type the location address',
      })
    }
  }

  const handleUpdateLocation = () => {
    if (updateLocationName.length > 0) {
      updateLocation({
        variables: {
          id: updateLocationId,
          location: updateLocationName,
        },
      })
    } else {
      notification.info({
        message: 'Please type the location address',
      })
    }
  }

  return (
    <div>
      <div className="profileTab-heading">
        <p>Location Setting</p>
      </div>
      <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
        <Button key="1" size="large" onClick={() => setIsAddLocationDrawerOpened(true)}>
          <PlusOutlined className="addButton" />
        </Button>
      </div>

      {loading && <LoadingComponent />}
      {!loading && (
        <Card style={{ marginTop: 20 }}>
          <List
            style={{ minHeight: 150, zoom: 1.1 }}
            size="small"
            loading={loading}
            itemLayout="horizontal"
            dataSource={data?.schoolLocation.edges}
            renderItem={item => (
              <List.Item
                key={item.node.id}
                actions={[
                  <Button
                    onClick={() => {
                      setIsEditLocationDrawerOpened(true)
                      setUpdateLocationId(item.node.id)
                      setUpdateLocationName(item.node.location)
                    }}
                  >
                    edit
                  </Button>,
                ]}
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta title={item.node.location} />
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
      )}

      <Drawer
        title="Update Location"
        placement="right"
        width={400}
        closable
        onClose={() => setIsEditLocationDrawerOpened(false)}
        visible={isEditLocationDrawerOpened}
      >
        <div>
          <div style={{ marginTop: 15 }}>
            <Input
              size="large"
              placeholder="Type new location name"
              value={updateLocationName}
              onChange={e => setUpdateLocationName(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: 20 }}
              onClick={handleUpdateLocation}
              size="large"
              loading={updateLocationLoading}
            >
              Update
            </Button>
          </div>
        </div>
      </Drawer>
      <Drawer
        title="Add new Location"
        placement="right"
        width={400}
        closable
        onClose={() => setIsAddLocationDrawerOpened(false)}
        visible={isAddLocationDrawerOpened}
      >
        <div>
          <div style={{ marginTop: 15 }}>
            <Input
              size="large"
              placeholder="Type new location name"
              value={newLocationName}
              onChange={e => setNewLocationName(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: 20 }}
              onClick={handleAddNewLocation}
              size="large"
              loading={createLocationLoading}
            >
              Create
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default Location
