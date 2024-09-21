import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import firebaseConfig from './bd/firebaseConfig'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import store from './features/store'

ReactDOM.createRoot(document.getElementById('root')).render(
<HelmetProvider>
<Provider store={store}>
<App />
</Provider>
</HelmetProvider>
)
