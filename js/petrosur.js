var API_URL = 'http://dev.ullon.com/petrosur/public/api/';
var IMG_URL = 'http://dev.ullon.com/petrosur/public/web/mobile_images/';
var STATUS_DEFAULT_HTML = '<h2>Ingresá con Facebook para usar la aplicación y participar</h2>';

var fb_id = 0;
var fb_response = 0;
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
    
        var document_number = document.getElementById('cedula').value;
        var phone_number = document.getElementById('telefono').value;
        if(document_number.length<5){
            alert('Por favor ingrese su numero de documento');
            document.getElementById('cedula').focus()
            return false;
        }
        if(phone_number.length<5){
            alert('Por favor ingrese su numero de telefono');
            document.getElementById('telefono').focus();
            return false;
        }
        
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
        
        var d = [
                    {
                        "key"   :"uid",
                        "value" :uId
                    }
                ]
        api_call('news','get_my_list',JSON.stringify(d),'my_list');
        
        alert('Bienvenido '.fb_response.first_name+' '+fb_response.last_name);
        document.getElementById('registro').innerHTML ='';
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

function get_var(varName){
    if(typeof(Storage) !== "undefined") {
        localStorage.getItem(varName);
    } else {
        alert("LocalStorage is Off");
    }
}






