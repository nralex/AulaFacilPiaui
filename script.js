document.addEventListener("DOMContentLoaded", function() {
    preencherObjetosConhecimento();
});

function preencherObjetosConhecimento() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('objetoConhecimento');
            for (let objeto in data) {
                let option = document.createElement('option');
                option.value = objeto;
                option.textContent = objeto;
                select.appendChild(option);
            }
            window.apiData = data; // Armazena os dados para uso posterior
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

function autoCompletarCampos() {
    const objetoSelecionado = document.getElementById('objetoConhecimento').value;
    if (objetoSelecionado && window.apiData[objetoSelecionado]) {
        const dados = window.apiData[objetoSelecionado];
        document.getElementById('competenciaGeral').value = dados.competenciaGeral;
        document.getElementById('competenciaEspecifica').value = dados.competenciaEspecifica;
        document.getElementById('habilidadeEspecifica').value = dados.habilidadeEspecifica;
        document.getElementById('integracao').value = dados.integracao;
        document.getElementById('objetivos').value = dados.objetivos;
    }
}

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

    function addJustifiedText(text, y) {
        const splitText = doc.splitTextToSize(text, textWidth);
        const numberOfLines = splitText.length;
        const maxY = pageHeight - marginBottom;

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

    doc.setFont('Times', 'bold');
    doc.setFontSize(12);
    yPos = addJustifiedText("GOVERNO DO ESTADO DO PIAUÍ\nSECRETARIA DE EDUCAÇÃO E CULTURA - SEDUC", yPos);
    yPos = addJustifiedText(`${document.getElementById('gerencia').value}ª GERÊNCIA REGIONAL DE EDUCAÇÃO`, yPos);
    yPos = addJustifiedText(document.getElementById('escola').value, yPos);
    yPos = addJustifiedText(document.getElementById('endereco').value, yPos);
    yPos += lineHeight;

    doc.setFont('Times', 'normal');
    yPos = addJustifiedText(`PROFESSOR(A): ${document.getElementById('professor').value}`, yPos);
    yPos = addJustifiedText(`TURMAS: ${document.getElementById('turmas').value}`, yPos);
    yPos = addJustifiedText(`ÁREA DO CONHECIMENTO: ${document.getElementById('areaConhecimento').value}`, yPos);
    yPos = addJustifiedText(`COMPONENTE CURRICULAR: ${document.getElementById('componenteCurricular').value}`, yPos);
    yPos = addJustifiedText(`PERÍODO: ${document.getElementById('periodo').value}`, yPos);
    yPos += lineHeight;

    doc.setFont('Times', 'bold');
    doc.text('PLANO DE AULA', pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight;

    doc.setFont('Times', 'normal');
    yPos = addJustifiedText(`OBJETO DO CONHECIMENTO: ${document.getElementById('objetoConhecimento').value}`, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Competência Geral:', yPos);
    yPos = addJustifiedText(document.getElementById('competenciaGeral').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Competência Específica da Área:', yPos);
    yPos = addJustifiedText(document.getElementById('competenciaEspecifica').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Habilidade Específica:', yPos);
    yPos = addJustifiedText(document.getElementById('habilidadeEspecifica').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Integração entre as áreas e/ou componentes:', yPos);
    yPos = addJustifiedText(document.getElementById('integracao').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Objetivos de aprendizagem:', yPos);
    yPos = addJustifiedText(document.getElementById('objetivos').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Metodologia:', yPos);
    yPos = addJustifiedText(document.getElementById('metodologia').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Material de apoio:', yPos);
    yPos = addJustifiedText(document.getElementById('materialApoio').value, yPos);
    yPos += lineHeight / 2;

    yPos = addJustifiedText('Estratégia de Avaliação:', yPos);
    yPos = addJustifiedText(document.getElementById('estrategiaAvaliacao').value, yPos);
    yPos += lineHeight / 2;

    doc.save('plano_de_aula.pdf');
}
