import React from 'react'
import Store from '../contexts/Store'

export default () => <Store.Consumer>
    {store => <div id='V_matrix'>
        <div className='title'>
            <span className='title'>V 매트릭스</span>
            <span className={'mode ' + store.v_matrix_mode}>{store.v_matrix_mode}</span>
            <span className='close'>
                <input type='button' id='closeVmatrix' onClick={store._v_matrix} />
                <label htmlFor='closeVmatrix'>
                    <svg width='26px' height='26px' viewBox='0 0 26 26'>
                        <circle cx='13' cy='13' r='10' />
                        <path d='M13,8 L13,18' stroke='#fff' />
                        <path d='M8,13 L18,13' stroke='#fff' />
                    </svg>
                </label>
            </span>
        </div>
    </div>}
</Store.Consumer>