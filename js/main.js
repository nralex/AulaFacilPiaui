document.addEventListener('DOMContentLoaded', function () {
    const areaSelect = document.getElementById('area');
    const componenteSelect = document.getElementById('componente');
    const serieSelect = document.getElementById('serie');
    const objetosContainer = document.getElementById('objetos');

    // Preencher Área do Conhecimento
    Object.keys(data).forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });

    areaSelect.addEventListener('change', function () {
        componenteSelect.innerHTML = '';  // Limpa as opções anteriores
        serieSelect.innerHTML = '';       // Limpa as opções anteriores
        objetosContainer.innerHTML = '';  // Limpa os objetos anteriores

        const selectedArea = areaSelect.value;

        if (selectedArea) {
            const componentes = data[selectedArea];

            const componentesCurriculares = [...new Set(componentes.map(item => item["Componente Curricular"]))];
            componentesCurriculares.forEach(componente => {
                const option = document.createElement('option');
                option.value = componente;
                option.textContent = componente;
                componenteSelect.appendChild(option);
            });

            componenteSelect.disabled = false;
        }
    });

    componenteSelect.addEventListener('change', function () {
        serieSelect.innerHTML = '';       // Limpa as opções anteriores
        objetosContainer.innerHTML = '';  // Limpa os objetos anteriores

        const selectedArea = areaSelect.value;
        const selectedComponente = componenteSelect.value;

        if (selectedComponente) {
            const series = data[selectedArea].filter(item => item["Componente Curricular"] === selectedComponente);
            const seriesUnicas = [...new Set(series.map(item => item["Série"]))];

            seriesUnicas.forEach(serie => {
                const option = document.createElement('option');
                option.value = serie;
                option.textContent = serie;
                serieSelect.appendChild(option);
            });

            serieSelect.disabled = false;
        }
    });

    serieSelect.addEventListener('change', function () {
        objetosContainer.innerHTML = '';  // Limpa os objetos anteriores

        const selectedArea = areaSelect.value;
        const selectedComponente = componenteSelect.value;
        const selectedSerie = serieSelect.value;

        if (selectedSerie) {
            const objetos = data[selectedArea].filter(item => item["Componente Curricular"] === selectedComponente && item["Série"] === selectedSerie)[0]["OBJETOS DO CONHECIMENTO"];
            objetos.forEach(objeto => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = objeto;
                checkbox.id = objeto;

                const label = document.createElement('label');
                label.htmlFor = objeto;
                label.textContent = objeto;

                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);

                objetosContainer.appendChild(div);
            });
        }
    });
});
