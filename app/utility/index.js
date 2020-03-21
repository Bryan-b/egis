// unique id generator
exports.uniqId = (index = "") => {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = 7;
    var rtn = "";
    for (var i = 0; i < ID_LENGTH; i++) {
      rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return index + rtn.toLowerCase();
}

// sanitizes data by trimming white spaces and converting html entities for Text only
exports.sanitize = data => {
  return String(data).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').trim();
}

// normal Text trim
exports.trim = data => {
  return data.replace(/^\s+|\s+$/gm, "");
}

// normal Integer trim
exports.trimInt = data => {
  let cleanData = data.toString().replace(" ", "").trim();
  return parseInt(cleanData, 10);
}

// normal Float trim
exports.trimFloat = data => {
  let cleanData = data.toString().replace(" ", "").trim();
  return parseFloat(cleanData);
}

// normal Number trim
exports.trimNum = data => {
  let cleanData = data.toString().replace(" ", "").replace(/[^0-9]/g, "").trim();
  return Number(cleanData);
}

// check if data does not exist or is empty
exports.isntOrEmpty = data => {
  if(!data || data == ""){
    return true;
  }else{
    return false;
  }
}

// check for image types
exports.isntOrNotImage = (data, allow = []) => {
  let types = ["image/gif", "image/jpeg", "image/png"];
  let allow_types;
  allow && allow.length != 0 ? allow_types = allow : allow_types = types; 
  if(data !== null){
    console.log(data.length)
    if(data.length == undefined){
      if (allow_types.includes(data.mimetype)) {
          return false;
      } else {
          return true;
      }
    }else{
      data.map(file => {
        console.log(file.mimetype)
          if (allow_types.includes(file.mimetype)) {
            return false;
          }else{
            return true;
          }
      })

    }
  }else{
    return true;
  }
}