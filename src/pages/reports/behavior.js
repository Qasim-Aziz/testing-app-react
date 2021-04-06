import { CloudDownloadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Dropdown, notification, Form, Menu, Select, Typography } from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { COLORS } from 'assets/styles/globalStyles'
import client from '../../apollo/config'
import LoadingComponent from '../staffProfile/LoadingComponent'
import { GET_TEMPLATES } from './query'
import './behavior.scss'
import FrequencyDurationGraph from './frequencyDuration'

const { RangePicker } = DatePicker
const { Option } = Select

const filterCardStyle = {
  backgroundColor: COLORS.palleteLight,
  display: 'flex',
  flexWrap: 'wrap',
  padding: '5px 10px',
  margin: 0,
  height: 'fit-content',
  overflow: 'hidden',
}

const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }
const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }

class BehaviorReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      behaviorList: [],
      loading: true,
      selectedBehavior: undefined,
      startDate: moment().subtract(21, 'days'),
      endDate: moment(),
      componentsKey: Math.random(),
    }
  }

  componentDidMount() {
    client
      .query({
        query: GET_TEMPLATES,
        variables: {
          studentId: localStorage.getItem('studentId'),
        },
      })
      .then(result => {
        this.setState({
          behaviorList: result.data.getTemplate.edges,
          loading: false,
        })
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  componentDidUpdate(prevProps) {
    const { selectedStudentId } = this.props
    if (selectedStudentId !== prevProps.selectedStudentId) {
      client
        .query({
          query: GET_TEMPLATES,
          variables: {
            studentId: selectedStudentId,
          },
        })
        .then(result => {
          this.setState({
            behaviorList: result.data.getTemplate.edges,
            loading: false,
          })
        })
        .catch(error => {
          error.graphQLErrors.map(item => {
            return notification.error({
              message: 'Somthing went wrong',
              description: item.message,
            })
          })
        })
    }
  }

  loadGraph = id => {
    this.setState({
      selectedBehavior: id,
      componentsKey: Math.random(),
    })
  }

  dateChange = dateRange => {
    this.setState({
      startDate: dateRange[0],
      endDate: dateRange[1],
      componentsKey: Math.random(),
    })
  }

  render() {
    const { selectedStudentId, studentName } = this.props
    const {
      behaviorList,
      loading,
      selectedBehavior,
      startDate,
      endDate,
      componentsKey,
    } = this.state

    const exportChart = () => {
      this.report.exportChart(studentName)
    }

    const exportToCSV = () => {
      this.report.exportToCSV(studentName)
    }

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={exportChart} type="link" size="small">
            Chart
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={exportToCSV} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
      </Menu>
    )

    return (
      <div className="behaviorReport">
        <div style={filterCardStyle}>
          <div style={parentDiv}>
            <span style={parentLabel}>Date :</span>
            <RangePicker
              style={{
                marginLeft: 'auto',
                width: 240,
              }}
              defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
              format="YYYY-MM-DD"
              onChange={this.dateChange}
            />
          </div>
          <div style={parentDiv}>
            <span style={parentLabel}>Behaviour :</span>
            <Select
              placeholder="Select Behavior"
              loading={loading}
              showSearch
              allowClear
              optionFilterProp="children"
              value={selectedBehavior}
              onChange={this.loadGraph}
              style={{ width: '240px' }}
            >
              {behaviorList?.map(({ node }) => (
                <Option key={node.id} value={node.id}>
                  {node.behavior.behaviorName}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          {loading ? (
            <LoadingComponent />
          ) : (
            <FrequencyDurationGraph
              ref={instance => {
                this.report = instance
              }}
              key={componentsKey}
              startDate={startDate}
              endDate={endDate}
              selectedBehavior={selectedBehavior}
              selectedStudentId={selectedStudentId}
            />
          )}
        </div>
      </div>
    )
  }
}

export default BehaviorReport
