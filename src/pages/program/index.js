import React from 'react'
import { Helmet } from 'react-helmet'
// import { Scrollbars } from 'react-custom-scrollbars';
import SortableTree from 'react-sortable-tree'
import { Tabs, Input, Button, Icon, Spin, Popover } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import { EditOutlined, CalendarOutlined, FolderAddOutlined } from '@ant-design/icons'
import 'react-sortable-tree/style.css'
import parse from 'html-react-parser'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
// import Table6 from 'components/kit-widgets/Tables/6'
// import Chart4 from 'components/kit-widgets/Charts/4'
// import Chart4v1 from 'components/kit-widgets/Charts/4v1'
// import Chart4v2 from 'components/kit-widgets/Charts/4v2'
import styles from './style.module.scss'

const { TabPane } = Tabs
const { Search } = Input

// const menu1 = (
//   <Menu>
//     <Menu.Item>Edit</Menu.Item>
//     <Menu.Item>Add Target</Menu.Item>
//   </Menu>
// );

// const menu2 = (
//   <Menu>
//     <Menu.Item>Edit</Menu.Item>
//     <Menu.Item>Target Instruction</Menu.Item>
//   </Menu>
// );
// const { TabPane } = Tabs;

// const mailTab = () => <div className={styles.tab}>gfdgdf</div>;

class ExtraAppsTodoistList extends React.Component {
  constructor(props) {
    super(props)
    this.ProgramAreaInput = React.createRef()
    this.TargetNameInput = React.createRef()
  }

  state = {
    programArea: [],
    domain: [],
    defaultProgram: null,
    treeData: [],
    treeDataLoad: false,
    visible: false,
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

  Domainchange = domain => {
    this.setState({
      treeDataLoad: false,
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

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleChange = visible => {
    this.setState({ visible })
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

  AddTargetName = e => {
    const program = e.target.value
    console.log(program)
    // if (e.which === 13 && program !== '') {
    //
    // }
  }

  render() {
    const { treeData, programArea, domain, defaultProgram, treeDataLoad, visible } = this.state

    return (
      <div>
        <Helmet title="Todoist List" />
        <div className="card">
          <div className={styles.contentHeader}>
            <div className="card-header clearfix">
              <div className="pull-right">
                <Popover
                  content={
                    <Input
                      size="default"
                      placeholder="Program Area"
                      onKeyPress={e => this.AddProgramArea(e)}
                      ref={this.TargetNameInput}
                    />
                  }
                  title="Add New Program Area"
                  trigger="click"
                  visible={visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <Button>Add Program Area</Button>
                </Popover>
              </div>
              <Tabs
                defaultActiveKey={defaultProgram}
                onChange={this.programchange}
                tabPosition="top"
              >
                {programArea.map(item => (
                  <TabPane
                    tab={
                      <span>
                        <Icon type="home" />
                        {item.node.name}
                      </span>
                    }
                    key={item.node.id}
                  />
                ))}
              </Tabs>
            </div>
            <div className="card-body">
              <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                  <Search placeholder="input search text" style={{ width: '100%' }} />
                </div>

                <Tabs tabPosition="right" onChange={this.Domainchange}>
                  {domain.map(item => (
                    <TabPane
                      tab={
                        <div className={styles.tab}>
                          <div className={styles.tabContent}>
                            <div className="mb-1">{item.node.domain}</div>
                          </div>
                        </div>
                      }
                      key={item.node.id}
                    />
                  ))}
                </Tabs>
              </div>
              <div className="height-600" style={{ marginLeft: '320px' }}>
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
                              <Popover
                                content={
                                  <Input
                                    size="default"
                                    placeholder="Add Target Name"
                                    onKeyPress={e => this.AddTargetName(e)}
                                    ref={this.ProgramAreaInput}
                                  />
                                }
                                title="Add Target Name"
                                trigger="click"
                              >
                                <Button>
                                  <FolderAddOutlined />
                                </Button>
                              </Popover>
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
        </div>
      </div>
    )
  }
}

export default ExtraAppsTodoistList
