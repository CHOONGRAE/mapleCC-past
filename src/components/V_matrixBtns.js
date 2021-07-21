import React from 'react'
import Store from '../contexts/Store'

export default class V_matrixBtns extends React.Component {
    render = () => <Store.Consumer>
        {store => {
            const {
                v_matrix_mode,
                _changeMode
            } = store
            const { _resetPage } = this.props

            switch (v_matrix_mode) {
                case 'home': return <div id='V_matrixBtns'>
                    <input type='button' id='remove' onClick={_changeMode} />
                    <label htmlFor='remove' onClick={() => {_resetPage()}}>코 어 삭 제</label>
                    <input type='button' id='create' onClick={_changeMode} />
                    <label htmlFor='create' onClick={() => {_resetPage()}}>코 어 추 가</label>
                    <input type='button' id='calculator' onClick={_changeMode} />
                    <label htmlFor='calculator' onClick={() => {_resetPage()}}>계 산 기</label>
                </div>
                case 'remove': return <div id='V_matrixBtns'>
                    <label htmlFor='Remove'>삭 제</label>
                    <label htmlFor='RemoveAll'>전 체 삭 제</label>
                    <input type='button' id='home' onClick={_changeMode} />
                    <label htmlFor='home' onClick={() => {_resetPage()}}>처 음 으 로</label>
                </div>
                case 'create': return <div id='V_matrixBtns'>
                    <label htmlFor='Add'>추 가</label>
                    <label htmlFor='ImgMatch'>이 미 지 인 식</label>
                    <input type='button' id='home' onClick={_changeMode} />
                    <label htmlFor='home' onClick={() => {_resetPage()}}>처 음 으 로</label>
                </div>
            }
        }}
    </Store.Consumer>
}