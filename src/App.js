import React, {useState} from 'react';
import SimpleMDE from 'react-simplemde-editor'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import './App.css';
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn';
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons'
import TabList from './components/TabList';
import uuidv4 from 'uuid/v4'
import {flattenArr, objToArr} from './utils/helper'
import fileHelper from './utils/fileHelper'

const path = window.require('path')
const {remote} = window.require('electron')

function App() {
  const [files, setFiles] = useState(flattenArr(defaultFiles))
  const [activeFileID, setActiveFileID] = useState(null)
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedKeyword, setSearchedKeyword] = useState('')

  const openedFiles = openedFileIDs.map(id => files[id])
  const activeFile = files[activeFileID]
  const searchedFiles = objToArr(files).filter(file => file.title.includes(searchedKeyword))

  const savedLocation = remote.app.getPath('documents');
  const fileClick = (fileId) => {
    setActiveFileID(fileId)
    ! openedFileIDs.includes(fileId) && setOpenedFileIDs([...openedFileIDs, fileId])
  }

  const tabClick = (fileId) => setActiveFileID(fileId)

  const tabClose = (fileId) => {
    const opened = openedFileIDs.filter(id => id !== fileId)
    setOpenedFileIDs(opened)

    setActiveFileID(opened.length ? opened[0] : null)
  }

  const fileChange = (id, value) => {
    const file = {...files[id], body : value}
    setFiles({...files, [id] : file})
    // update unsavedIDs
    ! unsavedFileIDs.includes(id) && setUnsavedFileIDs([...unsavedFileIDs, id])
  }

  const fileDelete = (id) => {
    fileHelper.deleteFile(path.join(savedLocation, `${files[id].title}.md`)).then(() => {
      const newFiles = {...files}
      delete newFiles[id]
      setFiles(newFiles)
      // close tab opened
      tabClose(id)
    })
  }

  const updateFileName = (id, title) => {
    const file = {...files[id], title : title}
    if(file.isNew) {
      fileHelper.writeFile(path.join(savedLocation, `${file.title}.md`), file.body).then(() => {
        delete file.isNew
        setFiles({...files, [id] : file}) 
      })
    } else {
      fileHelper.renameFile(
        path.join(savedLocation, `${files[id].title}.md`),
        path.join(savedLocation, `${file.title}.md`)).then(() => {
          setFiles({...files, [id] : file}) 
        })
    }
  }

  const fileSearch = (keyword) => {
    setSearchedKeyword(keyword)
  }

  const createNewFile = () => {
    const newId = uuidv4()
    const file =  {
      id : newId,
      title : '',
      body : '# Please input Markdown',
      isNew : true,
      createdAt : new Date().getTime()
    }
    setFiles({...files, [newId] : file})
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(
      path.join(savedLocation, `${activeFile.title}.md`), 
      activeFile.body
    ).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFileID))
    })
  }
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light letf-panel">
          <FileSearch 
            title="My Documents" 
            onFileSearch={fileSearch}></FileSearch>

          <FileList files={searchedFiles} 
            onFileClick = {fileClick}
            onFileDelete = {fileDelete}
            onSaveEdit = {updateFileName}
          ></FileList>
          <div className="row no-gutters bottom-btn">
            <div className="col">
              <BottomBtn
                icon={faPlus}
                text="新建"
                colorClass="btn-primary"
                onBtnClick={createNewFile} className="col">
              </BottomBtn>
            </div>
            <div className="col">
              <BottomBtn
                icon={faFileImport}
                text="导入"
                colorClass="btn-success"
                onBtnClick={() => console.log('click 2')} className="col">
              </BottomBtn>
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFileID && 
            <div className ="start-page">
              选择或者创建新的 Markdown 文件
            </div>
          }
          { activeFileID &&
            <>
              <TabList 
                files={openedFiles}
                onClickTab={tabClick}
                onCloseTab={tabClose}
                activeId={activeFileID}
                unsavedIds={unsavedFileIDs}
              >

              </TabList>
              <SimpleMDE
                key={activeFileID}
                value={activeFile && activeFile.body}
                onChange={(value) => fileChange(activeFile.id, value)}
                options={{
                  minHeight : '515px'
                }}
              ></SimpleMDE>
              {/* <div className="row"> */}
                <BottomBtn
                  icon={faSave}
                  text="保存"
                  colorClass="btn-success"
                  onBtnClick={saveCurrentFile} >
                </BottomBtn>
              {/* </div> */}
            </>
          }
        </div>
      </div>


    </div>
  );
}

export default App;
