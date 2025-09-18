import React, { useState, useEffect } from "react";
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
    }

    // Funciones de conversión directas en el frontend
    function convertirTiempo(valor, desde, hacia) {
        const conversiones = {
            'hora-meses': valor * 0.00136986,
            'hora-dias': valor / 24,
            'meses-horas': valor * 730.5,
            'meses-dias': valor * 30.44,
            'dias-horas': valor * 24,
            'dias-meses': valor / 30.44,
            'años-meses': valor * 12,
            'años-dias': valor * 365.25,
            'años-horas': valor * 8766
        };
        const clave = `${desde}-${hacia}`;
        return conversiones[clave] ? conversiones[clave] * valor : valor;
    }

    function convertirPeso(valor, desde, hacia) {
        const conversiones = {
            'kg-g': valor * 1000,
            'kg-lb': valor * 2.20462,
            'g-kg': valor / 1000,
            'g-lb': valor * 0.00220462,
            'lb-kg': valor * 0.453592,
            'lb-g': valor * 453.592
        };
        const clave = `${desde}-${hacia}`;
        return conversiones[clave] ? conversiones[clave] * valor : valor;
    }

    function convertirTemperatura(valor, desde, hacia) {
        if (desde === hacia) return valor;
        
        let celsius = valor;
        if (desde === 'f') {
            celsius = (valor - 32) * 5/9;
        } else if (desde === 'k') {
            celsius = valor - 273.15;
        }
        
        if (hacia === 'f') {
            return (celsius * 9/5) + 32;
        } else if (hacia === 'k') {
            return celsius + 273.15;
        }
        return celsius;
    }

    function convertirMoneda(valor, desde, hacia) {
        const tasas = {
            'usd-cop': 4100,
            'usd-eur': 0.85,
            'cop-usd': 1/4100,
            'cop-eur': 0.00021,
            'eur-usd': 1.18,
            'eur-cop': 4820
        };
        const clave = `${desde}-${hacia}`;
        return tasas[clave] ? tasas[clave] * valor : valor;
    }

    // Función para convertir automáticamente cuando cambien los valores
    function convertirAutomaticamente() {
        if (valorConversion && desde && hacia && tipoConversion) {
            let resultado = 0;
            const valor = parseFloat(valorConversion);
            
            switch(tipoConversion) {
                case 'tiempo':
                    resultado = convertirTiempo(valor, desde, hacia);
                    break;
                case 'peso':
                    resultado = convertirPeso(valor, desde, hacia);
                    break;
                case 'temperatura':
                    resultado = convertirTemperatura(valor, desde, hacia);
                    break;
                case 'moneda':
                    resultado = convertirMoneda(valor, desde, hacia);
                    break;
            }
            
            if (tipoConversion === 'temperatura') {
                setResultado(`${valor}°${desde.toUpperCase()} = ${resultado.toFixed(2)}°${hacia.toUpperCase()}`);
            } else {
                setResultado(`${valor} ${desde} = ${resultado.toFixed(4)} ${hacia}`);
            }
        }
    }

    // Efecto para convertir automáticamente
    useEffect(() => {
        convertirAutomaticamente();
    }, [valorConversion, desde, hacia, tipoConversion]);

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
                    
                    {/* Botones de tipo de conversión */}
                    <div className="conversion-buttons">
                        <input type="button" className="btnConversion" value="tiempo" onClick={handleConversion}/>
                        <input type="button" className="btnConversion" value="peso" onClick={handleConversion}/>
                        <input type="button" className="btnConversion" value="temperatura" onClick={handleConversion}/>
                        <input type="button" className="btnConversion" value="moneda" onClick={handleConversion}/>
                    </div>
                    
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
                </form>
            </div>
            
            <Resultado resultado={resultado ? "El resultado es: " + resultado : ""}/>
        </div>
    )
}

export default Calculadora