import React from 'react'
import Store from '../contexts/Store'

export default () => <Store.Consumer>
    {store => <div id='Skill'>
        <div className='btn'>
            <input type='button' id='Vmatrix' onClick={store._v_matrix}></input>
            <label htmlFor='Vmatrix'>V 매트릭스</label>
        </div>
        <div className='skillList'>
            {store.skillList.map(v => <div key={v}
                className='skill'>
                <label htmlFor={v} className='over'/>
                <div className='img'>
                    <img src={store.skillData[v].img} />
                </div>
                <div className='info'>
                    <p className={store.targetSkillList.includes(v) ? 'target' : null}>{v}</p>
                    <input type='checkbox' id={v} checked={store.targetSkillList.includes(v)} onChange={store._changeTargetSkill}/>
                    <label htmlFor={v}/>
                </div>
            </div>)}
        </div>
    </div>}
</Store.Consumer>