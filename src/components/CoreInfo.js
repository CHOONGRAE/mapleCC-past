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

        const skillName = (position,index) => {
            const title = () => {
                if(v_matrix_mode == 'create'){
                    return <p className='position'>
                    <span className='class'>&nbsp;{position}&nbsp;</span>
                    <input type='button' id={'cancel'+index} onClick='' />
                    <label htmlFor={'cancel'+index}></label>
                </p>
                }
                return <p className='position'>
                    <span className='class'>&nbsp;{position}&nbsp;</span>
                </p>
            }

            return <div className='skillInfo'>
                {title()}
            </div>
        }

        const cancel = () => {
            if (v_matrix_mode == 'create') {
                return <span className='skillCancel'>
                    <svg width='26px' height='26px' viewBox='0 0 26 26'>
                        <circle cx='13' cy='13' r='10' />
                        <path d='M13,8 L13,18' stroke='#fff' />
                        <path d='M8,13 L18,13' stroke='#fff' />
                    </svg>
                </span>
            }
        }

        return <div id='CoreInfo'>
            <div className='text'>
                <p className='coreName'>{coreName()}</p>
                <p className='position'>
                    <span className='class'>&nbsp;메인 스킬&nbsp;</span>
                    {cancel()}
                </p>
                {}
                <p>

                </p>
                <p className='position'>
                    <span className='class'>&nbsp;서브 스킬&nbsp;</span>
                    {cancel()}
                </p>
                <p className='position'>
                    <span className='class'>&nbsp;서브 스킬&nbsp;</span>
                    {cancel()}
                </p>
            </div>
            <V_matrixBtns />
        </div>
    }}
</Store.Consumer>