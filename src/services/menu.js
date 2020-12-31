/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
/* eslint-disable vars-on-top */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-indent */

import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import client from '../apollo/config'

export async function getLeftMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Documentation',
      key: 'documentation',
      url: 'https://docs.cleanuitemplate.com',
      target: '_blank',
      icon: 'icmn icmn-books',
    },
    {
      divider: true,
    },
    {
      title: 'Dashboard Alpha',
      key: 'dashboardAlpha',
      url: '/dashboard/alpha',
      icon: 'icmn icmn-home',
    },
  ]
}

export async function getTopMenuData(role) {
  return client
    .query({
      query: gql`
      query{
       menu(group_Name:"${role}")
       {
           edges {
                node {
                    MenuName
                    key
                    icon
                    url
                    menuLevel2Set
                    {
                        edges {
                        node {
                            id
                            key
                            url
                            MenuName
                            }
                        }
                    }
                }
           }
       }
    }
      `,
    })
    .then(result => {
      var temp_data = []
      var menuobj = result.data.menu.edges
      for (var i in menuobj) {
        var tempdata2 = {
          title: menuobj[i].node.MenuName,
          key: menuobj[i].node.key,
          icon: menuobj[i].node.icon,
          url: menuobj[i].node.url,
        }

        console.log(menuobj[i].node.menuLevel2Set.edges.length)
        if (menuobj[i].node.menuLevel2Set.edges.length > 0) {
          var tempdata3 = []
          for (var x in menuobj[i].node.menuLevel2Set.edges) {
            tempdata3.push({
              title: menuobj[i].node.menuLevel2Set.edges[x].node.MenuName,
              key: menuobj[i].node.menuLevel2Set.edges[x].node.key,
              icon: menuobj[i].node.menuLevel2Set.edges[x].node.icon,
              url: menuobj[i].node.menuLevel2Set.edges[x].node.url,
            })
          }
          tempdata2['children'] = tempdata3
        }
        temp_data.push(tempdata2)
      }
      console.log(temp_data)
      return temp_data
    })
}
