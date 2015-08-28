var API_URL = 'http://dev.ullon.com/petrosur/public/api/';
var IMG_URL = 'http://dev.ullon.com/petrosur/public/web/mobile_images/';
var STATUS_DEFAULT_HTML = '<h2>Ingresá con Facebook para usar la aplicación y participar</h2>';





var uId = 0;
var fb_id = 0;
var user_document = 0;
var user_phone = 0;

var fb_response = 0;

var newsId;
var newsList;
var myList;
    


function api_call(c,m,json,callback){
              var request = {
                c: c,
                m: m,
                data: JSON.stringify(json)
              };

              $.post(API_URL,request, function( data ) {
                  var json = JSON.parse(data);
                  eval(callback+'(json)');


              });
}

function pre_register(){
        
    
        if(document.getElementById('cedula').value.length<5){
            alert('Por favor ingrese su numero de documento');
            document.getElementById('cedula').focus()
            return false;
        }
        if(document.getElementById('telefono').value.length<5){
            alert('Por favor ingrese su numero de telefono');
            document.getElementById('telefono').focus();
            return false;
        }
        set_var('user_document',document.getElementById('cedula').value);
        set_var('user_phone',document.getElementById('telefono').value);
        login();
    
}


function register(first_name,last_name,email,document_number,phone_number,fb_id,fb_token,tw_id,tw_token){
    var data = [
            {
                "key"   :"first_name",
                "value" :first_name
            },
            {
                "key"   :"last_name",
                "value" :last_name
            },
            {
                "key"   :"email",
                "value" :email
            },
            {
                "key"   :"document_number",
                "value" :document_number
            },
            {
                "key"   :"phone_number",
                "value" :phone_number
            },
            {
                "key"   :"fb_id",
                "value" :fb_id
            },
            {
                "key"   :"fb_token",
                "value" :fb_token
            },
            {
                "key"   :"tw_id",
                "value" :tw_id
            },
            {
                "key"   :"tw_token",
                "value" :tw_token
            }
        ];
    
    
    api_call('user','register',JSON.stringify(data),'register_return');
    
}

function register_return(data){
    if(data.status=="success"){
        uId=data.data.id;
        fb_id = data.data.fb_id;
        user_document = data.data.document_number;
        user_phone = data.data.phone_number;
        
        set_var('uId',uId);
        set_var('fb_id',fb_id);
        set_var('user_document',user_document);
        set_var('user_phone',user_phone);
        
        list_all();
        
        
        document.getElementById('status').innerHTML = 'Bienvenido '.fb_response.first_name+' '+fb_response.last_name;
        $('#registro').hide();
    }else{
        alert(data.message);
    }
}

function set_var(varName,varValue){
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem(varName, varValue);
        
    } else {
        
    }
}

