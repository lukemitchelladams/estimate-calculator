export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base64, mediaType } = req.body;

  if (!base64) {
    return res.status(400).json({ error: "No image data provided" });
  }

  console.log("mediaType:", mediaType);
  console.log("base64 length:", base64.length);
  console.log("base64 prefix:", base64.substring(0, 30));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a construction measurement assistant. Analyze hand-drawn countertop/room sketches and extract shapes and measurements. Always respond with ONLY valid JSON, no other text. If a measurement is unclear or missing, use null. Measurements should be in inches unless labeled otherwise.",
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: base64
              }
            },
            {
              type: "text",
              text: "Analyze this hand-drawn sketch. Extract every distinct shape with their side measurements. Return ONLY JSON: {\"shapes\":[{\"label\":\"shape name\",\"type\":\"rectangle\",\"sides\":[{\"label\":\"Top\",\"inches\":96,\"confident\":true},{\"label\":\"Right\",\"inches\":26,\"confident\":true},{\"label\":\"Bottom\",\"inches\":96,\"confident\":false},{\"label\":\"Left\",\"inches\":null,\"confident\":false}],\"notes\":\"\"}]}"
            }
          ]
        }]
      })
    });

    const data = await response.json();
    console.log("Anthropic status:", response.status);
    console.log("Anthropic response:", JSON.stringify(data).substring(0, 500));

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "API error", detail: data });
    }

    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (e) {
    console.error("Sketch analysis error:", e);
    return res.status(500).json({ error: "Failed to analyze sketch: " + e.message });
  }
}
