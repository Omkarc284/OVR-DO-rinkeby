import { useState } from 'react';
import './App.css';
import MainMint from './MainMint';


function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className='overlay'>
      <div className='App'>
        <div className='grid-container'>
          <div className='grid-item grid-item-1'>
            <div className='title'>OVR</div>
            <div className='sub'>Dealership Minting Platform</div>
          </div>
          <div className='minter grid-item grid-item-2'>
            <MainMint accounts={accounts} setAccounts={setAccounts} />
          </div>
         
        </div>
        
      </div>
      <div className='moving-background'></div>
    </div>
  )
}

export default App;
