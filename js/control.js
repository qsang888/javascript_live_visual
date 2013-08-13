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