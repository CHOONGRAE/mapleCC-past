import React from 'react'
import ReactDOM from 'react-dom'
import Store from './contexts/Store'
import Data from './datas/data'

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            page:'class',
            v_matrix: false,
            groupList: [...Object.keys(Data)],
            selectedGroup:'',
            classList:[],
            selectedClass:'',
            classImg:'',
            skillList:[]
        }
    }

    componentDidMount = () => {
        if(this.state.selectedGroup == ''){
            this.setState(prevState => {
                var group = prevState.groupList[0]
                var classList = [...Object.keys(Data[group])]
                var selectedClass = classList[0]
                var classImg = Data[group][selectedClass].img
                var skillList = [...Object.keys(Data[group][selectedClass].skill)]

                return {
                    ...prevState,
                    group,
                    classList,
                    selectedClass,
                    classImg,
                    skillList
                }
            })
        }
    }

    render(){
        return <Store.Provider value={this.state}>
            <img src={this.state.classImg}/>
        </Store.Provider>
    }
}

ReactDOM.render(<App />,document.getElementById('mapleCC'))