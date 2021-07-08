import React from 'react'
import Store from '../contexts/Store'

export default class Calculator extends React.Component {
    render = () => <Store.Consumer>
        {store => {
            const {
                skillList,
                skillData,
                targetSkillList,
                coreList,
                superposition,
                minCores,
                plusCores,
                _changeMode,
            } = store

            const img = (data) => data ? data.img : null

            const coreImg = (core) => <div key={core} className='coreImg'>
                <img src={img(skillData[core[2]])} />
                <img src={img(skillData[core[0]])} />
                <img src={img(skillData[core[1]])} />
                <img src={require('../datas/iconFrame.frame3.png').default} />
            </div>

            return <div id='Calculator'>
                <div className='coreList'>
                    <p className='title'>Core List</p>
                    <div className='list'>
                        {coreList.map(v => coreImg(v))}
                    </div>
                </div>
                <div className='targetList'>
                    <p className='title'>Target List</p>
                    <div className='list'>
                        {targetSkillList.map(v => <img key={v} src={img(skillData[v])}/>)}
                    </div>
                </div>
                <div className='setting'>
                    <p>
                        <span className='target'>Core List</span> 를&nbsp;
                        <span className='target'>Target List</span> 들이
                    </p>
                    <div className='inline'>&nbsp;{superposition}&nbsp;중 첩&nbsp;</div>
                    <div className='inline'>
                        &nbsp;{minCores + plusCores}&nbsp;코 어&nbsp;
                        ( 최 소{plusCores == 0 ? null : ` + ${plusCores}`} )&nbsp;
                        </div>
                    <p className='inline'>
                        &nbsp;가 되도록 계산합니다.
                    </p>
                </div>
                <div className='option'>
                    <div className='title inline'>
                        &nbsp;서 브 스 킬&nbsp;
                    </div>
                    <div className='list inline'>
                        {skillList.filter(v => !targetSkillList.includes(v)).map(v =>
                            <div key={v} className='item inline'>
                                <label htmlFor={'sub'+v}>
                                    <input type='checkbox' id={'sub' + v} />
                                    {v}
                                </label>
                            </div>)}
                    </div>
                </div>
                <div className='btns'>
                    <input type='button' id='home' onClick={_changeMode}/>
                    <label htmlFor='home'>돌 아 가 기</label>
                    <input type='button' id='calc' />
                    <label htmlFor='calc'>계 산 시 작</label>
                </div>
            </div>
        }}
    </Store.Consumer>
}