import React from 'react'
import Store from '../contexts/Store'

export default class ClassSelector extends React.Component {
    render() {
        const { type, id } = this.props
        return <Store.Consumer>
            {store => <div id='ClassModal'>
                <input type='checkbox' name='selector' id={id} value={type === 'group' ? store.group : store.selected} onClick={this._likeRadio}></input>
                <label htmlFor={id}><span></span><span>{(type === 'group' ? store.group : store.selectedClass)}</span><span> ▽</span></label>
                <div className='modal'>
                    {(type === 'group' ? store.groupList : store.classList).map(v => {
                        return !(v === store.group || v === store.selectedClass)
                            ? <div key={v} className='item'>
                                <input type='button' id={v}
                                    onClick={() => { this._unchecked(id); type === 'group' ? store._changeTarget(v) : store._changeTarget(store.group, v) }}></input>
                                <label htmlFor={v}>{v}</label>
                            </div>
                            : null
                    })}
                </div>
            </div>}
        </Store.Consumer>
    }

    _likeRadio = (e) => {
        if(e.target.checked){
            document.getElementsByName('selector').forEach(v => {
                if(v.id !== e.target.id && v.checked) v.checked = false
            })
        }
    }

    _unchecked = (id) => {
        document.getElementById(id).checked = false
    }
}
