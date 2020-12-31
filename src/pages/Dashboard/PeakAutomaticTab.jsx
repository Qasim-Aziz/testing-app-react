import React, { useState, useEffect } from 'react'
import { Switch } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { useSelector } from 'react-redux'

const USER_SETTINGS = gql`
  query UserSettings($id: ID!) {
    userSettings(user: $id) {
      edges {
        node {
          id
          peakAutomaticBlocks
          user {
            id
          }
        }
      }
    }
  }
`

const UPDATE_PEAK_AUTOMATIC = gql`
  mutation updatePeakAutomatic($userId: ID!, $peakAutomatic: Boolean) {
    changeUserSetting(input: { user: $userId, peakAutomaticBlocks: $peakAutomatic }) {
      details {
        id
        peakAutomaticBlocks
        user {
          id
        }
      }
    }
  }
`

const PeakAutomaticTab = () => {
  const [peakAutomatic, setPeakAutomatic] = useState(false)
  const reduxUser = useSelector(state => state.user)

  const { data: userDetails, loading } = useQuery(USER_SETTINGS, {
    variables: {
      id: reduxUser?.id,
    },
  })

  const [updatePeakAutomatic, { data: updatePeakData }] = useMutation(UPDATE_PEAK_AUTOMATIC)

  const onChange = checked => {
    updatePeakAutomatic({
      variables: {
        userId: reduxUser?.id,
        peakAutomatic: checked,
      },
    })
  }

  useEffect(() => {
    console.log(userDetails)
    if (userDetails) setPeakAutomatic(userDetails.userSettings.edges[0]?.node.peakAutomaticBlocks)
  }, [userDetails])

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <span style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            Peak Automatic:
          </span>
          <Switch checked={peakAutomatic} onChange={onChange} />
        </div>
      )}
    </>
  )
}

export default PeakAutomaticTab
