/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Typography, Card, Button } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import taskCardHeroImg from './images/taskCardHero.jpg'

const { Title, Text } = Typography

const LIKE = gql`
  mutation targetLike($targetId: ID!) {
    targetLike(input: { target: $targetId }) {
      likeOrDislike
      totalLike
    }
  }
`

const TaskCard = ({ style, id, domainName, targetName, like, userLiked }) => {
  const [mutate, { data, error }] = useMutation(LIKE, {
    variables: {
      targetId: id,
    },
  })
  const [targetLike, setTargetLike] = useState(like)
  const [userLike, setUserLike] = useState(userLiked)

  useEffect(() => {
    if (data) {
      setTargetLike(data.targetLike.totalLike)
      setUserLike(data.targetLike.likeOrDislike)
    }
  }, [data])

  return (
    <Card
      hoverable
      style={{
        margin: '10px 10px 10px 0',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        maxWidth: 400,
        overflow: 'hidden',
        height: 400,
        ...style,
      }}
      cover={<img alt="example" src={taskCardHeroImg} />}
    >
      <Text
        type="danger"
        style={{
          margin: '0',
          fontSize: '14px',
          lineHeight: '19px',
          float: 'left',
        }}
      >
        {domainName}
      </Text>
      <Text type="danger" style={{ margin: '0', fontSize: '8px', float: 'right' }}>
        <Button
          type="link"
          onClick={e => {
            e.preventDefault()
            mutate()
          }}
        >
          {userLike === 'dislike' ? (
            <HeartOutlined style={{ fontSize: 20, color: 'red' }} />
          ) : (
            <HeartFilled style={{ fontSize: 20, color: 'red' }} />
          )}
          <Text>{targetLike}</Text>
          {error && 'error'}
        </Button>
      </Text>
      <Title
        level={4}
        style={{
          marginBottom: '0',
          fontWeight: '600',
          marginRight: '50px',
          fontSize: 18,
          lineHeight: '25px',
        }}
      >
        {targetName}
      </Title>
    </Card>
  )
}

export default TaskCard
