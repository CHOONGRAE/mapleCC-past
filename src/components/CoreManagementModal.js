import React from 'react'
import Store from '../contexts/Store'

const Add = () => <Store.Consumer>
    {store => {
        const { selectedSkillList } = store

        const message = () => {
            if (selectedSkillList.includes('')) {
                return <div className='message'>
                    <p>코어 스킬이 부족합니다.</p>
                    <p>스킬을 확인해 주세요.</p>
                </div>
            } else {
                return <div className='message'>
                    {selectedSkillList.map((v, i) => {
                        var position = (i == 0 ? '메인 ' : '서브 ') + '스킬'
                        return <p className='addList'>
                            <span className='position'>&nbsp;{position}&nbsp;</span>
                            <span className='name'>{v}</span>
                        </p>
                    })}
                </div>
            }
        }

        const btns = () => {
            if (selectedSkillList.includes('')) {
                return <div className='btns'>
                    <label htmlFor='Add'>확 인</label>
                </div>
            } else {
                return <div className='btns'>
                    <label htmlFor='Add'>취 소</label>
                    <label htmlFor='Add' onClick=''>확 인</label>
                </div>
            }
        }

        return <div id='AddModal'>
            <input type='checkbox' id='Add'></input>
            <div className='background'>
                <div className='modal'>
                    {message()}
                    {btns()}
                </div>
            </div>
        </div>
    }}
</Store.Consumer>

const Remove = () => <Store.Consumer>
    {store => {
        const { selectedCoreList } = store

        const message = () => {
            if (selectedCoreList.length) {
                return <div className='message'>
                    <p>선택한 코어 <span>{selectedCoreList.length}</span> 개</p>
                    <p>삭제 하시겠습니까?</p>
                </div>
            } else {
                return <div className='message'>
                    <p>선택한 코어가 없습니다.</p>
                </div>
            }
        }

        const btns = () => {
            if (selectedCoreList.length) {
                return <div className='btns'>
                    <label htmlFor='Remove'>취 소</label>
                    <label htmlFor='Remove' onClick=''>확 인</label>
                </div>
            } else {
                return <div className='btns'>
                    <label htmlFor='Remove'>확 인</label>
                </div>
            }
        }

        return <div id='RemoveModal'>
            <input type='checkbox' id='Remove'></input>
            <div className='background'>
                <div className='modal'>
                    {message()}
                    {btns()}
                </div>
            </div>
        </div>
    }}
</Store.Consumer>

const RemoveAll = () => <Store.Consumer>
    {store => <div id='RemoveAllModal'>
        <input type='checkbox' id='RemoveAll'></input>
        <div className='background'>
            <div className='modal'>
                <div className='message'>
                    <p>전체 코어를 삭제 하시겠습니까?</p>
                </div>
                <div className='btns'>
                    <label htmlFor='RemoveAll'>취 소</label>
                    <label htmlFor='RemoveAll' onClick=''>확 인</label>
                </div>
            </div>
        </div>
    </div>}
</Store.Consumer>

export { Add, Remove, RemoveAll }