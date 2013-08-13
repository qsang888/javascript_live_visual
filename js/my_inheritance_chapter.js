//Pseudoclassical example 
var Mammal = function(name){
    this.name = name 
}

Mammal.prototype.get_name = function(){
    return this.name
}

Mammal.prototype.says = function(){
    return this.saying || '';
}

//var myMammal = new Mammal('Herb the Mammal')
//var name = myMammal.get_name()

var Cat = function(name){
    this.name = name 
    this.saying = 'meow'
}
//inheritance 
Cat.prototype = new Mammal();
Cat.prototype.purr = function(n){   
    //Cat's new method purr
    var i,s = ''
    for (i=0; i<n; i+=1){
        if(s) {
            s += '-';
        }
        s += 'r';
    }
    return s;
}
Cat.prototype.get_name = function(){
    return this.says() + ' ' + this.name +' '+ this.says(); 
}
//test cases
//var myCat = new Cat('Henrietta')
//var says  = myCat.says()
//var purr  = myCat.purr(5)
//var name  = myCat.get_name()

//Object approach to interitance

//step1: define object
var myMammal_2 = {
    name: 'Herb the Mammal',
    get_name:function(){
        return this.name;
    },
    says:function(){
        return this.saying || '';
    }  
}

//step 2: use as Object.create
var myCat_2  = Object.create(myMammal_2)
myCat_2.name = 'Sansita' 
myCat_2.saying = 'yo'
myCat_2.purr = function(n){
    var i,s = ''
    for(i=0; i<n; i+=1){
        if(s){
            return '-'
        }
        s+='y'
    }
    return s
}
myCat_2.get_name = function(){
    return this.name + ' ' + this.saying  
}


//2 steps to make a better interitance method for functional programming

//step1: write the parent constructor
var mammal = function (spec){
    var that = {}
    that.get_name = function(){
        return spec.name
    } 
    that.says = function() {
        return spec.saying || ''
    }
    return that
}
var myMammal_3 = mammal({name:'Jol'})

//step2: interitance 
var cat = function(spec){
    spec.saying = spec.saying || 'meow'
    var that = mammal(spec)
    that.purr = function(n){
        var i,s = ''
        for(i=0; i<n; i+=1){
            if(s){
                s+= '-'
            }
            s+='y'
        }
        return s
    }
    that.get_name = function(){
        return that.says() + ' ' + spec.name + ' ' +that.says();
    }
    return that
}  
var myCat_3 = cat({name:'Super_jol'})

//a superior method..not sure is clearly understood
//Object.method('superior',function(name){
//    var that   = this,
//        method = that[name];
//    return function(){
//            return method.apply(that,arguments);
//        }
//})
//
//var coolcat = function(spec){
//    var that = cat(spec)
//    super_get_name = that.superior('get_name')
//    that.get_name = function(){
//        return 'like' + super_get_name() + 'baby'
//    }
//    return that
//} 

