import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bulma/css/bulma.css';
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Router } from './Router.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Router/>
    </ChakraProvider>
  </React.StrictMode>,
)
