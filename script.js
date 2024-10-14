// Definiciones de KPIs
const kpiDefinitions = {
    cpc: "Coste por Clic (CPC): Es el coste promedio que se paga por cada clic en un anuncio.",
    ctr: "Click-Through Rate (CTR): Es el porcentaje de personas que hacen clic en un anuncio después de verlo.",
    roas: "Return on Ad Spend (ROAS): Es el retorno de la inversión publicitaria, que mide los ingresos generados por cada euro gastado en publicidad.",
    cpa: "Coste por Adquisición (CPA): Es el coste promedio de adquirir un cliente o una conversión.",
    conversionRate: "Tasa de Conversión: Es el porcentaje de visitantes que realizan una acción deseada (como una compra).",
    cpm: "Coste por Mil Impresiones (CPM): Es el coste de mostrar un anuncio mil veces.",
    roi: "Retorno de Inversión (ROI): Es el beneficio obtenido en relación con la inversión realizada, expresado en porcentaje."
};

// Almacenar resultados por métrica
const resultadosPorMetrica = {};
let historialCalculos = [];

// Configuración del tema oscuro
const themeToggle = document.getElementById('theme-toggle');
const bodyElement = document.body;

themeToggle.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    
    // Cambiar entre el icono de luz y de oscuridad
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

// Mostrar y ocultar formularios según la métrica seleccionada
const buttons = document.querySelectorAll('.metric-buttons button');
const forms = document.querySelectorAll('.form-wrapper');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const metric = button.getAttribute('data-metric');
        forms.forEach(form => {
            form.style.display = 'none';
        });
        const selectedForm = document.getElementById(`form-${metric}`);
        selectedForm.style.display = 'block';
        
        // Añadir la definición del KPI debajo del título H2
        const definitionElement = selectedForm.querySelector('.kpi-definition');
        if (definitionElement) {
            definitionElement.textContent = kpiDefinitions[metric];
        } else {
            const newDefinitionElement = document.createElement('p');
            newDefinitionElement.className = 'kpi-definition';
            newDefinitionElement.textContent = kpiDefinitions[metric];
            
            // Colocar la definición justo después del H2
            const h2Element = selectedForm.querySelector('h2');
            h2Element.insertAdjacentElement('afterend', newDefinitionElement);
        }
        
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const resultadosDiv = document.getElementById('resultados');
        if (resultadosPorMetrica[metric]) {
            resultadosDiv.innerHTML = `<p>${resultadosPorMetrica[metric]}</p>`;
            mostrarBotonCopiar();
            actualizarGrafico(metric);
        } else {
            resultadosDiv.innerHTML = '';
            ocultarBotonCopiar();
        }
    });
});

// Funciones de cálculo para cada métrica
// Calcular CPC
document.getElementById('form-cpc-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const costeTotal = parseFloat(document.getElementById('cpc-coste').value);
    const clics = parseFloat(document.getElementById('cpc-clics').value);
    const cpc = costeTotal / clics;
    mostrarResultado('cpc', `CPC: ${cpc.toFixed(2)} €`);
});

// Calcular CTR
document.getElementById('form-ctr-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const clics = parseFloat(document.getElementById('ctr-clics').value);
    const impresiones = parseFloat(document.getElementById('ctr-impresiones').value);
    const ctr = (clics / impresiones) * 100;
    mostrarResultado('ctr', `CTR: ${ctr.toFixed(2)}%`);
});

// Calcular ROAS
document.getElementById('form-roas-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const ingresos = parseFloat(document.getElementById('roas-ingresos').value);
    const gastos = parseFloat(document.getElementById('roas-gastos').value);
    const roas = ingresos / gastos;
    mostrarResultado('roas', `ROAS: ${roas.toFixed(2)}`); 
});

// Calcular CPA
document.getElementById('form-cpa-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const gastos = parseFloat(document.getElementById('cpa-gastos').value);
    const conversiones = parseFloat(document.getElementById('cpa-conversiones').value);
    const cpa = gastos / conversiones;
    mostrarResultado('cpa', `CPA: ${cpa.toFixed(2)} €`);
});

