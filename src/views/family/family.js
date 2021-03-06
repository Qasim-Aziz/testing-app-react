/* eslint-disable react/jsx-indent */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Card, Layout, Menu, Typography } from 'antd'
import { COLORS, FONT } from 'assets/styles/globalStyles' // '../../../assets/styles/globalStyles' //

import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import Father from '../../icons/father.png'
import Mother from '../../icons/mother.jpeg'
import Sibling from '../../icons/siblings.jpeg'
import GrandParents from '../../icons/grandFather.jpeg'
import './family.scss'
import FamilyForm from './FamilyForm'
import FamilyMemberCard from './FamilyMemberCard'

@connect(({ user, family }) => ({ user, family }))
class FamilyMembers extends React.Component {
  constructor() {
    super()
    this.state = {
      relationId: '',
      relationName: '',
      newMember: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'family/SESSION_RELATIONS',
    })
    dispatch({
      type: 'family/FAMILY_DETAILS',
    })
  }

  memberClickHandler = (relationIdentifier, member, newMember) => {
    this.setState(state => ({
      ...state,
      relationId: relationIdentifier,
      relationName: member,
      newMember,
    }))
  }

  getIcons = type => {
    switch (type) {
      case 'Father':
        return Father
      case 'Mother':
        return Mother
      case 'Sibling':
        return Sibling
      case 'Grand Parents':
        return GrandParents
      default:
        return null
    }
  }

  render() {
    const { family } = this.props
    const { Content, Sider } = Layout
    const { Title, Text } = Typography
    const { relationId } = this.state

    const newMemberStyle = {
      border: '1px dashed #0B35B3',
      // padding: '10px',
      height: 'auto',
      width: '100%',
      color: '#0B35B3',
      margin: '12.5px 0',
      padding: '10px 35px',
    }

    const SideBarHeading = {
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '33px',
      marginBottom: '25px',
    }

    return (
      <Authorize roles={['school_admin', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Layout>
          <Layout style={{ padding: '0' }}>
            <Sider
              id="custom_sidebar"
              width={400}
              style={{
                background: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Card
                style={{
                  background: COLORS.palleteLight,
                  borderRadius: 0,
                  border: 'none',
                  minHeight: '100%', // '100vh',
                  minWidth: '290px',
                  maxWidth: '350px',
                }}
              >
                <div style={SideBarHeading}>FAMILY MEMBERS</div>
                {/* <div style={BlockStyle}>
                  <span style={HeadStyle}>Meal Data</span>
                </div> */}

                {family.relations.map(relation => {
                  return (
                    <FamilyMemberCard
                      key={relation.id}
                      onClick={() => this.memberClickHandler(relation.id, relation.name, false)}
                      heading={relation.name}
                      text="Personal Details & time 1 spen with kunal"
                      selected={relationId === relation.id}
                    />
                  )
                })}
                <Button
                  key="123"
                  type="link"
                  style={newMemberStyle}
                  onClick={() => this.memberClickHandler('', '', true)}
                >
                  New Family Member
                </Button>
              </Card>
              {/* <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{
                  height: '100%',
                  padding: '30px',
                  borderRight: 0,
                  backgroundColor: '#f2f4f8',
                }}
              >
                <h3 style={{ fontWeight: '500', fontSize: '22px' }}>
                  {/* type="secondary" level={3} * /}
                  <Text type="secondary">FAMILY MEMBERS</Text>
                </h3>
                {family.relations.map(relation => {
                  return (
                    <FamilyMemberCard
                      key={relation.id}
                      onClick={() => this.memberClickHandler(relation.id, relation.name, false)}
                      heading={relation.name}
                      text="Personal Details & time 1 spen with kunal"
                      selected={relationId === relation.id}
                    />
                  )
                })}
                <Menu.Item>
                  <Button
                    key="123"
                    type="link"
                    style={newMemberStyle}
                    onClick={() => this.memberClickHandler('', '', true)}
                  >
                    New Family Member
                  </Button>
                </Menu.Item>
              </Menu> */}
            </Sider>
            <Layout>
              <Content style={{ padding: '0 30px' }}>
                <FamilyForm
                  processData={{ ...this.state }}
                  memberClickHandler={this.memberClickHandler}
                />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Authorize>
    )
  }
}

export default FamilyMembers
