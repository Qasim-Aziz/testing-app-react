import * as actions from './panel.action-type'

const initialize = {
  celerationCategories: [],

  celerationCharts: [
    {
      date: '',
      title: '',
      category: { id: '', name: '' },
      notes: '',
      yAxisLabel: 'COUNT PER MINUTE',
      points: [],
      pointsTypeLables: {
        type1: 'Correct',
        type2: 'Incorrect',
        type3: 'Prompted',
      },
    },
  ],

  loading: false,
  error: null,
  drawer: false,

  celerationChartIndex: -1,
  celerationChart: {
    date: '',
    title: '',
    category: { name: '' },
    notes: '',
    yAxisLabel: 'COUNT PER MINUTE',
    points: [],
    pointsTypeLables: {
      type1: 'Correct',
      type2: 'Incorrect',
      type3: 'Prompted',
    },
  },

  behaviorTypesSelected: [],
}

const celerationChartReducer = (state = initialize, action) => {
  let updatedCelerationCharts = []

  switch (action.type) {
    case actions.fetchAllCelerationCategoriesBegin:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case actions.fetchAllCelerationCategoriesSuccess:
      return {
        ...state,
        celerationCategories: action.celerationCategories ? action.celerationCategories : [],
        loading: false,
        error: null,
      }
    case actions.fetchAllCelerationCategoriesFailure:
      return {
        ...state,
        celerationCategories: [],
        loading: false,
        error: action.error,
      }
    case actions.openAddDrawer:
      return {
        ...state,
        drawer: true,
        celerationChart: {
          date: '',
          title: '',
          category: { name: '' },
          yAxisLabel: 'COUNT PER MINUTE',
          notes: '',
          points: [],
          pointsTypeLables: {
            type1: 'Correct',
            type2: 'Incorrect',
            type3: 'Prompted',
          },
          student: { id: action.studentId },
        },

        celerationChartIndex: -1,
      }
    case actions.fetchAllCelerationChartBegin:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case actions.fetchAllCelerationChartSuccess:
      return {
        ...state,
        celerationCharts: action.celerationCharts ? action.celerationCharts : [],
        loading: false,
        error: null,
      }
    case actions.fetchAllCelerationChartFailure:
      return {
        ...state,
        celerationCharts: [],
        loading: false,
        error: action.error,
      }
    case actions.onCelerationChartChange:
      return {
        ...state,
        celerationChart: { ...state.celerationChart, [action.key]: action.value },
      }
    case actions.onRecordingParametersChange:
      return {
        ...state,
        celerationChart: {
          ...state.celerationChart,
          pointsTypeLables: {
            ...state.celerationChart.pointsTypeLables,
            [action.key]: action.value,
          },
        },
      }
    case actions.onAddCelerationChart:
      return {
        ...state,
        drawer: true,
        celerationCharts: [
          ...state.celerationCharts,
          {
            ...action.chart,
            yAxisLabel: 'COUNT PER MINUTE',
            points: [],
            pointsTypeLables: {
              type1: 'Correct',
              type2: 'Incorrect',
              type3: 'Prompted',
            },
          },
        ],
      }
    case actions.resetCelerationChart:
      return {
        ...state,
        drawer: false,
        celerationChartIndex: -1,
        celerationChart: {
          date: '',
          title: '',
          category: { name: '' },
          notes: '',
          yAxisLabel: '',
          points: [],
          pointsTypeLables: {
            type1: '',
            type2: '',
            type3: '',
          },
        },
      }
    case actions.onSelectCelerationChart: {
      const selectedChart = state.celerationCharts.find(chart => chart.id === action.chart.id)
      return {
        ...state,
        drawer: true,
        celerationChartIndex: selectedChart ? state.celerationCharts.indexOf(selectedChart) : -1,
        celerationChart: action.chart,
      }
    }
    case actions.onDisplaySelectedChart: {
      const selectedDisplayChart = state.celerationCharts.find(
        chart => chart.id === action.chart.id,
      )
      return {
        ...state,
        drawer: false,
        celerationChartIndex: selectedDisplayChart
          ? state.celerationCharts.indexOf(selectedDisplayChart)
          : -1,
        celerationChart: { ...action.chart, points: action.nodes },
      }
    }
    case actions.onUpdateCelerationChart:
      updatedCelerationCharts = state.celerationCharts.map((chart, index) => {
        if (index !== state.celerationChartIndex) {
          return chart
        }
        return {
          ...state.celerationChart,
        }
      })
      return {
        ...state,
        celerationCharts: updatedCelerationCharts,
        celerationChartIndex: -1,
      }
    case actions.addPoint:
      return {
        ...state,
        celerationChart: {
          ...state.celerationChart,
          points: [...state.celerationChart.points, action.point],
        },
      }
    case actions.updatePoint:
      return {
        ...state,
        celerationChart: {
          ...state.celerationChart,
          points: [
            ...state.celerationChart.points.slice(0, action.pointIndex),
            action.newPoint,
            ...state.celerationChart.points.slice(action.pointIndex + 1),
          ],
        },
      }
    case actions.onBehaviorTypesChange:
      return {
        ...state,
        behaviorTypesSelected: action.behaviors,
      }
    default:
      return state
  }
}

export default celerationChartReducer
