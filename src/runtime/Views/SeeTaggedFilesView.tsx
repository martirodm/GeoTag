import React, { useContext, useEffect, useState } from 'react'
import { Button, styled } from '@mui/material'
import { SharedVariableContext } from '../widgetUI'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import CircularProgress from '@mui/material/CircularProgress'

import '../../assets/stylesheets/css.css'

import * as FileExpIcons from '../../assets/images/FileExplorer/indexFileExp'

const FileListItem = ({ file }) => {
  const { serverIP,downloadIcons, imageExtensions, nameTag, siteId, setFileTags, cacheFiles, setCacheFiles, cacheDelFiles, setCacheDelFiles } = useContext(SharedVariableContext)
  const [seeHovered, setSeeHovered] = useState(false)
  const [openHovered, setOpenHovered] = useState(false)
  const [fileHovered, setFileHovered] = useState(false)
  const [deleteHovered, setDelteHovered] = useState(false)
  const [actualFileTags, setActualFileTags] = useState(false)
  const [modalState, setModalState] = useState<'closed' | 'firstModal' | 'successModal' | 'createColumnModal' | 'errorModal'>('closed');
  const [isLoading, setIsLoading] = useState(false)
  const tag = nameTag, fileTags = file.labels, fileId = file.id

  const handleOpen = () => {
    setModalState('firstModal')
  }

  const handleDel = () => {
    setIsLoading(true)
    if (!(fileTags.map(tag => tag.label.toLowerCase()).includes(tag.toLowerCase()))) {
      setModalState('errorModal')
    } else {
      const delTag = async () => {
        const dataResponse = await fetch("https://"+serverIP+":3002/delTag", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'siteId': siteId
          },
          body: JSON.stringify({
            tag: nameTag,
            fileTags: file.labels,
            fileId: file.id
          })
        })
        const data = await dataResponse.json()
        if (data.label === "columnNotFound") {
          setIsLoading(false)
          setModalState('createColumnModal')
        } else {
          setIsLoading(false)
          if (cacheFiles.some(label => label.taglabel === data.label && label.tagguid == data.termGuid)){
            const cacheFiles2 = cacheFiles.filter(label => !(label.taglabel === data.label && label.tagguid === data.termGuid))
            setCacheFiles(cacheFiles2)
          }
          console.log(cacheFiles)
          console.log(data)
          setModalState('successModal')
        }
      }
      delTag()
    }
  }

  const StyledButton = styled(Button)({
    marginRight: '7px',
    marginLeft: '7px',
    marginTop: '10px',
  })

  const style = {
    color: 'whitesmoke',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#23272f',
    border: '2px solid #23272f',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  }

  return (
    <ListItem secondaryAction={
      <div>
        {downloadIcons.includes(file.icon) ? (
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
        ) : (
          <Tooltip title="Open File" disableInteractive>
            <IconButton edge="end" aria-label="open" onClick={(e) => {
              e.stopPropagation()
              window.open(file.downloadurl, '_blank')
            }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Delete Tag" disableInteractive>
          <IconButton edge="end" aria-label="delete" onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }} onMouseEnter={() => setDelteHovered(true)} onMouseLeave={() => setDelteHovered(false)}>
            <img src={deleteHovered ? FileExpIcons.DeleteIconHover : FileExpIcons.DeleteIcon} />
          </IconButton>
        </Tooltip>
      </div >
    }

      onClick={(e) => {
        e.stopPropagation();
        window.open(file.previewurl, '_blank')
      }}
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
            maxWidth: "210px"
          }}
        />
      </Tooltip>

      <Modal
        open={modalState !== 'closed'}
        onClose={() => setModalState('closed')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {modalState === 'firstModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'whitesmoke' }}>
                Warning
              </Typography>
              <Typography className='truncateTag' id="modal-modal-description" sx={{ mt: 2, whiteSpace: 'normal' }}>  {/* whiteSpace is for breaking to a new line if I have an ellipsis*/}
                Do you want to delete the tag <span style={{ color: '#b0b0b0' }}><strong>{nameTag}</strong></span> from the file <span style={{ color: '#b0b0b0' }}><strong>{file.name}</strong></span>?
              </Typography>
              {isLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                <>
                  <StyledButton variant="contained" color="success" onClick={(e) => { e.stopPropagation(), handleDel() }}>Yes</StyledButton>
                  <StyledButton variant="contained" color="error" onClick={(e) => { e.stopPropagation(), setModalState('closed') }}>No</StyledButton>
                </>
              )}
            </>
          )}

          {modalState === 'successModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'whitesmoke' }}>
                The tag has been deleted succesfully!
              </Typography>
              <StyledButton variant="contained" color="success" onClick={(e) => { e.stopPropagation(), setModalState('closed') }}>Close</StyledButton>
            </>
          )}

          {modalState === 'createColumnModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'yellow' }}>
                Create a "Managed Metadata" column on SharePoint called "GeoTag"
              </Typography>
              <Typography id="modal-modal-title" variant="body2" component="h2" sx={{ color: 'yellow' }}>
                If unsure, please check the documentation
              </Typography>
              <StyledButton variant="contained" color="success" onClick={() => setModalState('closed')}>Close</StyledButton>
            </>
          )}

          {modalState === 'errorModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'red' }}>
                You already deleted this tag!
              </Typography>
              <StyledButton variant="contained" color="success" onClick={(e) => { e.stopPropagation(), setModalState('closed') }}>Close</StyledButton>
            </>
          )}
        </Box>
      </Modal>
    </ListItem >
  )
}

