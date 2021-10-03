const fs = require('fs');
const path = require('path');

const FIXTURE_FOLDER = path.resolve(__dirname, '../../fixtures/version/');

module.exports = {
  generateFixture
};

function generateFixture(fixtureName = 'New-fixture') {
  const date = new Date();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  const ms = `0000${date.getMilliseconds()}`.slice(-4);

  const uniqueDate = `${date.getFullYear()}${month}${day}${hour}${minute}${ms}`;
  const fileName = `${uniqueDate}-${slugify(fixtureName)}.js`;

  const dest = path.join(FIXTURE_FOLDER, fileName);

  fs.copyFileSync(path.join(__dirname, './template/fixture.js'), dest);
  return dest;
}

function slugify(str) {
  let slug = str.replace(/^\s+|\s+$/g, '');
  slug = slug.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc-------';
  for (let i = 0, l = from.length; i < l; i += 1) {
    slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return slug;
}
