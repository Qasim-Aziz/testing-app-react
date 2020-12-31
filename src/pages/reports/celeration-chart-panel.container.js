/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { Row, Col, Table, Drawer, Button, Icon, DatePicker } from 'antd'
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'

import {
  fetchAllCelerationCategories,
  fetchAllCelerationCharts,
  onCelerationChartChange,
  addCelerationChart,
  onSelectChart,
  updateCelerationChart,
  addPoint,
  updatePoint,
  onRecordingParametersChange,
  resetCelerationChart,
  openAddDrawer,
  onDisplaySelectedChart,
  onBehaviorTypesChange,
} from '../../redux/celerationchart/panel.action'

import AddCelerationChart from '../../components/CelerationChart/add-new-chart.component'
import UpdateCelerationChart from '../../components/CelerationChart/update-chart.component'
import CelerationGraph from '../../components/CelerationChart/celeration-graph.component'

const { RangePicker } = DatePicker

const filterCardStyle = {
  background: '#F1F1F1',
  padding: 10,
  margin: 0,
  height: 50,
  overflow: 'hidden',
  backgroundColor: 'rgb(241, 241, 241)',
}



const cardStyle = {
  background: '#F9F9F9',
  height: 500,
  overflow: 'auto',
}

const antcol1 = {
  display: 'block',
  width: '6%',
}


class CelerationChartPanel extends Component {
  constructor(props) {
    super(props)
    const { celerationCharts } = this.props
    this.state = {
      range: [moment().startOf('week'), moment().endOf('week')],
      charts: celerationCharts,
    }
  }

  componentDidMount() {
    const { fetchAllCelerationCategoriesAction, fetchAllCelerationChartsAction } = this.props
    fetchAllCelerationCategoriesAction()
    fetchAllCelerationChartsAction()
  }

  componentDidUpdate(prevProps) {
    const {
      selectedStudentId,
      fetchAllCelerationCategoriesAction,
      fetchAllCelerationChartsAction,
    } = this.props
    if (selectedStudentId !== prevProps.selectedStudentId) {
      fetchAllCelerationCategoriesAction()
      fetchAllCelerationChartsAction()
    }
  }

