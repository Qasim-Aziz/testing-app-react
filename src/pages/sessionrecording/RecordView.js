/* eslint-disable import/extensions */
import React from 'react'
import { Tabs } from 'antd'
import BehaviorContent from './BehaviorContent.js'
import MandContainer from './MandContainer.js'
import ToiletContainer from './ToiletContainer.js'

const { TabPane } = Tabs

export default () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Behavior Data" key="1">
          <BehaviorContent />
        </TabPane>
        <TabPane tab="Mand Data" key="2">
          <MandContainer />
        </TabPane>
        <TabPane tab="Toilet Data" key="3">
          <ToiletContainer />
        </TabPane>
      </Tabs>
    </div>
  )
}
