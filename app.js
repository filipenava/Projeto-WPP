const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create({
    session: 'sessionName',
    headless: false,  
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer.data,
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {
    const lowerCaseMessage = message.body.toLocaleLowerCase();

    if (lowerCaseMessage === 'oi' || lowerCaseMessage === 'olá') {
      client
        .sendText(message.from, 'Olá, como posso ajudar?\n1. Ver produtos\n2. Ver promoções\n3. Falar com atendente')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    } else if (lowerCaseMessage === '1') {
      client
        .sendText(message.from, 'Aqui estão nossos produtos:\n- Antenas\n- Suportes\n- Cabos e conectores\n- Acessórios')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    } else if (lowerCaseMessage === '2') {
      client
        .sendText(message.from, 'Confira nossas promoções:\n- Desconto em antenas\n- Ofertas especiais em suportes')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    } else if (lowerCaseMessage === '3') {
      client
        .sendText(message.from, 'Vou transferir você para um atendente. Aguarde um momento, por favor.')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    } else {
      client
        .sendText(message.from, 'Desculpe, não entendi sua resposta. Por favor, escolha uma das opções:\n1. Ver produtos\n2. Ver promoções\n3. Falar com atendente')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
