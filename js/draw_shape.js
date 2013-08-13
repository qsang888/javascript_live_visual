//draw a ball
var Shape = Shape || {}; 

Shape.Any = function(my_constructor){
   var publicMethod = {}
   
   //private properties
   var pos_x   =  my_constructor.pos_x  || 0
   var pos_y   =  my_constructor.pos_y  || 0
   var scale_x =  my_constructor.scale_x || 1
   var scale_y =  my_constructor.scale_y || 1
   
//   var rotation = 0,
//       scale_x = 1,
//       scale_y = 1,
//       lineWidth = 1,
//       color = "#ff0000";
   
    publicMethod.getPosition = function(){
            postion = {}
            postion.x = pos_x
            postion.y = pos_y
            return postion;
    };
    
    publicMethod.setPosition = function(x,y){
            pos_x = x || pos_x
            pos_y = y || pos_y   
    };
    
    publicMethod.getScale = function(x,y){
            scale   = {}
            scale.x = scale_x
            scale.y = scale_y
            return scale;
    };
    
    publicMethod.setScale = function(x,y){
            scale_x = x || scale_x
            scale_y = y || scale_y
    };
        
   
    var myPrivateMethod = {}
        
    myPrivateMethod.foo = function(){}
    
    return publicMethod
}      
      
      
Shape.Ball = function(my_constructor){
    var radius = my_constructor.radius || 40
    var publicMethod   = Shape.Any(my_constructor)
    
    that.setRadius = function(){}
    that.getRadius = function(){}
    
    return publicMethod

}

Shape.Triangle = function(my_constructor){

}

Shape.Rec = function(my_constructor){

}

