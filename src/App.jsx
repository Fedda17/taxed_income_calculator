import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {
  return (
      <div>
        <RalForm />
      </div>
  )
}



function RalForm(){
  const [ral_lorda, set_ral_lorda] = useState('15000');
  ral_lorda_as_number = Number(ral_lorda)

  return (
      <>
        <input type="number" value={ral_lorda} onChange={e => set_ral_lorda(e.target.value)}  id="ral_lorda" name="ral_lorda" /> €
        <label>Inserisci il tuo lordo qui: </label>
        <br></br><br></br>
        <button onClick={() => calculate_taxed_income(ral_lorda_as_number)}>Calcola netto</button>
        <br></br>
        risultato: <p></p>
      </>
  )

}



export default App
