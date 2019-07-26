const mongoose = require('mongoose');
const User = require('./models/User');
const Site = require('./models/Site');

const dbtitle = 'heroku_t40fdmtq';
mongoose.connect(`mongodb://ds255577.mlab.com:55577/${dbtitle}`)
  .then(console.log('connected to db'))
  .catch(e => console.log(e));

const createSite = () => {
  const newSite = new Site({ accesses: 0, signups: 0, confirmedSignups: 0 });
  newSite.save()
    .then(site => console.log('Created new site document', site))
    .catch(e => console.log(e));
};

const createAdmin = () => {
  const adminUser = new User({
    username: 'admin@admin.com',
    name: 'Admin',
    password: 'admin',
    hasConfirmed: true,
    isAdmin: true,
  });
  adminUser.save()
    .then(admin => console.log('Created new admin user', admin))
    .catch(e => console.log(e));
};

createSite();
createAdmin();
