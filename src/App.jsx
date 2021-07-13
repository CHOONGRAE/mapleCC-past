import React from 'react'
import ReactDOM from 'react-dom'
import Store from './contexts/Store'
import Data from './datas/data'
import ClassAndSkill from './components/ClassAndSkill'
import V_matrix from './components/V_matrix'
import './scss/App.scss'

class App extends React.Component {
    constructor(props) {
        super(props)

        this._changePage = (e) => {
            this.setState({
                page: e.target.id
            })
        }

        this._changeGroup = (group) => {
            this.setState(prevState => {
                let classList = [...Object.keys(Data[group])]
                let selectedClass = classList[0]
                let classImg = Data[group][selectedClass].img
                let skillList = [...Object.keys(Data[group][selectedClass].skill)]
                let skillData = Data[group][selectedClass].skill

                let coreList = (() => {
                    let list = []
                    for(let f in skillList){
                        for(let s in skillList){
                            if(f != s){
                                for(let t in skillList){
                                    if(f != t && s != t){
                                        list[list.length] = [+f,+s,+t]
                                    }
                                }
                            }
                        }
                    }
                    return list
                })()

                return {
                    ...prevState,
                    group,
                    classList,
                    selectedClass,
                    classImg,
                    skillList,
                    skillData,
                    coreList
                }
            })
        }

        this._changeClass = (selectedClass) => {
            this.setState(prevState => {
                let classImg = Data[prevState.group][selectedClass].img
                let skillList = [...Object.keys(Data[prevState.group][selectedClass].skill)]
                let skillData = Data[prevState.group][selectedClass].skill

                return {
                    ...prevState,
                    selectedClass,
                    classImg,
                    skillList,
                    skillData
                }
            })
        }

        this._changeTargetSkill = (e) => {
            this.setState(prevState => {
                let { targetSkillList } = prevState
                let id = +e.target.dataset.skillId
                if (e.target.checked) targetSkillList[targetSkillList.length] = id
                else targetSkillList.splice(targetSkillList.indexOf(id), 1)

                targetSkillList.sort((a, b) => a - b)

                return {
                    ...prevState,
                    targetSkillList,
                    subSkillList: []
                }
            })
        }

        this._v_matrix = () => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    v_matrix: !prevState.v_matrix
                }
            })
        }

        this._batchimEnding = (s) => {
            let lastLetter = s[s.length - 1]
            let uni = lastLetter.charCodeAt(0)
            return (uni - 44032) % 28 ? '과 ' : '와 '
        }

        this._changeMode = (e) => {
            this.setState(prevState => {
                let v_matrix_mode = e.target.id
                let selectedCoreList = []
                let selectedCore = ['', '', '']
                let selectedSkillList = ['', '', '']

                return {
                    ...prevState,
                    v_matrix_mode,
                    selectedCoreList,
                    selectedCore,
                    selectedSkillList
                }
            })
        }

        this._select_createCore = (target) => {
            let { selectedSkillList } = this.state
            if(!selectedSkillList.includes(target)) this.setState(prevState => {
                let nullIndex = selectedSkillList.indexOf('')
                if(nullIndex == -1) nullIndex = 2
                selectedSkillList[nullIndex] = target

                return {
                    ...prevState,
                    selectedSkillList
                }
            })
        }

        this._cancel_createCore = (index) => {
            this.setState(prevState => {
                let { selectedSkillList } = prevState
                selectedSkillList[index] = ''
                
                return {
                    ...prevState,
                    selectedSkillList
                }
            })
        }

        this._existenceCheck = (target,list = this.state.coreList) => {
            for(let core of list){
                if(JSON.stringify(core) == JSON.stringify(target)) return true
            }
            return false
        }

        this._sortCoreList = (coreList) => {
            let { skillList } = this.state
            return coreList.sort((a,b) => {
                if(a[0] == b[0]){
                    if(a[1] == b[1]) return skillList.indexOf(a[2]) - skillList.indexOf(b[2])
                    return skillList.indexOf(a[1]) - skillList.indexOf(b[1]) 
                }
                return skillList.indexOf(a[0]) - skillList.indexOf(b[0])
            })
        }

        this._createCore = () => {
            setTimeout(() => {
                this.setState(prevState => {
                    let { coreList, selectedSkillList } = this.state
                    if(!this._existenceCheck(selectedSkillList)) coreList = this._sortCoreList([...coreList,selectedSkillList])
                    selectedSkillList = ['', '', '']
    
                    return {
                        ...prevState,
                        coreList,
                        selectedSkillList
                    }
                })                
            }, 100);
        }

        this._select_homeCore = (target) => {
            this.setState(prevState => {
                let {selectedCoreList, selectedCore} = prevState

                if(this._existenceCheck(target,selectedCoreList)){
                    selectedCoreList = []
                    selectedCore = ['', '', '']
                } else {
                    selectedCoreList = [target]
                    selectedCore = target                   
                }

                return {
                    ...prevState,
                    selectedCoreList,
                    selectedCore
                }
            })
        }

        this._select_removeCore = (target) => {
            this.setState(prevState => {
                let {selectedCoreList, selectedCore} = prevState

                if(this._existenceCheck(target,selectedCoreList)){
                    selectedCoreList = selectedCoreList.filter(v => JSON.stringify(v) != JSON.stringify(target))
                    selectedCore = ['', '', '']
                } else {
                    selectedCoreList = [...selectedCoreList,target]
                    selectedCore = target
                }

                return {
                    ...prevState,
                    selectedCoreList,
                    selectedCore
                }
            })
        }

        this._removeCore = () => {
            setTimeout(() => {
                this.setState(prevState => {
                    let {
                        coreList,
                        selectedCoreList,
                        selectedCore
                    } = prevState

                    coreList = coreList.filter(v => !this._existenceCheck(v, selectedCoreList))
                    selectedCoreList = []
                    selectedCore = ['', '', '']

                    return {
                        ...prevState,
                        coreList,
                        selectedCoreList,
                        selectedCore
                    }
                })
            }, 100);
        }

        this._removeAllCore = () => {
            this.setState({
                coreList: [],
                selectedCoreList: [],
                selectedCore: ['', '', '']
            })
        }

        this._changeSuperposition = () => {
            this.setState(prevState => {
                let { superposition } = prevState
                superposition++
                if(superposition > 4) superposition -= 3

                return {
                    ...prevState,
                    superposition,
                    plusCores: 0,
                    subSkillList: []
                }
            })
            this._checkMinCore()
        }
        
        this._changePlusCores = () => {
            this.setState(prevState => {
                let { plusCores } = prevState
                plusCores++
                if(plusCores > 2) plusCores -= 3

                return {
                    ...prevState,
                    plusCores,
                    subSkillList: []
                }
            })
        }

        this._checkMinCore = () => {
            this.setState(prevState => {
                let {
                    superposition,
                    targetSkillList,
                    minCores
                } = prevState

                let targetCnt = targetSkillList.length
                minCores = 0

                if(targetCnt > 0){
                    if(superposition === 4 && targetCnt > 2)
                    minCores = targetCnt + Math.floor(targetCnt / 2) + (targetCnt % 2 ? 1 : 0)
                    else if(superposition > targetCnt) minCores = superposition
                    else {
                        let required = superposition * targetCnt
                        minCores = Math.floor(required / 3) + (required % 3 ? 1 : 0)
                    }
                } 

                return {
                    ...prevState,
                    minCores
                }
            })
        }

        this._changeSubSkill = (e) => {
            this.setState(prevState => {
                let {
                    skillList,
                    targetSkillList,
                    superposition,
                    minCores,
                    plusCores,
                    subSkillList
                } = prevState
                if (e.target.checked) subSkillList.push(e.target.id)
                else subSkillList.splice(subSkillList.indexOf(e.target.id), 1)

                subSkillList.sort((a, b) => skillList.indexOf(a) - skillList.indexOf(b))

                let possible = (minCores + plusCores) * 3
                let required = targetSkillList.length * superposition
    
                if (subSkillList.length >= possible - required)
                    document.querySelectorAll('.item input').forEach(v => {
                            console.log(v.id)
                            if (!subSkillList.includes(v.id))
                                v.toggleAttribute('disabled')
                        })
                else document.querySelectorAll('.item input').forEach(v => {
                        if (v.disabled)
                            v.toggleAttribute('disabled')
                    })

                return {
                    ...prevState,
                    subSkillList
                }
            })
        }

        this.state = {
            page: 'class',
            v_matrix: true,
            groupList: [...Object.keys(Data)],
            selectedGroup: '',
            classList: [],
            selectedClass: '',
            classImg: '',
            skillList: [],
            skillData: {},
            targetSkillList: [],
            v_matrix_mode: 'calculator',
            coreList: [],
            selectedCoreList: [],
            selectedCore: ['', '', ''],
            selectedSkillList: ['', '', ''],
            superposition: 3,
            minCores: 0,
            plusCores: 0,
            subSkillList: [],
            calcStatus: 0,
            _changePage: this._changePage,
            _changeGroup: this._changeGroup,
            _changeClass: this._changeClass,
            _changeTargetSkill: this._changeTargetSkill,
            _v_matrix: this._v_matrix,
            _batchimEnding: this._batchimEnding,
            _changeMode: this._changeMode,
            _select_createCore: this._select_createCore,
            _cancel_createCore: this._cancel_createCore,
            _createCore: this._createCore,
            _select_homeCore: this._select_homeCore,
            _select_removeCore: this._select_removeCore,
            _removeCore: this._removeCore,
            _removeAllCore: this._removeAllCore,
            _changeSuperposition: this._changeSuperposition,
            _changePlusCores: this._changePlusCores,
            _checkMinCore: this._checkMinCore,
            _changeSubSkill: this._changeSubSkill
        }
    }

    componentDidMount = () => {
        if (this.state.selectedGroup == '') {
            this.state._changeGroup(this.state.groupList[0])
        }
    }

    render() {
        return <div id='mapleCC'>
            <p className='title'>코어 배치 계산기</p>
            <Store.Provider value={this.state}>
                {this.state.v_matrix ? <V_matrix /> : <ClassAndSkill />}
            </Store.Provider>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('maple'))