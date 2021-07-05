import React from 'react'
import ReactDOM from 'react-dom'
import Store from './contexts/Store'
import Data from './datas/data'
import ClassAndSkill from './components/ClassAndSkill'

class App extends React.Component {
    constructor(props) {
        super(props)

        this._changePage = (e) => {
            this.setState({
                page: e.target.id
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
            _changePage: this._changePage
        }
    }

    componentDidMount = () => {
        if (this.state.selectedGroup == '') {
            this.setState(prevState => {
                var group = prevState.groupList[0]
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

ReactDOM.render(<App />, document.getElementById('mapleCC'))