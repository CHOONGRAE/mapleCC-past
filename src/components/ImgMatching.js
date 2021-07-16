import React from 'react'
import Store from '../contexts/Store'
import ImgFetch from '../imgMatching/ImgFetch'

export default class ImageMatching extends React.Component {

    static contextType = Store

    state = {
        files:{length:0}
    }

    render = () => <Store.Consumer>
        {store => {

            const { files } = this.state

            return <div id='ImageMatching'>
                <input type='checkbox' id='ImgMatch'></input>
                <div className='background'>
                    <div className='modal'>
                        <input type='file' id='file' accept='image/*' multiple onChange={this._changeFile} />
                        <label htmlFor='file'>이 미 지 선 택</label>
                        <p className='filesCnt'><span className='target'>{files.length}</span> 개의 파일</p>
                        <input type='button' id='test' onClick={() => this._imgMatch()}></input>
                        <label htmlFor='test'>test</label>
                    </div>
                </div>
            </div>
        }}
    </Store.Consumer>

    _imgFetch = async() => {
        const { skillList, skillData } = this.context

        let test = new ImgFetch(skillList,skillData)
        return await test.fetch()
    }

    _imgMatch = async() => {
        console.time('test')
        console.log(await this._imgFetch())
        console.timeEnd('test')
    }

    _changeFile = (e) => {
        this.setState({
            files:e.target.files
        })
        console.log(e.target.files)
        e.target.type = 'button'
        e.target.type = 'file'
    }
}