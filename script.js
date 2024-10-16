// Definiciones de KPIs
const kpiDefinitions = {
    cpc: "Coste por Clic (CPC): Es el coste promedio que se paga por cada clic en un anuncio.",
    ctr: "Click-Through Rate (CTR): Es el porcentaje de personas que hacen clic en un anuncio después de verlo.",
    roas: "Return on Ad Spend (ROAS): Es el retorno de la inversión publicitaria, que mide los ingresos generados por cada euro gastado en publicidad.",
    cpa: "Coste por Adquisición (CPA): Es el coste promedio de adquirir un cliente o una conversión.",
    conversionRate: "Tasa de Conversión: Es el porcentaje de visitantes que realizan una acción deseada (como una compra).",
    cpm: "Coste por Mil Impresiones (CPM): Es el coste de mostrar un anuncio mil veces.",
    roi: "Retorno de Inversión (ROI): Es el beneficio obtenido en relación con la inversión realizada, expresado en porcentaje.",
    cpl: "Coste por Lead (CPL): Es el coste promedio de adquirir un lead o prospecto.",
    atc: "Porcentaje de Add to Cart (% ATC): Es el porcentaje de clics que resultan en un evento de 'Añadir al Carrito'."
};

// Almacenar resultados por métrica
const resultadosPorMetrica = {};
let historialCalculos = [];

// Configuración del tema oscuro
const themeToggle = document.getElementById('theme-toggle');
const bodyElement = document.body;

themeToggle.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');
    if (bodyElement.classList.contains('dark-mode')) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
    } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
    }
});

// Delegación de eventos para manejar clics en botones de métricas
document.querySelector('.metric-buttons').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const metric = e.target.getAttribute('data-metric');
        mostrarFormulario(metric);
        actualizarResultado(metric);
    }
});

// Función genérica para mostrar formularios según la métrica seleccionada
function mostrarFormulario(metric) {
    const forms = document.querySelectorAll('.form-wrapper');
    forms.forEach(form => form.style.display = 'none');
    
    const selectedForm = document.getElementById(`form-${metric}`);
    selectedForm.style.display = 'block';
    
    const definitionElement = selectedForm.querySelector('.kpi-definition');
    if (!definitionElement) {
        const newDefinitionElement = document.createElement('p');
        newDefinitionElement.className = 'kpi-definition';
        newDefinitionElement.textContent = kpiDefinitions[metric];
        const h2Element = selectedForm.querySelector('h2');
        h2Element.insertAdjacentElement('afterend', newDefinitionElement);
    }
}

// Función para actualizar y mostrar resultados
function actualizarGrafico(metrica) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const data = Object.entries(resultadosPorMetrica).map(([key, value]) => ({
        metrica: key,
        valor: parseFloat(value.split(': ')[1])
    }));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.metrica),
            datasets: [{
                label: 'Valor',
                data: data.map(item => item.valor),
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Delegación de eventos para el botón de reinicio
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetCalculos);

// Función para reiniciar el cálculo
function resetCalculos() {
    for (let key in resultadosPorMetrica) {
        delete resultadosPorMetrica[key];
    }
    historialCalculos = [];
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('calculation-history').innerHTML = '';
    ocultarBotonCopiar();
    
    // Reset all form inputs
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Clear the chart
    if (window.myChart) {
        window.myChart.destroy();
    }
}

// Funciones genéricas de cálculo (simplificadas)
function calcularKPI(formId, inputs, formulaCallback, metrica) {
    document.getElementById(formId).addEventListener('submit', function(e) {
        e.preventDefault();
        const values = inputs.map(input => parseFloat(document.getElementById(input).value));
        if (values.some(isNaN)) {
            alert('Por favor, ingrese valores válidos.');
            return;
        }
        const resultado = formulaCallback(...values);
        mostrarResultado(metrica, resultado);
    });
}

// Definir cálculos específicos para cada KPI
calcularKPI('form-cpc-calculate', ['cpc-coste', 'cpc-clics'], (coste, clics) => `CPC: ${(coste / clics).toFixed(2)} €`, 'cpc');
calcularKPI('form-ctr-calculate', ['ctr-clics', 'ctr-impresiones'], (clics, impresiones) => `CTR: ${((clics / impresiones) * 100).toFixed(2)}%`, 'ctr');
calcularKPI('form-roas-calculate', ['roas-ingresos', 'roas-gastos'], (ingresos, gastos) => `ROAS: ${(ingresos / gastos).toFixed(2)}`, 'roas');
calcularKPI('form-cpa-calculate', ['cpa-gastos', 'cpa-conversiones'], (gastos, conversiones) => `CPA: ${(gastos / conversiones).toFixed(2)} €`, 'cpa');
calcularKPI('form-conversionRate-calculate', ['conversionRate-conversiones', 'conversionRate-visitantes'], (conversiones, visitantes) => `Tasa de Conversión: ${((conversiones / visitantes) * 100).toFixed(2)}%`, 'conversionRate');
calcularKPI('form-cpm-calculate', ['cpm-coste', 'cpm-impresiones'], (coste, impresiones) => `CPM: ${((coste / impresiones) * 1000).toFixed(2)} €`, 'cpm');
calcularKPI('form-roi-calculate', ['roi-ganancias', 'roi-inversion'], (ganancias, inversion) => `ROI: ${(((ganancias - inversion) / inversion) * 100).toFixed(2)}%`, 'roi');
calcularKPI('form-cpl-calculate', ['cpl-coste', 'cpl-leads'], (coste, leads) => `CPL: ${(coste / leads).toFixed(2)} €`, 'cpl');
calcularKPI('form-atc-calculate', ['atc-clicks', 'atc-events'], (clicks, atcEvents) => `% ATC: ${((atcEvents / clicks) * 100).toFixed(2)}%`, 'atc');

// Función para mostrar resultados y copiar
function mostrarResultado(metrica, mensaje) {
    resultadosPorMetrica[metrica] = mensaje;
    document.getElementById('resultados').innerHTML = `<p>${mensaje}</p>`;
    mostrarBotonCopiar();
    actualizarHistorial(metrica, mensaje);
    actualizarGrafico(metrica);
}

// Funciones auxiliares (copiar, gráfico y historial)
function mostrarBotonCopiar() { /* Lógica previa para copiar al portapapeles */ }
function ocultarBotonCopiar() { /* Lógica previa para ocultar botón */ }
function copiarAlPortapapeles(texto) { /* Lógica previa para copiar texto */ }
function actualizarHistorial(metrica, mensaje) { /* Lógica previa para historial */ }
function actualizarGrafico(metrica) { /* Lógica previa para gráficos */ }
