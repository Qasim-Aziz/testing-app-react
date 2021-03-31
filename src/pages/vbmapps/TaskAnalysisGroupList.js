import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import Scrollbars from 'react-custom-scrollbars'
import { GET_TASK_ANALYSIS_GROUP } from './query'
import './button.css'
import { leftDivStyle, rightDivStyle, assessmentCompletedBlockStyle, defaultDivStyle, leftListBoxStyle, recordResponseButtonStyle } from './customStyle'

export default ({ handleGroupChange, selected, areaId }) => {
  const { data, error, loading } = useQuery(GET_TASK_ANALYSIS_GROUP, {
    variables: {
      areaId,
    },
  })

  useEffect(() => {
    if (data) {
      handleGroupChange(data.vbmappGroups.edges[0]?.node)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (loading) {
    return 'Loading...'
  }

  if (error) {
    return 'Opps their are something wrong'
  }

  if (data?.vbmappGroups.edges.length === 0) {
    return (
      <div>
        <h4>Their is no groups for tasks analysis</h4>
      </div>
    )
  }

  return (

    <Scrollbars
      autoHide
      style={{
        height: 'calc(100vh - 120px)',
        paddingBottom: 20,
      }}
    >
      {data.vbmappGroups.edges.map(({ node }) => {
        let bg = '#FFF'
        let textColor = '#000'

        if (selected?.id === node.id) {
          bg = '#3E7BFA'
          textColor = '#FFF'
        } else {
          bg = '#FFF'
          textColor = '#000'
        }

        return (
          <div
            key={node.id}
            style={{
              ...leftListBoxStyle,
              backgroundColor: bg,
            }}
          >
            <button
              type="button"
              tabIndex="0"
              onClick={() => handleGroupChange(node)}
              style={{
                color: textColor,
                width: '100%',
                height: '100%',
                background: 'none',
                border: 'none',
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  marginBottom: 0,
                  textTransform: 'capitalize',
                }}
              >
                {node.groupName}
              </p>
              <p>Questions: {node.noQuestion}</p>
            </button>
          </div>
        )
      })}
    </Scrollbars>

  )
}
