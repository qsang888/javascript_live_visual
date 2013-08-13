function FirstReverse(str) { 
   array = []
  // code goes here  
  for (var i=str.length;i>0;i-=1){
    array.push(str)
  }
  return array; 
         
}

document.writeln(FirstReverse('sang'));                            