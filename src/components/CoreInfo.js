import React from 'react'
import Store from '../contexts/Store'
import V_matrixBtns from './V_matrixBtns'

export default () => <Store.Consumer>
    {store => {
        const {
            v_matrix_mode,
            skillData,
            targetSkillList,
            selectedCoreList,
            selectedCore,
            selectedSkillList,
            _batchimEnding
        } = store

        const coreName = () => {
            var string = ''
            if(v_matrix_mode == 'create'){
                for(var i in selectedSkillList){
                    var s = selectedSkillList[i]
                    if(s != ''){
                        switch(i){
                            case 0:
                                string += skillData[s].nick + _batchimEnding(skillData[s].nick)
                                break
                            case 1:
                                string += skillData[s].nick + "의 "
                                break
                            case 2:
                                string += s
                                break
                        }
                    }
                }
            } else {
                var s = selectedCore[i]
                if(s != ''){
                    switch(i){
                        case 0:
                            string += skillData[s].nick + _batchimEnding(skillData[s].nick)
                            break
                        case 1:
                            string += skillData[s].nick + "의 "
                            break
                        case 2:
                            string += s
                            break
                    }
                }
            }
            return string
        }

        const skill = (position,index) => {
            const title = () => {
                if (v_matrix_mode == 'create') {
                    return <p className='position'>
                        <span className='class'>&nbsp;{position + ' 스킬'}&nbsp;</span>
                        <input type='button' id={'cancel' + index} onClick='' />
                        <label htmlFor={'cancel' + index}>
                            <svg width='26px' height='26px' viewBox='0 0 26 26'>
                                <circle cx='13' cy='13' r='10' />
                                <path d='M13,8 L13,18' stroke='#fff' />
                                <path d='M8,13 L18,13' stroke='#fff' />
                            </svg>취소
                        </label>
                    </p>
                }
                return <p className='position'>
                    <span className='class'>&nbsp;{position + ' 스킬'}&nbsp;</span>
                </p>
            }

            const skillName = () => {
                if(v_matrix_mode == 'create'){
                    return <p className='skillName'>
                        {selectedSkillList[index]} 강화
                    </p>                    
                }
                return <p className='skillName'>
                    {selectedCore[index]} 강화
                </p>  
            }

            return <div className='skillInfo'>
                {title()}
                {skillName()}
            </div>
        }

        return <div id='CoreInfo'>
            <div className='text'>
                <p className='coreName'>{coreName()}</p>
                {skill('메인',0)}
                {skill('서브',1)}
                {skill('서브',2)}
            </div>
            <V_matrixBtns />
        </div>
    }}
</Store.Consumer>