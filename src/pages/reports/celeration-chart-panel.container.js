import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Drawer, Icon, Row, Table, Badge } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'
import { connect } from 'react-redux'
import AddCelerationChart from '../../components/CelerationChart/add-new-chart.component'
import CelerationGraph from '../../components/CelerationChart/celeration-graph.component'
import UpdateCelerationChart from '../../components/CelerationChart/update-chart.component'
import {
  addCelerationChart,
  addPoint,
  fetchAllCelerationCategories,
  fetchAllCelerationCharts,
  onBehaviorTypesChange,
  onCelerationChartChange,
  onDisplaySelectedChart,
  onRecordingParametersChange,
  onSelectChart,
  openAddDrawer,
  resetCelerationChart,
  updateCelerationChart,
  updatePoint,
} from '../../redux/celerationchart/panel.action'
import './celerationReport.scss'

const { RangePicker } = DatePicker
class CelerationChartPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      range: [moment().subtract(6, 'd'), moment()],
      editingChartId: null,
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
    const { range, editingChartId } = this.state
    const iconStyle = {
      paddingRight: '20px',
    }

    const strcmp = (a, b) => {
      if (a.toString() < b.toString()) return -1
      if (a.toString() > b.toString()) return 1
      return 0
    }

    const {
      celerationCategories,
      celerationCharts,
      celerationChartIndex,
      celerationChart,
      drawer,
      behaviorTypesSelected,
      isCelerationChartLoading,
    } = this.props
    const {
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
            <Badge
              count={pointsTypeLables.type1}
              style={{ marginRight: '5px', background: '#52c41a' }}
            />
            <Badge count={pointsTypeLables.type2} style={{ marginRight: '5px' }} />
            <Badge count={pointsTypeLables.type3} style={{ background: '#faad14' }} />
          </>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        align: 'center',
        render: (text, record) => (
          <div>
            <Icon type="edit" onClick={() => openEditDrawer(record)} style={iconStyle} />
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

    const openEditDrawer = record => {
      this.setState({
        editingChartId: record.id,
      })
      onSelectChartAction(record)
    }

    const handleBack = () => {
      this.setState({
        editingChartId: null,
      })
      resetCelerationChartAction()
    }

    const filterCardStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '5px 10px',
      margin: 0,
      height: 'fit-content',
      overflow: 'hidden',
      backgroundColor: COLORS.palleteLight,
    }

    const parentLabel = { fontSize: '15px', color: '#000', margin: 'auto 8px auto' }
    const parentDiv = { display: 'flex', margin: '5px 30px 5px 0' }

    return (
      <div className="celerationReport">
        {celerationChartIndex === -1 || editingChartId !== null ? (
          // If any chart is not selected & not in edit mode then
          <>
            <div style={filterCardStyle}>
              <div style={parentDiv}>
                <span style={parentLabel}>Date :</span>
                <RangePicker
                  style={{ width: 250 }}
                  value={range}
                  onChange={setRange}
                  size="default"
                  className="datePaicker"
                />
              </div>
              <div style={{ marginLeft: 'auto', marginTop: '4px' }}>
                <Button type="primary" onClick={openAddDrawerAction}>
                  <PlusOutlined />
                  New Chart
                </Button>
              </div>
            </div>
            <Row className="charts">
              <Table
                rowKey="id"
                style={{ paddingTop: '5px' }}
                dataSource={getCharts(celerationCharts)}
                columns={dataColumns}
                loading={isCelerationChartLoading}
                bordered
                size=""
              />
            </Row>
          </>
        ) : (
          // If any chart is selected then
          <CelerationGraph
            chart={celerationChart}
            addPoint={addPointAction}
            updatePoint={updatePointAction}
            onCelerationChartChange={onCelerationChartChangeAction}
            updateCelerationChart={updateCelerationChartAction}
            behaviorTypesSelected={behaviorTypesSelected}
            onBehaviorTypesChange={onBehaviorTypesChangeAction}
            resetCelerationChartAction={handleBack}
          />
        )}

        <Drawer
          placement="right"
          width={DRAWER.widthL3}
          title={editingChartId ? celerationChart.title : 'Create a New Chart'}
          closable
          onClose={handleBack}
          visible={drawer}
          destroyOnClose
        >
          {editingChartId ? (
            <UpdateCelerationChart
              celerationCategories={celerationCategories}
              chart={celerationChart}
              onCelerationChartChange={onCelerationChartChangeAction}
              updateCelerationChart={updateCelerationChartAction}
              onRecordingParametersChange={onRecordingParametersChangeAction}
            />
          ) : (
            <AddCelerationChart
              celerationCategories={celerationCategories}
              chart={celerationChart}
              onCelerationChartChange={onCelerationChartChangeAction}
              addCelerationChart={addCelerationChartAction}
              onRecordingParametersChange={onRecordingParametersChangeAction}
            />
          )}
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  celerationCategories: state.celerationChartReducer.celerationCategories,
  celerationChart: state.celerationChartReducer.celerationChart,
  isCelerationChartLoading: state.celerationChartReducer.loading,
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
