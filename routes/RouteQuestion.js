router.get('/questions', async (req, res) => {
  try {
    const { className } = req.query;

    const query = {};

    if (className) {
      query.className = className;
    }

    const classes = await ClassModel.find(query);

    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found', classes: [] });
    }

    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
