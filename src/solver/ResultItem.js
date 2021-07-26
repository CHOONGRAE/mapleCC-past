import React from 'react'
import Store from '../contexts/Store'

export default class ResultItem extends React.Component {

    state = {
        main: '',
        sub1: '',
        sub2: ''
    }

    _selectCore = (core) => {
        const { main, sub1, sub2 } = this.state
        if (core[0] == main && core[1] == sub1 && core[2] == sub2) {
            this.setState({
                main: '',
                sub1: '',
                sub2: ''
            })
        } else {
            this.setState({
                main: core[0],
                sub1: core[1],
                sub2: core[2]
            })
        }
    }

    render = () => <Store.Consumer>
        {store => {
            const {
                skillList,
                skillData,
                targetSkillList,
                _batchimEnding
            } = store

            const { list, index, page } = this.props
            const { main, sub1, sub2 } = this.state

            const img = (data, position) => data ? data[position] : null

            const imgs = (core) => <div key={core} className='core'>
                <div className={core[0] == main && core[1] == sub1 && core[2] == sub2 ? 'outline selected' : 'outline'} onClick={() => this._selectCore(core)}>
                    <img src={img(skillData[skillList[core[2]]], 'img')} />
                    <img src={img(skillData[skillList[core[0]]], 'core1')} />
                    <img src={img(skillData[skillList[core[1]]], 'core2')} />
                    <img src={require('../datas/iconFrame.frame3.png').default} />
                </div>
            </div>

            const coreInfo = () => {
                if (main !== '') {
                    return <div className='coreInfo'>
                        <p className='coreName'>
                            <span className='position'>&nbsp;코 어&nbsp;</span>
                            <span className='text'>{(() => {
                                let string = []
                                string[0] = skillData[skillList[sub1]] ? skillData[skillList[sub1]].nick + _batchimEnding(skillData[skillList[sub1]].nick) : ''
                                string[1] = skillData[skillList[sub2]] ? skillData[skillList[sub2]].nick + '의 ' : ''
                                string[2] = skillList[main]
                                return string.join('')
                            })()}</span>
                        </p>
                        <p className='skillName'>
                            <span className='position'>&nbsp;메 인&nbsp;</span>
                            <span className={targetSkillList.includes(main) ? 'text target' : 'text'}>{skillList[main]}</span>
                        </p>
                        <p className='skillName'>
                            <span className='position'>&nbsp;서 브&nbsp;</span>
                            <span className={targetSkillList.includes(sub1) ? 'text target' : 'text'}>{skillList[sub1]}</span>
                        </p>
                        <p className='skillName'>
                            <span className='position'>&nbsp;서 브&nbsp;</span>
                            <span className={targetSkillList.includes(sub2) ? 'text target' : 'text'}>{skillList[sub2]}</span>
                        </p>
                    </div>
                }
            }

            const checkSuperposition = () => {
                let result = []
                skillList.forEach((_, i) => {
                    let cnt = 0
                    for (let core of list) {
                        for (let skill of core) {
                            if (skill == i) cnt++
                        }
                    }
                    result[cnt] = result[cnt] && result[cnt].length > 0 ? [...result[cnt], i] : [i]
                })
                return result
            }

            return <div id='ResultItem'>
                <div className='coreList'>
                    <div className='cnt'>
                        {index + 1 + page * 10}
                    </div>
                    {list.map(v => {
                        return imgs(v)
                    })}
                </div>
                <div className='info'>
                    {coreInfo()}
                    <div className='superpositionInfo'>
                        {checkSuperposition().map((skills, superposition) => superposition != 0
                            ? <div key={skills} className='superposition'>
                                <div className='position'>&nbsp;{superposition} 중 첩&nbsp;</div>
                                <div className='list'>
                                    {skills.map((skill, i) =>
                                        <span key={skill} className={targetSkillList.includes(skill) ? 'text target' : 'text'}>
                                            &nbsp;{skillList[skill]}&nbsp;
                                        </span>)}
                                </div>
                            </div>
                            : null)}
                    </div>
                </div>
            </div>
        }}
    </Store.Consumer>
}