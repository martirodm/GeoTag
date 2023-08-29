import React, { useContext, useEffect, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import '../../assets/stylesheets/css.css'

import * as FileExpIcons from '../../assets/images/FileExplorer/indexFileExp'

const FolderListItem = ({ folder, setSelectedFolderId, setSelectedFolderName }) => {
  const { setFolderId } = useContext(SharedVariableContext)
  const [openHovered, setOpenHovered] = useState(false)
  const [folderHovered, setFolderHovered] = useState(false)

  return (
    <ListItem secondaryAction={
      <Tooltip title="Open Folder" disableInteractive>
        <IconButton edge="end" aria-label="Open" onClick={(e) => { e.stopPropagation(); window.open(folder.url, '_blank') }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
          <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
        </IconButton>
      </Tooltip>
    }
      onClick={() => { setFolderId(folder.id), setSelectedFolderId(folder.id), setSelectedFolderName(folder.name) }}
      onMouseEnter={() => setFolderHovered(true)} onMouseLeave={() => setFolderHovered(false)}
      style={{ backgroundColor: folderHovered ? '#161b22' : 'transparent', cursor: 'pointer' }}
      key={folder.id}>

      <ListItemIcon style={{ marginRight: '-20px', marginLeft: '-10px' }}>
        <img src={folderHovered ? FileExpIcons.FolderIconHover : FileExpIcons.FolderIcon} />
      </ListItemIcon>

      <Tooltip title={folder.name} placement="bottom-start" disableInteractive>
        <ListItemText
          primary={<div className="truncate">{folder.name}</div>}
        />
      </Tooltip>
    </ListItem>
  )
}

const FileListItem = ({ file, setView, setPrevView }) => {
  const { setFileId, setFileName, setFileTags } = useContext(SharedVariableContext)
  const [seeHovered, setSeeHovered] = useState(false)
  const [openHovered, setOpenHovered] = useState(false)
  const [fileHovered, setFileHovered] = useState(false)
  const downloadIcons = ["dwg", "url", "xlsx", "pptx", "vsdx", "docx", "zip", "csv"]

  return (
    <ListItem secondaryAction={
      <div>
        <Tooltip title="Preview File" disableInteractive>
          <IconButton edge="end" aria-label="See" onClick={(e) => { e.stopPropagation(); window.open(file.previewurl, '_blank') }} onMouseEnter={() => setSeeHovered(true)} onMouseLeave={() => setSeeHovered(false)}>
            <img src={seeHovered ? FileExpIcons.SeeIconHover : FileExpIcons.SeeIcon} />
          </IconButton>
        </Tooltip>

        {(downloadIcons.includes(file.icon)) ?
          <Tooltip title="Download File" disableInteractive>
            <IconButton edge="end" aria-label="download" onClick={(e) => {
              e.stopPropagation()
              const tempLink = document.createElement("a")
              tempLink.href = file.downloadurl
              tempLink.setAttribute("download", "")
              tempLink.setAttribute("target", "_blank")
              document.body.appendChild(tempLink)
              tempLink.click()
              document.body.removeChild(tempLink)

            }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.DownloadIconHover : FileExpIcons.DownloadIcon} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Open File" disableInteractive>
            <IconButton edge="end" aria-label="open" onClick={(e) => { e.stopPropagation(); window.open(file.downloadurl, '_blank') }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
            </IconButton>
          </Tooltip>
        }

      </div>
    }
      onClick={() => { setFileId(file.id), setFileName(file.name), setFileTags(file.labels), setPrevView('geoTag'); setView('addTag') }}
      onMouseEnter={() => setFileHovered(true)} onMouseLeave={() => setFileHovered(false)}
      style={{ backgroundColor: fileHovered ? '#161b22' : 'transparent', cursor: 'pointer' }}
      key={file.id}>

      <ListItemIcon style={{ marginRight: '-20px', marginLeft: '-10px' }}>
        <img src={fileHovered ? FileExpIcons.FileIconHover : FileExpIcons.FileIcon} />
      </ListItemIcon>

      <Tooltip title={file.name} placement="bottom-start" disableInteractive>
        <ListItemText
          primary={<div className="truncate">{file.name}</div>}
          style={{
            /* color: fileHovered ? '#c8c8c8' : '#f5f5f5', */
            maxWidth: "210px"
          }}
        />
      </Tooltip>
    </ListItem>
  )
}

const GeoTagView = ({ setView, setPrevView }) => {
  const { token, siteId, siteWebUrl, folderFinalId, setFolderFinalId, folderId, setFolderId } = useContext(SharedVariableContext)
  const [loading, setLoading] = useState(true)
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [selectedFolderName, setSelectedFolderName] = useState(null)
  const [, forceUpdate] = useState(0)
  const [historyFolders, setHistoryFolders] = useState([])
  const [isFolderEmpty, setIsFolderEmpty] = useState(false);

  if (!(token && siteId)) {
    return (
      <div className="no-credentials">Please add credentials.</div>
    )
  }

  function getValueInsideBraces(str) {
    const match = str.match(/{(.*?)}/)
    if (match) {
      return match[1]
    }
    return null
  }

  useEffect(() => { //For only executing one time
    const getData = async () => {
      let dataFiles = []
      let foldersData = []
      let filesData = []
      let siteUrlName: string

      setLoading(true)


      //console.log("final id: "+folderFinalId);
      //console.log("id: "+folderId);
      if (folderFinalId) {
        setSelectedFolderId(folderFinalId)
        setFolderId(null)
      }

      if (selectedFolderId) {
        setHistoryFolders(prev => {
          // Check if the folder is already in the history.
          const existingIndex = prev.findIndex(folder => folder.id === selectedFolderId)

          // If found, slice the array to that point; otherwise, add to the history.
          return existingIndex !== -1 ? prev.slice(0, existingIndex + 1) : [...prev, { id: selectedFolderId, name: selectedFolderName }]
        })
      }

      const dataResponse = await fetch("http://localhost:3002/display-ff", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'siteId': siteId,
          'folderId': selectedFolderId
        }
      })
      const data = await dataResponse.json()
      dataFiles = data.value

      const parts = siteWebUrl.split("/sites/")
      if (parts.length > 1) {
        siteUrlName = parts[1].split("/")[0]
      }

      dataFiles.forEach(file => {
        if (file.listItem.fields.ContentType == "Folder" && file.package?.type != "oneNote") {
          const folderData = {
            id: getValueInsideBraces(file.eTag),
            name: file.listItem.fields.FileLeafRef,
            url: file.listItem.webUrl
          }
          foldersData.push(folderData)

        } else if (file.listItem.fields.ContentType == "Document") {
          let parsedUrl = new URL(file.listItem.webUrl)
          let newUrl = parsedUrl.pathname
          let parts = newUrl.split('/')
          parts.pop()
          let newUrl2 = parts.join('/')
          let previewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + newUrl + "&parent=" + newUrl2
          let fileData = {
            id: getValueInsideBraces(file.eTag),
            name: file.listItem.fields.FileLeafRef,
            downloadurl: file.listItem.webUrl,
            previewurl: previewUrl,
            icon: file.listItem.fields.DocIcon,
            labels: file.listItem.fields.GeoTag ? file.listItem.fields.GeoTag.map(file2 => ({ label: file2.Label, termGuid: file2.TermGuid })) : []
          }
          filesData.push(fileData)
        }
      })

      setFolders(foldersData)
      setFiles(filesData)
      setFolderFinalId(null)
      forceUpdate(n => n + 1)
      setLoading(false)

      // Check if foldersData array contains files and folders inside.
      if (foldersData.length === 0 && filesData.length == 0) {
        setIsFolderEmpty(true)
      } else {
        setIsFolderEmpty(false)
      }
    }
    getData()
  }, [selectedFolderId]) //If selectedFolderId changes execute useEffect again

  const jumpToFolder = (index) => {
    const folder = historyFolders[index]
    setSelectedFolderId(folder.id) // Trigger fetching the folder's content
    setHistoryFolders(prev => prev.slice(0, index + 1)) // Update the breadcrumb path
  }

  const goToHome = () => {
    setSelectedFolderId(null); // Or whatever represents the top level in your system
    setHistoryFolders([]);     // Reset the breadcrumb history
  };

  if (loading) {
    return (
      <div className='body'>
        <List className='scrollableList'>
          {/* Example: Assuming you want 5 folder skeletons and 5 file skeletons */}
          {[...Array(5)].map((_, index) => (
            <SkeletonListItem key={`folder-skeleton-${index}`} />
          ))}
          {[...Array(5)].map((_, index) => (
            <SkeletonListItem key={`file-skeleton-${index}`} />
          ))}
        </List>
      </div>
    )
  }

  return (
    <div className='body'>
      <div className="breadcrumbs">
        {(selectedFolderId || historyFolders.length > 0) && (
          <>
            <button onClick={goToHome}>Home</button> /
          </>
        )}
        {historyFolders.map((folder, index) => (
          <span key={folder.id}>
            <button
              onClick={() => jumpToFolder(index)}
              style={index === historyFolders.length - 1 ? { color: '#f5f5f5' } : {}}
            >
              {folder.name}
            </button>
            {index < historyFolders.length - 1 && ' / '}
          </span>
        ))}
      </div>

      <List className='scrollableList'>
        {/* Display message if folder is empty */}
        {isFolderEmpty && (
          <div className="empty-folder-message">This folder is empty.</div>
        )}

        {folders.map((folder) => (
          <FolderListItem folder={folder} setSelectedFolderId={setSelectedFolderId} setSelectedFolderName={setSelectedFolderName} />
        ))}
        {files.map((file) => (
          <FileListItem file={file} setView={setView} setPrevView={setPrevView} />
        ))}
      </List>
    </div>
  )
}

const SkeletonListItem = () => {
  return (
    <ListItem secondaryAction={
      <IconButton>
        <div style={{ width: 20, height: 20, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" width="100%" height="100%" style={{ backgroundColor: '#c8c8c8' }} />
        </div>
      </IconButton>
    }>
      <ListItemIcon>
        <div style={{ width: 20, height: 20, overflow: 'hidden', marginRight: '-60px', marginLeft: '-8px' }}>
          <Skeleton variant="circular" width="100%" height="100%" style={{ backgroundColor: '#c8c8c8' }} />
        </div>
      </ListItemIcon>
      <ListItemText
        primary={<Skeleton variant="text" width="60%" style={{ backgroundColor: '#c8c8c8', marginLeft: '-25px' }} />}
      />
    </ListItem>
  )
}


export default GeoTagView
