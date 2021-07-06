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
                var {skillList,targetSkillList} = prevState
                if(e.target.checked) targetSkillList.push(e.target.id)
                else targetSkillList.splice(targetSkillList.indexOf(e.target.id))
    
                targetSkillList.sort((a,b) => skillList.indexOf(a) - skillList.indexOf(b))

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
                    v_matrix:!prevState.v_matrix
                }
            })
        }

        this.state = {
            page: 'class',
            v_matrix: false,
            groupList: [...Object.keys(Data)],
            selectedGroup: '',
            classList: [],
            selectedClass: '',
            classImg: '',
            skillList: [],
            skillData: {},
            targetSkillList: [],
            _changePage: this._changePage,
            _changeGroup: this._changeGroup,
            _changeClass: this._changeClass,
            _changeTargetSkill: this._changeTargetSkill,
            _v_matrix: this._v_matrix
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