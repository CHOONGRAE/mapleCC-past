import React from 'react'
import Store from '../contexts/Store'
import CoreItem from './CoreItem'
import CoreInfo from './CoreInfo'
import { Add, Remove, RemoveAll } from './CoreManagementModal'
import ImageMatching from './ImgMatching'

export default class CoreManagement extends React.Component {
    state = {
        currentPage: 0
    }

    _resetPage = () => {
        this.setState({currentPage: 0})
    }

    _changePage = (signal, totalPage) => {
        switch (signal) {
            case 'prev':
                this.setState(prevState => {
                    let currentPage = prevState.currentPage - 1
                    if (currentPage < 0) currentPage = totalPage - 1
                    return {
                        ...prevState,
                        currentPage
                    }
                })
                break
            case 'next':
                this.setState(prevState => {
                    let currentPage = prevState.currentPage + 1
                    if (currentPage + 1 > totalPage) currentPage = 0
                    return {
                        ...prevState,
                        currentPage
                    }
                })
                break
        }
    }

    render = () => <Store.Consumer>
        {store => {
            const { currentPage } = this.state
            const { v_matrix_mode, coreList } = store

            const totalPage = (() => {
                if (v_matrix_mode == 'create') return 1
                let page = parseInt(coreList.length / 25) + (coreList.length % 25 ? 1 : 0)
                return page ? page : 1
            })()

            const modal = () => {
                switch (v_matrix_mode) {
                    case 'create': return <div className='modal'>
                        <Add />
                        <ImageMatching />
                    </div>
                    case 'remove': return <div className='modal'>
                        <Remove />
                        <RemoveAll />
                    </div>
                }
            }

            return <div id='CoreManagement'>
                <div className='map'>
                    <div className='listBorder'>
                        <div className='list'>
                            {[...Array(25).keys()].map(v =>
                                <CoreItem key={v} className={`r${parseInt(v / 7)} c${v % 7}`} index={v} page={currentPage} />
                            )}
                        </div>
                    </div>
                    <div className='pagination'>
                        <input type='button' id='prev_page' onClick={() => this._changePage('prev', totalPage)} />
                        <label htmlFor='prev_page'>
                            <svg width='16px' height='24px' viewBox='0 0 16 24'>
                                <path d='M2,12 L14,2 M2,12 L14,22' />
                            </svg>
                        </label>
                        <div className='info'>
                            <span className='target'>{currentPage + 1}</span>
                            <span>&nbsp;of&nbsp;</span>
                            <span className='target'>{totalPage}</span>
                        </div>
                        <input type='button' id='next_page' onClick={() => this._changePage('next', totalPage)} />
                        <label htmlFor='next_page'>
                            <svg width='16px' height='24px' viewBox='0 0 16 24'>
                                <path d='M14,12 L2,2 M14,12 L2,22' />
                            </svg>
                        </label>
                    </div>
                </div>
                <CoreInfo _resetPage={this._resetPage}/>
                {modal()}
            </div>
        }}
    </Store.Consumer>
}