/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
import React from 'react'
import { Typography } from 'antd'
import styles from './style.module.scss'

const { Title } = Typography

const AllocatedTargetCard = ({ heading = '', status = '', node, editAllocatedTarget, editAble }) => {

  const editTarget = () => {
    console.log('clicked', node.id)
  }

  return (
    <>
      {editAble ?
        <a editAble onClick={() => editAllocatedTarget(node)}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E4E9F0',
              boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
              borderRadius: 2,
              padding: 5,
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2px'
            }}
          >
            <div
              style={{
                marginLeft: 22,
              }}
            >
              <Title
                style={{
                  color: '#000',
                  fontSize: 16,
                  lineHeight: '25px',
                  display: 'inline',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {heading}
              </Title>
              {/* <Title style={{ fontSize: 18, lineHeight: '25px' }}>{heading}</Title> */}
              <div>
                <span
                  style={{
                    color: '#0B35B3',
                    marginRight: 38,
                  }}
                >
                  STATUS : {status}
                </span>
              </div>
            </div>
          </div>
        </a>
        :
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 2,
            padding: 5,
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2px'
          }}
        >
          <div
            style={{
              marginLeft: 22,
            }}
          >
            <Title
              style={{
                color: '#000',
                fontSize: 16,
                lineHeight: '25px',
                display: 'inline',
                margin: 0,
                fontWeight: '500',
              }}
            >
              {heading}
            </Title>
            <div>
              <span
                style={{
                  color: '#0B35B3',
                  marginRight: 38,
                }}
              >
                STATUS : {status}
              </span>
            </div>
          </div>
        </div>
      }
    </>

  )
}

export default AllocatedTargetCard
