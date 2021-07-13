import React from 'react'
import Store from '../contexts/Store'
import Calculate from '../solver/Calculate'

export default class Calculator extends React.Component {

    static contextType = Store

    componentDidMount = () => {
        this.context._checkMinCore()
    }

    calculate = () => {
        const {
            targetSkillList,
            coreList,
            subSkillList,
            superposition,
            minCores,
            plusCores
        } = this.context

        let calc = new Calculate(targetSkillList,coreList,subSkillList,superposition,minCores,plusCores)
    }

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
                subSkillList,
                calcStatus,
                _changeMode,
                _changeSuperposition,
                _changePlusCores,
                _changeSubSkill
            } = store

            const status = ['계 산 시 작','계 산 중 ...(Click:취소)','계 산 완 료']

            const img = (data,pos) => data ? data[pos] : null

            const coreImg = (core) => <div key={core} className='coreImg'>
                <img src={img(skillData[skillList[core[2]]],'img')} />
                <img src={img(skillData[skillList[core[0]]],'core1')} />
                <img src={img(skillData[skillList[core[1]]],'core2')} />
                <img src={require('../datas/iconFrame.frame3.png').default} />
            </div>

            const option = () => {
                if (targetSkillList.length > 0) {
                    var possible = (minCores + plusCores) * 3
                    var required = targetSkillList.length * superposition
                    if (possible - required > 0) return <div className='option'>
                        <div className='title inline'>
                            &nbsp;서 브 강 화&nbsp;
                        </div>
                        <div className='list inline'>
                            {skillList.filter(v => !targetSkillList.includes(v)).map(v =>
                                <div key={v} className='item inline'>
                                    <label htmlFor={v}>
                                        <input type='checkbox' id={v} checked={subSkillList.includes(v)} onChange={_changeSubSkill} />
                                        {v}
                                    </label>
                                </div>)}
                        </div>
                    </div>
                }
            }

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
                        {targetSkillList.map(v => <img key={v} src={img(skillData[skillList[v]],'img')}/>)}
                    </div>
                </div>
                <div className='setting'>
                    <p>
                        <span className='target'>Core List</span> 를&nbsp;
                        <span className='target'>Target List</span> 들이
                    </p>
                    <div className='inline' onClick={_changeSuperposition}>&nbsp;{superposition}&nbsp;중 첩&nbsp;</div>
                    <div className='inline' onClick={_changePlusCores}>
                        &nbsp;{minCores + plusCores}
                        &nbsp;( 최 소
                        {plusCores == 0 ? null : ` + ${plusCores}`} 
                        &nbsp;) 코 어&nbsp;
                        </div>
                    <p className='inline'>
                        &nbsp;가 되도록 계산합니다.
                    </p>
                </div>
                {option()}
                <div className='btns'>
                    <input type='button' id='home' onClick={_changeMode}/>
                    <label htmlFor='home'>돌 아 가 기</label>
                    <input type='button' id='calc' onClick={this.calculate()}/>
                    <label htmlFor='calc'>{status[calcStatus]}</label>
                </div>
            </div>
        }}
    </Store.Consumer>
}