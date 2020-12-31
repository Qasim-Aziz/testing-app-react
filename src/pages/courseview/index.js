/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React from 'react'
import { Collapse, List, Avatar } from 'antd'
import { Helmet } from 'react-helmet'
import { GraphQLClient } from 'graphql-request'
import client from '../../config'

const { Panel } = Collapse

// import table from './data.json'

class Orders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      VimeoVideos: [],
    }
  }

  componentDidMount() {
    const query = `{
            VimeoProject  {
              edges {
                node {
                  id,
                  name,
                  vimeoVideosSet{
                      edges {
                        node {
                              id,
                              name,
                              description
                        }
                  }
                  }

              }
            }
          }
          }`

    client.request(query).then(data => {
      this.setState({
        VimeoVideos: data.VimeoProject.edges,
      })
    })
  }

  render() {
    const { VimeoVideos } = this.state

    console.log(VimeoVideos)

    return (
      <div>
        <Helmet title="Orders" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Creator</strong>
            </div>
            Are you doing deep data prep and analysis? Responsible for creating content for others?
            If you have Tableau Prep and Tableau Desktop, these videos are for you. Learn how to
            prepare, analyze, and share your data.
          </div>
          <div className="card-body">
            <Collapse defaultActiveKey={['VmltZW9Qcm9qZWN0VHlwZTox']}>
              {VimeoVideos.map(c => (
                <Panel header={c.node.name} key={c.node.id} extra="13 MIN">
                  <List
                    itemLayout="horizontal"
                    dataSource={c.node.vimeoVideosSet.edges}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar src="https://image.shutterstock.com/image-vector/play-button-icon-260nw-232671499.jpg" />
                          }
                          title={
                            <a href={`#/targets/coursedetail/${item.node.id}`}>{item.node.name}</a>
                          }
                          description={item.node.description}
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    )
  }
}

export default Orders
