import React from 'react'
import ReactDOM from 'react-dom'
import Store from './contexts/Store'
import Data from './datas/data'
import ClassAndSkill from './components/ClassAndSkill'
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
            _changePage: this._changePage,
            _changeGroup: this._changeGroup,
            _changeClass: this._changeClass
        }
    }

    componentDidMount = () => {
        if (this.state.selectedGroup == '') {
            this.state._changeGroup(this.state.groupList[0])
        }
    }

    render() {
        const img = (data) => {
            return data ? data.img : null
        }
        return <div id='mapleCC'>
            <p className='title'>코어 배치 계산기</p>
            <Store.Provider value={this.state}>
                <ClassAndSkill />
            </Store.Provider>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('maple'))