// Calcular Tasa de Conversión
document.getElementById('form-conversionRate-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const conversiones = parseFloat(document.getElementById('conversionRate-conversiones').value);
    const visitantes = parseFloat(document.getElementById('conversionRate-visitantes').value);
    const conversionRate = (conversiones / visitantes) * 100;
    mostrarResultado('conversionRate', `Tasa de Conversión: ${conversionRate.toFixed(2)}%`);
});

// Calcular CPM
document.getElementById('form-cpm-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const coste = parseFloat(document.getElementById('cpm-coste').value);
    const impresiones = parseFloat(document.getElementById('cpm-impresiones').value);
    const cpm = (coste / impresiones) * 1000;
    mostrarResultado('cpm', `CPM: ${cpm.toFixed(2)} €`);
});

// Calcular ROI
document.getElementById('form-roi-calculate').addEventListener('submit', function(e) {
    e.preventDefault();
    const ganancias = parseFloat(document.getElementById('roi-ganancias').value);
    const inversion = parseFloat(document.getElementById('roi-inversion').value);
    const roi = ((ganancias - inversion) / inversion) * 100;
    mostrarResultado('roi', `ROI: ${roi.toFixed(2)}%`);
});

// Mostrar resultado
function mostrarResultado(metrica, mensaje) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosPorMetrica[metrica] = mensaje; // Guardar el mensaje en el objeto

    // Solo guarda el mensaje sin duplicar el nombre de la métrica
    resultadosDiv.innerHTML = `${mensaje}`; // Muestra solo el mensaje

    mostrarBotonCopiar();
    actualizarHistorial(metrica, mensaje);
}

// Función para mostrar el botón de copiar
function mostrarBotonCopiar() {
    let copyButton = document.getElementById('copy-button');
    if (!copyButton) {
        copyButton = document.createElement('button');
        copyButton.id = 'copy-button';
        copyButton.textContent = 'Copiar al portapapeles';
        copyButton.className = 'styled-copy-button';
        document.getElementById('resultados').appendChild(copyButton);
    }
    copyButton.style.display = 'block';
    copyButton.onclick = () => {
        copiarAlPortapapeles(document.getElementById('resultados').innerText);
    };
}

// Función para ocultar el botón de copiar
function ocultarBotonCopiar() {
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.style.display = 'none';
    }
}

// Función para copiar al portapapeles
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            alert('Texto copiado al portapapeles: ' + texto);
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
        });
}

// Actualizar el historial de cálculos
function actualizarHistorial(metrica, mensaje) {
    const historyList = document.getElementById('calculation-history');
    
    // Limpiar el historial antes de añadir el nuevo
    historyList.innerHTML = '';

    historialCalculos.push({ metrica, mensaje });
    
    // Mostrar el historial
    historialCalculos.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.metrica.toUpperCase()}: ${item.mensaje}`; // Solo muestra una vez el nombre
        historyList.appendChild(listItem);
    });
}

// Función para actualizar gráfico
function actualizarGrafico(metrica) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    
    // Verificar si hay datos para la métrica seleccionada
    if (Object.keys(resultadosPorMetrica).length > 0) {
        const data = {
            labels: Object.keys(resultadosPorMetrica),
            datasets: [{
                label: 'Resultados de Métricas',
                data: Object.values(resultadosPorMetrica).map(res => parseFloat(res.split(': ')[1])),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar', // Tipo de gráfico (puede ser 'line', 'bar', etc.)
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor' // Título del eje Y
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Métricas' // Título del eje X
                        }
                    }
                }
            }
        };

        // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
        if (typeof window.myChart !== 'undefined') {
            window.myChart.destroy();
        }
        // Crear un nuevo gráfico
        window.myChart = new Chart(ctx, config);
    } else {
        alert("No hay datos disponibles para mostrar en el gráfico.");
    }
}