  render() {
    const { range, charts } = this.state
    const iconStyle = {
      paddingRight: '20px',
    }

    const strcmp = (a, b) => {
      if (a.toString() < b.toString()) return -1
      if (a.toString() > b.toString()) return 1
      return 0
    }

    const {
      studentName,
      celerationCategories,
      celerationCharts,
      celerationChartIndex,
      celerationChart,
      drawer,
      behaviorTypesSelected,
    } = this.props
    const {
      showDrawerFilter,
      onCelerationChartChangeAction,
      addCelerationChartAction,
      onSelectChartAction,
      updateCelerationChartAction,
      addPointAction,
      updatePointAction,
      onRecordingParametersChangeAction,
      resetCelerationChartAction,
      openAddDrawerAction,
      onDisplaySelectedChartAction,
      onBehaviorTypesChangeAction,
    } = this.props

    const dataColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => strcmp(a.date, b.date),
        filterDropdownVisible: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => strcmp(a.title, b.title),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        sorter: (a, b) => strcmp(a.category.name, b.category.name),
        render: category => category.name,
      },
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        sorter: (a, b) => strcmp(a.notes, b.notes),
      },
      {
        title: 'Recording parameters',
        dataIndex: 'pointsTypeLables',
        key: 'pointsTypeLables',
        render: pointsTypeLables => (
          <>
            <div>{pointsTypeLables.type1}</div>
            <div>{pointsTypeLables.type2}</div>
            <div>{pointsTypeLables.type3}</div>
          </>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (text, record, index) => (
          <div>
            <Icon type="edit" onClick={() => onSelectChartAction(record)} style={iconStyle} />
            <Icon
              type="line-chart"
              onClick={() => onDisplaySelectedChartAction(record)}
              style={iconStyle}
            />
          </div>
        ),
      },
    ]

    const setRange = dateRange => {
      this.setState({
        range: dateRange,
      })
    }

    function getCharts(array) {
      return array.filter(
        p =>
          p.date >= moment(range[0]).format('YYYY-MM-DD') &&
          p.date <= moment(range[1]).format('YYYY-MM-DD'),
      )
    }

    return (
      <Row>
        <Col sm={24}>
          {celerationChartIndex === -1 ? (
            <Row>
              <Col span={26}>
                <div style={filterCardStyle}>

                  <Row>
                    <Col span={1} style={antcol1}>
                      <span style={{ fontSize: '15px', color: '#000' }}>Date :</span>
                    </Col>
                    <Col span={4}>
                      <RangePicker
                        value={range}
                        onChange={setRange}
                        size="default"
                        style={{
                          marginLeft: 'auto',
                          width: 250,
                          marginRight: 31,
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col span={24}>
              <div style={{padding: 10}}>
                {celerationChartIndex === -1 ? (
                  <Row>
                    <Row type="flex" justify="space-between">
                      <Col>
                        <h1>Charts</h1>
                      </Col>
                      <Col>
                        <Button type="primary" htmlType="button" onClick={openAddDrawerAction}>
                          <PlusOutlined />
                          Add New Chart
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Table dataSource={getCharts(celerationCharts)} columns={dataColumns} />
                    </Row>
                  </Row>
                ) : (
                    <div>
                      <CelerationGraph
                        chart={celerationChart}
                        addPoint={addPointAction}
                        updatePoint={updatePointAction}
                        onCelerationChartChange={onCelerationChartChangeAction}
                        updateCelerationChart={updateCelerationChartAction}
                        behaviorTypesSelected={behaviorTypesSelected}
                        onBehaviorTypesChange={onBehaviorTypesChangeAction}
                        resetCelerationChartAction={resetCelerationChartAction}
                      />
                    </div>
                  )}
                <Drawer
                  placement="right"
                  width="40%"
                  closable
                  onClose={resetCelerationChartAction}
                  visible={drawer}
                  destroyOnClose
                >
                  {celerationChartIndex !== -1 ? (
                    <div>
                      <h1>{celerationChart.title}</h1>
                      <UpdateCelerationChart
                        celerationCategories={celerationCategories}
                        chart={celerationChart}
                        onCelerationChartChange={onCelerationChartChangeAction}
                        updateCelerationChart={updateCelerationChartAction}
                        onRecordingParametersChange={onRecordingParametersChangeAction}
                      />
                    </div>
                  ) : (
                      <>
                        <h1>Create a New Chart</h1>
                        <AddCelerationChart
                          celerationCategories={celerationCategories}
                          chart={celerationChart}
                          onCelerationChartChange={onCelerationChartChangeAction}
                          addCelerationChart={addCelerationChartAction}
                          onRecordingParametersChange={onRecordingParametersChangeAction}
                        />
                      </>
                    )}
                </Drawer>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  celerationCategories: state.celerationChartReducer.celerationCategories,
  celerationChart: state.celerationChartReducer.celerationChart,
  celerationCharts: state.celerationChartReducer.celerationCharts,
  celerationChartIndex: state.celerationChartReducer.celerationChartIndex,
  drawer: state.celerationChartReducer.drawer,
  behaviorTypesSelected: state.celerationChartReducer.behaviorTypesSelected,
})

const mapDispatchToProps = dispatch => ({
  fetchAllCelerationCategoriesAction: () => dispatch(fetchAllCelerationCategories()),
  fetchAllCelerationChartsAction: () => dispatch(fetchAllCelerationCharts()),
  openAddDrawerAction: () => dispatch(openAddDrawer()),
  onCelerationChartChangeAction: (event, key) => dispatch(onCelerationChartChange(event, key)),
  addCelerationChartAction: event => dispatch(addCelerationChart(event)),
  onSelectChartAction: (event, index) => dispatch(onSelectChart(event, index)),
  updateCelerationChartAction: event => dispatch(updateCelerationChart(event)),
  onRecordingParametersChangeAction: (event, key) =>
    dispatch(onRecordingParametersChange(event, key)),
  resetCelerationChartAction: () => dispatch(resetCelerationChart()),
  addPointAction: point => dispatch(addPoint(point)),
  updatePointAction: (currentPoint, newPoint) => dispatch(updatePoint(currentPoint, newPoint)),
  onDisplaySelectedChartAction: (event, index) => dispatch(onDisplaySelectedChart(event, index)),
  onBehaviorTypesChangeAction: behaviors => dispatch(onBehaviorTypesChange(behaviors)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CelerationChartPanel)
