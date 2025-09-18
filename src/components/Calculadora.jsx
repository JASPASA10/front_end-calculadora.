import { useState } from "react";
import '../styles/Calculadora.css'
import Resultado from "./Resultado";

function Calculadora(){
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [resultado, setResultado] = useState('');
    const [valorConversion, setValorConversion] = useState('');
    const [desde, setDesde] = useState('');
    const [hacia, setHacia] = useState('');
    const [tipoConversion, setTipoConversion] = useState('');

    function handleSubmit(e){
        e.preventDefault();
        const operacion = e.target.value;
        fetch(`http://localhost:3500/v1/calculadora/${operacion}`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({number1, number2})
        })
            .then(res =>res.json())
            .then(responseData => {
                setResultado(responseData.resultado)
            })
    }

    function handleConversion(e){
        e.preventDefault();
        const tipo = e.target.value;
        setTipoConversion(tipo);
        
        let endpoint = '';
        switch(tipo) {
            case 'tiempo':
                endpoint = 'convertir-tiempo';
                break;
            case 'peso':
                endpoint = 'convertir-peso';
                break;
            case 'temperatura':
                endpoint = 'convertir-temperatura';
                break;
            case 'moneda':
                endpoint = 'convertir-moneda';
                break;
        }
        
        fetch(`http://localhost:3500/v1/calculadora/${endpoint}`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({valor: valorConversion, desde, hacia})
        })
            .then(res => res.json())
            .then(responseData => {
                setResultado(`${valorConversion} ${desde} = ${responseData.resultado} ${hacia}`)
            })
    }

    return (
        <div className="container">
            <h1 id="txtCalculadora">CALCULADORA</h1>
            
            {/* Sección de operaciones básicas */}
            <div className="seccion">
                <h3>Operaciones Básicas</h3>
                <form>
                    <input type="text" className="number" placeholder="Primer número" onChange={(e)=>{setNumber1(e.target.value)}}/><br />
                    <input type="text" className="number" placeholder="Segundo número" onChange={(e)=>{setNumber2(e.target.value)}}/><br />
                    <input type="submit" className="btnEnviar" value="sumar" onClick={handleSubmit}/>
                    <input type="submit" className="btnEnviar" value="restar" onClick={handleSubmit}/>
                    <input type="submit" className="btnEnviar" value="multiplicar" onClick={handleSubmit}/>
                </form>
            </div>

            {/* Sección de conversiones */}
            <div className="seccion">
                <h3>Conversiones</h3>
                <form>
                    <input type="number" className="number" placeholder="Valor a convertir" onChange={(e)=>{setValorConversion(e.target.value)}}/><br />
                    
                    {/* Selectores de conversión */}
                    <div className="conversion-selectors">
                        <select className="select-conversion" onChange={(e)=>{setDesde(e.target.value)}}>
                            <option value="">Desde</option>
                            {tipoConversion === 'tiempo' && (
                                <>
                                    <option value="hora">Hora</option>
                                    <option value="dias">Días</option>
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </>
                            )}
                            {tipoConversion === 'peso' && (
                                <>
                                    <option value="kg">Kilogramos (kg)</option>
                                    <option value="g">Gramos (g)</option>
                                    <option value="lb">Libras (lb)</option>
                                </>
                            )}
                            {tipoConversion === 'temperatura' && (
                                <>
                                    <option value="c">Celsius (°C)</option>
                                    <option value="f">Fahrenheit (°F)</option>
                                    <option value="k">Kelvin (K)</option>
                                </>
                            )}
                            {tipoConversion === 'moneda' && (
                                <>
                                    <option value="usd">USD ($)</option>
                                    <option value="cop">COP ($)</option>
                                    <option value="eur">EUR (€)</option>
                                </>
                            )}
                        </select>
                        
                        <select className="select-conversion" onChange={(e)=>{setHacia(e.target.value)}}>
                            <option value="">Hacia</option>
                            {tipoConversion === 'tiempo' && (
                                <>
                                    <option value="hora">Hora</option>
                                    <option value="dias">Días</option>
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </>
                            )}
                            {tipoConversion === 'peso' && (
                                <>
                                    <option value="kg">Kilogramos (kg)</option>
                                    <option value="g">Gramos (g)</option>
                                    <option value="lb">Libras (lb)</option>
                                </>
                            )}
                            {tipoConversion === 'temperatura' && (
                                <>
                                    <option value="c">Celsius (°C)</option>
                                    <option value="f">Fahrenheit (°F)</option>
                                    <option value="k">Kelvin (K)</option>
                                </>
                            )}
                            {tipoConversion === 'moneda' && (
                                <>
                                    <option value="usd">USD ($)</option>
                                    <option value="cop">COP ($)</option>
                                    <option value="eur">EUR (€)</option>
                                </>
                            )}
                        </select>
                    </div>
                    
                    {/* Botones de tipo de conversión */}
                    <div className="conversion-buttons">
                        <input type="submit" className="btnConversion" value="tiempo" onClick={handleConversion}/>
                        <input type="submit" className="btnConversion" value="peso" onClick={handleConversion}/>
                        <input type="submit" className="btnConversion" value="temperatura" onClick={handleConversion}/>
                        <input type="submit" className="btnConversion" value="moneda" onClick={handleConversion}/>
                    </div>
                </form>
            </div>
            
            <Resultado resultado={resultado ? "El resultado es: " + resultado : ""}/>
        </div>
    )
}

export default Calculadora