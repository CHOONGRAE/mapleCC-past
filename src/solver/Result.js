import React from 'react'
import ResultItem from './ResultItem'

export default class Result extends React.Component {

    state = {
        currentPage: 0
    }

    _changePage = (signal, totalPage) => {
        switch(signal){
            case 'prev':
                this.setState(prevState => {
                    let currentPage = prevState.currentPage - 1
                    if(currentPage < 0) currentPage = totalPage - 1
                    return {
                        ...prevState,
                        currentPage
                    }
                })
                break
            case 'next':
                this.setState(prevState => {
                    let currentPage = prevState.currentPage + 1
                    if(currentPage + 1 > totalPage) currentPage = 0
                    return {
                        ...prevState,
                        currentPage
                    }
                })
                break
        }
    }

    render = () => {
        const { result, toggle } = this.props

        const { currentPage } = this.state
        const totalPage = parseInt(result.length / 10) + (result.length % 10 ? 1 : 0)

        return <div id='Result'>
            <p className='title'>계 산 결 과 
                <input type='button' id='back' onClick={() => toggle()}></input>
                <label htmlFor='back'> 돌 아 가 기</label>
            </p>
            {result.slice(currentPage*10,currentPage*10+10).map((v, i) => <ResultItem key={v} list={v} index={i} page={currentPage} />)}
            <div className='pagination'>
                <input type='button' id='prev_page' onClick={() => this._changePage('prev', totalPage)} />
                <label htmlFor='prev_page'>
                    <svg width='16px' height='24px' viewBox='0 0 16 24'>
                        <path d='M2,12 L14,2 M2,12 L14,22'/>
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
                        <path d='M14,12 L2,2 M14,12 L2,22'/>
                    </svg>
                </label>
            </div>
        </div>
    }
}