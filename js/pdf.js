function generatePDF() {
    // Importando a jsPDF do módulo
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
    yPos = addJustifiedText(`PROFESSOR(A): ${document.getElementById('professor').value}`, yPos);
    yPos = addJustifiedText(`TURMAS: ${document.getElementById('turmas').value}`, yPos);
    yPos = addJustifiedText(`ÁREA DO CONHECIMENTO: ${document.getElementById('areaConhecimento').value}`, yPos);
    yPos = addJustifiedText(`COMPONENTE CURRICULAR: ${document.getElementById('componenteCurricular').value}`, yPos);
    yPos = addJustifiedText(`PERÍODO: ${document.getElementById('periodo').value}`, yPos);
    yPos += lineHeight; // Espaço extra após as informações

    // Título 'PLANO DE AULA', centralizado
    doc.setFont('Times', 'bold');
    doc.text('PLANO DE AULA', pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight;

    doc.setFont('Times', 'normal');

    // Conteúdo das Competências, Habilidades e outros
    const sections = [
        { title: 'Competência Geral', field: 'competenciaGeral' },
        { title: 'Competência Específica da Área', field: 'competenciaEspecifica' },
        { title: 'Habilidade Específica', field: 'habilidadeEspecifica' },
        { title: 'Integração entre as áreas e/ou componentes', field: 'integracao' },
        { title: 'Objetivos de aprendizagem', field: 'objetivos' },
        { title: 'Metodologia', field: 'metodologia' },
        { title: 'Material de apoio', field: 'materialApoio' },
        { title: 'Estratégia de Avaliação', field: 'estrategiaAvaliacao' }
    ];

    sections.forEach(section => {
        // Adicionar título da seção
        doc.setFont('Times', 'bold');
        yPos = addJustifiedText(section.title, yPos);
        // Adicionar conteúdo da seção
        doc.setFont('Times', 'normal');
        const content = document.getElementById(section.field).value;
        yPos = addJustifiedText(content, yPos);
        yPos += lineHeight / 2; // Espaço extra entre seções
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
