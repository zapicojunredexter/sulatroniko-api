exports.allowOnly = methods => (req, res) => {
  res.setHeader('ALLOW', methods);
  res.status(405).send({ message: 'Selected method not allowed.' });
};
