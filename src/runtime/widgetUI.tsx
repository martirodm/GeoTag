import React, { useState } from 'react'
//import { DataSourceComponent } from 'jimu-core'
import { Spacer } from '@nextui-org/react'
import '../assets/stylesheets/css.css'

import * as BlackIcons from '../assets/images/Black/indexBlack';
import * as WhiteIcons from '../assets/images/White/indexWhite';
import * as HoverIcons from '../assets/images/Hover/indexHover';

//---------------------Views---------------------------------
import HomeView from './Views/HomeView'
import SeeFilesView from './Views/SeeFilesView'
import GeoTagView from './Views/GeoTagView'
import SettingsView from './Views/SettingsView'
import AppCredentialsView from './Views/AppCredentialsView'
//------------------------------------------------------------

const DataSourceRenderer = ({ configured, useDataSource, query, widgetId, dataRender }) => {
  const [view, setView] = useState('home')
  const [title, setTitle] = useState('Home')
  const [prevView, setPrevView] = useState(null)
  const [GoBackhovered, setGoBackHovered] = useState(false)
  const [homeHovered, setHomeHovered] = useState(false)
  const [seeFilesHovered, setSeeFilesHovered] = useState(false);
  const [geoTagHovered, setGeoTagHovered] = useState(false);
  const [settingsHovered, setSettingsHovered] = useState(false)


  if (!configured) {
    return (
      <div className="container">
        <div className="widget-use-feature-layer">
          <h3>Insert Data Source Plis</h3>
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
            <button className='ButtonGoBack' onMouseOver={() => setGoBackHovered(true)} onMouseOut={() => setGoBackHovered(false)}  onClick={() =>{ setView(prevView); setPrevView(null); setGoBackHovered(false);}}>
              <img src={String(GoBackhovered ? HoverIcons.GoBackIconHover : WhiteIcons.GoBackIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
        </div>
        <div className="left-bar">
          {view === 'home' || view === 'AppCredentials'
            ? <button className='ButtonSelected' onClick={() => { if (view !== 'AppCredentials') setPrevView(view); setView('home'); setTitle('Home') }}>
              <img src={String(BlackIcons.HomeIconBlack)} /> <br />
            </button>
            : <button className={homeHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setHomeHovered(true)}  onMouseOut={() => setHomeHovered(false)} onClick={() => { if (view !== 'AppCredentials') setPrevView(view); setView('home'); setTitle('Home'); setHomeHovered(false); }}>
              <img src={String(homeHovered ? HoverIcons.HomeIconHover : WhiteIcons.HomeIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'seeFiles'
            ? <button className='ButtonSelected' onClick={() => { setPrevView(view); setView('seeFiles'); setTitle('See GeoTagged Files') }}>
              <img src={String(BlackIcons.EyeFileIconBlack)} /> <br />
            </button>
            : <button className={seeFilesHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setSeeFilesHovered(true)}  onMouseOut={() => setSeeFilesHovered(false)} onClick={() => { if (view !== 'AppCredentials') setPrevView(view); setView('seeFiles'); setTitle('See GeoTagged Files'); setSeeFilesHovered(false); }}>
              <img src={String(seeFilesHovered ? HoverIcons.EyeFileIconHover : WhiteIcons.EyeFileIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'geoTag'
            ? <button className='ButtonSelected' onClick={() => { setPrevView(view); setView('geoTag'); setTitle('GeoTag File') }}>
              <img src={String(BlackIcons.GeoTagIconBlack)} /> <br />
            </button>
            : <button className={geoTagHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setGeoTagHovered(true)}  onMouseOut={() => setGeoTagHovered(false)} onClick={() => { if (view !== 'AppCredentials') setPrevView(view); setView('geoTag'); setTitle('GeoTag File'); setGeoTagHovered(false); }}>
              <img src={String(geoTagHovered ? HoverIcons.GeoTagIconHover : WhiteIcons.GeoTagIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
          {view === 'settings'
            ? <button className='ButtonSelected' onClick={() => { setPrevView(view); setView('settings'); setTitle('Settings') }}>
              <img src={String(BlackIcons.SettingIconBlack)} /> <br />
            </button>
            : <button className={settingsHovered ? 'ButtonHover' : 'ButtonNotSelected'} onMouseOver={() => setSettingsHovered(true)}  onMouseOut={() => setSettingsHovered(false)} onClick={() => { if (view !== 'AppCredentials') setPrevView(view); setView('settings'); setTitle('Settings'); setSettingsHovered(false); }}>
              <img src={String(settingsHovered ? HoverIcons.SettingIconHover : WhiteIcons.SettingIconWhite)} />
            </button>
          }
          <Spacer y={0.5} />
        </div>
        <div className="body">
          {view === 'home' && <HomeView setView={setView} setPrevView={setPrevView} />}
          {view === 'seeFiles' && <SeeFilesView
            useDataSource={useDataSource}
            query={query}
            widgetId={widgetId}
            queryCount
            dataRender={dataRender}
          />}
          {view === 'geoTag' && <GeoTagView />}
          {view === 'settings' && <SettingsView />}
          {view === 'AppCredentials' && <AppCredentialsView />}
        </div>
      </div>
    </div >
  )
}

export default DataSourceRenderer
