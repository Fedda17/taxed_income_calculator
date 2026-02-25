import { useState } from 'react'
import calculate_taxed_income from './calculation.js'
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
  const [ral_netta, set_ral_netta] = useState(0);
  const [taxes, set_taxes] = useState({
    inps: 0,
    irpef: 0,
    add_reg: 0,
    add_com: 0 
  })
  const [calculated, set_calculated] = useState(false);
  const ral_lorda_as_number = Number(ral_lorda);

  return (
      <>
        <label>Inserisci il tuo lordo qui: </label>
        <input type="number" value={ral_lorda} onChange={e => {set_ral_lorda(e.target.value); set_calculated(false)}}  id="ral_lorda" name="ral_lorda" /> €
        <br></br><br></br>
        <button onClick={() => 
        {
          const [r, t] = calculate_taxed_income(ral_lorda_as_number);
          set_ral_netta(r);
          set_taxes(t);
          set_calculated(true);
        }}>Calcola netto</button>
        <br></br>
          {calculated && <Result lordo={ral_lorda} netto={ral_netta} tasse={taxes} />}
      </>
  )

}

function Result({lordo, netto, tasse}){
  if (lordo <= 9000){
    return <p>Il valore non può essere sotto i 9000</p>
  }else{
    return (<>
        RAL NETTA: <p>{netto.toFixed(2)}</p>
        <br></br>
        RAL NETTA MENSILE: <p>{(netto / 12).toFixed(2)}</p>
        <br></br>
        tasse: 
        <ul>
          <li>INPS: {tasse.inps.toFixed(2)}</li>
          <li>IRPEF NETTA: {tasse.irpef.toFixed(2)}</li>
          <li>REGIONALE: {tasse.add_reg.toFixed(2)}</li>
          <li>COMUNALE: {tasse.add_com.toFixed(2)}</li>
        </ul>
        </>

    )
  }
}


export default App
