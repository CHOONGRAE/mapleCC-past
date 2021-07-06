import React from 'react'
import Store from '../contexts/Store'
import ClassSelector from './ClassSelector'

export default () => <Store.Consumer>
    {store => <div id='Class' style={{ background: `url(${store.classImg})` }}>
        <div className='select_class'>
            <ClassSelector type='group' id='GroupSelector' />
            <ClassSelector type='class' id='ClassSelector' />
        </div>
    </div>}
</Store.Consumer>