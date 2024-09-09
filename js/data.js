let apiData = {};

fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        apiData = data;
        preencherAreasConhecimento();
    });

function preencherAreasConhecimento() {
    const selectArea = document.getElementById('areaConhecimento');
    for (let area in apiData) {
        let option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        selectArea.appendChild(option);
    }
}

function preencherComponentesCurriculares() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular');
    selectComponente.innerHTML = ''; // Limpar opções anteriores

    if (apiData[selectArea]) {
        const componentes = apiData[selectArea];
        let componentesUnicos = [...new Set(componentes.map(item => item["Componente Curricular"]))];

        componentesUnicos.forEach(componente => {
            let option = document.createElement('option');
            option.value = componente;
            option.textContent = componente;
            selectComponente.appendChild(option);
        });
    }
}

function preencherSeries() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular').value;
    const selectSerie = document.getElementById('serie');
    selectSerie.innerHTML = ''; // Limpar opções anteriores

    const series = apiData[selectArea].filter(item => item["Componente Curricular"] === selectComponente);
    let seriesUnicas = [...new Set(series.map(item => item["Série"]))];

    seriesUnicas.forEach(serie => {
        let option = document.createElement('option');
        option.value = serie;
        option.textContent = serie;
        selectSerie.appendChild(option);
    });
}

function preencherObjetosConhecimento() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular').value;
    const selectSerie = document.getElementById('serie').value;
    const selectObjetos = document.getElementById('objetoConhecimento');
    selectObjetos.innerHTML = ''; // Limpar opções anteriores

    const objetos = apiData[selectArea].filter(item =>
        item["Componente Curricular"] === selectComponente &&
        item["Série"] === selectSerie
    );

    objetos.forEach(objeto => {
        let option = document.createElement('option');
        option.value = objeto["OBJETOS DO CONHECIMENTO"];
        option.textContent = objeto["OBJETOS DO CONHECIMENTO"];
        selectObjetos.appendChild(option);
    });
}

function autoCompletarCampos() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular').value;
    const selectSerie = document.getElementById('serie').value;
    const selectObjetos = document.getElementById('objetoConhecimento');
    const objetosSelecionados = Array.from(selectObjetos.selectedOptions).map(option => option.value);

    let competencias = [];
    let habilidades = [];
    let objetivos = [];

    objetosSelecionados.forEach(objetoSelecionado => {
        const dados = apiData[selectArea].find(item =>
            item["Componente Curricular"] === selectComponente &&
            item["Série"] === selectSerie &&
            item["OBJETOS DO CONHECIMENTO"] === objetoSelecionado
        );

        if (dados) {
            competencias.push(dados["COMPETÊNCIA ESPECÍFICA"]);
            habilidades.push(dados["HABILIDADE"]);
            objetivos.push(dados["OBJETIVO DE APRENDIZAGEM"]);
        }
    });

    // Atualiza os campos com valores concatenados
    document.getElementById('competenciaEspecifica').value = competencias.join('; ');
    document.getElementById('habilidadeEspecifica').value = habilidades.join('; ');
    document.getElementById('objetivos').value = objetivos.join('; ');
}

