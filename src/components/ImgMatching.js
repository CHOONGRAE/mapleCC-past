import React from 'react'
import Store from '../contexts/Store'
import ImgFetch from '../imgMatching/ImgFetch'
import ImgMatch from '../imgMatching/ImgMatch'

const states = {
    START: '대기',
    FETCH: '코어 이미지 수집',
    RUNNING: '매칭중...',
    COMPLETED: '완료'
}

export default class ImageMatching extends React.Component {

    static contextType = Store

    state = {
        state: states.START,
        files: [],
        cores: {},
        GPU: ''
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
            const { state, files, GPU } = this.state

            const img = (data, position) => data ? data[position] : null

            const imgs = (core) => <div key={core} className='core'>
                <img src={img(skillData[skillList[core[2]]], 'img')} />
                <img src={img(skillData[skillList[core[0]]], 'core1')} />
                <img src={img(skillData[skillList[core[1]]], 'core2')} />
                <img src={require('../datas/iconFrame.frame3.png').default} />
            </div>

            const btns = (list) => {
                if (list.length) {
                    return <div className='btns'>
                        <label className='info'><span className='target'>{list.length}</span> 종류의 코어 찾음</label>
                        <label htmlFor='ImgMatch' onClick={() => {this._addCores(list)}}>취 소</label>
                        <label htmlFor='ImgMatch' onClick={() => {this._addCores(list,true)}}>추 가</label>
                    </div>
                } else {
                    return <div className='btns'>
                        {state == states.RUNNING || state == states.COMPLETED ? 
                        <label className='info'><span className='target'>{list.length}</span> 종류의 코어 찾음</label> : null}
                        <label htmlFor='ImgMatch' onClick={() => {this._addCores(list)}}>닫 기</label>
                    </div>
                }
            }

            const possible = () => {
                let list = this._makeList()
                return <div className='modal'>
                    <div className='match'>
                        <div className='inputImg'>
                            <input type='file' id='file' accept='image/jpeg, image/png' multiple onChange={this._changeFile} disabled={state != states.START} />
                            <label htmlFor='file'>이 미 지 선 택</label>
                            <p className='filesCnt'><span className='target'>{files.length}</span> 개의 파일</p>
                            <p className='target'>※한번에 최대 10장까지 가능합니다.※</p>
                            <p className='target'>※인게임 스샷만 사용해주세요. 편집된 파일의 경우 필터링 됩니다.※</p>
                        </div>
                        <div className='status'>
                            <input type='button' id='start' onClick={() => this._imgMatch()} disabled={state != states.START || !files.length} />
                            <label htmlFor='start' >인 식 시 작</label>
                            <label className='state target'>{state}</label>
                        </div>
                        <div className='result'>
                            {list.map(v => imgs(v))}
                        </div>
                    </div>
                    {btns(list)}
                </div>
            }

            const impossible = () => <div className='modal'>
                {GPU == 'webgl'
                    ? <div className='message'>
                        <p><span className='target'>WebGL2</span>를 사용할 수 없는 브라우저 입니다.</p>
                        <p>최신버전의 <span className='target'>크롬 브라우저</span> 사용을 권장합니다.</p>
                    </div>
                    : <div className='message'>
                        <p><span className='target'>하드웨어 가속</span>이 꺼져있습니다.</p>
                        <p>해당 기능은 <span className='target'>하드웨어 가속</span>이 켜져있어야 사용가능합니다.</p>
                    </div>}
                <div className='btns'>
                    <label htmlFor='ImgMatch' >확 인</label>
                </div>
            </div>

            return <div id='ImageMatching'>
                <input type='checkbox' id='ImgMatch' disabled={state == states.FETCH || state == states.RUNNING}></input>
                <div className='background'>
                    {GPU == 'possible' ? possible() : impossible()}
                </div>
            </div>
        }}
    </Store.Consumer>

    _addCores = (list, sign=false) => {
        if (this.state.state == states.COMPLETED){
            if(sign) this.context._addMatch(list)
            setTimeout(() => {
                this.setState({
                    state: states.START,
                    files: [],
                    cores: {}
                })
            },100)
        }
    }

    _checkGPU = () => {
        let canvas = new OffscreenCanvas(1, 1)
        let gl = canvas.getContext('webgl2')
        if (!gl) return 'webgl2'
        let debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        let reg = /(NVIDIA|AMD|Intel)/
        let vender = renderer.match(reg) && renderer.match(reg)[0]
        let bool = vender == 'NVIDIA' || vender == 'AMD' || vender == 'Intel'
        return bool ? 'possible' : 'impossible'
    }

    _imgFetch = async () => {
        this.setState(prevState => {
            let state = states.FETCH
            return {
                ...prevState,
                state
            }
        })
        const { skillList, skillData } = this.context

        let fetch = new ImgFetch(skillList, skillData)
        return await fetch.fetch()
    }

    _imgMatch = async () => {
        console.time('test')

        const { files } = this.state

        if (files.length) {
            let coreImgs = await this._imgFetch()

            this.setState(prevState => {
                let state = states.RUNNING

                return {
                    ...prevState,
                    state
                }
            })
            let matchs = new Array(files.length)

            for (let i = 0; i < matchs.length; i++) {
                let src = URL.createObjectURL(files[i])
                matchs[i] = new ImgMatch(src, coreImgs, i, this._getResult)
            }

            let run = []
            for (let match of matchs) {
                run[run.length] = match.run()
            }

            await Promise.all(run)

            this.setState(prevState => {
                let state = states.COMPLETED

                return {
                    ...prevState,
                    state
                }
            })
        }

        console.timeEnd('test')
    }

    _getResult = (index, data) => {
        this.setState(prevState => {
            let { cores } = prevState

            let list = []
            for (let key in data) {
                list[list.length] = data[key].core
            }
            cores[index] = list

            return {
                ...prevState,
                cores
            }
        })
    }

    _existence = (list, core) => {
        for (let item of list) {
            if (item.toString() == core.toString()) return true
        }
        return false
    }

    _makeList = () => {
        const { cores } = this.state
        let result = []
        for (let key in cores) {
            for (let core of cores[key]) {
                if (!this._existence(result, core)) result[result.length] = core
            }
        }

        result.sort((a, b) => {
            if (a[0] == b[0]) {
                if (a[1] == b[1]) {
                    return a[2] - b[2]
                }
                return a[1] - b[1]
            }
            return a[0] - b[0]
        })

        return result
    }

    _checkImage = async (url) => {
        let ratio = {
            800: 600,
            1024: 768,
            1280: 720,
            1366: 768,
            1920: 1080
        }
        let img = await fetch(url)
            .then(res => res.blob())
            .then(blob => createImageBitmap(blob))
        return ratio[img.width] == img.height
    }

    _changeFile = async (e) => {
        if (e.target.files.length <= 10) {
            let files = []
            for (let i = 0; i < e.target.files.length; i++) {
                let check = await this._checkImage(URL.createObjectURL(e.target.files[i]))
                if (check) files[files.length] = e.target.files[i]
            }
            this.setState({
                files
            })
            e.target.type = 'button'
            e.target.type = 'file'
        }
    }
}