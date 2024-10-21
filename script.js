// Objeto para almacenar los resultados por métrica
let resultadosPorMetrica = {};

// Función para calcular KPIs
function calcularKPI(formId, inputIds, calculoFn, metrica) {
    const form = document.querySelector(`#${formId}`);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valores = inputIds.map(id => parseFloat(document.querySelector(`#${id}`).value));
        const resultado = calculoFn(...valores);
        mostrarResultado(metrica, resultado);
    });
}

// Inicializar los botones de métricas
function inicializarBotones() {
    const metricButtons = document.querySelectorAll('.metric-buttons button');
    metricButtons.forEach(button => {
        const metric = button.getAttribute('data-metric');
        button.addEventListener('click', () => {
            mostrarFormulario(metric);
            // Marcar el botón activo
            metricButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function mostrarFormulario(metric) {
    // Ocultar el mensaje inicial
    const mensajeInicial = document.getElementById('mensaje-inicial');
    if (mensajeInicial) {
        mensajeInicial.style.display = 'none';
    }

    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.form-wrapper');
    forms.forEach(form => {
        form.style.display = 'none';
    });

    // Mostrar el formulario seleccionado
    const selectedForm = document.getElementById(`form-${metric}`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
        
        // Mostrar la definición del KPI si no existe
        let definitionElement = selectedForm.querySelector('.kpi-definition');
        if (!definitionElement && kpiDefinitions[metric]) {
            const newDefinitionElement = document.createElement('p');
            newDefinitionElement.className = 'kpi-definition';
            newDefinitionElement.textContent = kpiDefinitions[metric];
            const h2Element = selectedForm.querySelector('h2');
            if (h2Element) {
                h2Element.insertAdjacentElement('afterend', newDefinitionElement);
            }
        }
    }
}


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
    atc: "Porcentaje de Add to Cart (% ATC): Es el porcentaje de clics que resultan en un evento de 'Añadir al Carrito'.",
    ltv: "Life Time Value (LTV): Es el valor estimado de los ingresos generados por un cliente a lo largo de su relación con la empresa.",
    adRank: "Ad Rank: Es una métrica que determina la posición de un anuncio en los resultados de búsqueda.",
    acos: "Average Cost of Sale (ACOS): Es el porcentaje de ventas que se gastan en publicidad.",
    i2c: "Impressions to Conversion (I2C): Es el porcentaje de impresiones que resultan en una conversión.",
    aov: "Average Order Value (AOV): Es el valor promedio de los pedidos realizados por los clientes.",
    impressionShare: "Impression Share: Es la proporción de impresiones que recibe un anuncio en comparación con el número total de impresiones posibles.",
    ecpm: "Effective Cost per Mille (eCPM): Es el coste efectivo por mil impresiones, que mide la rentabilidad de un anuncio.",
    rpc: "Revenue Per Click (RPC): Es el ingreso generado por cada clic en un anuncio."
};

// Función para mostrar el resultado en la página
function mostrarResultado(metrica, mensaje) {
    resultadosPorMetrica[metrica] = mensaje;
    const resultadoDiv = document.getElementById('resultados');
    resultadoDiv.innerHTML = `<p>${mensaje}</p>`;

    // Mostrar la sección de resultados
    document.getElementById('result-section').hidden = false;

    // Mostrar el botón de copiar al portapapeles
    mostrarBotonCopiar();

    actualizarHistorial(metrica, mensaje);
    actualizarGrafico();
}

// Función para mostrar el botón de copiar al portapapeles
function mostrarBotonCopiar() {
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.hidden = false;
        copyButton.addEventListener('click', () => {
            const resultadoElemento = document.getElementById('resultados');
            const valorParaCopiar = resultadoElemento.textContent;
            navigator.clipboard.writeText(valorParaCopiar);
            alert(`Valor copiado: ${valorParaCopiar}`);
        });
    }
}

// Función para actualizar el historial de cálculos
function actualizarHistorial(metrica, mensaje) {
    const historySection = document.getElementById('calculation-history');
    const listItem = document.createElement('li');
    listItem.textContent = `${metrica.toUpperCase()}: ${mensaje}`;
    historySection.appendChild(listItem);
    document.getElementById('history-section').hidden = false;
}

// Función para actualizar y mostrar el gráfico
function actualizarGrafico() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const data = Object.entries(resultadosPorMetrica).map(([key, value]) => ({
        metrica: key,
        valor: parseFloat(value.replace(/[^0-9.-]+/g,""))
    }));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.metrica.toUpperCase()),
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

// Función para cambiar el modo oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Cambiar los iconos
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');

    if (body.classList.contains('dark-mode')) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
    } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
    }
}

