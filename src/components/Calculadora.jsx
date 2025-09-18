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
        const num1 = parseFloat(number1);
        const num2 = parseFloat(number2);
        
        let resultado = 0;
        switch(operacion) {
            case 'sumar':
                resultado = num1 + num2;
                break;
            case 'restar':
                resultado = num1 - num2;
                break;
            case 'multiplicar':
                resultado = num1 * num2;
                break;
        }
        
        setResultado(resultado.toString());
    }

    function handleConversion(e){
        e.preventDefault();
        const tipo = e.target.value;
        setTipoConversion(tipo);
    }

    // Funciones de conversión directas en el frontend con datos reales
    function convertirTiempo(valor, desde, hacia) {
        const conversiones = {
            // Desde horas
            'hora-dias': valor / 24,           // 24 horas = 1 día
            'hora-meses': valor / (24 * 30.44), // 1 mes = 30.44 días promedio
            'hora-años': valor / (24 * 365.25), // 1 año = 365.25 días
            
            // Desde días
            'dias-horas': valor * 24,          // 1 día = 24 horas
            'dias-meses': valor / 30.44,       // 1 mes = 30.44 días
            'dias-años': valor / 365.25,       // 1 año = 365.25 días
            
            // Desde meses
            'meses-horas': valor * 24 * 30.44, // 1 mes = 730.56 horas
            'meses-dias': valor * 30.44,       // 1 mes = 30.44 días
            'meses-años': valor / 12,          // 12 meses = 1 año
            
            // Desde años
            'años-horas': valor * 24 * 365.25, // 1 año = 8766 horas
            'años-dias': valor * 365.25,       // 1 año = 365.25 días
            'años-meses': valor * 12           // 1 año = 12 meses
        };
        const clave = `${desde}-${hacia}`;
        return conversiones[clave] || valor;
    }

    function convertirPeso(valor, desde, hacia) {
        const conversiones = {
            // Desde kilogramos
            'kg-g': valor * 1000,        // 1 kg = 1000 gramos
            'kg-lb': valor * 2.20462,    // 1 kg = 2.20462 libras
            
            // Desde gramos
            'g-kg': valor / 1000,        // 1000 g = 1 kg
            'g-lb': valor / 453.592,     // 453.592 g = 1 lb
            
            // Desde libras
            'lb-kg': valor / 2.20462,    // 2.20462 lb = 1 kg
            'lb-g': valor * 453.592      // 1 lb = 453.592 gramos
        };
        const clave = `${desde}-${hacia}`;
        return conversiones[clave] || valor;
    }

    function convertirTemperatura(valor, desde, hacia) {
        if (desde === hacia) return valor;
        
        // Convertir a Celsius primero
        let celsius = valor;
        if (desde === 'f') {
            celsius = (valor - 32) * 5/9;  // Fahrenheit a Celsius
        } else if (desde === 'k') {
            celsius = valor - 273.15;      // Kelvin a Celsius
        }
        // Si ya está en Celsius, no hacer nada
        
        // Convertir desde Celsius
        if (hacia === 'f') {
            return (celsius * 9/5) + 32;   // Celsius a Fahrenheit
        } else if (hacia === 'k') {
            return celsius + 273.15;       // Celsius a Kelvin
        }
        return celsius; // Ya está en Celsius
    }

    function convertirMoneda(valor, desde, hacia) {
        const tasas = {
            // Desde USD
            'usd-cop': 4100,      // 1 USD = 4100 COP (aproximado)
            'usd-eur': 0.92,      // 1 USD = 0.92 EUR (aproximado)
            
            // Desde COP
            'cop-usd': 1/4100,    // 1 COP = 0.00024 USD
            'cop-eur': 1/4450,    // 1 COP = 0.00022 EUR
            
            // Desde EUR
            'eur-usd': 1.09,      // 1 EUR = 1.09 USD (aproximado)
            'eur-cop': 4450       // 1 EUR = 4450 COP (aproximado)
        };
        const clave = `${desde}-${hacia}`;
        return tasas[clave] || valor;
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