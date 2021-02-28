/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import lodash from 'lodash'
import gql from 'graphql-tag'
import { ResponsiveNetwork } from '@nivo/network'
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
        targetAllcatedDetails {
          id
          targetName
          dateBaseline
        }
      }
    }
  }
`

const NetworkChart = ({
  targetStatus,
  start_date,
  end_date,
  selectedprogram,
  statusselected,
  programName,
}) => {
  const [finalGraphData, setFinalGraphData] = useState({ nodes: [], links: [] })
  const [
    getDomainData,
    { data: domainData, loading: domainLoading, error: domainError },
  ] = useLazyQuery(DOMAIN_MASTERED)

  useEffect(() => {
    setFinalGraphData({ nodes: [], links: [] })
    const studentId = localStorage.getItem('studentId')
    getDomainData({
      variables: {
        studentId,
        dateGte: start_date,
        dateLte: end_date,
        programArea: selectedprogram,
        targetStatus: statusselected === 'All' || statusselected === '' ? null : statusselected,
      },
    })
  }, [start_date, end_date, selectedprogram, statusselected])

  useEffect(() => {
    if (domainData && domainData.domainMastered.target.length) {
      const groupedData = lodash.groupBy(
        domainData.domainMastered.target,
        item => item?.targetId?.domain?.domain,
      )

      const graphData = { nodes: [], links: [] }
      Object.keys(groupedData).map((item, index) => {
        graphData.nodes.push({
          id: `${index}`,
          radius: groupedData[item].length + 7,
          depth: 1,
          color: 'rgb(97, 205, 187)',
          title: item,
          size: groupedData[item].length,
        })
        // eslint-disable-next-line no-shadow
        groupedData[item].map((item, subIndex) => {
          graphData.nodes.push({
            id: `${index}.${subIndex}`,
            radius: 5,
            depth: 2,
            color: 'rgb(232, 193, 160)',
            title: item.targetAllcatedDetails.targetName,
          })

          // * Linking nodes with subNodes
          graphData.links.push({
            source: `${index}`,
            target: `${index}.${subIndex}`,
            distance: 30,
          })

          console.log(`linking ---- ${index} + ${index}.${subIndex}`)
          return null
        })
        return null
      })

      // * Logic for linking nodes
      const pairs = lodash.toPairs(groupedData)
      const combinations = pairs.flatMap((v, i) => pairs.slice(i + 1).map(w => [v, w]))

      combinations.forEach((item, index) => {
        const keys = Object.keys(groupedData)
        console.log('keys = ', keys)
        console.log(
          `comparing item: ${keys.indexOf(item[0][0])} & ${keys.indexOf(item[1][0])} `,
          item[0][0],
          ' <--> ',
          item[1][0],
        )

        item[0][1].forEach(subItem => {
          let intersectionCount = 0
          const toCompare = subItem.targetAllcatedDetails.targetName
            .replace(/[^A-Za-z0-9 ]/g, '')
            .toLowerCase()
            .split(' ')
          console.log(toCompare)
          console.log('**')
          item[1][1].forEach(secondSubItem => {
            const compareFrom = secondSubItem.targetAllcatedDetails.targetName
              .replace(/[^A-Za-z0-9 ]/g, '')
              .toLowerCase()
              .split(' ')
            console.log('checking for', toCompare, compareFrom)
            intersectionCount += lodash.intersectionWith(toCompare, compareFrom).length
          })
          if (intersectionCount > 0) {
            console.log(
              `Linking nodes: ${keys.indexOf(item[0][0])} & ${keys.indexOf(item[1][0])} i.e, `,
              item[0][0],
              ' <--> ',
              item[1][0],
              '\n\n',
            )
            graphData.links.push({
              source: `${keys.indexOf(item[0][0])}`,
              target: `${keys.indexOf(item[1][0])}`,
              distance: 40 * intersectionCount + 40,
              matches: intersectionCount,
            })
          }
        })
      })
      setFinalGraphData(graphData)
    }
  }, [domainData])

  return (
    <div
      role="presentation"
      style={{
        borderRadius: 10,
        border: '2px solid #F9F9F9',
        display: 'block',
        width: '100%',
        height: '500px',
      }}
    >
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
      {!domainLoading && finalGraphData.nodes.length <= 0 && (
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
      {finalGraphData.nodes.length > 0 && (
        <ResponsiveNetwork
          data={finalGraphData}
          nodes={finalGraphData.nodes}
          links={finalGraphData.links}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          isInteractive
          repulsivity={finalGraphData.nodes.length > 8 ? 20 : 25}
          iterations={60}
          nodeColor={e => {
            return e.color
          }}
          nodeBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.8]],
          }}
          linkThickness={e => {
            return e.matches ? 3 * (2.2 - e.matches) : 2 * (2 - e.source.depth)
            // return 2 * (2 - e.source.depth)
          }}
          linkDistance={link => {
            return link.distance
          }}
          linkColor={link =>
            link.source.color === link.target.color ? 'rgb(244, 117, 96)' : link.source.color
          }
          motionStiffness={160}
          motionDamping={12}
          tooltip={node => {
            return (
              <div>
                <p>hello</p>
                <strong style={{ color: node.color }}>{node.title}</strong>
                {node.size && <p>Targets: {node.size} </p>}
              </div>
            )
          }}
        />
      )}
    </div>
  )
}

export default NetworkChart 
