// GET /api/credits?userId=<uuid>
const { supabaseAdmin } = require('./_utils/supabaseService');


module.exports = async function (req, res) {
try {
const userId = req.method === 'GET' ? req.query.userId : (req.body && req.body.userId);
if (!userId) return res.status(400).json({ error: 'missing userId' });


const { data, error } = await supabaseAdmin
.from('profiles')
.select('credits')
.eq('id', userId)
.single();


if (error) return res.status(500).json({ error: error.message });
return res.status(200).json({ credits: data?.credits ?? 0 });
} catch (err) {
console.error(err);
return res.status(500).json({ error: err.message || String(err) });
}
};
