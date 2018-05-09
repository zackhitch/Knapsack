const fs = require('fs');
const _ = require('underscore');

function naiveKnapsack(items, capacity) {
  // what is the value we have when we dont pick up any items
  // value[0, w] = 0;
  // value[i, w] = value[i-1, w] if w[i] > w

  // recursive solution
  function recurse(i, size) {
    // base case
    if (i === 0) {
      return {
        value: 0,
        size: 0,
        chosen: [],
      };
    }

    // how do we move towards our base case?
    // recurse(items.length, capacity)
    // recurse(items.length - 1, capacity)
    // recurse(items.length - 2, capacity)

    // pick up an item
    // case: item doesnt fit
    else if (items[i].size > size) {
      return recurse(i - 1, size);
    }

    // case: item does fit, but it might not be worth
    // as much as the sum of values of items we currently
    // have in our bag
    else {
      // the max value we've accumulated so far
      const r0 = recurse(i - 1, size);
      // the max value we could have if we added the new item we
      // picked but evicted some others
      const r1 = recurse(i - 1, size - items[i].size);

      r1.value += items[i].value;

      if (r0.value > r1.value) {
        return r0;
      } else {
        r1.size += items[i].size;
        r1.chosen = r1.chosen.concat(i);
        return r1;
      }
    }
  }

  return recurse(items.length - 1, capacity);
}

function lessNaiveKnapsack(items, capacity) {
  const returnObj = {
    value: 0,
    size: 0,
    chosen: [],
  };

  for (let i in items) {
    items[i].ratio = items[i].value / items[i].size;
  }

  const itemsAscRatio = _.sortBy(items, 'ratio');
  const itemsDescRatio = itemsAscRatio.reverse();
  console.log(itemsDescRatio);

  while (returnObj.size <= capacity) {
    if (itemsDescRatio[0] === null || itemsDescRatio[0] === undefined)
      itemsDescRatio.shift();
    if (returnObj.size + itemsDescRatio[1].size > capacity) break;
    returnObj.value += itemsDescRatio[0].value;
    returnObj.size += itemsDescRatio[0].size;
    returnObj.chosen.push(itemsDescRatio[0].index);
    itemsDescRatio.shift();
  }
  returnObj.chosen.sort();
  return returnObj;
}

const argv = process.argv.slice(2);

// console.log(argv);

// add an error check to check the number of params
if (argv.length !== 2) {
  console.error('usage: [filename] [capacity]');
  process.exit(1);
}

const filename = argv[0];
const capacity = argv[1];

// read the file that was passed to our program

const filedata = fs.readFileSync(filename, 'utf8');

// an array of all the lines of the filedata
const lines = filedata.trim().split(/[\r\n]+/g);

// console.log(lines);

// process the lines

const items = [];

for (let l of lines) {
  const [index, size, value] = l.split(' ').map(n => parseInt(n));

  items[index] = {
    index,
    size,
    value,
  };
}

// console.log('Naive Recursive Implementation: ', naiveKnapsack(items, capacity));
console.log('Less Naive Implementation: ', lessNaiveKnapsack(items, capacity));
