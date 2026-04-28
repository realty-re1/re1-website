import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, message, property_type } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram token or chatId is missing');
      return NextResponse.json({ success: false, error: 'Config missing' }, { status: 500 });
    }

    const text = `🚨 신규 문의 접수 [${property_type}]
이름: ${name}
연락처: ${phone}
내용:
${message}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API Error:', errorText);
      return NextResponse.json({ success: false, error: 'Telegram API Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
