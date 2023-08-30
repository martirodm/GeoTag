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

const FileListItem = ({ file }) => {
  const { downloadIcons, imageExtensions } = useContext(SharedVariableContext)
  const [seeHovered, setSeeHovered] = useState(false)
  const [openHovered, setOpenHovered] = useState(false)
  const [fileHovered, setFileHovered] = useState(false)
  
  console.log(file.icon)
  return (
    <ListItem secondaryAction={
      <div>
        {downloadIcons.includes(file.icon) ? (
          <Tooltip title="Download File" disableInteractive>
            <IconButton edge="end" aria-label="download" onClick={(e) => {
              e.stopPropagation()
              const tempLink = document.createElement("a")
              tempLink.href = file.dwgdownloadurl
              tempLink.setAttribute("download", "")
              tempLink.setAttribute("target", "_blank")
              document.body.appendChild(tempLink)
              tempLink.click()
              document.body.removeChild(tempLink)

            }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.DownloadIconHover : FileExpIcons.DownloadIcon} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Open File" disableInteractive>
            <IconButton edge="end" aria-label="open" onClick={(e) => {
              e.stopPropagation();
              if (imageExtensions.includes(file.icon)) {
                window.open(file.dwgdownloadurl, '_blank')
              } else {
                window.open(file.downloadurl, '_blank')
              }
            }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
            </IconButton>
          </Tooltip>
        )}

      </div >
    }

      onClick={(e) => {
        e.stopPropagation();
        if (downloadIcons.includes(file.icon) || imageExtensions.includes(file.icon)) {
          window.open(file.dwgpreviewurl, '_blank')
        } else {
          window.open(file.previewurl, '_blank')
        }
      }}
      onMouseEnter={() => setFileHovered(true)} onMouseLeave={() => setFileHovered(false)}
      style={{ backgroundColor: fileHovered ? '#161b22' : 'transparent', cursor: 'pointer' }}
      key={file.id} >

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
    </ListItem >
  )
}

const SeeTaggedFilesView = () => {
  const { siteId, nameTag, siteWebUrl, downloadIcons, imageExtensions } = useContext(SharedVariableContext)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState([])

  function getFileExtension(filename) {
    let parts1 = filename.split('.');
    if (parts1.length === 1) {
      return ''; // No extension found
    }
    return parts1.pop();
  }

  useEffect(() => { //For only executing one time
    const getData = async () => {
      let dataFiles = []
      let filesData = []
      let siteUrlName: string

      setLoading(true)
      try {
        const dataResponse = await fetch("http://localhost:3002/seeTaggedFiles", {
          headers: {
            'siteId': siteId,
            'nameTag': nameTag
          }
        })
        const data = await dataResponse.json()

        if (!dataResponse.ok) {
          throw new Error(data.message || "Unknown error occurred")
        }

        dataFiles = data.value

        const parts2 = siteWebUrl.split("/sites/")
        if (parts2.length > 1) {
          siteUrlName = parts2[1].split("/")[0]
        }

        for (let file of dataFiles) {

          let parsedUrl = new URL(file.webUrl)
          let newUrl = parsedUrl.pathname
          let parts3 = newUrl.split('/')
          parts3.pop()
          let newUrl2 = parts3.join('/')
          let previewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + newUrl + "&parent=" + newUrl2

          interface FileData {
            id: any
            name: any
            downloadurl: any
            previewurl: string
            icon: any
            dwgdownloadurl?: any
            dwgpreviewurl?: any
          }


          let fileData: FileData = {
            id: file.id,
            name: file.name,
            downloadurl: file.webUrl,
            previewurl: previewUrl,
            icon: getFileExtension(file.name),
          }

          if (downloadIcons.includes(getFileExtension(file.name)) || imageExtensions.includes(getFileExtension(file.name)) ) {
            console.log("Name: " + file.name)
            console.log("ID: " + file.id)

            const dataDWGResponse = await fetch("http://localhost:3002/get-DWGfile", {
              headers: {
                'siteId': siteId,
                'fileId': file.id
              }
            })
            const dataDWG = await dataDWGResponse.json()
            console.log(dataDWG)

            let DWGparsedUrl = new URL(dataDWG.listItem.webUrl)
            let DWGnewUrl = DWGparsedUrl.pathname
            let DWGparts3 = DWGnewUrl.split('/')
            DWGparts3.pop()
            let DWGnewUrl2 = DWGparts3.join('/')
            let DWGPreviewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + DWGnewUrl + "&parent=" + DWGnewUrl2

            fileData.dwgdownloadurl = dataDWG.listItem.webUrl
            fileData.dwgpreviewurl = DWGPreviewUrl

          }

          filesData.push(fileData)

        }

        setFiles(filesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
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
    )
  }

  return (
    <div className='body'>
      <List className='scrollableList'>
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


export default SeeTaggedFilesView
