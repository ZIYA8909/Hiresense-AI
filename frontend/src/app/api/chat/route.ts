import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const prompt = await request.text();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new NextResponse(
        "Hello! I'm ready to assist, but my Gemini API Key is not set on the server. Please set the GEMINI_API_KEY environment variable in your frontend project (e.g. inside a .env.local file) and restart your server to enable real-time Gemini AI coaching answers!",
        { status: 200 }
      );
    }

    // List of model candidates to try sequentially in case of deprecation or regional variations
    const modelCandidates = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-pro'
    ];

    let lastErrorDetails = "";
    let lastStatusCode = 200;

    for (const modelName of modelCandidates) {
      console.log(`[Gemini API] Attempting contact using model: ${modelName}`);
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an expert AI Career Coach for the HireSense AI recruitment platform. Guide candidates on tech stacks, microservices architectures, resume improvements, learning roadmaps, and interview preparations. Keep responses concise and highly professional. User prompt: ${prompt}`
                    }
                  ]
                }
              ]
            }),
            // Short timeout to speed up failover
            signal: AbortSignal.timeout(8000)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const coachReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (coachReply) {
            console.log(`[Gemini API] Successfully generated content using model: ${modelName}`);
            return new NextResponse(coachReply, { status: 200 });
          }
        }

        const errorText = await response.text();
        lastStatusCode = response.status;
        console.warn(`[Gemini API] Model ${modelName} failed. Status: ${response.status}. Response: ${errorText}`);

        let errorMsg = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMsg = errorJson.error.message;
          }
        } catch (e) {}

        lastErrorDetails = errorMsg;

        // If the error status is 400 (typically invalid API key) or 403 (unauthorized/billing),
        // it means the credentials themselves are invalid. Do not loop to other models.
        if (response.status === 400 || response.status === 403) {
          return new NextResponse(
            `Gemini API Credentials Error: ${errorMsg} (Status Code: ${response.status}). Please check your key value in frontend/.env.local.`,
            { status: 200 }
          );
        }
      } catch (fetchErr: any) {
        console.error(`[Gemini API] Connection error for model ${modelName}:`, fetchErr);
        lastErrorDetails = fetchErr.message || String(fetchErr);
      }
    }

    // If all models in the fallback loop failed
    return new NextResponse(
      `Gemini API Error: All attempted models (${modelCandidates.join(', ')}) failed to respond. Last error: ${lastErrorDetails} (Status: ${lastStatusCode}). Please verify your API Key activation and regional availability.`,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Next.js API Chat Error]', error);
    return new NextResponse(`Error processing request: ${error.message || error}`, { status: 500 });
  }
}
