// Se crea el archivo de configuracion para realizar la autenticacion por medio de firebase 
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBjasCFXiGf7JZAdqlG_lo-7XMwLwUJw0E",
    authDomain: "delifast-7576c.firebaseapp.com",
    databaseURL: "https://delifast-7576c.firebaseio.com",
    projectId: "delifast-7576c",
    storageBucket: "delifast-7576c.appspot.com",
    messagingSenderId: "415819035666",
    appId: "1:415819035666:web:9300f229e79d85c0f6d4cb",
    measurementId: "G-ESS36GVJTN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();


VerificarExistenciarestaurante()
VerificarDia()

function VerificarExistenciarestaurante(){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryRestaurante = urlParams.get('restaurante');
    const dia_actual=VerificarDia()
    const dias_semana = ["Lunes", "Martes", "Miercoles","Jueves","Viernes","Sábado","Domingo"];
    var consulta_restaurantes=db.collection('restaurantes').where("nombreRestaurante","==",QueryRestaurante)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            
            alert("Ingresa un restaurante válido")
            

        }
        else{
            $(".user-items").css("background-color","#333333")
            $("#button_pedir").css("display","block")
            $(".user-items").append(
                `
                
                    <h1 id="tituloMenuDia" class="col-12 mt-3"style=" color: white;" >Menú del día ${dias_semana[dia_actual]} </h1>
                      
                    <h2 id="tituloAlmuerzos" class="col-12 text-center mb-3" style=" color: #fef88f">ALMUERZOS</h2>

            
                `
                )

            querySnapshot.forEach(function(doc){

                const uid_restaurante=doc.data().uid
                var vista_menu=db.collection('menu').where("uid_restaurante","==",uid_restaurante)
                vista_menu.get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){
                        alert('Aun no hay un menú creado')
                    }
                    else{

                        querySnapshot.forEach(function(doc){
                            const categoria=doc.data().categoria
                            const nombre=doc.data().nombre
                            const descripcion=doc.data().descripcion
                            var categoriaFix = categoria.replace(/\s/g, '');
                            var dias= doc.data().dia
                            

                        if(dias[dia_actual]===true){    

                            if($("#" + categoriaFix).length == 0) {
                                //si no existe esa categoria debe crearse
                             
                                $(".user-items").append(`
                                <div class="col-12 col-md-6" id="${categoriaFix}">
                                        <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                        <h5 id="platoMenu" class="col-12 text-center" style=" color: white">${nombre}<br> <small class="text-muted">${descripcion}</small></h5>
                                </div>`
                                )
                              }
            
                            else{
                                  $(`#${categoriaFix}`).append(`<h5 id="platoMenu" class="col-12 text-center" style=" color: white">${nombre}<br> <small class="text-muted">${descripcion}</small></h5>`)
                              }
                            }


                        })
  
                    }
                })

                var consulta_precio=db.collection('restaurantes').where("uid","==",uid_restaurante)
                consulta_precio.get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        const precio=doc.data().precio
                     
                        $(".user-items").append(`
                        
                        <div class="col-12 ">
                                <h5 id="titulocategoria" class="col-12 text-center mt-2" style=" color: #fef88f">Precio: $ ${precio}</h5>
                        </div>
                        
                        `)
                    })
                })
                


                
  
            })
        }
        
    })
}

function VerificarDia(){
   
    today =  new Date();
    today_day_week=today.getDay();
    console.log(today_day_week);
    if(today_day_week===0){
        return 6
    }
    else{
        today_day_week=today_day_week-1
        return today_day_week
    }
}

// Agregar boton de pedir 
// Agregar modal de registro o autenticacion

// reciclé la mayoría de tu código en el login.js

const formulario=document.forms['form-register']
const authForm=document.forms['form-auth']
const forgotForm=document.forms['form-forgot']
forgotForm.addEventListener('submit',olvidar_contrasena);
formulario.addEventListener('submit', crearUsuario);
authForm.addEventListener('submit', AutenticarUsuario);

var firstTime=false

function crearUsuario(event){
	event.preventDefault();
	const email = formulario['email'].value;
	const password = formulario['password'].value;
    const name = formulario['name'].value;
    const dir = formulario['dir'].value;
    const tel = formulario['telefono'].value;
    
	// se verifica si no lleno algun campo 
	if (!email || !name || !password || !tel || !dir ){
		console.log('Deben llenarse todos los campos')

		swal({
			title:"Advertencia",
			  text:"Debes llenar todos los campos",
			  icon:"warning"
		  })
	}

	else{
		console.log(`El usuario que quiere crearse es ${name} con email ${email} y contraseña ${password}`)
		      

		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(result=>{
			result.user.updateProfile({
				displayName: name
			})
			console.log("Entra a creacion de usuario")
			var user = firebase.auth().currentUser;
			console.log(user.emailVerified)
			
			user.sendEmailVerification().then(function() {
				console.log("Enviando correo de Verificacion")
				GuardarInformacionCliente(name,email,password,dir,tel,user.uid)
				// Email sent.

				swal({
					title:"Check",
					  text:"Please check you email",
					  icon:"success"
				  
				  })

			  }).catch(function(error) {
				alert(error)
			  });
			  firstTime=true
			  firebase.auth().signOut()
	})
	.catch(error=>{
		alert(error)
		console.error(error)
	})
	

}
}

function AutenticarUsuario(event){
	event.preventDefault();
	const password = authForm['password'].value;
	const username = authForm['username'].value;
	console.log(`El usuario que quiere entrar es ${username} con  contraseña ${password}`)

  	firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result=>{
    	if(result.user.emailVerified){
			window.location = '../UvR/UvR.html'; //After successful login, user will be redirected to home.html
    		console.log('Restaurante');
		}
		
      else{

      	if(confirm("Verifica en tu correo electronico")){
      		// //Vamos a enviar un correo para que el usuario pueda verificarse 
			result.user.sendEmailVerification()
			.catch(error=>{// en caso deque hayaerror en el envío del correo 
				alert(error)

			console.error(error)
		})

      	console.log('Listo ya lo enviamos')
      	}
      	else{
      		console.log('okay como quieras')
      	}
      	//si va entrar pero se sale
      	firebase.auth().signOut()
      }
  	})
    
    .catch(function (error) {
    alert(error)
	  console.log(error);

    });
}

function olvidar_contrasena(event){
    var auth = firebase.auth();
    event.preventDefault();
    const email = forgotForm['email-address'].value;

    auth.sendPasswordResetEmail(email).then(function() {
        swal({
            title:"Check",
              text:"An email has been sent",
              icon:"success"
          
          })
        // Email sent.
      }).catch(function(error) {
        alert(error)
        console.log(error)
      });
}


// tengo un objeto mirando si hay o no autenticacion, si la hay abre lo otro
firebase.auth().onAuthStateChanged(user => {
  if(user && firstTime===false) {
   
	console.log("Allowed User")
	window.location = '../UvR/UvR.html';

  }
  else{
	console.log("Is the first time dont redirect or Logout")
  }
});

function GuardarInformacionCliente(name,email,password,dir,tel,userUid) {

	console.log('Enviando a base de datos')
    db.collection("clientes").doc().set({
		nombre:name,
        email: email,
        password: password,
        dir:dir,
		tel:tel,
		tipo:'cliente',
		uid:userUid,
	})
    .then(function() {
    console.log("Document successfully written!");
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
	});
}
