import React, { useState, useEffect } from 'react'
import {
  Table,
  Menu,
  Icon,
  Dropdown,
  Button,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  notification,
  Modal,
} from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import Highlighter from 'react-highlight-words'
import UpdateTemplateForm from 'pages/BehaviourData/UpdateTemplateForm'
import CreateTemplateForm from 'pages/BehaviourData/Templateform'
import RecordDrawer from 'pages/BehaviourData/RecordDrawer'
import BehaviorChart from 'pages/BehaviourData/BehaviorChart'
import moment from 'moment'
import { GET_TEMPLETES, DELETE_TEMPLATE } from './queries'

const { Search } = Input

const TemplateTab = ({ studentId }) => {
  const [allTemplates, setAllTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])

  const [isCreatingNewTemplate, setCreatingNewTemplate] = useState(false)
  const [editTemplateFor, setEditTemplateFor] = useState(false)
  const [openRecordDrawerFor, setOpenRecordDrawerFor] = useState(false)
  const [openChartFor, setOpenChartFor] = useState(false)
  const [searchText, setSearchText] = useState()

  const {
    data: templateData,
    error: templateError,
    loading: templateLoading,
    refetch: refetchTemplates,
  } = useQuery(GET_TEMPLETES, {
    variables: {
      studentId,
    },
    fetchPolicy: 'network-only',
  })

  console.log(templateData, 'tpl')

  const [deleteTemplate, { data: deleteTemplateData, error: deleteTemplateError }] = useMutation(
    DELETE_TEMPLATE,
  )

  useEffect(() => {
    if (templateData) {
      const templateList = templateData.getTemplate.edges.map(({ node }) => ({
        id: node.id,
        date: moment(node.createdAt).format('YYYY-MM-DD'),
        behaviourId: node.behavior.id,
        templateName: node.behavior.behaviorName,
        status: node.status.statusName,
        description: node.behaviorDescription,
        environment: node.environment?.edges.map(
          ({ node: environmentNode }) => environmentNode.name,
        ),
      }))
      setAllTemplates(templateList)

      if (searchText) {
        // If filter already exist then
        const filteredTemplateList = templateList.filter(x =>
          x.templateName.toLowerCase().includes(searchText.toLowerCase()),
        )
        setFilteredTemplates(filteredTemplateList)
      } else {
        setFilteredTemplates(templateList)
      }
    }
  }, [templateData])

  useEffect(() => {
    if (deleteTemplateData) {
      notification.success({
        message: 'Delete Template Sucessfully',
      })
      refetchTemplates({
        variables: {
          studentId,
        },
      })
    }
  }, [deleteTemplateData])

  useEffect(() => {
    if (deleteTemplateError)
      notification.error({
        message: 'Opps their something wrong',
      })
  }, [deleteTemplateError])

  const templateColumns = [
    {
      title: 'Template Name',
      dataIndex: 'templateName',
      render: (text, row) =>
        searchText ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      ellipsis: true,
      render: (text, record) => record.environment.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
    },
    {
      title: 'Action(s)',
      dataIndex: '',
      align: 'center',
      width: 200,
      render: (text, record) => {
        const menu = (
          <Menu onClick={e => handleMenuActions(e, record)}>
            <Menu.Item key="editTemplate">
              <Icon type="edit" /> Edit
            </Menu.Item>
            <Menu.Item key="deleteTemplate">
              <Icon type="delete" /> Delete
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="openGraph">
              <Icon type="snippets" /> Open Graph
            </Menu.Item>
          </Menu>
        )

        return (
          <>
            <Button type="link" size="small" onClick={() => setOpenRecordDrawerFor(record.id)}>
              <Icon type="form" /> Record
            </Button>
            <span style={{ borderRight: '1px solid #ccc', marginRight: '8px' }} />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" style={{ color: '#1890ff' }}>
                More <Icon type="down" />
              </a>
            </Dropdown>
          </>
        )
      },
    },
  ]

  const handleMenuActions = (e, obj) => {
    switch (e.key) {
      case 'editTemplate':
        setEditTemplateFor(obj.id)
        break
      case 'deleteTemplate':
        deleteTemplate({
          variables: {
            id: obj.id,
          },
        })
        break
      case 'openGraph':
        setOpenChartFor(obj)
        break

      default: {
        console.log(`Unknown menuitem - ${e.key}`)
      }
    }
  }

  const checkIsBehaviorAlreadyExist = newId => allTemplates.some(x => x.behaviourId === newId)

  const onCreatingTemplate = () => {
    setCreatingNewTemplate(false)
    refetchTemplates({
      variables: {
        studentId,
      },
    })
  }

  const doSearchTemplate = e => {
    // Update Text
    const text = e.target.value
    setSearchText(text)

    if (text) {
      // Filter Template
      const filteredTemplateList = allTemplates.filter(x =>
        x.templateName.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredTemplates(filteredTemplateList)
    } else {
      // If not search then show all
      setFilteredTemplates(allTemplates)
    }
  }

  const header = () => (
    <Row>
      <Col span={14}>
        <Form layout="inline">
          <Form.Item label="Template Name">
            <Search
              placeholder="Search by template name"
              value={searchText}
              onChange={doSearchTemplate}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )

  if (templateError) {
    console.error(templateError)
    return <h3>An error occurred to load data.</h3>
  }
  console.log(filteredTemplates, 'flt')

  return (
    <>
      <Table
        loading={templateLoading}
        className="templateTable"
        rowKey="id"
        columns={templateColumns}
        dataSource={filteredTemplates}
        pagination={{
          position: 'bottom',
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
        }}
        size="small"
        bordered
      />
      <Drawer
        width={800}
        title="Edit Behavior Template"
        placement="right"
        visible={!!editTemplateFor}
        onClose={() => setEditTemplateFor(null)}
      >
        <UpdateTemplateForm
          tempId={editTemplateFor}
          closeUpdateDrawer={() => setEditTemplateFor(null)}
          formSize="large"
        />
      </Drawer>
      <Drawer
        width={800}
        title="New Behavior Templates"
        placement="right"
        visible={isCreatingNewTemplate}
        onClose={() => setCreatingNewTemplate(false)}
      >
        <CreateTemplateForm
          onCreatingTemplate={onCreatingTemplate}
          isBehaviorAlreadyExist={checkIsBehaviorAlreadyExist}
          cancel={setCreatingNewTemplate}
        />
      </Drawer>

      <Drawer
        width={600}
        title="Record Behavior"
        placement="right"
        visible={openRecordDrawerFor}
        onClose={() => {
          setOpenRecordDrawerFor(null)
        }}
      >
        {openRecordDrawerFor && (
          <RecordDrawer
            selectTamplate={openRecordDrawerFor}
            refetchRecordData={() => {}}
            onRecordingData={() => {
              setOpenRecordDrawerFor(null)
            }}
          />
        )}
      </Drawer>

      <Modal
        title={openChartFor ? openChartFor.templateName : 'Chart'}
        visible={!!openChartFor}
        footer={null}
        width={800}
        height={400}
        onCancel={() => setOpenChartFor(null)}
      >
        {openChartFor && <BehaviorChart templateId={openChartFor.id} studentId={studentId} />}
      </Modal>
    </>
  )
}
export default TemplateTab
