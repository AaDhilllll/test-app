export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const topResults = searchData.query?.search?.slice(0, 5);

    const detailed = await Promise.all(
      topResults.map(async (result) => {
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`
        );
        return await summaryRes.json();
      })
    );

    return res.status(200).json(detailed);
  } catch (err) {
    console.error('Wikipedia API error:', err);
    return res.status(500).json({ error: 'Server error while fetching Wikipedia data.' });
  }
}
