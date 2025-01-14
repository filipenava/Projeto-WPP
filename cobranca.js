const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');
const xlsx = require('xlsx');

// Configurações
const FILE_PATH = './AFIN_MovimentoProgAbertoRP-00879.xlsx'; // Arquivo no formato .xlsx
const COUNTRY_CODE = '55'; // Código do país (Brasil)

// Carregar os dados da planilha
const workbook = xlsx.readFile(FILE_PATH); // Nome do arquivo Excel
const sheetName = workbook.SheetNames[0]; // Selecionar a primeira aba
const rawSheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' }); // Converter a aba para JSON

// Função para formatar datas
function formatDate(value) {
  // Verifica se o valor é numérico (serial do Excel)
  if (!isNaN(value)) {
    const excelBaseDate = new Date(1899, 11, 30); // Data base do Excel (30/12/1899)
    const parsedDate = new Date(excelBaseDate.getTime() + value * 86400000); // Converte dias em milissegundos
    return parsedDate.toLocaleDateString('pt-BR'); // Retorna no formato dd/MM/yyyy
  }

  // Verifica se é uma data válida no formato string
  if (!value || isNaN(Date.parse(value))) {
    return 'Não informado';
  }
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR'); // Formato dd/MM/yyyy
}

// Função para consolidar os dados
function consolidateData(data) {
  const consolidatedData = [];
  data.forEach((row, index) => {
    if (row.Programação === 'Telefone' && index + 1 < data.length) {
      const nextRow = data[index + 1];
      consolidatedData.push({
        CNPJ: row['CNPJ/CPF'] || 'Não informado',
        NomeDaEmpresa: nextRow['CNPJ/CPF'] || 'Não informado',
        Telefone: row['Parcela'] || 'Não informado',
        Cidade: nextRow['Cidade'] || 'Não informada',
        Estado: nextRow['Estado'] || 'Não informado',
        Documento: nextRow['Documento'] || 'Não informado',
        ValorOriginal: nextRow['Valor Original'] || '0.00',
        Juros: nextRow.Juros || '0.00',
        Multa: nextRow.Multa || '0.00',
        VlrAReceber: nextRow['Vlr a Receber'] || '0.00',
        Vencimento: formatDate(nextRow.Vencimento),
        Emissão: formatDate(nextRow.Emissão),
        Atraso: nextRow.Atraso || '0',
      });
    }
  });
  return consolidatedData;
}

// Consolidar os dados
const sheetData = consolidateData(rawSheetData);

// Função para formatar mensagens de cobrança
function formatMessage(cliente) {
  return `
🔔 *Cobrança Pendente* 🔔

*Prezado(a) Representante da Empresa ${cliente.CNPJ},*

Segue abaixo as informações relacionadas à pendência identificada no nosso sistema:

📄 *Documento:* ${cliente.Documento}
💰 *Valor Original:* R$ ${cliente.ValorOriginal}
📈 *Juros:* R$ ${cliente.Juros}
⚠️ *Multa:* R$ ${cliente.Multa}
💳 *Valor Total:* R$ ${cliente.VlrAReceber}
📅 *Vencimento:* ${cliente.Vencimento}
📆 *Emissão:* ${cliente.Emissão}
⏳ *Dias em Atraso:* ${cliente.Atraso}

📍 *Localização da Empresa:*
   - Nome: ${cliente.NomeDaEmpresa}
   - Cidade: ${cliente.Cidade}
   - Estado: ${cliente.Estado}

Por favor, regularize sua situação o mais breve possível para evitar transtornos. Caso tenha dúvidas ou necessite de suporte, entre em contato com a nossa equipe.

📝 Estamos à disposição para ajudar.

*Atenciosamente,*  
*Equipe Financeira*
  `;
}

// Função para enviar mensagens
async function sendMessages(client, data) {
  for (const cliente of data) {
    try {
      // Formatar mensagem para cada cliente
      const mensagem = formatMessage(cliente);

      // Formatar número de telefone
      const telefone = cliente.Telefone.replace(/\D/g, ''); // Remover caracteres não numéricos
      if (!telefone) {
        console.error(`Telefone inválido para ${cliente.NomeDaEmpresa}`);
        continue;
      }
      const telefoneCompleto = `${COUNTRY_CODE}${telefone}`;

      // Enviar mensagem
      await client.sendText(`${telefoneCompleto}@c.us`, mensagem);
      console.log(`Mensagem enviada para ${cliente.NomeDaEmpresa}`);
    } catch (erro) {
      console.error(`Erro ao enviar mensagem para ${cliente.NomeDaEmpresa}:`, erro);
    }
  }
}

// Iniciar sessão do WhatsApp com WPPConnect
wppconnect
  .create({
    session: 'sessionName',
    headless: true,
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR);
    },
    logQR: false,
  })
  .then((client) => sendMessages(client, sheetData))
  .catch((error) => console.error('Erro ao iniciar sessão:', error));
