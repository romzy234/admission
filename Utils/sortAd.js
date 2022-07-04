// O(logN)

/**This Function Sort the object ofan array 
 * @description This is used To Return a sort an object and use the sort function 
 * @param {String} field this is the fieeld you want to sort in the object 
 * @param {Boolean} reverse This param take ``` true => highest to lowest``` while ``` false => lowest to hightest```
 * @param {Function} primer This is used to determine the type of the value sorted used ```parseInt``` for Number while used ```(a) =>  a.toUpperCase()``` For string (Case sentivity)
*/
exports.sort_by = (field, reverse, primer) => {

    const key = primer ?
      function(x) {
        return primer(x[field])
      } :
      function(x) {
        return x[field]
      };
  
    reverse = !reverse ? 1 : -1;
  
    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }
  
  
  //Now you can sort by any field at will...
  
//   const homes=[
//      {h_id:"3",city:"Dallas",state:"TX",zip:"75201",price:"162500"},
//      {h_id:"4",city:"Bevery Hills",state:"CA",zip:"90210",price:"319250"},
//      {h_id:"5",city:"New York",state:"NY",zip:"00010",price:"962500"}
//     ];
  
//   // Sort by price high to low
//   console.log(homes.sort(sort_by('price', true, parseInt)));
  
//   // Sort by city, case-insensitive, A-Z
//   console.log(homes.sort(sort_by('city', false, (a) =>  a.toUpperCase()
//   )));