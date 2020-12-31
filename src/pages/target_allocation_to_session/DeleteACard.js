import React from 'react'
import Sortable from 'react-sortablejs'
import style from './style.module.scss'

const DeleteACard = () => {
  return (
    <Sortable
      style={{marginTop: '2px'}}
      className={style.deleteButton}
      options={{
        group: {
          name: 'shared',
          put: true,
        },
      }}
    >
      <span>Drag target here to delete</span>
    </Sortable>
  )
}

export default DeleteACard
