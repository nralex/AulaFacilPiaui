document.addEventListener('DOMContentLoaded', function () {
    let globalData; // Variável para armazenar os dados JSON globalmente

    // Carregar dados JSON
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            globalData = data; // Armazena os dados globalmente
            populateSelect('serie', data.series, 'nome');
            populateSuggestions('metodologia', data.sugestoesMetodologia);
            populateSuggestions('materialApoio', data.sugestoesMaterialApoio);
            populateSuggestions('avaliacao', data.sugestoesAvaliacao);

            document.getElementById('serie').addEventListener('change', function () {
                const selectedSerie = this.value;
                const serie = data.series.find(serie => serie.nome === selectedSerie);
                populateSelect('trimestre', serie.trimestres, 'nome');
            });

            document.getElementById('trimestre').addEventListener('change', function () {
                const selectedSerie = document.getElementById('serie').value;
                const selectedTrimestre = this.value;
                const serie = data.series.find(serie => serie.nome === selectedSerie);
                const trimestre = serie.trimestres.find(trimestre => trimestre.nome === selectedTrimestre);
                populateSelect('componenteCurricular', trimestre.componentesCurriculares, 'nome');
            });

            document.getElementById('componenteCurricular').addEventListener('change', function () {
                const selectedSerie = document.getElementById('serie').value;
                const selectedTrimestre = document.getElementById('trimestre').value;
                const selectedComponente = this.value;

                const serie = data.series.find(serie => serie.nome === selectedSerie);
                const trimestre = serie.trimestres.find(trimestre => trimestre.nome === selectedTrimestre);
                const componente = trimestre.componentesCurriculares.find(comp => comp.nome === selectedComponente);
                populateSelect('objetosConhecimento', componente.objetosConhecimento, 'nome', true);
            });
        });


    function populateSelect(selectId, data, key, isMultiple = false) {
        const select = document.getElementById(selectId);
        select.innerHTML = ''; // Limpa o select

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[key];
            option.textContent = item[key];
            select.appendChild(option);
        });

        if (!isMultiple) {
            select.value = data[0][key];
        }
    }



    function populateSuggestions(textareaId, suggestions) {
        const textarea = document.getElementById(textareaId);
        textarea.placeholder = 'Sugestões: ' + suggestions.join(', ');
    }

    
    // Função para gerar o PDF
    document.getElementById('planoForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const gre = document.getElementById('gre').value;
        const escola = document.getElementById('escola').value;
        const professor = document.getElementById('professor').value;
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;
        function formatarData(data) {
            const partes = data.split('-'); // Aqui a gente separa o ano, mês e dia
            return `${partes[2]}/${partes[1]}/${partes[0]}`; // Aqui a gente junta de novo no formato certo
        }
        const dataInicioFormatada = formatarData(dataInicio);
        const dataFimFormatada = formatarData(dataFim);

        const serie = document.getElementById('serie').value;
        const trimestre = document.getElementById('trimestre').value;
        const componenteCurricular = document.getElementById('componenteCurricular').value;
        const metodologia = document.getElementById('metodologia').value;
        const materialApoio = document.getElementById('materialApoio').value;
        const avaliacao = document.getElementById('avaliacao').value;
        const objetosConhecimentoSelect = document.getElementById('objetosConhecimento');
        const selectedObjetosConhecimento = Array.from(objetosConhecimentoSelect.selectedOptions);
        
        // Buscar informações detalhadas do JSON
        const serieData = globalData.series.find(s => s.nome === serie);
        const trimestreData = serieData.trimestres.find(t => t.nome === trimestre);
        const componenteData = trimestreData.componentesCurriculares.find(c => c.nome === componenteCurricular);
        const objetosConhecimentoData = selectedObjetosConhecimento.map(option => 
            componenteData.objetosConhecimento.find(obj => obj.nome === option.value)
        );

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configurações ABNT
        const fontSizeTitle = 14;
        const fontSizeText = 12;
        const lineHeight = 7;
        const margin = 30;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const maxLineWidth = pageWidth - margin * 2;

        // Função para adicionar texto com quebra de linha automática
        function addWrappedText(text, x, y, maxWidth, lineHeight) {
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return y + (lines.length * lineHeight);
        }

        // Função para adicionar uma nova página
        function addNewPage() {
            doc.addPage();
            return margin;
        }

        let yPosition = margin;

        // Cabeçalho
        doc.setFont('Times', 'bold');
        doc.setFontSize(fontSizeTitle);
        yPosition = addWrappedText("GOVERNO DO ESTADO DO PIAUÍ", margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText("SECRETARIA DA EDUCAÇÃO – SEDUC", margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`${gre}ª GERÊNCIA REGIONAL DE EDUCAÇÃO`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(escola, margin, yPosition, maxLineWidth, lineHeight);

        yPosition += lineHeight * 2;

        // Informações do professor
        doc.setFont('Times', 'normal');
        doc.setFontSize(fontSizeText);
        yPosition = addWrappedText(`Professor(a): ${professor}`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`Componente curricular: ${componenteCurricular}   Série: ${serie}`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`Trimestre: ${trimestre}   Vigência: de ${dataInicioFormatada} a ${dataFimFormatada}`, margin, yPosition, maxLineWidth, lineHeight);

        yPosition += lineHeight * 2;

        // Título
        doc.setFont('Times', 'bold');
        doc.setFontSize(fontSizeTitle);
        yPosition = addWrappedText("Plano de Aula", margin, yPosition, maxLineWidth, lineHeight);

        yPosition += lineHeight * 2;

        // Seções de conteúdo
        doc.setFont('Times', 'normal');
        doc.setFontSize(fontSizeText);

        const sections = [
            { title: "Objeto do Conhecimento:", content: objetosConhecimentoData.map(obj => obj.nome).join(", ") },
            { title: "Competência Específica:", content: objetosConhecimentoData.map(obj => obj.competencia).join("\n") },
            { title: "Habilidade:", content: objetosConhecimentoData.map(obj => obj.habilidade).join("\n") },
            { title: "Objetivo de Aprendizagem:", content: objetosConhecimentoData.map(obj => obj.objetivo).join("\n") },
            { title: "Metodologia:", content: metodologia },
            { title: "Material de Apoio:", content: materialApoio },
            { title: "Avaliação:", content: avaliacao }
        ];

        sections.forEach(section => {
            if (yPosition + lineHeight * 4 > pageHeight - margin) {
                yPosition = addNewPage();
            }

            doc.setFont('Times', 'bold');
            yPosition = addWrappedText(section.title, margin, yPosition, maxLineWidth, lineHeight);
            
            doc.setFont('Times', 'normal');
            yPosition = addWrappedText(section.content, margin, yPosition + lineHeight, maxLineWidth, lineHeight);
            
            yPosition += lineHeight * 2;
        });
        
        // Adicionar numeração de páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('Times', 'normal');
            doc.setFontSize(12);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - margin, { align: 'right' });
        }
        
        if (yPosition + lineHeight * 6 > pageHeight - margin) {
            yPosition = addNewPage(); // Isso aqui vai para uma nova página se não tiver espaço
        }
        
        // Linha para o professor
        doc.setFont('Times', 'bold');
        doc.text("________________________________________", margin, yPosition); // Desenha a linha
        yPosition += lineHeight; // Move para baixo
        doc.text("Professor(a)", margin, yPosition); // Escreve "Professor"
        
        yPosition += lineHeight * 2;
        
        // Linha para o coordenador
        doc.text("________________________________________", margin, yPosition);
        yPosition += lineHeight;
        doc.text("Coordenador(a)", margin, yPosition);
        
        yPosition += lineHeight * 2;
        
        // Linha para o diretor
        doc.text("________________________________________", margin, yPosition);
        yPosition += lineHeight;
        doc.text("Diretor(a)", margin, yPosition);
        

        // Gerar o PDF
        doc.save('plano_aula.pdf');
    });
});