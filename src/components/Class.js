import React from 'react'
import Store from '../contexts/Store'
import ClassSelector from './ClassSelector'

export default () => <div id='Class'>
    <div className='select_class'>
        <ClassSelector type='group' id='GroupSelector' />
        <ClassSelector type='class' id='ClassSelector' />
    </div>
    <Store.Consumer>
        {store => <img src={store.classImg} alt={store.selectedClass}></img>}
    </Store.Consumer>
</div>