const SeeTaggedFilesView = () => {
  const { serverIP,siteId, nameTag, siteWebUrl, downloadIcons, imageExtensions, cacheFiles, setCacheFiles } = useContext(SharedVariableContext)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  function getFileExtension(filename) {
    let parts1 = filename.split('.');
    if (parts1.length === 1) {
      return ''; // No extension found
    }
    return parts1.pop();
  }

  function getValueInsideBraces(str) {
    const match = str.match(/{(.*?)}/)
    if (match) {
      return match[1]
    }
    return null
  }

  function encodeURL(url) {
    // Encode special characters
    return url.replace(/#/g, '%23').replace(/&/g, '%26').replace(/=/g, '%3D').replace(/\+/g, '%2B');
  }


  useEffect(() => { //For only executing one time
    const getData = async () => {
      let dataFiles = []
      let filesData = []
      let siteUrlName: string
      setLoading(true);
      setErrorMessage(''); // Clear any previous error messages

      try {
        const dataResponse = await fetch("https://"+serverIP+":3002/seeTaggedFiles", {
          headers: {
            'siteId': siteId,
            'nameTag': nameTag
          }
        });

        const data = await dataResponse.json();

        if (!dataResponse.ok) {
          const errorMessage = 'The tag does not exist.';
          setErrorMessage(errorMessage); // Set the error message.
          throw new Error(errorMessage);
        }

        dataFiles = data.value

        const parts2 = siteWebUrl.split("/sites/")
        if (parts2.length > 1) {
          siteUrlName = parts2[1].split("/")[0]
        }
        
        //FILES THAT HAVE BEEN JUST CREATED ON SAME SESSION
        for (let cacheFile of cacheFiles) {
          console.log(cacheFile.taglabel)
          console.log(nameTag.toLowerCase())
          if (cacheFile.taglabel.toLowerCase() === nameTag.toLowerCase()) {
            console.log("GG")

            const dataCacheFileResponse = await fetch("https://"+serverIP+":3002/seeDataTaggedFile", {
              headers: {
                'siteId': siteId,
                'fileId': cacheFile.fileid
              }
            })
            const dataCacheFile = await dataCacheFileResponse.json()

            let CacheFileparsedUrl = new URL(dataCacheFile.listItem.webUrl)
            let CacheFilenewUrl = CacheFileparsedUrl.pathname
            let CacheFileparts3 = CacheFilenewUrl.split('/')
            CacheFileparts3.pop()
            let CacheFilenewUrl2 = CacheFileparts3.join('/')

            const encodedCacheFilenewUrl = encodeURL(CacheFilenewUrl);
            const encodedCacheFilenewUrl2 = encodeURL(CacheFilenewUrl2);

            let CacheFilePreviewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + encodedCacheFilenewUrl + "&parent=" + encodedCacheFilenewUrl2;

            let fileData2 = {
              id: getValueInsideBraces(dataCacheFile.eTag),
              name: dataCacheFile.name,
              downloadurl: dataCacheFile.listItem.webUrl,
              previewurl: CacheFilePreviewUrl,
              icon: getFileExtension(dataCacheFile.name),
              labels: dataCacheFile.listItem.fields.GeoTag ? dataCacheFile.listItem.fields.GeoTag.map(file2 => ({ label: file2.Label, termGuid: file2.TermGuid })) : []
            }

            filesData.push(fileData2)
          }
        }

        for (let file of dataFiles) {

          //If file already exists on filesData && cacheFiles, delete it from there to avoid duplications
          if (filesData.some(fileDataItem => fileDataItem.name === file.name)) {
            filesData = filesData.filter(fileDataItem => fileDataItem.name !== file.name)
            const cacheFiles2 = cacheFiles.filter(item => item.filename !== file.name)
            setCacheFiles(cacheFiles2)
          }

          const dataTaggedFileResponse = await fetch("https://"+serverIP+":3002/seeDataTaggedFile", {
            headers: {
              'siteId': siteId,
              'fileId': file.id
            }
          })
          const dataTaggedFile = await dataTaggedFileResponse.json()
          console.log(dataTaggedFile)

          let TaggedFileparsedUrl = new URL(dataTaggedFile.listItem.webUrl)
          let TaggedFilenewUrl = TaggedFileparsedUrl.pathname
          let TaggedFileparts3 = TaggedFilenewUrl.split('/')
          TaggedFileparts3.pop()
          let TaggedFilenewUrl2 = TaggedFileparts3.join('/')

          const encodedTaggedFilenewUrl = encodeURL(TaggedFilenewUrl);
          const encodedTaggedFilenewUrl2 = encodeURL(TaggedFilenewUrl2);

          let previewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + encodedTaggedFilenewUrl + "&parent=" + encodedTaggedFilenewUrl2;

          let fileData = {
            id: getValueInsideBraces(dataTaggedFile.eTag),
            name: dataTaggedFile.name,
            downloadurl: dataTaggedFile.listItem.webUrl,
            previewurl: previewUrl,
            icon: getFileExtension(dataTaggedFile.name),
            labels: dataTaggedFile.listItem.fields.GeoTag ? dataTaggedFile.listItem.fields.GeoTag.map(file2 => ({ label: file2.Label, termGuid: file2.TermGuid })) : []
          }
          filesData.push(fileData)
        }

        setFiles(filesData)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  if (loading) {
    return (
      <div className='body'>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>  // If I have an error (don't enter a valid tag).
      ) : (
        <List className='scrollableList'>
          {files.map((file) => (
            <FileListItem file={file} />
          ))}
        </List>
      )}
    </div>
  )
}

const SkeletonListItem = () => {
  return (
    <ListItem secondaryAction={
      <>
        <IconButton>
          <div style={{ width: 20, height: 20, overflow: 'hidden', marginRight: '-12px', marginTop: '-10px' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" style={{ backgroundColor: '#c8c8c8' }} />
          </div>
        </IconButton>
        <IconButton>
          <div style={{ width: 20, height: 20, overflow: 'hidden', marginRight: '-20px', marginTop: '-10px' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" style={{ backgroundColor: '#c8c8c8' }} />
          </div>
        </IconButton>
      </>
    }>
      <ListItemIcon>
        <div style={{ width: 20, height: 20, overflow: 'hidden', marginRight: '-60px', marginLeft: '-8px', marginTop: '-5px' }}>
          <Skeleton variant="circular" width="100%" height="100%" style={{ backgroundColor: '#c8c8c8' }} />
        </div>
      </ListItemIcon>
      <ListItemText
        primary={<Skeleton variant="text" width="60%" style={{ backgroundColor: '#c8c8c8', marginLeft: '-25px', marginTop: '-5px' }} />}
      />
    </ListItem>
  )
}

export default SeeTaggedFilesView
