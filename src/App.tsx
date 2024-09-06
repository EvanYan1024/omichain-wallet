import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TonConnectButton } from "@tonconnect/ui-react";
import { TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { EditTable } from './EditTable';
import Compressor from 'compressorjs';
import { Link, Outlet } from 'react-router-dom';



const Home = () => {
  const [count, setCount] = useState(0)
  const handleFile = (e) => {
    const file = e.target.files[0];
    console.log(file)
    new Compressor(file, {
      quality: 0.6,
      success: file => {
        console.log(file);
      }
    })
  }
  return (
    <div>
      <div>


        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <input type='file' onChange={handleFile} />
    </div>
  )
}

function App() {
  return (
    <>
      <div className='flex items-center gap-4'>
        <Link to='/'>Home</Link>
        <Link to='/web3modal'>Web3Modal</Link>
        <Link to='/signin'>SignIn</Link>
        <Link to='/eth'>ETH</Link>
        <Link to='/rainbow'>Rainbow</Link>
        {/* <Link>ADA</Link> */}
        <Link to='/starknet'>Starknet</Link>
        {/* <Link>TON</Link>
        <Link>OKX</Link> */}
        {/* <Link to='/deploy'>Deploy Starknet Contract</Link> */}
      </div>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App
