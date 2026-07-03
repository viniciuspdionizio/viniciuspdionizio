import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const apiKey = process.env['RESEND_API_KEY'];

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY');
}

const resend = new Resend(apiKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed',
    };
  }

  try {
    const { name, email, message, phone } = JSON.parse(event.body ?? '{}');

    await resend.emails.send({
      from: 'Contato - Vinicius <viniciuspdionizio@resend.dev>',
      to: 'viniciuspdionizio@gmail.com',
      subject: `Contato de ${name}`,
      replyTo: email,
      html: `
        <h2>Novo contato pelo portfólio</h2>

        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>E-mail:</strong> ${email}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${(message ?? '').replace(/\n/g, '<br>')}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Resend Error: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
