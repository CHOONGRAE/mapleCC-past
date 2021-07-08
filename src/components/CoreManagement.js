import React from 'react'
import Store from '../contexts/Store'
import CoreItem from './CoreItem'
import CoreInfo from './CoreInfo'
import { Add, Remove, RemoveAll } from './CoreManagementModal'

export default class CoreManagement extends React.Component {
    render = () => <Store.Consumer>
        {store => {

            const modal = () => {
                const { v_matrix_mode } = store
                switch(v_matrix_mode){
                    case 'create': return <div className='modal'>
                        <Add />
                    </div>
                    case 'remove': return <div className='modal'>
                        <Remove />
                        <RemoveAll />
                    </div>
                }
            }

            return <div id='CoreManagement'>
                <div className='listBorder'>
                    <div className='list'>
                        {[...Array(25).keys()].map(v =>
                            <CoreItem key={v} className={`r${parseInt(v / 7)} c${v % 7}`} index={v} />
                        )}
                    </div>
                </div>
                <CoreInfo />
                {modal()}
            </div>
        }}
    </Store.Consumer>
}