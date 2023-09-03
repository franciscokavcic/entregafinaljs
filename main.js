const VALOR_KM = 10; // Valor en pesos argentinos por kilómetro
const IVA = 0.21; // 21% de IVA

// Array con información de las provincias 
const provinciasArgentinas = [
  { nombre: "Buenos Aires", distanciaDesdeCABA: 5 },
  { nombre: "CABA (Ciudad Autónoma de Buenos Aires)", distanciaDesdeCABA: 3 },
  { nombre: "Catamarca", distanciaDesdeCABA: 1144 },
  { nombre: "Chaco", distanciaDesdeCABA: 1003 },
  { nombre: "Chubut", distanciaDesdeCABA: 1426 },
  { nombre: "Córdoba", distanciaDesdeCABA: 695 },
  { nombre: "Corrientes", distanciaDesdeCABA: 886 },
  { nombre: "Entre Ríos", distanciaDesdeCABA: 469 },
  { nombre: "Formosa", distanciaDesdeCABA: 1109 },
  { nombre: "Jujuy", distanciaDesdeCABA: 1644 },
  { nombre: "La Pampa", distanciaDesdeCABA: 623 },
  { nombre: "La Rioja", distanciaDesdeCABA: 1093 },
  { nombre: "Mendoza", distanciaDesdeCABA: 1030 },
  { nombre: "Misiones", distanciaDesdeCABA: 1033 },
  { nombre: "Neuquén", distanciaDesdeCABA: 1215 },
  { nombre: "Río Negro", distanciaDesdeCABA: 1218 },
  { nombre: "Salta", distanciaDesdeCABA: 1556 },
  { nombre: "San Juan", distanciaDesdeCABA: 1124 },
  { nombre: "San Luis", distanciaDesdeCABA: 845 },
  { nombre: "Santa Cruz", distanciaDesdeCABA: 2721 },
  { nombre: "Santa Fe", distanciaDesdeCABA: 472 },
  { nombre: "Santiago del Estero", distanciaDesdeCABA: 946 },
  { nombre: "Tierra del Fuego", distanciaDesdeCABA: 3080 },
  { nombre: "Tucumán", distanciaDesdeCABA: 1187 }
];

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para calcular el costo total de un viaje a una provincia e incluyendo IVA
function calcularCostoTotal(distanciaDesdeCABA, cantidadPersonas) {
  const costoViaje = distanciaDesdeCABA * VALOR_KM * cantidadPersonas;
  const costoConIVA = costoViaje * (1 + IVA);
  return {
    costoViaje: costoViaje.toFixed(2),
    costoIVA: (costoViaje * IVA).toFixed(2),
    costoTotalConIVA: costoConIVA.toFixed(2),
  };
}

const provinciasSelect = document.getElementById("provincias-select");

provinciasArgentinas.forEach((provincia) => {
  const optionItem = new Option(provincia.nombre, provincia.nombre);
  provinciasSelect.add(optionItem);
});


let detalleCostosObj = {};
const detalleCostosTextarea = document.getElementById("detalleCostos");
// Función para mostrarlos en el textarea
function actualizarCostos() {
  const cantidadPersonas = parseInt(document.getElementById("cantidadPersonas").value);
  const provinciaSeleccionada = document.getElementById("provincias-select").value;
  const resultadoTextarea = document.getElementById("resultado");
  

  let resultado = "Costo de Viaje:\n";
  let detalleCostos = "Detalle de Costos:\n";

  provinciasArgentinas.forEach((provincia) => {
    if (provincia.nombre === provinciaSeleccionada) {
      const { costoViaje, costoIVA, costoTotalConIVA } = calcularCostoTotal(provincia.distanciaDesdeCABA, cantidadPersonas);
      
      resultado += `Provincia: ${provincia.nombre} - Costo total del viaje: $${costoTotalConIVA}\n`;

      detalleCostosObj.provNombre = provincia.nombre;
      detalleCostosObj.provDistanciaDesdeCABA = provincia.distanciaDesdeCABA;
      detalleCostosObj.valorKM = VALOR_KM;
      detalleCostosObj.cantidadPersonas = cantidadPersonas;
      detalleCostosObj.costoViaje = costoViaje;
      detalleCostosObj.costoIVA = costoIVA
      detalleCostosObj.costoTotalConIVA = costoTotalConIVA

      detalleCostos += `Provincia: ${detalleCostosObj.provNombre}\n`;
      detalleCostos += `Distancia desde CABA: ${detalleCostosObj.provDistanciaDesdeCABA} km\n`;
      detalleCostos += `Costo del viaje por km: $${detalleCostosObj.valorKM}\n`;
      detalleCostos += `Costo del viaje (sin IVA) para ${detalleCostosObj.cantidadPersonas} personas: $${detalleCostosObj.costoViaje}\n`;
      detalleCostos += `Valor del IVA (21%): $${detalleCostosObj.costoIVA}\n`;
      detalleCostos += `Costo total del viaje (con IVA): $${detalleCostosObj.costoTotalConIVA}\n\n`;

    }
  });

  resultadoTextarea.value = resultado;
  detalleCostosTextarea.value = detalleCostos;
}
//eventos de botones :P
provinciasSelect.addEventListener("change", actualizarCostos);
botonpersonas.addEventListener("click", actualizarCostos);

const guardarBtn = document.getElementById("botonEnviaEst");

document.addEventListener('DOMContentLoaded', function() {
  refreshViajesAcumulados();
}, false);

guardarBtn.addEventListener("click", () => {
  if (!isEmpty(detalleCostosObj)) {
    let datosExistentes = JSON.parse(localStorage.getItem("misDatos")) || [];
    
    datosExistentes.push(detalleCostosObj);
    
    localStorage.setItem("misDatos", JSON.stringify(datosExistentes));
    detalleCostosObj={};
    
    alert("Agregaste un viaje !.");
    refreshViajesAcumulados()
    detalleCostosTextarea.value = "";
    
  } 
});


const viajesAcumulados = document.getElementById("textViajesAcumulados");
function refreshViajesAcumulados(){
  viajesAcumulados.value = "";
  
  let jsonString = localStorage.getItem('misDatos');
  let jsonObject = JSON.parse(jsonString);
  let txtViajesAcumulados = "";
  let costoTotalFinal= 0.0;
  for (var key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      let value = jsonObject[key];
      //console.log(key + ": " + value);
     
      txtViajesAcumulados += "Destino: " + value.provNombre + 
                            " Personas: " + value.cantidadPersonas +
                            " Precio Final: " + value.costoTotalConIVA +
                            "\n";
      
      costoTotalFinal += parseFloat(value.costoTotalConIVA);
      
    }
  }
  viajesAcumulados.value = txtViajesAcumulados;
  console.log(costoTotalFinal);
  
}
window.addEventListener("beforeunload", function(e){
  refreshViajesAcumulados();
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}



const cotizacion = document.getElementById("cotizar");
cotizacion.addEventListener("click", () => {
  fetch("https://dolarapi.com/v1/dolares/oficial")
    .then(response => response.json())
    .then(data => console.log(data.venta));
  
  fetch("https://dolarapi.com/v1/dolares/blue")
    .then(response => response.json())
    .then(data => console.log(data.venta));
   
});