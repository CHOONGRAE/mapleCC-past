import React from 'react'
import Store from '../contexts/Store'
import CoreItem from './CoreItem'

export default class CoreManagement extends React.Component {
    render = () => <Store.Consumer>
        {store => <div id='CoreManagement'>
            <div className='list'>
                {[...Array(35).keys()].map(v =>
                    <CoreItem key={v} className={`r${parseInt(v / 7)} c${v % 7}`} />
                )}
            </div>
        </div>}
    </Store.Consumer>
}