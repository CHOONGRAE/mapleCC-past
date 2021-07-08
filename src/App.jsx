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
                var classList = [...Object.keys(Data[group])]
                var selectedClass = classList[0]
                var classImg = Data[group][selectedClass].img
                var skillList = [...Object.keys(Data[group][selectedClass].skill)]
                var skillData = Data[group][selectedClass].skill

                return {
                    ...prevState,
                    group,
                    classList,
                    selectedClass,
                    classImg,
                    skillList,
                    skillData
                }
            })
        }

        this._changeClass = (selectedClass) => {
            this.setState(prevState => {
                var classImg = Data[prevState.group][selectedClass].img
                var skillList = [...Object.keys(Data[prevState.group][selectedClass].skill)]
                var skillData = Data[prevState.group][selectedClass].skill

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
                var { skillList, targetSkillList } = prevState
                if (e.target.checked) targetSkillList.push(e.target.id)
                else targetSkillList.splice(targetSkillList.indexOf(e.target.id))

                targetSkillList.sort((a, b) => skillList.indexOf(a) - skillList.indexOf(b))

                return {
                    ...prevState,
                    targetSkillList
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
            var lastLetter = s[s.length - 1]
            var uni = lastLetter.charCodeAt(0)
            return (uni - 44032) % 28 ? '과 ' : '와 '
        }

        this._changeMode = (e) => {
            this.setState(prevState => {
                var v_matrix_mode = e.target.id
                var selectedCoreList = []
                var selectedCore = ['', '', '']
                var selectedSkillList = ['', '', '']

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
            var { selectedSkillList } = this.state
            if(!selectedSkillList.includes(target)) this.setState(prevState => {
                var nullIndex = selectedSkillList.indexOf('')
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
                var { selectedSkillList } = prevState
                selectedSkillList[index] = ''
                
                return {
                    ...prevState,
                    selectedSkillList
                }
            })
        }

        this._existenceCheck = (target,list = this.state.coreList) => {
            for(var core of list){
                if(JSON.stringify(core) == JSON.stringify(target)) return true
            }
            return false
        }

        this._sortCoreList = (coreList) => {
            var { skillList } = this.state
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
                    var { coreList, selectedSkillList } = this.state
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
                var {selectedCoreList, selectedCore} = prevState

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
                var {selectedCoreList, selectedCore} = prevState

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
            v_matrix_mode: 'home',
            coreList: [],
            selectedCoreList: [],
            selectedCore: ['', '', ''],
            selectedSkillList: ['', '', ''],
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
            _select_removeCore: this._select_removeCore
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