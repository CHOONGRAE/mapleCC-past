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
                    targetSkillList,
                    coreList,
                    selectedCoreList } = store

                const innerHtml = () => {
                    var string = 'outline '
                    if (v_matrix_mode == 'create') {
                        if (targetSkillList.includes(skillList[index])) string += 'selected'
                        return <div className={string}>
                            {skillList[index]
                                ? <img src={skillData[skillList[index]].img} />
                                : null}
                        </div>
                    } else {
                        if (selectedCoreList.includes(coreList[index])) string += 'selected'
                        return <div className={string}>

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