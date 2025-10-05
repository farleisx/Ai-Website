// POST /api/generate { userId: string, prompt: string }


// 1) atomic decrement via rpc
const { data: newCredits, error: rpcErr } = await supabaseAdmin.rpc('decrement_credit_if_available', { p_user_id: userId });
if (rpcErr) return res.status(500).json({ error: 'rpc error', details: rpcErr.message });


if (!newCredits) {
return res.status(402).json({ error: 'no credits' });
}


// 2) call Gemini (or another GenAI) - use GEN_AI_ENDPOINT env var
const GEN_AI_ENDPOINT = process.env.GEN_AI_ENDPOINT || ''; // example: set to a correct Google GenAI endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';


let generatedHtml = null;


if (GEN_AI_ENDPOINT && GEMINI_API_KEY) {
// Minimal generic POST to the endpoint. Replace body structure if your endpoint needs different shape.
const response = await fetch(GEN_AI_ENDPOINT, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${GEMINI_API_KEY}`
},
body: JSON.stringify({ prompt })
});


if (!response.ok) {
const text = await response.text();
console.error('GenAI error:', text);
return res.status(502).json({ error: 'genai_error', details: text });
}


const json = await response.json();
// The exact path to the generated HTML depends on your GenAI response shape. Try common fields first.
generatedHtml = json.output || json.result || json.text || JSON.stringify(json);
} else {
// Fallback: return a simple demo HTML if no GEN_AI_ENDPOINT provided.
generatedHtml = `<!doctype html><html><head><meta charset="utf-8"><title>Demo site</title></head><body><h1>Generated site</h1><p>Prompt: ${escapeHtml(prompt)}</p></body></html>`;
}


// 3) Return generated HTML and remaining credits
return res.status(200).json({ html: generatedHtml, creditsLeft: newCredits });
} catch (err) {
console.error(err);
return res.status(500).json({ error: err.message || String(err) });
}
};


function escapeHtml(str) {
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
