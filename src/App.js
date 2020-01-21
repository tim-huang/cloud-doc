import React, {useState} from 'react';
import SimpleMDE from 'react-simplemde-editor'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import './App.css';
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn';
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons'
import TabList from './components/TabList';
import uuidv4 from 'uuid/v4'
import {flattenArr, objToArr} from './utils/helper'
import fileHelper from './utils/fileHelper'

// require nodejs modules
const path = window.require('path')
const {remote} = window.require('electron')
const Store = window.require('electron-store')

const fileStore = new Store({'name' : 'Files Data'})

const saveFilesToStore = (files) => {
  // wo don't have to store any info in file system, eg : isNew, body, etc.
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const {id, path, title, createdAt } = file
    result[id] = { id, path, title, createdAt}
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFileID] = useState(null)
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedKeyword, setSearchedKeyword] = useState('')

  const openedFiles = openedFileIDs.map(id => files[id])
  const activeFile = files[activeFileID]
  // console.log(objToArr(files))
  const searchedFiles = objToArr(files).filter(file => file.title.includes(searchedKeyword))

  const savedLocation = remote.app.getPath('documents');
  const fileClick = (fileId) => {
    setActiveFileID(fileId)
    const currentFile = files[fileId] 
    if(!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(
        (data) => {
          const newFile = {...files[fileId], body : data, isLoaded : true}
          setFiles({...files, [fileId]: newFile})
          ! openedFileIDs.includes(fileId) && setOpenedFileIDs([...openedFileIDs, fileId])
        },
        (reason) => {
          console.log(reason)
        })
    } else {
      ! openedFileIDs.includes(fileId) && setOpenedFileIDs([...openedFileIDs, fileId])
    }
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
    const { [id]: file, ...afterDelete } = files
    // const file = files[id];
    if(!file.isNew) {
      fileHelper.deleteFile(files[id].path).then(() => {
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        // close tab opened
        tabClose(id)
      })
    } else {
      setFiles(afterDelete)
    }
  }

  const updateFileName = (id, title) => {
    const newPath = path.join(savedLocation, `${title}.md`);
    const modifiedFile = {...files[id], title : title, path : newPath}
    const newFiles = {...files, [id] : modifiedFile}
    if(modifiedFile.isNew) {
      fileHelper.writeFile(newPath, modifiedFile.body).then(() => {
        modifiedFile.isNew = false
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      fileHelper.renameFile(
        files[id].path, newPath).then(() => {
          setFiles(newFiles) 
          saveFilesToStore(newFiles)
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

  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title : '选择导入的 Markdown 文件',
      properties : ['openFile', 'multiSelections'],
      filters : [
        {name : 'Markdown files', extensions : ['md']}
      ]
    }).then(({canceled, filePaths}) => {
      if(!canceled) {
        // filter out the path we already have in files
        const arr = Object.values(files).map(file => file.path)
        const importFilesArr = filePaths.filter(p => !arr.includes(p)).map(p => ({
          id : uuidv4(),
          title : path.basename(p, path.extname(p)),
          path : p
        }))

        if(importFilesArr.length) {
          const newFiles = {...files, ...flattenArr(importFilesArr)}
          setFiles(newFiles)
          saveFilesToStore(newFiles)
          remote.dialog.showMessageBox({
            type : 'info',
            title : `成功导入了${importFilesArr.length}个文件`,
            message : `成功导入了${importFilesArr.length}个文件`
          })
        }
      }
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
                onBtnClick={importFiles} className="col">
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
