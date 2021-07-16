import React from 'react'
import Store from '../contexts/Store'
import ImgFetch from '../imgMatching/ImgFetch'
import ImgMatch from '../imgMatching/ImgMatch'

const states = {
    START: 'start',
    FETCH: 'fetch',
    RUNNING: 'running',
    COMPLETED: 'completed'
}

export default class ImageMatching extends React.Component {

    static contextType = Store

    state = {
        state: states.START,
        files: { length: 0 },
        cores: []
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

    _imgFetch = async () => {
        const { skillList, skillData } = this.context

        let fetch = new ImgFetch(skillList, skillData)
        return await fetch.fetch()
    }

    _imgMatch = async () => {
        console.time('test')

        const {files} = this.state

        let coreImgs = await this._imgFetch()

        let matchs = new Array(files.length)

        for(let i=0; i< matchs.length; i++){
            let src = URL.createObjectURL(files[i])
            matchs[i] = new ImgMatch(src,coreImgs)
        }

        await matchs[0].run()

        console.timeEnd('test')
    }

    _changeFile = (e) => {
        this.setState({
            files: e.target.files
        })
        console.log(e.target.files)
        e.target.type = 'button'
        e.target.type = 'file'
    }
}