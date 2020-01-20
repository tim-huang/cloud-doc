import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col bg-light letf-panel">
          <FileSearch 
            title="My Documents" 
            onFileSearch={(value) => {console.log(value)}}></FileSearch>

          <FileList files={defaultFiles} 
            onFileClick = {(id) => console.log('click', id)}
            onFileDelete = {(id) => console.log('delete', id)}
            onSaveEdit = {(id,value) => console.log('save', id, value)}
          ></FileList>
        </div>
        <div className="col bg-primary right-panel">
          <h1>this is the right</h1>
        </div>
      </div>


    </div>
  );
}

export default App;
