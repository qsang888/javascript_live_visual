//function FirstReverse(str) { 
//   array = []
//  // code goes here  
//  for (var i=str.length;i>=0;i-=1){
//    array[array.length] = str[i]
//  }
//  return array; 
//         
//}
//
//document.writeln(FirstReverse('kate'));               

//ignore punchuation
replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
replace(/[0-9]/g,"")
