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
            _batchimEnding,
            _cancel_createCore
        } = store

        const coreName = () => {
            var string = []
            var list
            if(v_matrix_mode == 'create') list = selectedSkillList
            else list = selectedCore

            for(var i in list){
                var s = list[i]
                if(s != ''){
                    switch(i){
                        case '0':
                            string[2] = s
                            break
                        case '1':
                            string[0] = skillData[s].nick + _batchimEnding(skillData[s].nick)
                            break
                        case '2':
                            string[1] = skillData[s].nick + "의 "
                            break
                    }
                }
            }

            return string.join('')
        }

        const skill = (position,index) => {
            const title = () => {
                if (v_matrix_mode == 'create') {
                    return <p className='position'>
                        <span className='class'>&nbsp;{position + ' 스킬'}&nbsp;</span>
                        <input type='button' id={'cancel' + index} onClick={() => _cancel_createCore(index)} />
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