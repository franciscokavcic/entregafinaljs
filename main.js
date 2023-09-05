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

document.addEventListener('DOMContentLoaded', function () {
  refreshViajesAcumulados();
}, false);

guardarBtn.addEventListener("click", () => {
  if (!isEmpty(detalleCostosObj)) {
    const datosExistentes = JSON.parse(localStorage.getItem("misDatos")) || [];

    datosExistentes.push(detalleCostosObj);

    localStorage.setItem("misDatos", JSON.stringify(datosExistentes));
    detalleCostosObj = {};

    Swal.fire('Agregaste un viaje')
    refreshViajesAcumulados();
    detalleCostosTextarea.value = "";
  }
});

const viajesAcumulados = document.getElementById("textViajesAcumulados");
function refreshViajesAcumulados() {
  viajesAcumulados.value = "";

  const jsonString = localStorage.getItem('misDatos');
  const jsonObject = JSON.parse(jsonString);

  const txtViajesAcumulados = Object.entries(jsonObject).map(([key, value]) =>
    `Destino: ${value.provNombre} Personas: ${value.cantidadPersonas} Precio Final: ${value.costoTotalConIVA}\n`
  ).join('');

  const costoTotalFinal = Object.values(jsonObject).reduce((total, value) =>
    total + parseFloat(value.costoTotalConIVA), 0.0
  );

  viajesAcumulados.value = txtViajesAcumulados;
  console.log(costoTotalFinal);
}
window.addEventListener("beforeunload", function (e) {
  refreshViajesAcumulados();
});

//---------
// Función para eliminar el último objeto del almacenamiento local y actualizar la vista
function eliminarUltimoObjetoLocalStorage() {
  const jsonString = localStorage.getItem('misDatos');
  const jsonArray = JSON.parse(jsonString) || [];


  if (jsonArray.length > 0) {
   
    jsonArray.pop();

    // Guardar el arreglo actualizado en el almacenamiento local
    localStorage.setItem('misDatos', JSON.stringify(jsonArray));

     refreshViajesAcumulados();
  }
}

// obtén el botón por su id
const botonEliminarUltimoObjeto = document.getElementById("botonEliminarUltimoObjeto");

// agrega un evento de clic al boton
botonEliminarUltimoObjeto.addEventListener("click", eliminarUltimoObjetoLocalStorage);

function sumarTotal() {
  const jsonString = localStorage.getItem('misDatos');
  const jsonObject = JSON.parse(jsonString);

  // calcular el total sumando los precios de cada viaje
  const total = Object.values(jsonObject).reduce((accumulator, value) =>
    accumulator + parseFloat(value.costoTotalConIVA), 0.0
  );

  // Mostrar el total en el elemento con el ID "textViajesAcumulados"
  const viajesAcumulados = document.getElementById("textViajesAcumulados");
  viajesAcumulados.value = `Total acumulado: $${total.toFixed(2)}`;
}

// agregar un evento de clic al btn con el id "botonSumarTotal"
const botonSumarTotal = document.getElementById("botonSumarTotal");
botonSumarTotal.addEventListener("click", sumarTotal);
//---------
// Función para mostrar el formulario modal de pago
function mostrarFormularioDePago() {
  Swal.fire({
    title: "Datos de Pago",
    html: `
      <form id="formularioPago">
        <input type="text" id="nombre" placeholder="Nombre">
        <input type="text" id="tarjeta" placeholder="Número de Tarjeta">
        <input type="text" id="vencimiento" placeholder="Fecha de Vencimiento (MM/YY)">
        <input type="text" id="cvv" placeholder="CVV">
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: "Pagar",
    preConfirm: () => {
      const nombre = Swal.getPopup().querySelector("#nombre").value;
      const tarjeta = Swal.getPopup().querySelector("#tarjeta").value;
      const vencimiento = Swal.getPopup().querySelector("#vencimiento").value;
      const cvv = Swal.getPopup().querySelector("#cvv").value;

      // Aquí puedes realizar validaciones de los datos ingresados

      return { nombre, tarjeta, vencimiento, cvv };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const datosPago = result.value;

      // Realiza cualquier acción necesaria con los datos de pago 

      
      sumarTotal();
    }
  });
}

// Agregar un evento de clic al botón con el id "botonSumarTotal"
const botonSumaTotal = document.getElementById("botonSumarTotal");
botonSumarTotal.addEventListener("click", mostrarFormularioDePago);

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


async function obtenerCotizacionDolar(url, titulo) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const cotizacion = data.venta;

    // obtener el monto en pesos 
    const montoEnDolares = 100; 
    const conversionAPesos = cotizacion * montoEnDolares;

    await Swal.fire({
      title: titulo,
      html: `La cotización actual es: ${cotizacion}<br>La conversión a pesos de ${montoEnDolares} dólares es: ${conversionAPesos.toFixed(2)} pesos`,
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  } catch (error) {
    console.error(`Error al obtener la cotización (${titulo}):`, error);
    await Swal.fire({
      title: "Error",
      text: `Hubo un error al obtener la cotización del dólar (${titulo}).`,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
}

async function mostrarCotizacionDolar() {
  await obtenerCotizacionDolar("https://dolarapi.com/v1/dolares/oficial", "Dólar Oficial");
  await obtenerCotizacionDolar("https://dolarapi.com/v1/dolares/blue", "Dólar Blue");
}


const cotizacion = document.getElementById("cotizar");

cotizacion.addEventListener("click", mostrarCotizacionDolar);
