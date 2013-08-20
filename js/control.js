var Control = Control || {} 

Control.Slicer = function(e){
            var slicer_speed = document.getElementById('slicer-speed')
            var slicer_range = document.getElementById('slicer-range')
            
            var my_number = document.getElementById("number")
            var my_mouse = document.getElementById("coordinate")
            
            x=e.clientX;
            y=e.clientY;
//            console.log(slicer_control.value)
//            console.log('x',x)
            
    
//            slicer_control.value = x % slicer_control.max
            my_number.innerHTML = slicer_control.value
            my_mouse.innerHTML = (x+' '+y)
            
            
}

Control.Mouse = function(element){
    
    // a canvas object is the element
    
    var mouse = {x: 0, y: 0, event: null}
    
      body_scrollLeft    = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop     = document.body.scrollTop,
      element_scrollTop  = document.documentElement.scrollTop,
      offsetLeft         = element.offsetLeft,
      offsetTop          = element.offsetTop;
  
    element.addEventListener('mousemove', function (event) {
        var x, y;
        
        if (event.pageX || event.pageY) {
          x = event.pageX;
          y = event.pageY;
        } else {
          x = event.clientX + body_scrollLeft + element_scrollLeft;
          y = event.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;
        
        mouse.x = x;
        mouse.y = y;
        mouse.event = event;
  }, false);
    


    
    
  return mouse;
     
}




Control.captureMouse = function (element) {
  var mouse = {x: 0, y: 0, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;
  
  element.addEventListener('mousemove', function (event) {
    var x, y;
    
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + body_scrollLeft + element_scrollLeft;
      y = event.clientY + body_scrollTop + element_scrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    
    mouse.x = x;
    mouse.y = y;
    mouse.event = event;
  }, false);
  
  return mouse;
};     
