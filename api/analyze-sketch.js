export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base64, mediaType } = req.body;
  if (!base64) return res.status(400).json({ error: "No image data provided" });

  const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const safeMediaType = supported.includes(mediaType) ? mediaType : "image/jpeg";

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
        max_tokens: 2000,
        system: "You are a construction measurement assistant specializing in countertop and surface layout drawings. Analyze hand-drawn sketches and extract ALL shapes and measurements with high accuracy. Always respond with ONLY valid JSON, no other text. If a measurement is unclear or missing, use null. All measurements should be in inches unless clearly labeled otherwise (e.g. ft, cm).",
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: safeMediaType, data: base64 }
            },
            {
              type: "text",
              text: `Carefully analyze this hand-drawn countertop/room sketch. 

IMPORTANT: Look for ALL separate shapes in the drawing. Common layouts include:
- A main counter + separate island
- Multiple counter sections (left counter, right counter, peninsula)
- Bathroom vanity + separate tub surround
- Any combination of rectangular sections

For EACH distinct shape you find, extract:
1. Its label/name (written on or near the shape, or describe it like "Main Counter", "Island")
2. All 4 side measurements written on the drawing

Return ONLY this exact JSON format, with one entry per shape found:
{
  "shapes": [
    {
      "label": "Main Counter",
      "type": "rectangle",
      "sides": [
        { "label": "Top", "inches": 96, "confident": true },
        { "label": "Right", "inches": 26, "confident": true },
        { "label": "Bottom", "inches": 96, "confident": false },
        { "label": "Left", "inches": null, "confident": false }
      ],
      "notes": "any notes about this shape"
    },
    {
      "label": "Island",
      "type": "rectangle",
      "sides": [
        { "label": "Top", "inches": 60, "confident": true },
        { "label": "Right", "inches": 36, "confident": true },
        { "label": "Bottom", "inches": 60, "confident": true },
        { "label": "Left", "inches": 36, "confident": true }
      ],
      "notes": ""
    }
  ]
}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "API error" });

    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (e) {
    console.error("Sketch analysis error:", e);
    return res.status(500).json({ error: "Failed to analyze sketch: " + e.message });
  }
}
