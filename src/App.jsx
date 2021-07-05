import React from 'react'
import ReactDOM from 'react-dom'
import Store from './contexts/Store'
import Data from './datas/data'

class App extends React.Component {
    render(){
        return <Store.Provider value={this.state}>
            {Data['아니마']['라라'].list}
        </Store.Provider>
    }
}

ReactDOM.render(<App />,document.getElementById('mapleCC'))