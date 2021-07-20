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
        cores: {},
        GPU: false
    }

    componentDidMount = () => {
        this.setState(prevState => {
            let GPU = this._checkGPU()

            return {
                ...prevState,
                GPU
            }
        })
    }

    render = () => <Store.Consumer>
        {store => {
            const { skillList, skillData } = store
            const { files, GPU } = this.state

            const img = (data, position) => data ? data[position] : null

            const imgs = (core) => <div key={core} className='core'>
                <img src={img(skillData[skillList[core[2]]], 'img')} />
                <img src={img(skillData[skillList[core[0]]], 'core1')} />
                <img src={img(skillData[skillList[core[1]]], 'core2')} />
                <img src={require('../datas/iconFrame.frame3.png').default} />
            </div>

            const possible = () => {
                let list = this._makeList()
                return <div className='modal'>
                    <input type='file' id='file' accept='image/*' multiple onChange={this._changeFile} />
                    <label htmlFor='file'>이 미 지 선 택</label>
                    <p className='filesCnt'><span className='target'>{files.length}</span> 개의 파일</p>
                    <input type='button' id='start' onClick={() => this._imgMatch()}></input>
                    <label htmlFor='start' style={{ cursor: 'pointer' }}>인식 시작</label>
                    <div className='result'>
                        {list.map(v => imgs(v))}
                        {list.length ? <p>{list.length} 종류의 코어 찾음</p> : null}
                    </div>
                    <div className='btns'>
                        <input type='button' id='start' onClick={() => this._imgMatch()}></input>
                        <label htmlFor='start' style={{ cursor: 'pointer' }}>취소</label>
                        <input type='button' id='start' onClick={() => this._imgMatch()}></input>
                        <label htmlFor='start' style={{ cursor: 'pointer' }}>추가</label>
                    </div>
                </div>
            }

            const impossible = () => <div className='modal'>
            </div>

            return <div id='ImageMatching'>
                <input type='checkbox' id='ImgMatch'></input>
                <div className='background'>
                    {GPU ? possible() : impossible()}
                </div>
            </div>
        }}
    </Store.Consumer>

    _checkGPU = () => {
        let canvas = new OffscreenCanvas(1,1)
        let gl = canvas.getContext('webgl2')
        let debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        let reg = /(NVIDIA|AMD|Intel)/
        let vender = renderer.match(reg) && renderer.match(reg)[0]
        let bool = vender == 'NVIDIA' || vender == 'AMD' || vender == 'Intel'
        return bool
    }

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
            matchs[i] = new ImgMatch(src,coreImgs,i,this._getResult)
        }

        let run = []
        for(let match of matchs){
            run[run.length] = match.run()
        }

        await Promise.all(run)

        console.timeEnd('test')
    }

    _getResult = (index, data) => {
        this.setState(prevState => {
            let {cores} = prevState

            let list = []
            for(let key in data){
                list[list.length] = data[key].core
            }
            cores[index] = list

            return {
                ...prevState,
                cores
            }
        })
    }

    _existence = (list,core) => {
        for(let item of list){
            if(item.toString() == core.toString()) return true
        }
        return false
    }

    _makeList = () => {
        const {cores} = this.state
        let result = []
        for(let key in cores){
            for(let core of cores[key]){
                if(!this._existence(result,core)) result[result.length] = core
            }
        }

        result.sort((a,b) => {
            if(a[0] == b[0]){
                if(a[1] == b[1]){
                    return a[2] - b[2]
                }
                return a[1] - b[1]
            }
            return a[0] - b[0]
        })

        return result
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