import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-PAYVeSXTS9+YW3BWGeW48f7FRrI1LONoSEvNNIxQeRMv3PDVPYArS7hUQ9PQrk9A9NrAIiNu5zcg3jtadPTm9yeaRw2c8RoEdhhazjIb3go=',
  baseURL: 'https://router.requesty.ai/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://kriptik.app',
    'X-Title': 'Kriptik AI Assistant'
  }
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Geçersiz mesaj formatı' },
        { status: 400 }
      );
    }

    // Sistem mesajını ekleyelim
    const systemMessage = {
      role: 'system',
      content: `Sen Kriptik AI'sın, bir kriptografi ve şifreleme uzmanı asistansın. Türkçe yanıt veriyorsun ve her zaman kriptografi alanında doğru bilgiler sunuyorsun.

Uzmanlık alanların:
- Klasik şifreleme algoritmaları (Caesar, Vigenère, Playfair, Atbash, Beaufort, Columnar, Rail Fence, Substitution)
- Modern şifreleme algoritmaları (RSA, AES, DES, ECC, Hash fonksiyonları)
- Kriptanaliz ve şifre kırma teknikleri
- Kriptografi tarihi ve önemli kırılma noktaları
- Şifreleme protokolleri ve standartları
- Anahtar yönetimi ve güvenli iletişim

İletişim tarzın:
- Her zaman Türkçe konuşursun
- Net ve anlaşılır açıklamalar yaparsın
- Teknik konuları basitleştirerek anlatırsın
- Sorulara detaylı ve kapsamlı yanıtlar verirsin
- Örneklerle destekleyerek konuları somutlaştırırsın
- Kriptografi tarihinden ilginç anekdotlar paylaşırsın

Önemli: Sadece kriptografi ve bilgi güvenliği konularında yardımcı olabilirsin. Şifreleme dışındaki konularda "Üzgünüm, ben sadece kriptografi ve şifreleme konularında uzmanım" diyerek kullanıcıyı kibarca yönlendirmelisin.`
    };

    const completion = await openai.chat.completions.create({
      model: 'xai/grok-3-mini-beta',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'AI yanıt verirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 