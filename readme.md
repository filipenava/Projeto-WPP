
## Descrição

Este é um sistema simples que utiliza a biblioteca `wppconnect` para conectar uma conta no WhatsApp e automatizar as respostas.

O projeto visa a criação de um bot para WhatsApp que responde automaticamente a mensagens recebidas com base no conteúdo delas. As mensagens são processadas e respostas automáticas são enviadas conforme regras predefinidas.

## Instalação

Para instalar as dependências do projeto, execute:

```bash
npm install
```

## Explicação do Código

### Importação das Dependências:

- fs: módulo nativo do Node.js para manipulação de arquivos.
- wppconnect: biblioteca utilizada para conectar e interagir com uma conta no WhatsApp.

### Configuração da Sessão e Captura do QR Code:

- wppconnect.create(): cria uma sessão para a conexão com o WhatsApp.
- catchQR: função para capturar e salvar o QR Code necessário para autenticação.
- logQR: false: desabilita o log do QR Code no console.

### Início da Sessão e Tratamento de Mensagens:

- start(client): função chamada ao iniciar a sessão com sucesso.
- client.onMessage(): evento que ouve mensagens recebidas.
- As mensagens são convertidas para minúsculas e comparadas com palavras-chave para definir a resposta apropriada.
- As respostas são enviadas usando client.sendText().

### Estrutura de Respostas:

- Responde "Oi" ou "Olá" com opções de interação.
- Responde "1" com a lista de produtos.
- Responde "2" com as promoções.
- Responde "3" transferindo para um atendente.
- Qualquer outra mensagem recebe uma resposta padrão solicitando uma escolha válida.

## Como Utilizar

1. Instale as dependências:

```bash
npm install
```

2. Execute o projeto:

```bash
node index.js
```

3. Escaneie o QR Code:

- Abra o WhatsApp no seu celular e escaneie o QR Code gerado no terminal para conectar a conta.

4. Interaja com o bot:

- Envie mensagens para a conta conectada e receba respostas automáticas conforme definido no código.