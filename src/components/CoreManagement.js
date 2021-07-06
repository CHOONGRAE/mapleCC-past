import React from 'react'
import Store from '../contexts/Store'
import CoreItem from './CoreItem'

export default class CoreManagement extends React.Component {
    render = () => <Store.Consumer>
        {store => <div id='CoreManagement'>
            <div className='list'>
                {[...Array(24).keys()].map(v =>
                    <CoreItem key={v} className={`s${parseInt(v / 6)} r${v % 6}`} />
                )}
            </div>
        </div>}
    </Store.Consumer>
}