import React, { useState, createContext, useContext } from 'react'
//import { DataSourceComponent } from 'jimu-core'
import { Spacer } from '@nextui-org/react'
import '../assets/stylesheets/css.css'
import '../assets/stylesheets/warning.css'

import * as BlackIcons from '../assets/images/Black/indexBlack'
import * as WhiteIcons from '../assets/images/White/indexWhite'
import * as HoverIcons from '../assets/images/Hover/indexHover'
import InsertDataSource from '../assets/images/InsertDataSource.svg'
//---------------------Views---------------------------------
import HomeView from './Views/HomeView'                       //Main View
import SeeFilesView from './Views/SeeFilesView'               //Main View
import GeoTagView from './Views/GeoTagView'                   //Main View
import SettingsView from './Views/SettingsView'               //Main View
import AppCredentialsView from './Views/AppCredentialsView'   //SubView of Home
import SiteNameView from './Views/SiteNameView'               //SubView of Home
import SeeTaggedFilesView from './Views/SeeTaggedFilesView'   //SubView of SeeFiles
import AddTagView from './Views/AddTagView'                   //SubView of GeoTag
//------------------------------------------------------------

export const SharedVariableContext = createContext(null);

const DataSourceRenderer = ({ configured, useDataSource, query, widgetId, dataRender, useMapWidgetIds }) => {
  const [view, setView] = useState('home')
  const [title, setTitle] = useState('Home')
  const [prevView, setPrevView] = useState(null)
  const [goBackHovered, setGoBackHovered] = useState(false)
  const [homeHovered, setHomeHovered] = useState(false)
  const [seeFilesHovered, setSeeFilesHovered] = useState(false)
  const [geoTagHovered, setGeoTagHovered] = useState(false)
  const [settingsHovered, setSettingsHovered] = useState(false)

  // --------------- Shared Variables ---------------------------
  const [credentials, setCredentials] = useState({
    client_id: '',
    client_secret: '',
    tenant_id: '',
  })
  const [siteName, setSiteName] = useState({ site_name: '' })
  const [token, setToken] = useState(null)
  const [siteId, setSiteId] = useState(null)
  const [siteWebUrl, setSiteWebUrl] = useState(null)
  const [folderId, setFolderId] = useState(null)
  const [folderFinalId, setFolderFinalId] = useState(null)
  const [fileId, setFileId] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileTags, setFileTags] = useState(null)
  const [nameTag, setNameTag] = useState(null)
  const [cacheFiles, setCacheFiles] = useState([])
  const [downloadIcons] = useState(["dwg", "url", "xlsx", "pptx", "vsdx", "docx", "zip", "csv"])
  const [imageExtensions] = useState(["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "ico", "svg", "webp"])

  // ----------------------------------------------------------

  if (view === prevView) {
    setPrevView(null)
  }

  // If the date source is not configured, add an image with instructions.
  if (!configured) {
    return (
      <div className="InsertDataSource">
        <div className="titleWarning">GeoTag</div>
        <div className="subtitleWarning">Please Insert Data Source</div>
        <div className="imageContainer">
          <img src={InsertDataSource} />
        </div>
      </div>
    )
  }

  return (
    <div className="widget-use-feature-layer">
      <div className="container">
        <h3>{title}</h3>
        <div className='goBack'>
          {prevView &&
            <button className='ButtonGoBack' onMouseOver={() => setGoBackHovered(true)} onMouseOut={() => setGoBackHovered(false)} onClick={() => { if (prevView == 'geoTag') { setFolderFinalId(folderId) } setView(prevView); setGoBackHovered(false); }}>
              <img src={String(goBackHovered ? HoverIcons.GoBackIconHover : WhiteIcons.GoBackIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
        </div>
        <div className="left-bar">
          {view === 'home' || view === 'appCredentials' || view === 'siteName'
            ? <button className='ButtonSelected' onClick={() => { if (view !== 'home') setPrevView('home'); setView('home'); setTitle('Home') }}>
              <img src={String(BlackIcons.HomeIconBlack)} /> <br />
            </button>
            : <button className={homeHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setHomeHovered(true)} onMouseOut={() => setHomeHovered(false)} onClick={() => { setPrevView('home'); setView('home'); setTitle('Home'); setHomeHovered(false); }}>
              <img src={String(homeHovered ? HoverIcons.HomeIconHover : WhiteIcons.HomeIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'seeFiles'|| view === 'seeTaggedFiles'
            ? <button className='ButtonSelected' onClick={() => { if (view !== 'seeFiles') setPrevView('seeFiles'); setView('seeFiles'); setTitle('See GeoTagged Files') }}>
              <img src={String(BlackIcons.EyeFileIconBlack)} /> <br />
            </button>
            : <button className={seeFilesHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setSeeFilesHovered(true)} onMouseOut={() => setSeeFilesHovered(false)} onClick={() => { setPrevView('seeFiles'); setView('seeFiles'); setTitle('See GeoTagged Files'); setSeeFilesHovered(false); }}>
              <img src={String(seeFilesHovered ? HoverIcons.EyeFileIconHover : WhiteIcons.EyeFileIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'geoTag' || view === 'addTag'
            ? <button className='ButtonSelected' onClick={() => { if (view !== 'geoTag') setPrevView('geoTag'); setView('geoTag'); setTitle('GeoTag File') }}>
              <img src={String(BlackIcons.GeoTagIconBlack)} /> <br />
            </button>
            : <button className={geoTagHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setGeoTagHovered(true)} onMouseOut={() => setGeoTagHovered(false)} onClick={() => { setPrevView('geoTag'); setView('geoTag'); setTitle('GeoTag File'); setGeoTagHovered(false); }}>
              <img src={String(geoTagHovered ? HoverIcons.GeoTagIconHover : WhiteIcons.GeoTagIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'settings'
            ? <button className='ButtonSelected' onClick={() => { if (view !== 'settings') setPrevView('settings'); setView('settings'); setTitle('Settings') }}>
              <img src={String(BlackIcons.SettingIconBlack)} /> <br />
            </button>
            : <button className={settingsHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setSettingsHovered(true)} onMouseOut={() => setSettingsHovered(false)} onClick={() => { setPrevView('settings'); setView('settings'); setTitle('Settings'); setSettingsHovered(false); }}>
              <img src={String(settingsHovered ? HoverIcons.SettingIconHover : WhiteIcons.SettingIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
        </div>
        <div className="body">
          <SharedVariableContext.Provider value={{ credentials, setCredentials, siteName, setSiteName, token, setToken, siteId, setSiteId, siteWebUrl, setSiteWebUrl, folderId, setFolderId, folderFinalId, setFolderFinalId, fileId, setFileId, fileName, setFileName, fileTags, setFileTags, nameTag, setNameTag, cacheFiles, setCacheFiles, downloadIcons,imageExtensions }}>
            {view === 'home' && <HomeView setView={setView} setPrevView={setPrevView} />}
            {view === 'seeFiles' && <SeeFilesView
              setView={setView}
              setPrevView={setPrevView}
              useDataSource={useDataSource}
              query={query}
              widgetId={widgetId}
              dataRender={dataRender}
              useMapWidgetIds={useMapWidgetIds}
            />}
            {view === 'geoTag' && <GeoTagView setView={setView} setPrevView={setPrevView} />}
            {view === 'settings' && <SettingsView />}
            {view === 'appCredentials' && <AppCredentialsView setView={setView} />}
            {view === 'siteName' && <SiteNameView setView={setView} />}
            {view === 'addTag' && <AddTagView
              setView={setView}
              useDataSource={useDataSource}
              query={query}
              widgetId={widgetId}
              dataRender={dataRender}
              useMapWidgetIds={useMapWidgetIds}
            />}
            {view === 'seeTaggedFiles' && <SeeTaggedFilesView />}
          </SharedVariableContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default DataSourceRenderer