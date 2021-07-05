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
            skillList:[]
        }
    }

    componentDidMount = () => {
        if(this.state.selectedGroup == ''){
            this.setState(prevState => {
                var group = prevState.groupList[0]
                var classList = [...Object.keys(Data[group])]
                var selectedClass = classList[0]
                var skillList = Data[group][selectedClass].list

                return {
                    ...prevState,
                    group,
                    classList,
                    selectedClass,
                    skillList
                }
            })
        }
    }

    render(){
        return <Store.Provider value={this.state}>
            {this.state.skillList}
        </Store.Provider>
    }
}

ReactDOM.render(<App />,document.getElementById('mapleCC'))