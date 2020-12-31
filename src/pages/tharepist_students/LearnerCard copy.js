/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Typography } from 'antd'
import profileImg from './img/profile.jpg'
import style from './learnerCardStyle.scss'

const { Title } = Typography

const LearnerCard = ({ style, node, name }) => {
  const selectStudent = () => {
    console.log('===> button clicked', node.id)
    localStorage.setItem('studentId', JSON.stringify(node.id))
    // window.location.href = '/#/therapistStudent'
  }

  let backgroungColor = 'white'
  if (localStorage.getItem('studentId') && (JSON.parse(localStorage.getItem('studentId')) === node.id)) {
    backgroungColor = '#cccccc'
  }

  return (
    <a >
      <a
        href="#"
        key={node.id}
        onClick={selectStudent}
        className={`${style.item} ${
          backgroungColor === 'white' ? style.current : ''
          } d-flex flex-nowrap align-items-center`}
      >
        <div className="kit__utils__avatar kit__utils__avatar--size46 mr-3 flex-shrink-0">
          <img 
            src={profileImg} 
            style={{
              width: 70,
              height: 54,
            }} 
            alt={name} 
          />
        </div>
        <div className={`${style.info} flex-grow-1`}>
          <div className="text-uppercase font-size-12 text-truncate text-gray-6">
            {node.category.category}
          </div>
          <div className="text-dark font-size-18 font-weight-bold text-truncate">
            {name}
          </div>
        </div>
        {/* <div
          hidden={!item.unread}
          className={`${style.unread} flex-shrink-0 align-self-start`}
        >
          <div className="badge badge-success">1</div>
        </div> */}
      </a>
      {/* <div
        style={{
          background: backgroungColor,
          border: '1px solid #E4E9F0',
          boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
          borderRadius: 10,
          padding: '16px 12px',
          display: 'flex',
          alignItems: 'center',
          ...style,
        }}
      >
        <img
          src={profileImg}
          alt=""
          style={{
            width: 80,
            height: 64,
            borderRadius: 10,
          }}
        />
        <div
          style={{
            marginLeft: 22,
          }}
        >
          <Title style={{ fontSize: 18, lineHeight: '25px' }}>{name}</Title>
          <div>
            <span
              style={{
                color: '#0B35B3',
                marginRight: 38,
              }}
            >
              Learner
            </span>
            <span style={{ color: '#FF5454' }}>{node.category.category}</span>
          </div>
        </div>
      </div> */}
    </a>
  )
}

export default LearnerCard
