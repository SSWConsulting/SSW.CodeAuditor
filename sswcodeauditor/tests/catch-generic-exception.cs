// standard
try {
  var 1 = 1;
} catch (Exception ex) {
}

// no ex
try {
  var 1 = 1;
} catch (Exception) {
}

// no space
try {
  var 1 = 1;
} catch(Exception) {
}

// no space after
try {
  var 1 = 1;
} catch(Exception){
}

// no space after
try {
  var 1 = 1;
} catch(Exception){}
