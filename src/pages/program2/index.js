/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-closing-tag-location */

import React from 'react'
// import { Input, Button } from 'antd'
import {
  Tabs,
  Drawer,
  Form,
  Button,
  Popover,
  Col,
  Row,
  DatePicker,
  Input,
  Spin,
  Select,
} from 'antd'
import { Helmet } from 'react-helmet'
import { Scrollbars } from 'react-custom-scrollbars'
import SortableTree from 'react-sortable-tree'
import { Editor } from 'react-draft-wysiwyg'
import { EditOutlined, CalendarOutlined, FolderAddOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'
import { gql } from 'apollo-boost'
import 'react-sortable-tree/style.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import client from '../../apollo/config'
import styles from './style.module.scss'

const { TabPane } = Tabs
const { Option } = Select
const FormItem = Form.Item
// const {Search} = Input;

const operations = (
  <Popover
    content={<Input size="default" placeholder="Program Area" />}
    title="Add New Program Area"
    trigger="click"
    onKeyPress={e => this.AddProgramArea(e)}
  >
    <Button>Add Program Area</Button>
  </Popover>
)

@Form.create()
class ProductsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      programArea: [],
      drawervisible: false,
      defaultProgram: null,
      defaultDomain: null,
      SelectedArea: null,
      treeData: [],
      suggestedDomain: [],
      treeDataLoad: false,
      visible: false,
      domain: [],
    }
    this.DomainInput = React.createRef()
    // this.TargetNameInput = React.createRef();
  }

  componentDidMount() {
    client
      .query({
        query: gql`
          {
            programArea {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .then(result => {
        this.setState({
          programArea: result.data.programArea.edges,
          defaultProgram: result.data.programArea.edges[0].node.id,
        })
        if (result.data.programArea.edges[0]) {
          this.programchange(result.data.programArea.edges[0].node.id)
        } else {
          this.setState({
            programArea: [],
            treeData: [],
            domain: [],
          })
        }
      })
  }

  showDrawer = () => {
    this.setState({
      drawervisible: true,
    })
  }

  onClose = () => {
    this.setState({
      drawervisible: false,
    })
  }

  programchange = key => {
    client
      .query({
        query: gql`{
    domain(programarea:"${key}") {
        edges {
            node {
                id
                domain
            }
              }
          }
      }
        `,
      })
      .then(result => {
        this.setState({
          domain: result.data.domain.edges,
          defaultProgram: key,
        })

        if (result.data.domain.edges[0]) {
          this.Domainchange(result.data.domain.edges[0].node.id)
        } else {
          this.setState({
            treeData: [],
            domain: [],
          })
        }
      })
  }

  SearchDomain = value => {
    client
      .query({
        query: gql`{
    domain(domain_Icontains:"${value}") {
        edges {
            node {
                id
                domain
            }
              }
          }
      }
        `,
      })
      .then(result => {
        this.setState({
          suggestedDomain: result.data.domain.edges,
        })
      })
  }

  AddDomain = value => {
    const { defaultProgram } = this.state
    let { domain } = this.state

    client
      .mutate({
        mutation: gql`mutation {
        domainProgram(input:{programArea:"${defaultProgram}", key:"${value.key}",label: "${value.label}"})
        {
            domain
           {
                    id
                    domain

        }}
          }
      `,
      })
      .then(result => {
        domain = domain.concat({
          node: {
            id: result.data.domainProgram.domain.id,
            domain: result.data.domainProgram.domain.domain,
          },
        })

        this.setState({
          domain,
        })
      })
    this.DomainInput.current.value = ''
  }

  Domainchange = domain => {
    this.setState({
      treeDataLoad: false,
      defaultDomain: domain,
    })
    client
      .query({
        query: gql`{
      targetArea(domain:"${domain}") {
        edges {
          node {
            id
            Area
            targetMain
            {
                edges {
                      node {
                          id
                          targetName
                          targetsSet
                          {
                                  edges {
                                  node {
                                          id
                                          targetInstr
                                      }
                              }
                          }
                      }
                }
            }
          }
      }
    }
    }`,
      })
      .then(result => {
        const dataTree = []
        const targetarea = result.data.targetArea.edges

        targetarea.map(area => {
          const tar = []
          area.node.targetMain.edges.map(target => {
            const tamp = {}

            tamp.name = target.node.targetName
            if (target.node.targetsSet.edges[0]) {
              tamp.tarInstr = target.node.targetsSet.edges[0].node.targetInstr
            } else {
              tamp.tarInstr = ''
            }
            tar.push(tamp)
            return null
          })
          dataTree.push({
            name: area.node.Area,
            children: tar,
          })

          return null
        })
        this.setState({
          treeData: dataTree,
        })
        this.setState({
          treeDataLoad: true,
        })
      })
  }

  AddProgramArea = e => {
    const program = e.target.value

    if (e.which === 13 && program !== '') {
      let { programArea } = this.state
      client
        .mutate({
          mutation: gql`mutation {programArea(input:{name:"${program}"})
               {
                   ProgramArea
                   {
                       id
                       name
                       }
                   }
              }`,
        })
        .then(result => {
          programArea = programArea.concat({
            node: {
              id: result.data.programArea.ProgramArea.id,
              name: program,
            },
          })

          this.setState({
            programArea,
          })
        })
      this.ProgramAreaInput.current.value = ''
      this.hide()
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { form } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const { defaultProgram, defaultDomain } = this.state

        client
          .mutate({
            mutation: gql`mutation {
    masterTarget(input:{domainId:"${defaultDomain}", targetAreaId:"",targetName: "dfbhfd", targetInstr:"fgdfg"})
    {
        target
       {
                id

    }}
      }
      `,
          })
          .then(result => {})
      }
    })
  }

  render() {
    const {
      treeData,
      programArea,
      domain,
      defaultProgram,
      treeDataLoad,
      visible,
      suggestedDomain,
    } = this.state

    const { form } = this.props

    console.log(visible)
    console.log(treeData)
    return (
      <div>
        <Helmet title="Program List" />
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Program List</strong>
            </div>
          </div>
          <div className="card-body">
            <Tabs
              tabBarExtraContent={operations}
              defaultActiveKey={defaultProgram}
              onChange={this.programchange}
            >
              {programArea.map(item => (
                <TabPane tab={item.node.name} key={item.node.id}>
                  <div className="row">
                    <div className="col-sm-4">
                      <div className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                          <Select
                            mode="tags"
                            labelInValue
                            placeholder="Add Domain"
                            filterOption="true"
                            onSearch={this.SearchDomain}
                            onSelect={this.AddDomain}
                            style={{ width: '100%' }}
                            ref={this.DomainInput}
                          >
                            {suggestedDomain.map(d => (
                              <Option key={d.node.id}>{d.node.domain}</Option>
                            ))}
                          </Select>
                        </div>
                        <Tabs tabPosition="right" onChange={this.Domainchange}>
                          {domain.map(dom => (
                            <TabPane
                              tab={
                                <div className={styles.tab}>
                                  <div className={styles.tabContent}>
                                    <div className="mb-1">
                                      {dom.node.domain}{' '}
                                      <a>
                                        <FolderAddOutlined />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              }
                              key={dom.node.id}
                            />
                          ))}
                        </Tabs>
                      </div>
                    </div>
                    <div className="col-sm-8">
                      <div style={{ height: 800 }}>
                        {treeDataLoad ? (
                          <Scrollbars
                            autoHide
                            renderThumbVertical={({ ...props }) => (
                              <div
                                {...props}
                                style={{
                                  width: '5px',
                                  borderRadius: 'inherit',
                                  backgroundColor: 'rgba(195, 190, 220, 0.4)',
                                  left: '1px',
                                }}
                              />
                            )}
                          >
                            <SortableTree
                              treeData={treeData}
                              onChange={tree => this.setState({ treeData: tree })}
                              generateNodeProps={({ node }) => ({
                                title: <span>{node.name}</span>,
                                buttons: [
                                  node.children ? (
                                    <>
                                      <Button>
                                        <EditOutlined />
                                      </Button>
                                      <Button onClick={e => this.showDrawer(e)}>
                                        <FolderAddOutlined />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Popover
                                        content={parse(node.tarInstr)}
                                        trigger="click"
                                        placement="rightTop"
                                        title="Target Instruction"
                                      >
                                        <Button>
                                          <CalendarOutlined />
                                        </Button>
                                      </Popover>
                                    </>
                                  ),
                                ],
                              })}
                            />
                          </Scrollbars>
                        ) : (
                          <Spin />
                        )}
                      </div>
                    </div>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
        <Drawer
          title="Create a new account"
          width={600}
          onClose={this.onClose}
          visible={this.state.drawervisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form className="mt-3" onSubmit={this.onSubmit}>
            <div className="form-group">
              <FormItem label="Target Name">
                {form.getFieldDecorator('target_name', {
                  rules: [{ required: true, message: 'Please input your target name' }],
                })(<Input placeholder="Target Name" />)}
              </FormItem>
            </div>
            <div className="form-group">
              <FormItem label="Target Instruction">
                {form.getFieldDecorator('tar_inst', {
                  rules: [{ required: true, message: 'Please input your target Instruction' }],
                })(
                  <div className={styles.editor}>
                    <Editor />
                  </div>,
                )}
              </FormItem>
            </div>
            <FormItem>
              <div className={styles.submit}>
                <span className="mr-3">
                  <Button type="primary" htmlType="submit">
                    Create Target
                  </Button>
                </span>
                <Button type="danger" onClick={this.onClose}>
                  Discard
                </Button>
              </div>
            </FormItem>
          </Form>
        </Drawer>
      </div>
    )
  }
}

export default ProductsList
