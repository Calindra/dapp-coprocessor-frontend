import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { connectMetaMask } from './services/WalletService'
import SoccerTeamManager from './views/SoccerTeamManager'

function App() {
  const [address, setAddress] = useState(localStorage.getItem("connectedAccount") ?? '')
  window.ethereum.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0])
      console.log(`address`, accounts[0])
    } else {
      setAddress('')
    }
  });
  return (
    <>
      <Button onClick={connectMetaMask}>{address ? `Connected: ${address.substring(0, 7)}...${address.substring(address.length - 5)}` : 'Connect'}</Button>
      <SoccerTeamManager />
    </>
  )
}

export default App
