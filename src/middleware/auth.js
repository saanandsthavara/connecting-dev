// we are going to create a middleware for authentication and authorization
const adminAuth = (req, res, next) => {
  const token = 'sthavara';
  if (token !== 'sthavara') {
    return res.status(401).send('Unauthorized');
  }
  console.log('This is the admin middleware');
  next();
};

const userAuth = (req, res, next) => {
  const token = 'sdtoken';
  if (token !== 'sdtoken') {
    return res.status(401).send('Unauthorized');
  }
  console.log('This is the user middleware');
  next('route');
};

module.exports = {
  adminAuth,
  userAuth,
};
