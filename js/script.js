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

    // Função para popular selects
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

    // Função para popular sugestões
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

        // Formatação da data
        function formatarData(data) {
            const partes = data.split('-'); // Separar o ano, mês e dia
            return `${partes[2]}/${partes[1]}/${partes[0]}`; // Juntar de novo no formato correto
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
        doc.setFontSize(fontSizeText);
        yPosition = addWrappedText("GOVERNO DO ESTADO DO PIAUÍ", margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText("SECRETARIA DA EDUCAÇÃO – SEDUC", margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`${gre}ª GERÊNCIA REGIONAL DE EDUCAÇÃO`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(escola, margin, yPosition, maxLineWidth, lineHeight);

        // Informações do professor
        yPosition = addWrappedText(`Professor(a): ${professor}`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`Componente curricular: ${componenteCurricular}   Série: ${serie}`, margin, yPosition, maxLineWidth, lineHeight);
        yPosition = addWrappedText(`Trimestre: ${trimestre}   Vigência: de ${dataInicioFormatada} a ${dataFimFormatada}`, margin, yPosition, maxLineWidth, lineHeight);

        yPosition += lineHeight;

        // Título
        doc.setFontSize(fontSizeTitle);
        doc.text("Plano de Aula", pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineHeight;

        // Eliminar duplicatas para Competência, Habilidade e Objetivo
        const competenciasUnicas = [...new Set(objetosConhecimentoData.map(obj => obj.competencia))].join("\n");
        const habilidadesUnicas = [...new Set(objetosConhecimentoData.map(obj => obj.habilidade))].join("\n");
        const objetivosUnicos = [...new Set(objetosConhecimentoData.map(obj => obj.objetivo))].join("\n");

        // Seções de conteúdo
        doc.setFont('Times', 'normal');
        doc.setFontSize(fontSizeText);

        const sections = [
            { title: "Objeto do Conhecimento:", content: objetosConhecimentoData.map(obj => obj.nome).join(", ") },
            { title: "Competência Específica:", content: competenciasUnicas },
            { title: "Habilidade:", content: habilidadesUnicas },
            { title: "Objetivo de Aprendizagem:", content: objetivosUnicos },
            { title: "Metodologia:", content: metodologia },
            { title: "Material de Apoio:", content: materialApoio },
            { title: "Avaliação:", content: avaliacao }
        ];

        sections.forEach(section => {
            if (yPosition + lineHeight * 2 > pageHeight - margin) {
                yPosition = addNewPage();
            }

            doc.setFont('Times', 'bold');
            yPosition = addWrappedText(section.title, margin, yPosition, maxLineWidth, lineHeight);

            doc.setFont('Times', 'normal');
            yPosition = addWrappedText(section.content, margin, yPosition + lineHeight, maxLineWidth, lineHeight);

            yPosition += lineHeight;
        });

        // Adicionar numeração de páginas no rodapé, sem interferir nas assinaturas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('Times', 'normal');
            doc.setFontSize(10);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        // Gerar o PDF
        doc.save('plano_aula.pdf');
    });
});
