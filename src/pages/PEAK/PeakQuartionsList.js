/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Card, Tag, Typography } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import { SUMMERY, GET_CODE_DETAILS, SEND_RESPONSE, QUIT } from './query'

const { Title } = Typography

export default ({ selectedQ, data, handelSelectQ, scrollbarRef, type }) => {
  // console.log(selectedQ,'ssssssssssssssssssssssssss');
  const peakId = localStorage.getItem('peakId')
  const [allreadyAnswere, setAllReadyAnswer] = useState(null)

  const { data: summeryData, loading: summeryLoading, refetch } = useQuery(SUMMERY, {
    fetchPolicy: 'network-only',
    variables: {
      program: peakId,
    },
  })
  console.log(summeryData);
  useEffect(() => {
    // if(type === true){
    //   setAllReadyAnswer('2px solid #1208E7')
    // }
    // if(type === false){
    if (summeryData) {
      const yes = summeryData.peakDataSummary.edges[0]?.node.yes.edges.find(({ node }) => {
        return node.id === selectedQ.id
      })
      if (yes) {
        setAllReadyAnswer('2px solid #4baea0')
      } else {
        const no = summeryData.peakDataSummary.edges[0]?.node.no.edges.find(({ node }) => {
          return node.id === selectedQ.id
        })
        if (no) {
          setAllReadyAnswer('2px solid #ff8080')
        } else {
          setAllReadyAnswer('2px solid #1208E7')
        }
      }
      console.log(selectedQ, allreadyAnswere, type, 'aaaaaaaaaaaaaaaaaa');
    }
    // }

  })

  return (
    <Scrollbars
      style={{
        height: 'calc(100vh - 180px)',
        minHeight: 'calc(100vh - 180px)',
      }}
      ref={scrollbarRef}
      autoHide
    >
      {!selectedQ && <h4>Loading...</h4>}
      {selectedQ &&
        data?.map(({ node }, index) => {
          const selected = node.id === selectedQ.id
          return (
            <div
              role="button"
              style={{
                cursor: 'pointer',
                boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.08)',
                padding: '12px 20px',
                border: selected ? allreadyAnswere : '',
                borderRadius: 0,
                flex: 1,
                margin: '5px 5px 0px',
                backgroundColor: 'white',
                display: 'block ruby'
              }}
              onClick={handelSelectQ(node.id, index)}
            >
              <Title
                style={{
                  fontSize: 15,
                  marginBottom: 1,
                  color: selected ? '#000' : '#000',
                }}
              >
                {node.code}
              </Title>
              <Tag
                style={{
                  height: 25,
                  background: selected ? '#007acc' : '#007acc',
                  paddingTop: 2,
                  fontSize: 14,
                  fontWeight: 600,
                  color: selected ? '#fff' : '#fff',
                  float: 'right'
                }}
              >
                {node.peakType}
              </Tag>
            </div>

          )
        })}
    </Scrollbars>
  )
}
