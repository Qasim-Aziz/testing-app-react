/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import lodash from 'lodash'
import gql from 'graphql-tag'
import { useLazyQuery } from 'react-apollo'
import { ResponsiveSankey } from '@nivo/sankey'
import { Spin, Empty } from 'antd'

const DOMAIN_MASTERED = gql`
  query domainMastered(
    $studentId: ID!
    $dateGte: Date
    $dateLte: Date
    $programArea: ID
    $targetStatus: ID
  ) {
    domainMastered(
      studentId: $studentId
      dateGte: $dateGte
      dateLte: $dateLte
      programArea: $programArea
      targetStatus: $targetStatus
    ) {
      target {
        id
        targetId {
          id
          domain {
            id
            domain
          }
        }
        targetStatus {
          id
          statusName
        }
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
        }
      }
    }
  }
`

const SankeyGraph = ({
  targetStatus,
  start_date,
  end_date,
  selectedprogram,
  statusselected,
  programName,
}) => {
  const [finalGraphData, setFinalGraphData] = useState({ nodes: [], links: [] })
  const [availableStatus, setAvailableStatus] = useState(null)

  const [
    getDomainData,
    { data: domainData, loading: domainLoading, error: domainError },
  ] = useLazyQuery(DOMAIN_MASTERED)

  useEffect(() => {
    setAvailableStatus(targetStatus)
  }, [])

  useEffect(() => {
    setFinalGraphData({ nodes: [], links: [] })
    const studentId = localStorage.getItem('studentId')
    getDomainData({
      variables: {
        studentId,
        dateGte: start_date,
        dateLte: end_date,
        programArea: selectedprogram,
        targetStatus: statusselected === 'All' ? null : statusselected,
      },
    })
  }, [start_date, end_date, selectedprogram, statusselected])

  useEffect(() => {
    if (domainData) {
      const rawData = domainData.domainMastered.target
      const domainGroup = lodash.groupBy(rawData, item => item?.targetId?.domain.domain)
      const targetGroup = lodash.groupBy(rawData, item => item.targetStatus.statusName)

      const graphData = { nodes: [], links: [] }
      graphData.nodes.push({
        id: `area`,
        color: `rgb(97, 205, ${Math.floor(Math.random() * 255)})`,
        title: `${programName}`,
      })

      Object.keys(targetGroup).map((item, index) => {
        graphData.nodes.push({
          id: `${item}`, // baseline, in-maintenance...
          color: `rgb(97, 205, ${Math.floor(Math.random() * 255)})`,
          title: item,
        })
        return null
      })
      Object.keys(domainGroup).map((item, index) => {
        graphData.nodes.push({
          id: `${item}`, // maths, mand...
          color: `rgb(97, 205, ${Math.floor(Math.random() * 255)})`,
          title: item,
        })
        // domainGroup[item].map(data =>

        //   )
        graphData.links.push({
          source: `${item}`,
          target: `${domainGroup[item][0].targetStatus.statusName}`,
          value: targetGroup[domainGroup[item][0].targetStatus.statusName]?.length,
        })
        graphData.links.push({
          source: `area`,
          target: `${item}`,
          value: targetGroup[domainGroup[item][0].targetStatus.statusName]?.length,
        })
        return null
      })

      setFinalGraphData(graphData)
    }
  }, [domainData])

  useEffect(() => {}, [finalGraphData])

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {domainLoading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      )}
      {!domainLoading && finalGraphData.nodes.length <= 1 && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty />
        </div>
      )}
      {finalGraphData.nodes.length > 1 && (
        <ResponsiveSankey
          nodes={finalGraphData.nodes}
          links={finalGraphData.links}
          data={finalGraphData}
          isInteractive
          margin={{ top: 40, right: 250, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeTooltip={node => <span>{node.title}</span>}
          linkTooltip={node => (
            <span>
              {node.source.title} --- {node.target.title}
            </span>
          )}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeSpacing={24}
          label={node => node.title}
          nodeBorderWidth={0}
          nodeBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.8]],
          }}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          enableLinkGradient
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1]],
          }}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              translateX: 220,
              translateY: 40,
              itemWidth: 120,
              itemHeight: 16,
              itemDirection: 'left-to-right',
              itemsSpacing: 6,
              itemTextColor: '#999',
              symbolSize: 14,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  )
}

export default SankeyGraph
