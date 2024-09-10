function preencherComponentesCurriculares() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular');
    selectComponente.innerHTML = '<option value="">Selecione o Componente</option>'; // Resetar opções

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
    selectSerie.innerHTML = '<option value="">Selecione a Série</option>'; // Resetar opções

    if (apiData[selectArea]) {
        const series = apiData[selectArea].filter(item => item["Componente Curricular"] === selectComponente);
        let seriesUnicas = [...new Set(series.map(item => item["Série"]))];

        seriesUnicas.forEach(serie => {
            let option = document.createElement('option');
            option.value = serie;
            option.textContent = serie;
            selectSerie.appendChild(option);
        });
    }
}

function preencherObjetosConhecimento() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular').value;
    const selectSerie = document.getElementById('serie').value;
    const selectObjetos = document.getElementById('objetoConhecimento');
    selectObjetos.innerHTML = ''; // Limpar opções anteriores

    if (apiData[selectArea]) {
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
}

function autoCompletarCampos() {
    const selectArea = document.getElementById('areaConhecimento').value;
    const selectComponente = document.getElementById('componenteCurricular').value;
    const selectSerie = document.getElementById('serie').value;
    const objetoSelecionado = document.getElementById('objetoConhecimento').value;

    const dados = apiData[selectArea].find(item =>
        item["Componente Curricular"] === selectComponente &&
        item["Série"] === selectSerie &&
        item["OBJETOS DO CONHECIMENTO"] === objetoSelecionado
    );

    if (dados) {
        document.getElementById('competenciaEspecifica').value = dados["COMPETÊNCIA ESPECÍFICA"];
        document.getElementById('habilidadeEspecifica').value = dados["HABILIDADE"];
        document.getElementById('objetivos').value = dados["OBJETIVO DE APRENDIZAGEM"];
    }
}

function salvarPlanoDeAula(event) {
    event.preventDefault();

    const planoDeAula = {
        gre: document.getElementById('gre').value,
        escola: document.getElementById('escola').value,
        professor: document.getElementById('professor').value,
        areaConhecimento: document.getElementById('areaConhecimento').value,
        componenteCurricular: document.getElementById('componenteCurricular').value,
        serie: document.getElementById('serie').value,
        competenciaEspecifica: document.getElementById('competenciaEspecifica').value,
        habilidadeEspecifica: document.getElementById('habilidadeEspecifica').value,
        objetivos: document.getElementById('objetivos').value,
        objetosConhecimento: [...document.getElementById('objetoConhecimento').selectedOptions].map(option => option.value),
        metodologia: document.getElementById('metodologia').value,
        materialDeApoio: document.getElementById('materialDeApoio').value,
        estrategiaDeAvaliacao: document.getElementById('estrategiaDeAvaliacao').value,
    };

    // Armazena o plano de aula no localStorage
    localStorage.setItem('planoDeAula', JSON.stringify(planoDeAula));
    alert('Plano de aula salvo com sucesso!');

    // Redireciona para a página de exportação do PDF
    window.location.assign("export_pdf.html");
}


