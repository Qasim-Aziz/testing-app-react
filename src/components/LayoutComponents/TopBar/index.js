import React from 'react'
import { Button } from 'antd'
// import { FormattedMessage } from 'react-intl'
import store from 'store'
import HomeMenu from './HomeMenu'
import ProjectManagement from './ProjectManagement'
import IssuesHistory from './IssuesHistory'
import LiveSearch from './LiveSearch'
import BitcoinPrice from './BitcoinPrice'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
import styles from './style.module.scss'

// Partners
import Learners from './Partners/Learners/index'
import Staff from './Partners/Staff/index'
import Providers from './Partners/Providers/index'
import Others from './Partners/Others/index'

// Files
import MyFiles from './Files/MyFiles'

class TopBar extends React.Component {
  render() {
    const newSelectedKey = store.get('app.menu.selectedKeys')
    console.log(newSelectedKey)
    if (newSelectedKey) {
      if (
        newSelectedKey[0] === 'partners' ||
        newSelectedKey[0] === 'partnersLearner' ||
        newSelectedKey[0] === 'partnersStaff' ||
        newSelectedKey[0] === 'partnersProviders' ||
        newSelectedKey[0] === 'partnersOthers'
      ) {
        return (
          <div className={styles.topbar}>
            <div className="mr-4">
              <Learners />
            </div>
            <div className="mr-4">
              <Staff />
            </div>
            <div className="mr-4">
              <Providers />
            </div>
            <div className="mr-auto">
              <Others />
            </div>
            <div className="mr-4">
              <LanguageSelector />
            </div>
            <div className="mr-4">
              <HomeMenu />
            </div>
            <ProfileMenu />
          </div>
        )
      }
      if (
        newSelectedKey[0] === 'files' ||
        newSelectedKey[0] === 'filesUpload' ||
        newSelectedKey[0] === 'filesAllFiles' ||
        newSelectedKey[0] === 'filesNewFiles' ||
        newSelectedKey[0] === 'filesSharedWithMe' ||
        newSelectedKey[0] === 'filesOwnedByMe' ||
        newSelectedKey[0] === 'filesUploadedByMe' ||
        newSelectedKey[0] === 'filesDocumentryReport' ||
        newSelectedKey[0] === 'filesSurvey'
      ) {
        return (
          <div className={styles.topbar}>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-upload3`} />
              <b>Upload</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-files-empty`} />
              <b>All Files</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>New Files</b>
            </a>

            <div className="mr-4">
              <MyFiles />
            </div>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-file-text2`} />
              <b>Document Report</b>
            </a>
            <a href="#" className="mr-auto d-none d-sm-inline">
              <b>Survery</b>
            </a>

            <div className="mr-4">
              <LanguageSelector />
            </div>
            <div className="mr-4">
              <HomeMenu />
            </div>
            <ProfileMenu />
          </div>
        )
      }

      if (
        newSelectedKey[0] === 'parentAssessment' ||
        newSelectedKey[0] === 'parentVBMAPP' ||
        newSelectedKey[0] === 'parentPEAK' ||
        newSelectedKey[0] === 'parentCogniAble' ||
        newSelectedKey[0] === 'parentABC' ||
        newSelectedKey[0] === 'parentPreferenceAssessment'
      ) {
        return (
          <div className={styles.topbar}>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-upload3`} />
              <b>VB-MAPP</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-files-empty`} />
              <b>CogniAble</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>PEAK</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-file-text2`} />
              <b>ABC</b>
            </a>
            <a href="#" className="mr-auto d-none d-sm-inline">
              <i className={`${styles.icon} icmn-file-text2`} />
              <b>Preference Assessment</b>
            </a>

            <div className="mr-4">
              <LanguageSelector />
            </div>
            <div className="mr-4">
              <HomeMenu />
            </div>
            <ProfileMenu />
          </div>
        )
      }
      if (
        newSelectedKey[0] === 'parentSessions' ||
        newSelectedKey[0] === 'parentSkillAcquisition' ||
        newSelectedKey[0] === 'parentBehaviorReduction' ||
        newSelectedKey[0] === 'parentMaintenance'
      ) {
        return (
          <div className={styles.topbar}>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-upload3`} />
              <b>Skill Acquisition</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-files-empty`} />
              <b>Behavior Reduction</b>
            </a>
            <a href="#" className="mr-auto d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Maintenance</b>
            </a>

            <div className="mr-4">
              <LanguageSelector />
            </div>
            <div className="mr-4">
              <HomeMenu />
            </div>
            <ProfileMenu />
          </div>
        )
      }
      if (
        newSelectedKey[0] === 'parentPrescription' ||
        newSelectedKey[0] === 'parentMeal' ||
        newSelectedKey[0] === 'parentToileting' ||
        newSelectedKey[0] === 'parentWeight' ||
        newSelectedKey[0] === 'parentHeight' ||
        newSelectedKey[0] === 'ParentBehavior' ||
        newSelectedKey[0] === 'parentMand' ||
        newSelectedKey[0] === 'parentDailyVitals'
      ) {
        return (
          <div className={styles.topbar}>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-upload3`} />
              <b>Mand</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-files-empty`} />
              <b>Behavior</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Height</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Weight</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Toileting</b>
            </a>
            <a href="#" className="mr-4 d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Meal</b>
            </a>
            <a href="#" className="mr-auto d-none d-sm-inline">
              <i className={`${styles.icon} icmn-plus`} />
              <b>Prescription</b>
            </a>

            <div className="mr-4">
              <LanguageSelector />
            </div>
            <div className="mr-4">
              <HomeMenu />
            </div>
            <ProfileMenu />
          </div>
        )
      }
    }

    return (
      <div className={styles.topbar}>
        <div className="mr-4">
          <IssuesHistory />
        </div>
        <div className="mr-4">
          <ProjectManagement />
        </div>
        <div className="mr-auto">
          <LiveSearch />
        </div>
        <div className="mr-4">
          <Button type="danger" style={{ borderRadius: '20px', width: '40px', height: '40px' }}>
            <i className={`${styles.icon} icmn-plus`} style={{ marginLeft: '-2px' }} />
          </Button>
        </div>
        <div className="mr-4">
          <BitcoinPrice />
        </div>
        <div className="mr-4">
          <LanguageSelector />
        </div>
        <div className="mr-4">
          <HomeMenu />
        </div>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
