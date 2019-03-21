const moment = require('moment');

let select = function (selected, options) {
  // console.log(selected);
  // console.log(options.fn(this));
  return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
}

/* let select =(postStatus, availableOptions) => {
  // console.log('test', postStatus);
  // console.log(JSON.stringify(availableOptions.fn(this), {}, 2));
  return availableOptions.fn(slef).replace(new RegExp(' value="' + postStatus + '\"'), '$&selected="selected"');
} */

let generateDate = (date, format) => {
  return moment(date).format(format);
}

let paginate = function(options) {
  /* console.log(options);
  console.log(options.hash.current); */

  let output = '';

  if (options.hash.current === 1) {
    output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
  } else {
    output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
  }

  let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

  // THE DOT
  if (i !== 1) {
    output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
  }

  for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++) {
    if (i === options.hash.current) {
      output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
    } else {
      output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
    }

    // THE DOT
    if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
      output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
    }
  }

  if (options.hash.current === options.hash.pages) {
    output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
  } else {
    output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
  }

  return output;
}

module.exports = {
  /* select: function(selected, options){
    return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
}, */
  select,
  generateDate,
  paginate,
}