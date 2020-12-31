import React from 'react'
import { Tag } from 'antd'
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'

const MemersTags = ({
  membersArray = [],
  currentIndex = 0,
  handleNextMember,
  addNewMember,
  deleteMember,
}) => {
  const { CheckableTag } = Tag
  return (
    <div className="siblings">
      {membersArray.map((sib, index) => {
        return (
          <CheckableTag
            className="tag"
            key={sib.node.id}
            checked={currentIndex === index}
            onChange={() => handleNextMember(index)}
          >
            {sib.node.memberName}
            <CloseCircleOutlined onClick={() => deleteMember(sib)} />
          </CheckableTag>
        )
      })}
      <Tag className="tag" onClick={addNewMember}>
        <PlusOutlined />
      </Tag>
    </div>
  )
}

export default MemersTags
