import React, { useContext, useEffect, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import '../../assets/stylesheets/css.css'

import * as FileExpIcons from '../../assets/images/FileExplorer/indexFileExp'

const GeoTagView = () => {
  const { token, siteId } = useContext(SharedVariableContext)
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
      let dataFiles2 = []
      let folders = []
      let i = 0

      let foldersData = []
      let filesData = []

      const dataResponse = await fetch("http://localhost:3002/display-ff", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'siteId': siteId
        }
      })
      const data = await dataResponse.json()
      dataFiles = data.value

      dataFiles.forEach(file => {
        if (file.fields.ContentType == "Folder" && !file.webUrl.includes("_layouts")) {
          const folderData = {
            id: getValueInsideBraces(file.eTag),
            name: file.fields.FileLeafRef,
            url: file.webUrl
          }
          foldersData.push(folderData)

          console.log("--------Folder--------")
          console.log("Folder ID:", getValueInsideBraces(file.eTag))
          console.log("Folder name:", file.fields.FileLeafRef)
          console.log("Folder url:", file.webUrl)
          folders.push('/' + file.fields.FileLeafRef + '/')

        } else if (file.fields.ContentType == "Document") {
          let fileData = {
            id: "",
            name: "",
            downloadurl: "",
            previewurl: "",
            icon: "",
            labels: ""
          }
          console.log("---------File---------")
          console.log("File ID:", getValueInsideBraces(file.eTag))
          console.log("File name:", file.fields.FileLeafRef)
          let newUrl = "/sites/Test1/Shared%20Documents/" + encodeURIComponent(file.fields.FileLeafRef.trim())
          console.log(newUrl)
          let previewUrl = "https://geosyscommt.sharepoint.com/sites/Test1/Shared%20Documents/Forms/AllItems.aspx?id=" + newUrl + "&parent=/sites/Test1/Shared%20Documents"
          console.log("File preview url:", previewUrl)
          console.log("File download url:", file.webUrl)
          console.log("File extension:", file.fields.DocIcon)

          if (file.fields.Taxonomy != null) {
            dataFiles2 = file.fields.Taxonomy
            dataFiles2.forEach(file2 => {
              console.log("File label:", file2.Label)

            })
          }
          fileData = {
            id: getValueInsideBraces(file.eTag),
            name: file.fields.FileLeafRef,
            downloadurl: file.webUrl,
            previewurl: previewUrl,
            icon: file.fields.DocIcon,
            labels: file.fields.TaxKeyword ? file.fields.TaxKeyword.map(file2 => file2.Label) : []
          }
          filesData.push(fileData)
        }
        i++
        console.log("")
      });
      console.log(folders)
      console.log("number of files: " + i)

      setFolders(foldersData)
      setFiles(filesData)
    }
    getData()
  }, [])

  return (
    <div className='body'>
      <List className='scrollableList'>
        {folders.map((folder) => (
          <ListItem secondaryAction={
            <Tooltip title="Open Folder" disableInteractive>
              <IconButton edge="end" aria-label="See" onClick={() => window.open(folder.url, '_blank')}>
                <img src={FileExpIcons.OpenIcon} />
              </IconButton>
            </Tooltip>
          } key={folder.id}>

            <ListItemIcon style={{ marginRight: '-20px', marginLeft: '-10px' }}>
              <img src={FileExpIcons.FolderIcon} />
            </ListItemIcon>

            <Tooltip title={folder.name} placement="bottom-start" disableInteractive>
              <ListItemText
                primary={<div className="truncate">{folder.name}</div>}
                style={{
                  maxWidth: "210px"
                }}
              />
            </Tooltip>

          </ListItem>
        ))}
        {files.map((file) => (
          <ListItem secondaryAction={
            <div>
              <Tooltip title="Preview File" disableInteractive>
                <IconButton edge="end" aria-label="See" onClick={() => window.open(file.previewurl, '_blank')}>
                  <img src={FileExpIcons.SeeIcon} />
                </IconButton>
              </Tooltip>
              {(file.icon === "dwg" || file.icon === "url") ?
                <Tooltip title="Download File" disableInteractive>
                  <IconButton edge="end" aria-label="download" onClick={() => window.location.href = file.downloadurl}>
                    <img src={FileExpIcons.DownloadIcon} />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title="Open File" disableInteractive>
                  <IconButton edge="end" aria-label="open" onClick={() => window.open(file.downloadurl, '_blank')}>
                    <img src={FileExpIcons.OpenIcon} />
                  </IconButton>
                </Tooltip>
              }
            </div>
          } key={file.id}>

            <ListItemIcon style={{ marginRight: '-20px', marginLeft: '-10px' }}>
              <img src={FileExpIcons.FileIcon} />
            </ListItemIcon>

            <Tooltip title={file.name} placement="bottom-start" disableInteractive>
              <ListItemText
                primary={<div className="truncate">{file.name}</div>}
                style={{
                  maxWidth: "210px"
                }}
              />
            </Tooltip>

          </ListItem>
        ))}
      </List>
    </div>
  )
}


export default GeoTagView