function get_var(varName,defaultValue){
    if(typeof(Storage) !== "undefined") {
        var x = localStorage.getItem(varName);
        if(typeof(x) == "undefined")x = defaultValue;
        return x;
    } else {
        alert("LocalStorage is Off");
    }
}


 
    
          
    function init(){
        
                uId = get_var('uId',uId);
                fb_id = get_var('fb_id',fb_id);
                fb_response = get_var('fb_response',fb_response);
                user_phone = get_var('user_phone',user_phone);
                user_document = get_var('user_document',user_document);
                
                
              
                
                
                if(uId==0 || fb_id==0 || user_phone.length<6 || user_document.length<5){
                    $('#registro').show();
                    $('#noticias').hide();
                }else{
                    list_all();
                    $('#registro').hide();
                    $('#noticias').show();
                    login();
                }
    }       
       
          
        
    function list_all(){
        var d = [
                    {
                        "key"   :"uid",
                        "value" :uId
                    }
                ]
                api_call('news','get_list','','list_news');
                api_call('news','get_my_list',JSON.stringify(d),'my_list');
                
    }
    
    function list_mine(){
        if(uId==0){
            alert('Debe ser un usuario registrado para usar esta funcion');
            return false;
        }
        var d = [
                    {
                        "key"   :"uid",
                        "value" :uId
                    }
                ]
                api_call('news','get_my_list',JSON.stringify(d),'list_news');
                api_call('news','get_my_list',JSON.stringify(d),'my_list');
    }
    

    function popup(id){
        if(uId==0){
            alert('Debe ser un usuario registrado para poder compartir noticias');
            return false;
        }      
        newsId = id;
      
      $('#popup').show();
    }
    
    function list_news(data){
      clear_list();
      newsList = data;
      for(var i=0;i<data.data.length;i++) noticia(i,data.data[i]);
    }
    function my_list(data){
      myList = data;
    }
    
    function clear_list(){
       for(var i=0;i<6;i++) document.getElementById('news_'+i).innerHTML = '';
    }
    

    function noticia(position,data){
      var url = "'"+data.url+"'";
      var html = '<div onclick="popup('+data.id+');"><img src="'+IMG_URL+data.image+'"><div class="newstitle"><div class="pad10"> '+data.title+'</div></div></div>';
      document.getElementById('news_'+position).innerHTML = html;
    }

    function shareThis(){
        
        $('#popup').hide();
        if(uId==0){
            alert('Debe ser un usuario registrado para poder compartir noticias');
            return false;
        }
        for(var i=0;i<myList.data.length;i++){
            
            if(myList.data[i].id==newsId){
                alert('Esta noticia ya fue compartida');
                return false;
            }
        }
        
        for(var i=0;i<newsList.data.length;i++){
            if(newsList.data[i].id==newsId){
                
                facebookWallPost(
                        newsList.data[i].title,
                        newsList.data[i].url,
                        IMG_URL+newsList.data[i].image,
                        'Petrosur, Buena Energia',
                        'Comparte buenas noticias con Petrosur!'
                );
                
                        
            }
        }
    }
    
    function saveShared(fbPostId){
        
        var data = [
            {
                "key"   :"nid",
                "value" :newsId
            },
            {
                "key"   :"uid",
                "value" :uId
            },
            {
                "key"   :"fb_post_id",
                "value" :fbPostId
            }
        ];        
        
        api_call('news','share_new',JSON.stringify(data),'share_return');
        api_call('news','get_my_list',JSON.stringify(data),'my_list');
        api_call('user','getfuel',JSON.stringify(data),'update_fuel');
        var n = {"id":newsId};
        myList.data.push(n);
    }
    
    function update_fuel(data){
        document.getElementById('needle').src='img/aguja'+data.data.level+'.png';
    }
        
    
    function share_return(data){
        if(data.status=='success'){
            alert('Su noticia se ha compartido con exito!');
        }else{
            alert('Ocurrio un error al registrar este share');
        }
    }
    
    function verifyFbUser(fbid){
        var data = [
            {
                "key"   :"fbid",
                "value" :fbid
            }
        ]; 
        api_call('user','verify_fbuser',JSON.stringify(data),'verifyFbUser_return');
    }
    
    function verifyFbUser_return(data){
        if(data.status=='success'){
            uId = data.data[0].id;
            document.getElementById('registro').style='visibility:hidden';
        }else{
            alert(data.message);
        }
    }
	
	function ver_mapa() {
		$('#mapa').show();
		$('#cerrarmapa').show();
	  }
	  function cerrar_mapa() {
		$('#mapa').hide();
		$('#cerrarmapa').hide();
	  }

  
            var login = function () {
                if (window.cordova.platformId == "web") {
                    var appId = "145649255773745";
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login( ["email","public_profile "], 
                    function (response) {
                        fb_id = response.authResponse.userID;
                        
                        getUser();
                        //facebookConnectPlugin.api('/me', function(meresponse) {
                        //    alert(JSON.stringify(meresponse));
                        //    verifyFbUser(meresponse.id);
                        //    fb_id = meresponse.id;
                        //    fb_response = meresponse;
                            //document.getElementById('status').innerHTML = '<h2>Bienvenido '+response.first_name+' '+response.last_name+'</h2>';
                        //    document.getElementById('status').innerHTML = JSON.stringify(meresponse);
                            //alert(JSON.stringify(response));
                        //});
                        
                    },
                    function (response) { alert(JSON.stringify(response)) }
                 );
            }
            
            var showDialog = function () { 
                facebookConnectPlugin.showDialog( { method: "feed" }, 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }
            
            var getUser = function () { 
                facebookConnectPlugin.api( "me/?fields=first_name,last_name,email,id", ['publish_actions'],
                    function (response) { 
                        document.getElementById('status').innerHTML = '<h2>Bienvenido '+response.first_name+' '+response.last_name+'</h2>';
                        fb_id = response.id;
                        fb_response = response;
                        set_var('fb_id',fb_id);
                        set_var('fb_response',fb_response);
                        user_document = get_var('user_document',0);
                        user_phone = get_var('user_phone',0);
                        
                        
                        register(fb_response.first_name,fb_response.last_name,fb_response.email,user_document,user_phone,fb_id,'-','-','-');

                    },
                    function (response) { alert('Getuser Failed: '+JSON.stringify(response)) }); 
            }
            
            function facebookWallPost(postName,postLink,postPicture,postCaption,postDescription) {
                
                var params = {
                    method: 'feed',
                    name: postName,
                    link: postLink,
                    picture: postPicture,
                    caption: postCaption,
                    description: postDescription
                };
                facebookConnectPlugin.showDialog( params, 
                    function (response) { 
                        //alert(JSON.stringify(response)) 
                        saveShared(response.post_id);
                    },
                    function (response) { alert(JSON.stringify(response)) });
                
                console.log(params);
                
            } 

            var getAccessToken = function () { 
                facebookConnectPlugin.getAccessToken( 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }
            
            var getStatus = function () { 
                facebookConnectPlugin.getLoginStatus( 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }

            var logout = function () { 
                facebookConnectPlugin.logout( 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }
        


        
        

   
    function initMap() {
    var myLatLng = {lat: '-25.286118' , lng: '-57.558252'};

    var map = new google.maps.Map(document.getElementById('mapa'), {
      zoom: 4,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Petrosur'
    });
    
  }
  





