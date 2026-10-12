import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This is the starting point of the entire app.
// ReactDOM.createRoot() grabs the <div id="root"> from index.html
// and tells React: "render the App component inside this div, and
// keep it in sync with any state changes from now on."
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
