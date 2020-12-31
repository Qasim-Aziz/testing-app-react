/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react'
import { Row, Col, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-apollo'
import Scrollbars from 'react-custom-scrollbars'
import CreateGroupBox from './CreateGroupForm'
import GroupCard from './GroupCard'
import { GET_GROUPS } from './query'
import BlogsView from './BlogsView'

const { Title } = Typography

export const LSAG_USER_ID = 'VXNlclR5cGU6MTk4'

const centerView = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default () => {
  const [selectGroup, setSelectGroup] = useState()
  const userId = useSelector(state => state.user.id)
  const { data: groupsData, error: groupsError, loading: groupsLoading } = useQuery(GET_GROUPS)

  useEffect(() => {
    if (groupsData) {
      setSelectGroup(groupsData.communityGroups[0]?.id)
    }
  }, [groupsData])

  return (
    <div
      style={{
        maxWidth: 1300,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Row gutter={[44, 0]}>
        <Col span={14}>
          {userId === LSAG_USER_ID && <CreateGroupBox />}
          <div style={{ marginTop: 20 }}>
            <BlogsView selectGroup={selectGroup} />
          </div>
        </Col>

        <Col span={10}>
          <Title style={{ fontSize: '1.75rem', fontWeight: 600, marginLeft: 25 }}>
            Popular Groups
          </Title>
          <div
            style={{
              background: '#F9F9F9',
              borderRadius: 10,
              padding: '25px',
            }}
          >
            {groupsLoading ? (
              <div style={{ ...centerView, height: 'calc(100vh - 180px)' }}>Loading...</div>
            ) : (
              <Scrollbars style={{ height: 'calc(100vh - 180px)' }} autoHide>
                {groupsError && (
                  <div style={centerView}>
                    Opps their are something is wrong can not get groups data form server
                  </div>
                )}
                {groupsData &&
                  selectGroup &&
                  groupsData.communityGroups.map(({ id, name, description, user: { count } }) => {
                    const selected = selectGroup === id
                    return (
                      <div key={id}>
                        <GroupCard
                          id={id}
                          name={name}
                          description={description}
                          count={count}
                          selected={selected}
                          setSelectGroup={setSelectGroup}
                        />
                      </div>
                    )
                  })}
              </Scrollbars>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}
