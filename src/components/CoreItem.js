import React from 'react'
import Store from '../contexts/Store'

export default class CoreItem extends React.Component {
    render = () => {
        const { className, index } = this.props
        return <Store.Consumer>
            {store => {
                const { v_matrix_mode,
                    skillList,
                    skillData,
                    coreList,
                    selectedCoreList,
                    selectedSkillList,
                    _select_createCore ,
                    _select_homeCore ,
                    _select_removeCore } = store

                const innerHtml = () => {
                    let string = 'outline '

                    const img = (data,pos) => data ? data[pos] : null

                    if (v_matrix_mode == 'create') {
                        if (selectedSkillList.includes(index)) string += 'selected'
                        return skillList[index]
                            ? <div className={string} onClick={() => _select_createCore(index)}>
                                <img src={img(skillData[skillList[index]],'img')} />
                            </div>
                            : null
                    } else {
                        if (selectedCoreList.includes(coreList[index])) string += 'selected'
                        let target = coreList[index]
                        let func = _select_homeCore
                        if(v_matrix_mode == 'remove') func = _select_removeCore
                        return target
                            ? <div className={string} onClick={() => func(target)}>
                                <img src={img(skillData[skillList[target[2]]],'img')} />
                                <img src={img(skillData[skillList[target[0]]],'core1')} />
                                <img src={img(skillData[skillList[target[1]]],'core2')} />
                                <img src={require('../datas/iconFrame.frame3.png').default} />
                            </div>
                            : null
                    }
                }

                return <div id='CoreItem' className={className}>
                    {innerHtml()}
                </div>
            }}
        </Store.Consumer>
    }
}