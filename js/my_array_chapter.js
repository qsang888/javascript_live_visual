var numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

var numbers_object = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine' };

//this looks ridiculous 
var myArray = []; myArray.length // 0 

myArray[1000000] = true; 

myArray.length // 1000001 

// myArray contains one property.

//add a new method in Array called reduce
//Array.method('reduce', function (f, value) { 
//    var i; 
//    for (i = 0; i < this.length; i+=1) { 
//        value = f(this[i], value); 
//    } 
//    return value; 
//});

var myArra_2 = ['sang','jack','dala']

//make multi-dimention array
//initiazlie single dimention
Array.dim = function (dimension, initial) {
    var a = [], i; for (i = 0; i < dimension; i += 1) { 
        a[i] = initial; 
    } 
    return a; 
};

//matraix

Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = []; 
        for (j = 0; j < n; j += 1) {
            a[j] = initial; 
        } 
        mat[i] = a; 
    } 
    return mat;
};
var my_matrix = Array.matrix(3,3,0)
document.writeln(my_matrix)
document.writeln('<br>')

Array.identity = function(m,n){
    var matrix = Array.matrix(m,n,0)
    for(var i = 0; i<m;i+=1){
        for (var j=0;j<n;j+=1){
            matrix[i][j] = 1
        }
    }
    return matrix
}

var m = 3, n = 3
var my_identity_matrix = Array.identity(m,n)
for (var i = 0;i<m;i+=1){
    document.writeln(my_identity_matrix[i] + '<br>')
}

