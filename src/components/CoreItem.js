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
                    targetSkillList,
                    coreList,
                    selectedCoreList } = store

                const innerHtml = () => {
                    var string = 'outline '

                    const img = (data) => data ? data.img : null

                    if (v_matrix_mode == 'create') {
                        if (targetSkillList.includes(skillList[index])) string += 'selected'
                        return <div className={string}>
                            {skillList[index]
                                ? <img src={img(skillData[skillList[index]])} />
                                : null}
                        </div>
                    } else {
                        if (selectedCoreList.includes(coreList[index])) string += 'selected'
                        return <div className={string}>
                            <img src={img(skillData[skillList[0]])} />
                            <img src={Frame} />
                        </div>
                    }
                }

                return <div id='CoreItem' className={className}>
                    {innerHtml()}
                </div>
            }}
        </Store.Consumer>
    }
}