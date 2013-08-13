//var stooge = { 
//	"first-name": "Jerome", 
//	"last-name": "Howard" 
//}
//
//
//var flight = { 
//	airline: "Oceanic", 
//	number: 815, 
//	departure: { 
//		IATA: "SYD", 
//		time: "2004-09-22 14: 55", 
//		city: "Sydney" }, 
//	arrival: { 
//		IATA: "LAX", 
//		time: "2004-09-23 10: 42", 
//		city: "Los Angeles"
//	}
//}

//var add = function(a,b) {return a+b}
var myObject = { 
    value: 0, 
    increment: function (inc) { 
        this.value += typeof inc === 'number' ? inc :1;      } 
};

//myObject.increment()
//document.writeln(myObject.value)
//
//myObject.increment(2)
//document.writeln(myObject.value)

// use "that" to let inner function access "this" varible. 
myObject.double = function ( ) { 
    var that = this; 
    // Workaround. 
    var helper = function ( ) { 
        that.value = add(that.value, that.value); 
    }; 
    helper(); // Invoke helper as a function.
};



//an example to throw an exception
var add = function (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number'){ 
        throw { 
            name: 'TypeError', 
            message: 'add needs numbers' 
        }; 
    } 
    document.writeln('run me');
    return a + b; 
}

//document.writeln('new output:');
//document.writeln(myObject.value);
//document.writeln('new output:');
////myObject.double(2)
//document.writeln(add(3,'s'));

//an example of scope
foo = function(){
    var a = 3, b = 5
    var bar = function(){
        var b = 7, c=11
        a += b + c
    }
    bar()
}
foo() 

//an example use closure 
var initilizeMyObject = (function(){
    var value = 0 
    return{
        increment:function(){return value+=1},
        getValue: function(){return value}
    }
}()) 

//document.writeln('new output:'+'<br>');
//document.writeln(initilizeMyObject.getValue());

//another example of closure
var fade = function (node) { 
    var level = 1; 
    var step = function ( ) { 
        console.log('call me')
        var hex = level.toString(16); 
        node.style.backgroundColor = '#FFFF' + hex + hex; 
        if (level < 15) { 
            level += 1; 
            setTimeout(step, 100);
        } 
    }; 
    setTimeout(step, 100);
}; 
//fade(document.body);

//add handlers
var add_the_handlers = function (nodes) { 
    var helper = function (i) { 
        return function (e) { 
            alert(i); }; 
    }; 
    var i; 
    for (i = 0; i < nodes.length; i += 1) { 
        nodes[i]. onclick = helper(i); 
    } 
};
//add_the_handlers(document.body)

//module pattern example, a good example for encapsolation
var serial_maker = function(){
    var prefix = ''
    var seq = 0
    return {
        set_prefix: function(p){
            prefix = String(p)
        },
        set_seq:function(s){
            seq = s 
        },
        gensym: function(){
            var result = prefix + seq
            seq+=1
            return result
        }
    }
}

//var seqer = serial_maker()
//seqer.set_prefix('S')
//seqer.set_seq(1000)
//var unique  = seqer.gensym()
//
//var seqer_2 = serial_maker()
//seqer_2.set_prefix('Q')
//seqer_2.set_seq(2000)
//var unique_2  = seqer_2.gensym()
//
//
//document.writeln('new output:'+'<br>');
//document.writeln(unique +'<br>')
//document.writeln('new output:'+'<br>');
//document.writeln(unique_2)

//Curry example ?

//Memoization examples

//a ok exapmle to start but need do better
var fibonaci = function (n){
    console.log('c me')
    return n<2 ? n:fibonaci(n-1) + fibonaci(n-2)
};


number = 3
document.writeln('Here is my fibonaci sequence from 0 to '+number + '<br>');
for (var i=0; i<number; i+=1){
    document.writeln(fibonaci(i))
}
document.writeln('<br><br>')

//improved example by memoize 
number = 10
var fibonacci = (function(){
    //console.log('call me')
    var memo = [0,1]
    var fib = function(n) {
        var result = memo[n];
        if (typeof result !== 'number'){   
            //if the result not in our memo dictionary, then add inton memo 
            result = fib(n-1) + fib(n-2)
            memo[n] = result
        }
        return result;
    }
    return fib;
}())
document.writeln('Here is my faster fibonaci sequence from 0 to '+number + '<br>');
for (var i=0; i<number; i+=1){
    document.writeln(fibonacci(i))
}


//an even better example by generalize meomoizer 
var memoizer = function(memo,formula){
    var recur = function(n){
        var result = memo[n];
        if (typeof result !== 'number'){
            result = formula(recur,n);
        }
        return result
    }
    return recur
}

var fibonaccci = memoizer([0,1], function(recur,n){
    return recur(n-1) + recur(n-2)
});

var fibonaccci = memoizer([1,1], function(recur,n){
    return n*recur(n-1)
});

document.writeln('<br><br>')
document.writeln('an even better fibonaci sequence from 0 to '+number + '<br>');
for (var i=0; i<number; i+=1){
    document.writeln(fibonaccci(i))
}