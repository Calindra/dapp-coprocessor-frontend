import './App.css'
import { Button } from './components/ui/button'
import { connectMetaMask } from './services/WalletService'
import SoccerTeamManager from './views/SoccerTeamManager'

function App() {
  return (
    <>
      <Button onClick={connectMetaMask}>Connect</Button>
      <SoccerTeamManager />
    </>
  )
}

export default App
