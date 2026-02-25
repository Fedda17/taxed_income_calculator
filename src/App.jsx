import { useState } from 'react'
import {calculate_taxed_income} from './calculation.js'
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
  const [ral_netta, set_ral_netta] = useState('');
  const [taxes, set_taxes] = useState({
    inps: 0,
    irpef: 0,
    add_reg: 0,
    add_com: 0 
  })
  const ral_lorda_as_number = Number(ral_lorda);

  return (
      <>
        <label>Inserisci il tuo lordo qui: </label>
        <input type="number" value={ral_lorda} onChange={e => set_ral_lorda(e.target.value)}  id="ral_lorda" name="ral_lorda" /> €
        <br></br><br></br>
        <button onClick={() => 
        {
          const [r, t] = calculate_taxed_income(ral_lorda_as_number);
          set_ral_netta(r);
          set_taxes(t);
        }}>Calcola netto</button>
        <br></br>
        risultato: <p>{ral_netta}</p>
        <br></br>
        tasse: 
        <ul>
          <li>{taxes.inps}</li>
          <li>{taxes.irpef}</li>
          <li>{taxes.add_reg}</li>
          <li>{taxes.add_com}</li>
        </ul>
      </>
  )

}



export default App
