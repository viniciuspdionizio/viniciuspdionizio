import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const apiKey = process.env['RESEND_API_KEY'];

if (!apiKey) {
  throw new Error('Missing RESEND_API_KEY');
}

const resend = new Resend(apiKey);

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed',
    };
  }

  try {
    const { name, email, message, phone } = JSON.parse(event.body ?? '{}');

    console.log('Received contact form submission from:', name ? `${String(name).slice(0, 60)}` : '(sem nome)');

    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const result = await resend.emails.send({
      from: 'Contato - Vinicius <dev.viniciuspd@resend.dev>',
      to: 'dev.viniciuspd@gmail.com',
      subject: `Contato de ${safeName}`,
      replyTo: email,
      html: `
        <h2>Novo contato pelo portfólio</h2>

        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Telefone:</strong> ${safePhone}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (result.error) {
      console.error('Resend API returned an error:', result.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Não foi possível enviar o e-mail. Tente novamente mais tarde.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Resend Error: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao processar a solicitação.' }),
    };
  }
};
