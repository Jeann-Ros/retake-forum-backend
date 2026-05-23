import { GoogleGenAI } from "@google/genai";

type SummaryInput = {
  tipo: "post" | "noticia";
  titulo?: string;
  content: string;
};

type SummaryResult = {
  resumo: string;
};

const model = "gemini-2.5-flash";

function limparRespostaGemini(texto: string) {
  let resposta = texto.trim();

  if (resposta.startsWith("```")) {
    resposta = resposta
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  const inicioJson = resposta.indexOf("{");
  const fimJson = resposta.lastIndexOf("}");

  if (inicioJson >= 0 && fimJson > inicioJson) {
    resposta = resposta.substring(inicioJson, fimJson + 1);
  }

  return resposta;
}

export async function resumirConteudo({
  tipo,
  titulo = "",
  content,
}: SummaryInput): Promise<SummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  if (!content) {
    return { resumo: "Não há conteúdo suficiente para resumir." };
  }

  const ai = new GoogleGenAI({ apiKey });
  const tipoLabel = tipo === "noticia" ? "notícia" : "post";
  const prompt = `
Eu tenho esse HTML de um ${tipoLabel} do meu site de CS e preciso que você leia ele,
entenda o texto mesmo tendo tags HTML, revise o conteúdo e faça um resumo simples.

Não remova o sentido do texto por causa das tags. As tags como <p>, <strong>, <img>,
<a> e outras são só formatação do editor.

Regras do resumo:
- escreva em português do Brasil
- deixe com linguagem natural, como se fosse para uma pessoa entender rápido
- não invente nada que não esteja no HTML
- não fale que recebeu HTML
- máximo 70 palavras
- responda somente em JSON, sem markdown

O JSON tem que ser assim:
{ "resumo": "texto do resumo aqui" }

Tipo do conteúdo: ${tipoLabel}
Título: ${titulo || "Sem título"}
HTML original:
---
${content}
---
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const jsonText = limparRespostaGemini(response?.text || "{}");
  const parsed = JSON.parse(jsonText) as Partial<SummaryResult>;

  if (!parsed.resumo || typeof parsed.resumo !== "string") {
    throw new Error("Resposta do Gemini sem resumo válido.");
  }

  return { resumo: parsed.resumo };
}