// Función para reiniciar los cálculos
function resetCalculations() {
    // Reiniciar los resultados
    resultadosPorMetrica = {};
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('result-section').hidden = true;

    // Reiniciar el historial
    const historySection = document.getElementById('calculation-history');
    historySection.innerHTML = '';
    document.getElementById('history-section').hidden = true;

    // Reiniciar los formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());

    // Destruir el gráfico si existe
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Desactivar botones activos
    const metricButtons = document.querySelectorAll('.metric-buttons button');
    metricButtons.forEach(btn => btn.classList.remove('active'));

    // Mostrar el mensaje inicial
    const mensajeInicial = document.getElementById('mensaje-inicial');
    if (mensajeInicial) {
        mensajeInicial.style.display = 'block';
    }

    // Ocultar todos los formularios
    const formWrappers = document.querySelectorAll('.form-wrapper');
    formWrappers.forEach(formWrapper => {
        formWrapper.style.display = 'none';
    });
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    inicializarBotones();
    
    // Configurar los cálculos de KPIs
    calcularKPI('form-cpc', ['cpc-coste', 'cpc-clics'], 
        (coste, clics) => `CPC: ${(coste / clics).toFixed(2)} €`, 'cpc');
    calcularKPI('form-ctr', ['ctr-clics', 'ctr-impresiones'], 
        (clics, impresiones) => `CTR: ${((clics / impresiones) * 100).toFixed(2)}%`, 'ctr');
    calcularKPI('form-roas', ['roas-ingresos', 'roas-gastos'], 
        (ingresos, gastos) => `ROAS: ${(ingresos / gastos).toFixed(2)}`, 'roas');
    calcularKPI('form-cpa', ['cpa-gastos', 'cpa-conversiones'], 
        (gastos, conversiones) => `CPA: ${(gastos / conversiones).toFixed(2)} €`, 'cpa');
    calcularKPI('form-conversionRate', ['conversionRate-conversiones', 'conversionRate-visitantes'], 
        (conversiones, visitantes) => `Tasa de Conversión: ${((conversiones / visitantes) * 100).toFixed(2)}%`, 'conversionRate');
    calcularKPI('form-cpm', ['cpm-coste', 'cpm-impresiones'], 
        (coste, impresiones) => `CPM: ${((coste / impresiones) * 1000).toFixed(2)} €`, 'cpm');
    calcularKPI('form-roi', ['roi-ganancias', 'roi-inversion'], 
        (ganancias, inversion) => `ROI: ${(((ganancias - inversion) / inversion) * 100).toFixed(2)}%`, 'roi');
    calcularKPI('form-cpl', ['cpl-coste', 'cpl-leads'], 
        (coste, leads) => `CPL: ${(coste / leads).toFixed(2)} €`, 'cpl');
    calcularKPI('form-atc', ['atc-clicks', 'atc-events'], 
        (clicks, events) => `% ATC: ${((events / clicks) * 100).toFixed(2)}%`, 'atc');
    calcularKPI('form-ltv', ['ltv-totalRevenue', 'ltv-totalCustomers'], 
        (totalRevenue, totalCustomers) => `LTV: ${(totalRevenue / totalCustomers).toFixed(2)} €`, 'ltv');
    calcularKPI('form-adRank', ['adRank-cpcBid', 'adRank-qualityScore'], 
        (cpcBid, qualityScore) => `Ad Rank: ${(cpcBid * qualityScore).toFixed(2)}`, 'adRank');
    calcularKPI('form-acos', ['acos-totalCost', 'acos-totalRevenue'], 
        (totalCost, totalRevenue) => `ACOS: ${((totalCost / totalRevenue) * 100).toFixed(2)}%`, 'acos');
    calcularKPI('form-i2c', ['i2c-conversions', 'i2c-impressions'], 
        (conversions, impressions) => `I2C: ${((conversions / impressions) * 100).toFixed(2)}%`, 'i2c');
    calcularKPI('form-aov', ['aov-totalRevenue', 'aov-totalConversions'], 
        (totalRevenue, totalConversions) => `AOV: ${(totalRevenue / totalConversions).toFixed(2)} €`, 'aov');
    calcularKPI('form-impressionShare', ['impressionShare-impressions', 'impressionShare-totalEligibleImpressions'], 
        (impressions, totalEligibleImpressions) => `Impression Share: ${((impressions / totalEligibleImpressions) * 100).toFixed(2)}%`, 'impressionShare');
    calcularKPI('form-ecpm', ['ecpm-totalRevenue', 'ecpm-totalImpressions'], 
        (totalRevenue, totalImpressions) => `eCPM: ${((totalRevenue / totalImpressions) * 1000).toFixed(2)} €`, 'ecpm');
    calcularKPI('form-rpc', ['rpc-revenue', 'rpc-goalValue', 'rpc-clicks'], 
        (revenue, goalValue, clicks) => `RPC: ${((revenue + goalValue) / clicks).toFixed(2)} €`, 'rpc');
});

// Añadir eventos para el cambio de tema y reinicio
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('reset-button').addEventListener('click', resetCalculations);

    // Configurar el estado inicial de los iconos de tema
    const body = document.body;
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');

    if (body.classList.contains('dark-mode')) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
    } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
    }
