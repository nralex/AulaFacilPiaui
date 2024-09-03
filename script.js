// Função para preencher o select com os objetos do conhecimento
async function preencherObjetosConhecimento() {
    const select = document.getElementById('objetoConhecimento');
    const response = await fetch('data.json');
    const apiData = await response.json();

    for (let objeto in apiData) {
        let option = document.createElement('option');
        option.value = objeto;
        option.textContent = objeto;
        select.appendChild(option);
    }
}

// Função para autocompletar os campos
async function autoCompletarCampos() {
    const objetoSelecionado = document.getElementById('objetoConhecimento').value;
    if (!objetoSelecionado) return;

    const response = await fetch('data.json');
    const apiData = await response.json();

    if (apiData[objetoSelecionado]) {
        const dados = apiData[objetoSelecionado];
        document.getElementById('competenciaGeral').value = dados.competenciaGeral;
        document.getElementById('competenciaEspecifica').value = dados.competenciaEspecifica;
        document.getElementById('habilidadeEspecifica').value = dados.habilidadeEspecifica;
        document.getElementById('integracao').value = dados.integracao;
        document.getElementById('objetivos').value = dados.objetivos;
    }
}

// Chamada para preencher os objetos do conhecimento quando a página carregar
window.onload = preencherObjetosConhecimento;

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Definir margens conforme ABNT
    const marginLeft = 30;  // 3 cm
    const marginRight = 20; // 2 cm
    const marginTop = 20;   // 2 cm
    const marginBottom = 20; // 2 cm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const textWidth = pageWidth - marginLeft - marginRight;  // 160 mm
    const lineHeight = 7; // mm, baseado em 1.5 de espaçamento e fonte 12

    let yPos = marginTop;

    // Função para adicionar texto justificado
    function addJustifiedText(text, y) {
        const splitText = doc.splitTextToSize(text, textWidth);
        const numberOfLines = splitText.length;
        const maxY = pageHeight - marginBottom;
        
        // Verifica se há espaço suficiente na página atual, senão adiciona nova página
        if (y + numberOfLines * lineHeight > maxY) {
            doc.addPage();
            y = marginTop;
        }
        
        for (let i = 0; i < splitText.length; i++) {
            if (y + lineHeight > maxY) {
                doc.addPage();
                y = marginTop;
            }
            doc.text(splitText[i], marginLeft, y, { maxWidth: textWidth, align: 'justify' });
            y += lineHeight;
        }
        return y;
    }

    // Cabeçalho e informações do professor/turma
    doc.setFont('Times', 'bold');
    doc.setFontSize(12);
    yPos = addJustifiedText("GOVERNO DO ESTADO DO PIAUÍ\nSECRETARIA DE EDUCAÇÃO E CULTURA - SEDUC", yPos);
    yPos = addJustifiedText(`${document.getElementById('gerencia').value}ª GERÊNCIA REGIONAL DE EDUCAÇÃO`, yPos);
    yPos = addJustifiedText(document.getElementById('escola').value, yPos);
    yPos = addJustifiedText(document.getElementById('endereco').value, yPos);
    yPos += lineHeight; // Espaço extra após o cabeçalho
    
    doc.setFont('Times', 'normal');
    yPos = addJustifiedText(`Professor(a): ${document.getElementById('professor').value}`, yPos);
    yPos = addJustifiedText(`Turmas: ${document.getElementById('turmas').value}`, yPos);
    yPos = addJustifiedText(`Área do Conhecimento: ${document.getElementById('areaConhecimento').value}`, yPos);
    yPos = addJustifiedText(`Componente Curricular: ${document.getElementById('componenteCurricular').value}`, yPos);
    yPos = addJustifiedText(`Período: ${document.getElementById('periodo').value}`, yPos);
    yPos += lineHeight; // Espaço extra após informações iniciais
    
    // Conteúdos principais
    const campos = [
        { label: 'Objeto do Conhecimento', value: 'objetoConhecimento' },
        { label: 'Competência Geral', value: 'competenciaGeral' },
        { label: 'Competência Específica da Área', value: 'competenciaEspecifica' },
        { label: 'Habilidade Específica', value: 'habilidadeEspecifica' },
        { label: 'Integração entre as Áreas e/ou Componentes', value: 'integracao' },
        { label: 'Objetivos de Aprendizagem', value: 'objetivos' },
        { label: 'Metodologia', value: 'metodologia' },
        { label: 'Material de Apoio', value: 'materialApoio' },
        { label: 'Estratégia de Avaliação', value: 'estrategiaAvaliacao' }
    ];

    campos.forEach(campo => {
        doc.setFont('Times', 'bold');
        yPos = addJustifiedText(campo.label, yPos);
        doc.setFont('Times', 'normal');
        yPos = addJustifiedText(document.getElementById(campo.value).value, yPos);
        yPos += lineHeight; // Espaço extra entre seções
    });
// Assinaturas
yPos += lineHeight; // Espaço extra antes das assinaturas

// Verifica se há espaço suficiente para as assinaturas, senão adiciona nova página
if (yPos + lineHeight * 2 > pageHeight - marginBottom) {
    doc.addPage();
    yPos = marginTop;
}

// Assinaturas: Professor(a), Diretor(a), Coordenador(a)
// Cada linha tem 40 mm de comprimento, espaçadas 10 mm entre si
doc.setFont('Times', 'normal');

// Linha para PROFESSOR(A)
doc.line(marginLeft, yPos, marginLeft + 40, yPos);
doc.text('PROFESSOR(A)', marginLeft + 20, yPos + 5, { align: 'center' });

// Linha para DIRETOR(A)
doc.line(marginLeft + 50, yPos, marginLeft + 90, yPos);
doc.text('DIRETOR(A)', marginLeft + 70, yPos + 5, { align: 'center' });

// Linha para COORDENADOR(A)
doc.line(marginLeft + 100, yPos, marginLeft + 140, yPos);
doc.text('COORDENADOR(A)', marginLeft + 120, yPos + 5, { align: 'center' });

// Salvar o PDF
doc.save('plano_de_aula.pdf');
}
