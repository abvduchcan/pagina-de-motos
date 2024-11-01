function actualizarMonto(valor) {
    document.getElementById('monto-valor').textContent = Number(valor).toLocaleString();
}

function actualizarTiempo(valor) {
    document.getElementById('tiempo-valor').textContent = valor;
}

document.getElementById('cotizacion-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Formulario enviado');
    // Aquí puedes agregar la lógica para manejar el envío del formulario
});

document.getElementById('cotizacion-form').addEventListener('reset', function() {
    alert('Formulario limpiado');
    // Aquí puedes agregar la lógica para manejar la limpieza del formulario
});

