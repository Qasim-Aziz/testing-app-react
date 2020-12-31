import React from 'react'
import { CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Select, Typography, Popconfirm, Badge } from 'antd'
import { useDispatch } from 'react-redux'
import style from './style.module.scss'

const {Text, Title} = Typography

const TargetCard = ({ id = '', text = '', showDelete = false, onDelete, srNo, node, sessionId = '', showAllocation = false }) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
    marginBottom: 15,
    padding: 5,
    minHeight: 40,
    cursor: 'move',
    border: '1px solid #E4E9F0',
    position: 'relative',
  }

  const closeBtnStyle = {
    position: 'absolute',
    right: '10px',
    top: '5px',
    // cursor: 'pointer',
    zIndex: '999',
  }
  const closeBtnStyle2 = {
    position: 'absolute',
    right: '10px',
    bottom: '5px',
    cursor: 'pointer',
    zIndex: '999',
  }

  const dispatch = useDispatch()

  const deleteTargetFromSession = targetId => {
    console.log('Close button clicked ===>', targetId, 'sessionId ==> ', sessionId)

    dispatch({
      type: 'sessiontargetallocation/DELETE_TARGET',
      payload: {
        session: sessionId,
        id: targetId
      }
    })

  }

  const allocatedTagetBadgeStyle = {backgroundColor: '#52c41a'}
  const notAllocatedTagetBadgeStyle = {backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}

  return (
    <div className={id} id={id} style={cardStyle} key={id}>
      {showDelete ? (
        <div style={closeBtnStyle}>
          {/* {node.targetStatus.statusName} &nbsp;  */}
          <Popconfirm title="Are you sure?" onConfirm={() => deleteTargetFromSession(node.id)}>
            <Button style={{padding:0}} type="link"><CloseOutlined /></Button>
          </Popconfirm>
          
          {/* <CloseCircleOutlined onClick={onDelete} /> */}
          {/* {srNo} */}
        </div>
      ) : (
        <></>
      )}

      <div className={style.content}>
        <div className="d-flex flex-wrap align-items-center">
          <h5 className="text-dark font-size-18 mt-2 mr-auto">{text}</h5>
          <br />
        </div>
      </div>
      
      <div style={closeBtnStyle2}>
        {node.targetStatus.statusName} &nbsp;
        #{srNo}
      </div>

      {showAllocation && (
        <>
          <Badge count='M' style={node.morning ? allocatedTagetBadgeStyle : notAllocatedTagetBadgeStyle} />
          <Badge count='A' style={node.afternoon ? allocatedTagetBadgeStyle : notAllocatedTagetBadgeStyle} />
          <Badge count='E' style={node.evening ? allocatedTagetBadgeStyle : notAllocatedTagetBadgeStyle} />
        </>
      )}
      
      
    </div>
  )
}

export default TargetCard
