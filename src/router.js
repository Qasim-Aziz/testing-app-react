import Loader from 'components/LayoutComponents/Loader'
import { ConnectedRouter } from 'connected-react-router'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'
import invCom from 'pages/Invoices'
import React from 'react'
import Loadable from 'react-loadable'
import { Redirect, Route, Switch } from 'react-router-dom'
import PrintTableInvoice from './pages/allClinicData/printableInvoice'
import clinicDash from './pages/Dashboard/Clinic'
import payorCom from './pages/payor'
import peakReprotCom from './pages/PEAK/PeakDGReport'
import Reportss from './pages/reports'

// import DownloadReport from './pages/IISA/StartAssessment/downloadReport'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',

    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },
  {
    path: '/user/signup',
    component: loadable(() => import('pages/user/signup')),
    exact: true,
  },
  {
    path: '/user/phone',
    component: loadable(() => import('pages/user/phone')),
    exact: true,
  },
  {
    path: '/user/forgotpass',
    component: loadable(() => import('pages/user/forgot/changepass')),
    exact: true,
  },
  {
    path: '/user/otpVerification',
    component: loadable(() => import('pages/user/otpVerification')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/clinic_admin',
    // component: loadable(() => import('pages/Dashboard/Clinic')),
    component: clinicDash,
    exact: true,
  },
  {
    path: '/dashboard/therapist_admin',
    component: loadable(() => import('pages/Dashboard/Therapist')),
    exact: true,
  },
  {
    path: '/dashboard/alpha/',
    component: loadable(() => import('pages/Dashboard/Parent')),
    exact: true,
  },
  // Partners
  {
    path: '/partners/viewlearners',
    component: loadable(() => import('pages/learners/view_learners')),
    // component: Learners,
    exact: true,
  },
  // Add LEADS HERE
  {
    path: '/partners/viewleads',
    component: loadable(() => import('pages/leads/view_leads')),
    exact: true,
  },
  // The expense component.
  {
    path: '/partners/viewexpenses',
    component: loadable(() => import('pages/expenses/view_expense')),
    exact: true,
  },
  // The assets component
  {
    path: '/partners/viewasset',
    component: loadable(() => import('pages/assets_pages/view_asset')),
    exact: true,
  },
  {
    path: '/partners/viewstaffs',
    component: loadable(() => import('pages/staffs/view_staffs')),
    exact: true,
  },
  {
    path: '/partners/staffManagement',
    component: loadable(() => import('pages/StaffManagement')),
    exact: true,
  },

  {
    path: '/screenningData',
    component: loadable(() => import('pages/screenAssessment')),
    exact: true,
  },
  {
    path: '/screenningReport',
    component: loadable(() => import('pages/screeningReport')),
    exact: true,
  },

  // targets
  {
    path: '/targets/program',
    component: loadable(() => import('pages/program')),
    exact: true,
  },
  {
    path: '/targets/program2',
    component: loadable(() => import('pages/program2')),
    exact: true,
  },
  {
    path: '/target/allocation',
    component: loadable(() => import('pages/targets/targetAlocation')),
    exact: true,
  },
  {
    path: '/targets/target_by_status',
    component: loadable(() => import('pages/graphs/targetByStatus')),
    exact: true,
  },
  {
    path: '/analytics/abagraph',
    component: loadable(() => import('pages/graphs/abagraph')),
    exact: true,
  },
  {
    path: '/analytics/timeline',
    component: loadable(() => import('pages/graphs/timeline')),
    exact: true,
  },
  {
    path: '/analytics/domainmastered',
    component: loadable(() => import('pages/graphs/domainmastered')),
    exact: true,
  },
  {
    path: '/targets/session_target',
    component: loadable(() => import('pages/session_target')),
    exact: true,
  },
  {
    path: '/analytics/report1',
    component: loadable(() => import('pages/graphs/report1')),
    exact: true,
  },
  {
    path: '/forms/intake',
    component: loadable(() => import('pages/intake')),
    exact: true,
  },

  // Course
  {
    path: '/course/courseview',
    component: loadable(() => import('pages/courseview')),
    exact: true,
  },
  {
    path: '/course/coursedetail/',
    component: loadable(() => import('pages/courseview/coursedetail')),
    exact: true,
  },

  // Edit Profile
  {
    path: '/partners/editprofile',
    component: loadable(() => import('components/UserProfile/EditProfile')),
    exact: true,
  },
  // {
  //   path: '/targets/program_pdf',
  //   component: loadable(() => import('pages/program_pdf')),
  //   exact: true,
  // },
  {
    path: '/targets/appointment',
    component: loadable(() => import('pages/appointment')),
    exact: true,
  },

  // Daily Vitals
  {
    path: '/mealData/',
    component: loadable(() => import('pages/meal/index')),
    exact: true,
  },
  {
    path: '/toilet/',
    component: loadable(() => import('pages/ToiletData/index')),
    exact: true,
  },
  {
    path: '/appointmentData/',
    component: loadable(() => import('pages/appointmentdata/index')),
    // component: AppData,
    exact: true,
  },
  {
    path: '/decel/',
    component: loadable(() => import('pages/BehaviourData/index')),
    exact: true,
  },
  {
    path: '/mand/',
    component: loadable(() => import('pages/mandData/index')),
    exact: true,
  },
  {
    path: '/medicalData/',
    component: loadable(() => import('pages/MedicalData/index')),
    exact: true,
  },
  {
    path: '/family/',
    component: loadable(() => import('views/family/family')),
    exact: true,
  },
  {
    path: '/abc/',
    component: loadable(() => import('pages/abcData/index')),
    exact: true,
  },

  // Tutorials videos
  {
    path: '/tutorials/step1',
    component: loadable(() => import('pages/tutorials/step1')),
    exact: true,
  },
  {
    path: '/tutorials/step2',
    component: loadable(() => import('pages/tutorials/step2')),
    exact: true,
  },
  {
    path: '/tutorials/step3',
    component: loadable(() => import('pages/tutorials/step3')),
    exact: true,
  },

  // clinic specific video tutorials
  {
    path: '/clinicTutorial/step1',
    component: loadable(() => import('pages/clinicTutorial/step1')),
    exact: true,
  },
  {
    path: '/clinicTutorial/step2',
    component: loadable(() => import('pages/clinicTutorial/step2')),
    exact: true,
  },

  // PEAK
  {
    path: '/peak',
    component: loadable(() => import('pages/PEAK')),
    // component: peakCom,
    exact: true,
  },
  {
    path: '/peakAssign',
    component: loadable(() => import('pages/PEAK/PeakAssign')),
    exact: true,
  },
  {
    path: '/peakResult/',
    component: loadable(() => import('pages/PEAK/PeakResult')),
    exact: true,
  },
  {
    path: '/peakReport/',
    // component: loadable(() => import('pages/PEAK/PeakReport')),
    component: peakReprotCom,
    exact: true,
  },
  {
    path: '/genAssessment/',
    component: loadable(() => import('pages/GeneralAssessment')),
    exact: true,
  },
  {
    path: '/tableReportPdf/',
    component: loadable(() => import('pages/PEAK/TableReportPdf')),
    exact: true,
  },
  {
    path: '/peakEqvi/',
    component: loadable(() => import('pages/PeakEqvi')),
    exact: true,
  },
  {
    path: '/triangleReportPDF/',
    component: loadable(() => import('pages/PEAK/TriangleReportPDF')),
    exact: true,
  },
  // TriangleReportPDF
  {
    path: '/peakEquivalenceReport/',
    component: loadable(() => import('pages/PeakEqvi/peakReport')),
    exact: true,
  },

  // Settings -- parent
  {
    path: '/profileSetting/',
    component: loadable(() => import('pages/ProfileSetting/index')),
    exact: true,
  },
  // staff
  {
    path: '/staffProfile/',
    component: loadable(() => import('pages/staffProfile')),
    exact: true,
  },
  // clinic
  {
    path: '/clinicProfile',
    component: loadable(() => import('pages/ClinicProfile')),
    exact: true,
  },

  // Progress Graph
  {
    path: '/progressGraph',
    component: loadable(() => import('pages/ProgressGraph')),
    exact: true,
  },
  // Daily response rate graph
  {
    path: '/dailyResponseRate',
    component: loadable(() => import('pages/DailyResponseRate')),
    exact: true,
  },
  // Sessions Graph
  {
    path: '/sessions',
    component: loadable(() => import('pages/Sessions')),
    exact: true,
  },
  // Goals Graph
  {
    path: '/goals',
    component: loadable(() => import('pages/Goals')),
    exact: true,
  },
  // Behavior Graph
  {
    path: '/behaviorGraph',
    component: loadable(() => import('pages/behaviorGraph')),
    exact: true,
  },

  // community, doctors & commitments
  {
    path: '/parent/community',
    component: loadable(() => import('pages/community')),
    exact: true,
  },
  {
    path: '/chat',
    component: loadable(() => import('pages/chat')),
    exact: true,
  },
  {
    path: '/doctor',
    component: loadable(() => import('pages/doctor')),
    exact: true,
  },

  // Assessments
  {
    path: '/cogniableAssessment',
    component: loadable(() => import('pages/cogniableAssessment')),
    exact: true,
  },
  {
    path: '/cogniableAssessment/start',
    component: loadable(() => import('pages/cogniableAssessment/leftArea')),
    exact: true,
  },
  {
    path: '/cliniccariculam',
    component: loadable(() => import('pages/clinicCariculam')),
    exact: true,
  },
  {
    path: '/targetsAllocationToSession/',
    component: loadable(() => import('pages/target_allocation_to_session')),
    exact: true,
  },
  {
    path: '/sessionrecording',
    // component: loadable(() => import('pages/sessionrecording')),
    component: loadable(() => import('pages/SessionDataRecording')),
    exact: true,
  },
  {
    path: '/sessionsummary',
    component: loadable(() => import('pages/session_summary')),
    exact: true,
  },
  {
    path: '/sessionDetails',
    component: loadable(() => import('pages/sessionDetails/index')),
    exact: true,
  },
  {
    path: '/viewTask',
    component: loadable(() => import('pages/Tasks/view_Task')),
    // component: tastCom,
    exact: true,
  },
  {
    path: '/viewTickets',
    component: loadable(() => import('pages/Tickets')),
    // component: tastCom,
    exact: true,
  },

  {
    path: '/invoices',
    component: invCom,
    exact: true,
  },

  {
    path: '/printInvoice/',
    component: PrintTableInvoice,
    exact: true,
  },

  // Therapist Urls
  // Program
  // {
  //   path: '/therapistStudent',
  //   component: loadable(() => import('pages/tharepist_students')),
  //   exact: true,
  // },
  {
    path: '/therapistStudent',
    component: loadable(() => import('pages/LearnersProgram')),
    exact: true,
  },

  {
    path: '/LearnerAssessments',
    component: loadable(() => import('pages/LearnersProgram/urlAssessments')),
    exact: true,
  },
  {
    path: '/LearnerGoals',
    component: loadable(() => import('pages/LearnersProgram/urlGoals')),
    exact: true,
  },
  {
    path: '/LearnerSessions',
    component: loadable(() => import('pages/LearnersProgram/urlSessions')),
    exact: true,
  },
  {
    path: '/LearnerBuildSessions',
    component: loadable(() => import('pages/LearnersProgram/urlBuildSessions')),
    exact: true,
  },
  {
    path: '/LearnerMand',
    component: loadable(() => import('pages/tharepist_students/urlMand')),
    exact: true,
  },
  {
    path: '/LearnerMeal',
    component: loadable(() => import('pages/tharepist_students/urlMeal')),
    exact: true,
  },
  {
    path: '/LearnerMedical',
    component: loadable(() => import('pages/tharepist_students/urlMedical')),
    exact: true,
  },
  {
    path: '/LearnerBehavior',
    component: loadable(() => import('pages/tharepist_students/urlBehavior')),
    exact: true,
  },
  {
    path: '/LearnerABC',
    component: loadable(() => import('pages/tharepist_students/urlAbc')),
    exact: true,
  },
  {
    path: '/LearnerToilet',
    component: loadable(() => import('pages/tharepist_students/urlToilet')),
    exact: true,
  },
  // Program Daily Vitals
  {
    path: '/therapistStudentDailyVitals',
    component: loadable(() => import('pages/tharepist_students/ProgramDailyVitals')),
    exact: true,
  },
  // Program Sessions
  {
    path: '/therapistStudentSessions',
    component: loadable(() => import('pages/tharepist_students/ProgramSession')),
    exact: true,
  },
  // Program Graphs
  {
    path: '/therapistStudentGraphs',
    component: loadable(() => import('pages/tharepist_students/ProgramGraphs')),
    exact: true,
  },
  // Program Assessments
  {
    path: '/therapistStudentAssessments',
    component: loadable(() => import('pages/tharepist_students/ProgramAssessments')),
    exact: true,
  },
  // Staff report
  {
    path: '/staffReport',
    component: loadable(() => import('pages/staffReports/index')),
    exact: true,
  },
  {
    path: '/workdone',
    component: loadable(() => import('pages/WorkDone/index')),
  },

  // VB-MAPP urls
  {
    path: '/therapy/vbmapps/new',
    component: loadable(() => import('pages/vbmapps/new')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/list',
    component: loadable(() => import('pages/vbmapps/assessmentsList')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/milestonesGroups',
    component: loadable(() => import('pages/vbmapps/milestonesGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/barriersGroups',
    component: loadable(() => import('pages/vbmapps/barriersGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/eesaGroups',
    component: loadable(() => import('pages/vbmapps/eesaGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/taskGroups',
    component: loadable(() => import('pages/vbmapps/taskGroups')),
    exact: true,
  },
  {
    path: '/therapy/vbmapps/transitionGroups',
    component: loadable(() => import('pages/vbmapps/transitionGroups')),
    exact: true,
  },
  {
    path: [
      '/reports',
      '/reports/progress_overview',
      '/reports/daily_res_rate',
      '/reports/behavior',
      '/reports/mand',
      '/reports/sessions',
      '/reports/goals',
      '/reports/celer_chart',
      '/reports/appointment_report',
      '/reports/staff_activity',
      '/reports/attendance',
      '/reports/timesheet',
      '/reports/monthly_report',
      '/reports/vbmapp',
      '/reports/peak_block_report',
      '/reports/target_res_report',
      '/reports/network_graph',
    ],
    // component: loadable(() => import('pages/reports/index')),
    component: Reportss,
    exact: true,
  },
  {
    path: '/activitylog',
    component: loadable(() => import('pages/activity/ActivityList')),
    exact: true,
  },
  {
    path: '/allClinicData',
    component: loadable(() => import('pages/allClinicData')),
    exact: true,
  },
  // Payors
  {
    path: '/payors/view_payors',
    // component: loadable(() => import('pages/payor')),
    component: payorCom,
    exact: true,
  },
  // Service codes
  {
    path: '/authorization_codes/view_codes',
    component: loadable(() => import('pages/authorizationCodes')),
    exact: true,
  },
  {
    path: '/clinicSupportTicket',
    component: loadable(() => import('pages/ClinicProfile/SupportTicketSett')),
    exact: true,
  },
  {
    path: '/clinicInvoice',
    component: loadable(() => import('pages/ClinicProfile/Invoices')),
    exact: true,
  },
  {
    path: '/clinicVideoTutorials',
    component: loadable(() => import('pages/ClinicProfile/VideoTutorial')),
    exact: true,
  },
  {
    path: '/book-appointment',
    component: loadable(() => import('pages/BookAppointment')),
    exact: true,
  },
  {
    path: '/appointments',
    component: loadable(() => import('pages/appointmentForTherapist')),
    exact: true,
  },
  {
    path: '/prescription',
    component: loadable(() => import('pages/Prescription')),
    exact: true,
  },
  {
    path: '/staffLeave',
    component: loadable(() => import('pages/StaffLeave')),
    exact: true,
  },
  {
    path: '/iisaAssessment',
    component: loadable(() => import('pages/IISA')),
    exact: true,
  },
  {
    path: '/startIISA',
    component: loadable(() => import('pages/IISA/StartAssessment')),
    exact: true,
  },
  {
    path: '/startIisaAssessment',
    component: loadable(() => import('pages/IISA/StartAssessment/start')),
    exact: true,
  },
  {
    path: '/fileUpload',
    component: loadable(() => import('pages/FileUpload/index')),
    exact: true,
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/user/login" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
