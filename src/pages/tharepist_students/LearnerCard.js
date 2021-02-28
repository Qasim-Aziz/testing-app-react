/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import profileImg from './img/profile.jpg'
import style from './learnerCardStyle.scss'

const { Title } = Typography

const LearnerCard = ({ style, node, name }) => {
  const selectStudent = () => {
    localStorage.setItem('studentId', JSON.stringify(node.id))
  }

  let backgroungColor = 'white'
  if (
    localStorage.getItem('studentId') &&
    JSON.parse(localStorage.getItem('studentId')) === node.id
  ) {
    backgroungColor = '#cccccc'
  }

  const selectedCard = {
    // border: '1px solid #ccc',
    margin: 0,
    background: '#cccccc',
    padding: 12,
  }

  const normalCard = {
    // border: '1px solid #ccc',
    background: '#f9f9f9',
    padding: 12,
    margin: 0,
  }

  return (
    <a
      key={node.id}
      onClick={selectStudent}
      className={`${style.item} ${
        backgroungColor === 'white' ? style.current : ''
      } d-flex flex-nowrap align-items-center`}
      style={backgroungColor === 'white' ? normalCard : selectedCard}
    >
      <div className="kit__utils__avatar kit__utils__avatar--size46 mr-3 flex-shrink-0">
        <FontAwesomeIcon style={{ color: '#777' }} icon={faUser} />
      </div>
      <div
        className={`${style.info} flex-grow-1`}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div className=" text-truncate " style={{ color: '#3ca5fc' }}>
          {name} {node.lastname}
        </div>
        <div className="text-uppercase font-size-12 text-truncate text-gray-6">
          {node.category?.category}
        </div>
      </div>
    </a>
  )
}

export default LearnerCard
