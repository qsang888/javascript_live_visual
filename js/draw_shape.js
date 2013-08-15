//draw a ball
var Shape = Shape || {}; 

Shape.Any = function(my_constructor){
   var publicMethod = {}
   
   //private properties
   var pos_x     =  my_constructor.pos_x  || 0
   var pos_y     =  my_constructor.pos_y  || 0
   var scale_x   =  my_constructor.scale_x || .5
   var scale_y   =  my_constructor.scale_y || .5
   var color     =  my_constructor.color || "#ff0000";
   var lineWidth =  my_constructor.lineWidth || 1
   var rotation  =  my_constructor.rotaion || 0
    
   
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
        
    publicMethod.draw = function(context){
//        console.log('run me')
//        console.log(pos_x,'', pos_y)
        context.save();
        context.translate(pos_x, pos_y);
        context.rotate(rotation);
        context.scale(scale_x, scale_y);
        context.lineWidth = lineWidth;
        context.fillStyle = color;
        context.fill();
        if (lineWidth > 0) {
            context.stroke();
        }
        
    }
    
    
    
//    var myPrivateMethod = {}
//        
//    myPrivateMethod.foo = function(){}
    
    return publicMethod
}      
      
      
Shape.Ball = function(my_constructor){
    var radius = my_constructor.radius || 40
    var publicMethod   = Shape.Any(my_constructor)
    
    
    publicMethod.drawCircle = function(context){
      publicMethod.draw(context)   
      //circle specific
      context.beginPath()
      context.arc(0, 0, radius, 0, (Math.PI * 2), true)
      context.closePath()  
      
      context.restore();     
        
    }
    
    publicMethod.setRadius = function(){}
    publicMethod.getRadius = function(){}
    
    
    publicMethod.getBounds = function () {
        var position = this.getPosition()
      return {
        x: position.x - radius,
        y: position.y - radius,
        width:  radius*2,
        height: radius*2
        };
    
    }
    
    return publicMethod

}

Shape.Triangle = function(my_constructor){

}

Shape.Rec = function(my_constructor){

}

