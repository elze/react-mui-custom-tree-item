import * as React from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider } from '@mui/material/styles';
//import Demo from './demo';
import App from './App';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

const instance = createInstance({
  urlBase: 'https://www.piw.geekitude.com/matomo',
  siteId: 1,
  userId: 'UID76903202', // optional, default value: `undefined`.
  //trackerUrl: 'https://www.piw.geekitude.com/matomo/tracking.php', // optional, default value: `${urlBase}matomo.php`
  //srcUrl: 'https://www.piw.geekitude.com/matomo/tracking.js', // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: { // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10 // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: { // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST'
  }
})

ReactDOM.render(
  <StyledEngineProvider injectFirst>
  <MatomoProvider value={instance}>  
    <App />
  </MatomoProvider>	
  </StyledEngineProvider>,
  document.querySelector("#root")
);