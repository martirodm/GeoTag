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

import '../../assets/stylesheets/css.css'

import * as FileExpIcons from '../../assets/images/FileExplorer/indexFileExp'

const FileListItem = ({ file }) => {
  const { downloadIcons, imageExtensions, nameTag } = useContext(SharedVariableContext)
  const [seeHovered, setSeeHovered] = useState(false)
  const [openHovered, setOpenHovered] = useState(false)
  const [fileHovered, setFileHovered] = useState(false)
  const [deleteHovered, setDelteHovered] = useState(false)
  const [modalState, setModalState] = useState<'closed' | 'firstModal' | 'successModal' | 'errorModal'>('closed');

  const handleOpen = () => {
    setModalState('firstModal')
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
              e.stopPropagation();
              window.open(file.downloadurl, '_blank')
            }} onMouseEnter={() => setOpenHovered(true)} onMouseLeave={() => setOpenHovered(false)}>
              <img src={openHovered ? FileExpIcons.OpenIconHover : FileExpIcons.OpenIcon} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Delete File" disableInteractive>
          <IconButton edge="end" aria-label="delete" onClick={() => handleOpen()} onMouseEnter={() => setDelteHovered(true)} onMouseLeave={() => setDelteHovered(false)}>
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

              <StyledButton variant="contained" color="success">Yes</StyledButton>
              <StyledButton variant="contained" color="error" onClick={() => setModalState('closed')}>No</StyledButton>
            </>
          )}

          {modalState === 'successModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'whitesmoke' }}>
                The tag has been created succesfully!
              </Typography>
              <StyledButton variant="contained" color="success" onClick={() => setModalState('closed')}>Close</StyledButton>
            </>
          )}

          {modalState === 'errorModal' && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'red' }}>
                The file already has this tag!
              </Typography>
              <StyledButton variant="contained" color="success" onClick={() => setModalState('closed')}>Close</StyledButton>
            </>
          )}
        </Box>
      </Modal>
    </ListItem >
  )
}

const SeeTaggedFilesView = () => {
  const { siteId, nameTag, siteWebUrl, downloadIcons, imageExtensions, cacheFiles, setCacheFiles } = useContext(SharedVariableContext)
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

  useEffect(() => { //For only executing one time
    const getData = async () => {
      let dataFiles = []
      let filesData = []
      let siteUrlName: string
      setLoading(true);
      setErrorMessage(''); // Clear any previous error messages

      try {
        console.log('Fetching data...');
        const dataResponse = await fetch("http://localhost:3002/seeTaggedFiles", {
          headers: {
            'siteId': siteId,
            'nameTag': nameTag
          }
        });

        console.log('Data response:', dataResponse);

        const data = await dataResponse.json();
        console.log('Data:', data);

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
          if (cacheFile.taglabel === nameTag) {

            const dataCacheFileResponse = await fetch("http://localhost:3002/seeDataTaggedFile", {
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
            let CacheFilePreviewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + CacheFilenewUrl + "&parent=" + CacheFilenewUrl2

            let fileData2 = {
              id: dataCacheFile.id,
              name: dataCacheFile.name,
              downloadurl: dataCacheFile.listItem.webUrl,
              previewurl: CacheFilePreviewUrl,
              icon: getFileExtension(dataCacheFile.name),
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

          const dataTaggedFileResponse = await fetch("http://localhost:3002/seeDataTaggedFile", {
            headers: {
              'siteId': siteId,
              'fileId': file.id
            }
          })
          const dataTaggedFile = await dataTaggedFileResponse.json()

          let TaggedFileparsedUrl = new URL(dataTaggedFile.listItem.webUrl)
          let TaggedFilenewUrl = TaggedFileparsedUrl.pathname
          let TaggedFileparts3 = TaggedFilenewUrl.split('/')
          TaggedFileparts3.pop()
          let TaggedFilenewUrl2 = TaggedFileparts3.join('/')
          let previewUrl = siteWebUrl + "/Shared%20Documents/Forms/AllItems.aspx?id=" + TaggedFilenewUrl + "&parent=" + TaggedFilenewUrl2

          let fileData = {
            id: dataTaggedFile.id,
            name: dataTaggedFile.name,
            downloadurl: dataTaggedFile.listItem.webUrl,
            previewurl: previewUrl,
            icon: getFileExtension(dataTaggedFile.name),
          }

          filesData.push(fileData)
        }

        console.log(cacheFiles)
        console.log(filesData)
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
