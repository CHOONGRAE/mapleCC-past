import React from 'react'
import Store from '../contexts/Store'
import Frame from '../datas/iconFrame.frame3.png'

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
                    var string = 'outline '

                    const img = (data) => data ? data.img : null

                    if (v_matrix_mode == 'create') {
                        if (selectedSkillList.includes(skillList[index])) string += 'selected'
                        var target = skillList[index]
                        return target
                            ? <div className={string} onClick={() => _select_createCore(target)}>
                                <img src={img(skillData[target])} />
                            </div>
                            : null
                    } else {
                        if (selectedCoreList.includes(coreList[index])) string += 'selected'
                        var target = coreList[index]
                        var func = _select_homeCore
                        if(v_matrix_mode == 'remove') func = _select_removeCore
                        return target
                            ? <div className={string} onClick={() => func(target)}>
                                <img src={img(skillData[coreList[index][0]])} />
                                <img src={Frame} />
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