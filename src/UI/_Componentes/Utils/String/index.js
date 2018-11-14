const metodos = {
  toTitleCase: val => {
    return val.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
};

export default metodos;
