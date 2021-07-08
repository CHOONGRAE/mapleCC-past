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
                    _select_createCore } = store

                const innerHtml = () => {
                    var string = 'outline '

                    const img = (data) => data ? data.img : null

                    if (v_matrix_mode == 'create') {
                        if (selectedSkillList.includes(skillList[index])) string += 'selected'
                        return skillList[index]
                            ? <div className={string} onClick={() => _select_createCore(skillList[index])}>
                                <img src={img(skillData[skillList[index]])} />
                            </div>
                            : null
                    } else {
                        if (selectedCoreList.includes(coreList[index])) string += 'selected'
                        return coreList[index]
                            ? <div className={string}>
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