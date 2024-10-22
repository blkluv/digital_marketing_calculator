// Inicializar los botones de métricas
function inicializarBotones() {
    const metricButtons = document.querySelectorAll('.metric-buttons button');
    let activeButton = null;

    metricButtons.forEach(button => {
        button.addEventListener('click', () => {
            const metric = button.getAttribute('data-metric');
            mostrarFormulario(metric);

            if (window.innerWidth <= 768) {  // Acordeón para móvil
                if (activeButton && activeButton !== button) {
                    const activeForm = document.querySelector(`#form-${activeButton.getAttribute('data-metric')}`);
                    if (activeForm) {
                        activeForm.classList.remove('active');
                        activeButton.classList.remove('active');
                    }
                }
                const form = document.querySelector(`#form-${metric}`);
                if (form) {
                    form.classList.toggle('active');
                    button.classList.toggle('active');
                    activeButton = button.classList.contains('active') ? button : null;
                }
            } else {
                metricButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        });
    });
}

const kpiDefinitions = {
    acos: "ACOS (Advertising Cost of Sale) measures the efficiency of advertising spend. It is the percentage of ad spend relative to revenue generated.",
    adRank: "Ad Rank determines your ads position on a search engine results page. It is calculated by multiplying your CPC bid by your quality score.",
    aov: "AOV (Average Order Value) is the average amount of money spent each time a customer places an order.",
    atc: "% ATC (Add to Cart) shows the percentage of users who added items to the cart out of all clicks.",
    cpa: "CPA (Cost Per Acquisition) is the cost incurred for each conversion or acquisition.",
    cpc: "CPC (Cost Per Click) is the amount paid for each click in a pay-per-click advertising campaign.",
    cpl: "CPL (Cost Per Lead) is the cost of acquiring a lead through a marketing campaign.",
    cpm: "CPM (Cost Per Mille) is the cost of 1,000 ad impressions on a web page.",
    conversionRate: "Conversion Rate is the percentage of users who take the desired action (e.g., making a purchase) out of total visitors.",
    ctr: "CTR (Click-Through Rate) is the percentage of people who clicked on your ad after seeing it.",
    ecpm: "eCPM (Effective Cost Per Mille) calculates the revenue generated per 1,000 impressions, combining different revenue sources.",
    i2c: "I2C (Impressions to Conversion) measures how many impressions are needed for a conversion.",
    impressionShare: "Impression Share is the percentage of total impressions your ads received compared to the total available impressions.",
    ltv: "LTV (Customer Lifetime Value) is the total revenue a business can reasonably expect from a single customer account.",
    roas: "ROAS (Return on Ad Spend) shows how much revenue is earned for every dollar spent on advertising.",
    rpc: "RPC (Revenue Per Click) calculates the average revenue generated for each click.",
    roi: "ROI (Return on Investment) measures the profit made from investments relative to the cost of the investment."
};

const industryBenchmarks = {
    acos: { value: 30, unit: '%' },  // ACOS como porcentaje
    adRank: { value: 3.0, unit: '' },  // Ad Rank sin unidad
    atc: { value: 7.5, unit: '%' },  // Add to Cart como porcentaje
    conversionRate: { value: 1.2, unit: '%' },  // Tasa de conversión como porcentaje
    cpa: { value: 50, unit: '€' },  // CPA en euros
    cpc: { value: 1.25, unit: '€' },  // CPC en euros
    cpl: { value: 30, unit: '€' },  // CPL en euros
    cpm: { value: 10, unit: '€' },  // CPM en euros
    ctr: { value: 2.5, unit: '%' },  // CTR como porcentaje
    ecpm: { value: 12, unit: '€' },  // eCPM en euros
    i2c: { value: 1.5, unit: '%' },  // Impresiones necesarias para conversión, porcentaje
    impressionShare: { value: 70, unit: '%' },  // Share de impresión como porcentaje
    ltv: { value: 196.89, unit: '€' },  // LTV en euros
    roi: { value: 150, unit: '%' },  // ROI como porcentaje
    roas: { value: 4, unit: 'x' },  // ROAS como factor multiplicativo
    rpc: { value: 2.5, unit: '€' }  // Revenue per click en euros
};



function mostrarFormulario(metric) {
    const mensajeInicial = document.getElementById('mensaje-inicial');
    if (mensajeInicial) {
        mensajeInicial.style.display = 'none';
    }

    const forms = document.querySelectorAll('.form-wrapper');
    if (window.innerWidth > 768) {
        forms.forEach(form => form.style.display = 'none');
    }

    const selectedForm = document.getElementById(`form-${metric}`);
    if (selectedForm) {
        if (window.innerWidth > 768) {
            selectedForm.style.display = 'block';
        }

        // Add definition below h2 if it doesn't exist
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

// Validación de formularios
function validateFormInputs(inputIds) {
    let isValid = true;
    inputIds.forEach(id => {
        const inputElement = document.querySelector(`#${id}`);
        if (!inputElement.value || parseFloat(inputElement.value) < 0) {
            isValid = false;
            inputElement.classList.add('input-error');
            const errorMessage = inputElement.nextElementSibling;
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        } else {
            inputElement.classList.remove('input-error');
            const errorMessage = inputElement.nextElementSibling;
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
    });
    return isValid;
}


// Calcular KPIs
function calcularKPI(formId, inputIds, calculoFn, metrica) {
    const form = document.querySelector(`#${formId}`);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isValid = validateFormInputs(inputIds);
        if (!isValid) return;

        const valores = inputIds.map(id => parseFloat(document.querySelector(`#${id}`).value));
        const resultado = calculoFn(...valores);
        mostrarResultado(metrica, resultado);
    });
}

function mostrarResultado(metrica, resultado) {
    const benchmark = industryBenchmarks[metrica];
    let benchmarkMessage = '';

    if (benchmark !== undefined) {
        const benchmarkValue = benchmark.value;
        const benchmarkUnit = benchmark.unit || '';

        // Asegurar que el valor de resultado es numérico
        const numericResult = parseFloat(resultado.replace(/[^0-9.-]+/g,""));

        if (numericResult > benchmarkValue) {
            benchmarkMessage = `Tu resultado está por encima del promedio de ecommerce (${benchmarkValue}${benchmarkUnit}). ¡Buen trabajo!`;
        } else if (numericResult < benchmarkValue) {
            benchmarkMessage = `Tu resultado está por debajo del promedio de ecommerce (${benchmarkValue}${benchmarkUnit}).`;
        } else {
            benchmarkMessage = `Tu resultado está en el promedio de ecommerce (${benchmarkValue}${benchmarkUnit}).`;
        }
    }

    // Mostrar resultado en texto
    const resultadoDiv = document.getElementById('resultados');
    resultadoDiv.innerHTML = `<p>${resultado}</p><p>${benchmarkMessage}</p>`;
    document.getElementById('result-section').hidden = false;

    // Actualizar gráfico con el valor calculado y el benchmark
    actualizarGrafico(metrica, resultado);

    mostrarBotonCopiar();
    actualizarHistorial(metrica, resultado);
}



// Botón de copiar al portapapeles
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

// Actualizar historial de cálculos
function actualizarHistorial(metrica, mensaje) {
    const historySection = document.getElementById('calculation-history');
    const listItem = document.createElement('li');
    listItem.textContent = `${metrica.toUpperCase()}: ${mensaje}`;
    historySection.appendChild(listItem);
    document.getElementById('history-section').hidden = false;
}

function actualizarGrafico(metrica, valorCalculado) {
    const ctx = document.getElementById('resultChart').getContext('2d');

    // Obtener el benchmark de la métrica actual
    const benchmark = industryBenchmarks[metrica] ? industryBenchmarks[metrica].value : null;
    
    const labels = ['Valor Calculado', 'Benchmark'];
    const data = [parseFloat(valorCalculado.replace(/[^0-9.-]+/g,"")), benchmark];  // Valor calculado y benchmark
    
    // Destruir el gráfico anterior si existe
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Crear el nuevo gráfico con dos barras (valor calculado vs benchmark)
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: metrica.toUpperCase(),
                data: data,
                backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                borderColor: ['rgba(0, 123, 255, 1)', 'rgba(255, 99, 132, 1)'],
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

// Cambiar el tema oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
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

// Reiniciar cálculos
function resetCalculations() {
    resultadosPorMetrica = {};
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('result-section').hidden = true;

    const historySection = document.getElementById('calculation-history');
    historySection.innerHTML = '';
    document.getElementById('history-section').hidden = true;

    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());

    if (window.myChart) {
        window.myChart.destroy();
    }

    const metricButtons = document.querySelectorAll('.metric-buttons button');
    metricButtons.forEach(btn => btn.classList.remove('active'));

    const mensajeInicial = document.getElementById('mensaje-inicial');
    if (mensajeInicial) {
        mensajeInicial.style.display = 'block';
    }

    const formWrappers = document.querySelectorAll('.form-wrapper');
    formWrappers.forEach(formWrapper => {
        formWrapper.style.display = 'none';
    });
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    resetCalculations();
    inicializarBotones();
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

    // Añadir evento de resize para manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        const forms = document.querySelectorAll('.form-wrapper');
        if (window.innerWidth > 768) {
            // En desktop, revertir a comportamiento normal
            forms.forEach(form => {
                form.classList.remove('active');
                form.style.display = 'none';
            });
            const activeButton = document.querySelector('.metric-buttons button.active');
            if (activeButton) {
                const metric = activeButton.getAttribute('data-metric');
                const activeForm = document.getElementById(`form-${metric}`);
                if (activeForm) {
                    activeForm.style.display = 'block';
                }
            }
        }
    });
});
