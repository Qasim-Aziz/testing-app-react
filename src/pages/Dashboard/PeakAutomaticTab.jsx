import React, { useState, useEffect } from 'react'
import { Switch, Icon } from 'antd'
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
  mutation updatePeakAutomatic($userId: ID!, $updatedValue: Boolean) {
    changeUserSetting(input: { user: $userId, peakAutomaticBlocks: $updatedValue }) {
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

  const [updatePeakAutomatic] = useMutation(UPDATE_PEAK_AUTOMATIC)

  useEffect(() => {
    if (userDetails) {
      const settings = userDetails.userSettings.edges[0]?.node
      setPeakAutomatic(settings.peakAutomaticBlocks)
    }
  }, [userDetails])

  const savePeakAutomatic = checked => {
    setPeakAutomatic(checked)
    updatePeakAutomatic({
      variables: {
        userId: reduxUser?.id,
        updatedValue: checked,
      },
    })
  }

  const tdStyle = { border: '1px solid #dddddd', padding: 8, textAlign: 'center' }

  return (
    <div className="miscConfigTab">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <table>
          <tbody>
            <tr>
              <td style={{ ...tdStyle, width: 200 }}>
                <p
                  style={{
                    color: '#1C8FFA',
                    fontSize: 15,
                    display: 'block',
                    marginTop: '5px',
                    marginBottom: '5px',
                  }}
                >
                  Peak Automatic
                </p>
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <Switch
                  checkedChildren={<Icon type="check" />}
                  checked={peakAutomatic}
                  onChange={savePeakAutomatic}
                  unCheckedChildren={<Icon type="close" />}
                />
              </td>
              <td style={tdStyle}>
                <i>
                  An evidence-based tool that assesses and teaches language and cognitive skills
                  starting from basic foundational abilities to generalizing and higher-order
                  abilities.
                </i>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PeakAutomaticTab
