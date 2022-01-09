function check(){
  let view = findHtmlViewById('site_title');
    //alert(view.textContent);
    view.style.color = 'white';
    let loginBtn = findHtmlViewById('login_btn');
    loginBtn.onclick = function(){
            let progress = findViewById('progress').progress;
            
    let val = 0;
    let int = setInterval(function(){
               val+=0.8;
               val = Math.round(val,2);
        if(val < 10){
           progress.setValue(val , "Starting..." ); 
        }else if(val >= 10 && val < 20){
           progress.setValue(val , "Picking up..." ); 
        }else if(val >= 20 && val < 30){
           progress.setValue(val , "Powering up..." ); 
        }else if(val >= 30 && val < 40){
           progress.setValue(val , "Accelerating..." ); 
        }else if(val >= 40 && val < 50){
           progress.setValue(val , "Reaching top speed..." ); 
        }else if(val >= 50 && val < 60){
           progress.setValue(val , "Speed levels out..." ); 
        }else if(val >= 60 && val < 80){
           progress.setValue(val , "Constant rate..." ); 
        }else if(val >= 80 && val < 90){
           progress.setValue(val , "Cooling off..." ); 
        }else if(val >= 90 && val < 100){
           progress.setValue(val , "Powering down..." ); 
        }else{
           progress.setValue(val=100 , "Upload done" );
            clearInterval(int);
        }
        
    }, 100 );
    };

}


check();
