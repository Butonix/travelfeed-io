// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404

const asyncForEach = async (array, callback) => {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};

module.exports = {
  asyncForEach,
};
