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

const FolderListItem = ({ folder }) => {
  const [openHovered, setOpenHovered] = useState(false)
  const [folderHovered, setFolderHovered] = useState(false)

  return (
    <ListItem secondaryAction={
      <Tooltip title="Open Folder" disableInteractive>
        <IconButton edge="end" aria-label="Open" onClick={() => window.open(folder.url, '_blank')} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
          <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
        </IconButton>
      </Tooltip>
    }
      onMouseEnter={() => setFolderHovered(true)} onMouseLeave={() => setFolderHovered(false)}
      style={{ backgroundColor: folderHovered ? '#161b22' : 'transparent' }}
      key={folder.id}>

      <ListItemIcon style={{ marginRight: '-20px', marginLeft: '-10px' }}>
        <img src={folderHovered ? FileExpIcons.FolderIconHover : FileExpIcons.FolderIcon} />
      </ListItemIcon>

      <Tooltip title={folder.name} placement="bottom-start" disableInteractive>
        <ListItemText
          primary={<div className="truncate">{folder.name}</div>}
          style={{
            /* color: folderHovered ? '#c8c8c8' : '#f5f5f5', */
            maxWidth: "210px"
          }}
        />
      </Tooltip>
    </ListItem>
  )
}

const FileListItem = ({ file }) => {
  const [seeHovered, setSeeHovered] = useState(false)
  const [openHovered, setOpenHovered] = useState(false)
  const [fileHovered, setFileHovered] = useState(false)

  return (
    <ListItem secondaryAction={
      <div>
        <Tooltip title="Preview File" disableInteractive>
          <IconButton edge="end" aria-label="See" onClick={() => window.open(file.previewurl, '_blank')} onMouseEnter={() => setSeeHovered(true)} onMouseLeave={() => setSeeHovered(false)}>
            <img src={seeHovered ? FileExpIcons.SeeIconHover : FileExpIcons.SeeIcon} />
          </IconButton>
        </Tooltip>

        {(file.icon === "dwg" || file.icon === "url") ?
          <Tooltip title="Download File" disableInteractive>
            <IconButton edge="end" aria-label="download" onClick={() => window.location.href = file.downloadurl} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.DownloadIconHover : FileExpIcons.DownloadIcon} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Open File" disableInteractive>
            <IconButton edge="end" aria-label="open" onClick={() => window.open(file.downloadurl, '_blank')} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
            </IconButton>
          </Tooltip>
        }

      </div>
    }
      onMouseEnter={() => setFileHovered(true)} onMouseLeave={() => setFileHovered(false)}
      style={{ backgroundColor: fileHovered ? '#161b22' : 'transparent' }}
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

const GeoTagView = () => {
  const { token, siteId, siteWebUrl } = useContext(SharedVariableContext)
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  function getValueInsideBraces(str) {
    const match = str.match(/{(.*?)}/);
    if (match) {
      return match[1];
    }
    return null;
  }

  useEffect(() => { //For only executing one time
    const getData = async () => {
      let dataFiles = []
      let foldersData = []
      let filesData = []
      let siteUrlName: string

      const dataResponse = await fetch("http://localhost:3002/display-ff", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'siteId': siteId
        }
      })
      const data = await dataResponse.json()
      dataFiles = data.value

      const parts = siteWebUrl.split("/sites/")
      if (parts.length > 1) {
        siteUrlName = parts[1].split("/")[0]
        console.log(siteUrlName)
      }

      dataFiles.forEach(file => {
        if (file.fields.ContentType == "Folder" && !file.webUrl.includes("_layouts")) {
          const folderData = {
            id: getValueInsideBraces(file.eTag),
            name: file.fields.FileLeafRef,
            url: file.webUrl
          }
          foldersData.push(folderData)

        } else if (file.fields.ContentType == "Document") {
          let newUrl = "/sites/" + siteUrlName + "/Shared%20Documents/" + encodeURIComponent(file.fields.FileLeafRef.trim())
          let previewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + newUrl + "&parent=/sites/" + siteUrlName + "/Shared%20Documents"

          let fileData = {
            id: getValueInsideBraces(file.eTag),
            name: file.fields.FileLeafRef,
            downloadurl: file.webUrl,
            previewurl: previewUrl,
            icon: file.fields.DocIcon,
            labels: file.fields.TaxKeyword ? file.fields.TaxKeyword.map(file2 => file2.Label) : []
          }
          filesData.push(fileData)
        }
      })
      setFolders(foldersData)
      setFiles(filesData)
      setLoading(false);
    }
    getData()
  }, [])

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
    );
  }

  return (
    <div className='body'>
      <List className='scrollableList'>
        {folders.map((folder) => (
          <FolderListItem folder={folder} />
        ))}
        {files.map((file) => (
          <FileListItem file={file} />
        ))}
      </List>
    </div>
  )
}

const SkeletonListItem = () => {
  return (
    <ListItem secondaryAction={
      <IconButton>
        <div style={{ width: 20, height: 20, overflow: 'hidden'}}>
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
