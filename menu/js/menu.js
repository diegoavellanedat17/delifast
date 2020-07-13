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
  numero_almuerzos=1;


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

                uid_restaurante=doc.data().uid
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
                            const estado= doc.data().estado
                            var categoriaFix = categoria.replace(/\s/g, '');
                            var dias= doc.data().dia
                            

                        if(dias[dia_actual]===true && estado==='activo'){    

                            if($("#" + categoriaFix).length == 0) {
                                //si no existe esa categoria debe crearse
                             if (categoriaFix === 'Entradas' || categoriaFix === 'Principio'){
                                $(`
                                <div class="col-12 col-md-6 clase-categoria" id="${categoriaFix}">
                                        <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                        <h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                        <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>
                                </div>`).insertAfter( "#tituloAlmuerzos" );
    
                             }

                             else{
                                $(".user-items").append(`
                                <div class="col-12 col-md-6 clase-categoria" id="${categoriaFix}">
                                        <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                        <h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                        <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>
                                </div>`
                                )
                             }
                              }
            
                            else{
                                  $(`#${categoriaFix}`).append(`<h5  class="col-12 text-center platoMenu" style=" color: white">${nombre}</h5>
                                                                        <p class="text-muted col-12 text-center descripcion-text">${descripcion}</p>`)
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

//Cuando quieran realizar un pedido

document.getElementById("button_pedir").addEventListener("click", function(){
    //debe decidirse cual modal mostrar si el de realizar pedido o realizar atenticación, esto depende si hay usuario o no 
    var user = firebase.auth().currentUser;
    console.log(user)
    numero_almuerzos=1;
    if(user === null){
        $("#modal-usuario").modal()
    }
    else{
        //Debe verificarse que tipo de usuario quiere hacer un pedido, si es un restaurante redirige a restaurantes 
        // Si es un cliente abre el modal de hacer pedido 
        var consulta_precio=db.collection('clientes').where("uid","==",user.uid)
        consulta_precio.get()
        .then(function(querySnapshot){
            if(querySnapshot.empty){
                // Seguramente es un restaurante entonces redirigimos a UvR
                window.location = '../UvR/UvR.html'; //After successful login, user will be redirected to home.html

            }
            querySnapshot.forEach(function(doc){
                if(numero_almuerzos === 1){
                    $(".quitarMenu").remove()
                }
                
                const tipo=doc.data().tipo
                console.log(tipo)
                $(".almuerzoDia").empty()
                    $(".almuerzoDia").append( `                  <div style="border-bottom: gray 1px solid;">
                <h5 id="almuerzoTitle">Almuerzo ${numero_almuerzos} </h5>
                    </div>`)
                
                if(tipo==='cliente'){
                    var categorias = $(".clase-categoria").map(function() { return this.id;});
                    console.log(categorias[0])
                    var i;
                    
                    for (i = 0; i < categorias.length; i++) { 

                        $(".almuerzoDia").append( `
                               
                                <div class="form-group col-md-12 ${categorias[i]}${numero_almuerzos}">
                                    <label for="input${categorias[i]}">${categorias[i]}</label>
                                    <select id="input${categorias[i]}" class="form-control ${categorias[i]}${numero_almuerzos}class" name="${categorias[i]}${numero_almuerzos}">
                                    </select>
                                </div> `)

                                var platoPorCategoria=$(`#${categorias[i]}`).find(".platoMenu").each(function(){
                                    console.log($( this ).text())
                                    $(`.${categorias[i]}${numero_almuerzos}class`).append(`<option>${$( this ).text()}</option>`)
                                })
                     }

                     $(".almuerzoDia").append( `   <div class="form-group col-md-12 notas">
                     <label for="notas">Notas</label>
                     <input type="notas" class="form-control" id="notas" placeholder="Notas">
                        </select>
                    </div> `)

                     $(".ModalHacerPedido").css("display","none")
                     $(".adicionarMenu").css("display","block")
                     $(".quitarMenu").css("display","block")
                     $(".atrasBoton").css("display","none")
                     $(".modal-body-pedido").css("display","block")
                     $(".hacerpedido").css("display","block")
                     $(".enviarOrden").css("display","none") 
                    $("#modal-pedido").modal()
                }
                else{
                    alert("Comunicate con nosotros en delifast")
                    firebase.auth().signOut()
                }

            })
        })
    }
})

function AdicionarMenu(){
    $(".notas").remove()
    numero_almuerzos++;
    $(".almuerzoDia").append( `       <div style="border-bottom: gray 1px solid;" id="almuerzoTitle${numero_almuerzos}">
                <h5 id="almuerzoTitle">Almuerzo ${numero_almuerzos} </h5>
                    </div>`)
    var categorias = $(".clase-categoria").map(function() { return this.id;});
                    var i;
                    for (i = 0; i < categorias.length; i++) { 

                        $(".almuerzoDia").append( `
                               
                                <div class="form-group col-md-12 ${categorias[i]}${numero_almuerzos}">
                                    <label for="input${categorias[i]}">${categorias[i]} ${numero_almuerzos}</label>
                                    <select id="input${categorias[i]}" class="form-control ${categorias[i]}${numero_almuerzos}class" name="${categorias[i]}${numero_almuerzos}">
                                    </select>
                                </div> `)

                                var platoPorCategoria=$(`#${categorias[i]}`).find(".platoMenu").each(function(){
                                    console.log($( this ).text())
                                    $(`.${categorias[i]}${numero_almuerzos}class`).append(`<option>${$( this ).text()}</option>`)
                                })
                     }
                     $(".almuerzoDia").append( `   <div class="form-group col-md-12 notas">
                     <label for="notas">Notas</label>
                     <input type="notas" class="form-control" id="notas" placeholder="Notas">
                        </select>
                    </div> `)
                    

    if(numero_almuerzos>1 && $(".quitarMenu").length == 0){
        $(`<button type="button" class="btn btn-outline-danger quitarMenu" onclick="QuitarMenu()">Quitar un Menú</button>`).insertAfter(".adicionarMenu")
    }

console.log(`El numero de almuerzos es ${numero_almuerzos}`)
}

function QuitarMenu(){
    
    if (numero_almuerzos > 1){

        var categorias = $(".clase-categoria").map(function() { return this.id;});
                    var i;
                    for (i = 0; i < categorias.length; i++) {
                        $(`.${categorias[i]}${numero_almuerzos}`).remove()
                       
                     }
                     $(`#almuerzoTitle${numero_almuerzos}`).remove()
                     console.log(`El numero de almuerzos quitado es ${numero_almuerzos}`)
        numero_almuerzos--;
    }

    if(numero_almuerzos === 1){
        $(".quitarMenu").remove()
    }
}

// Cerrar sesión
$(".logout").click(function() {
    console.log("out")
    firebase.auth().signOut()

});

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
            swal({
                title:"Check",
                  text:"Bienvenido",
                  icon:"success"
              
              })
    	
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
    var user = firebase.auth().currentUser;
    console.log(user)
    $(".icon").css("color","green")
    $(".user-name").append(user.displayName)

  }
  else{
    console.log("Is the first time dont redirect or Logout")
    $(".icon").css("color","white")
    $(".user-name").empty()
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


function HacerPedido(){
    // Aqui se mostrará el resumen de lo que se piensa pedir
    var categorias = $(".clase-categoria").map(function() { return this.id;});

    if($(".atrasBoton").length == 0){
        $(`<button type="button" class="btn btn-outline-danger atrasBoton" onclick="Atras()">Atras</button>`).insertAfter(".cerrar")
        $(`<button type="button" class="btn btn-primary enviarOrden" onclick="EnviarOrden()">Enviar Orden</button>`).insertAfter(".cerrar")
    }

    $(".modal-body-pedido").css("display","none")
    $(".adicionarMenu").css("display","none")
    $(".quitarMenu").css("display","none")
    $(".atrasBoton").css("display","block")
    $(".hacerpedido").css("display","none")
    $(".enviarOrden").css("display","block")
    
    $(".ModalHacerPedido").css("display","block")
    $(".ModalHacerPedido").empty()
    console.log(`iterar pedido en ${numero_almuerzos}`)
    $(".ModalHacerPedido").append(`
    <h5>Resumen del pedido</h5>
    <table class="table table-sm TablaHacerPedido">
    <thead>
    <tr class="headerTablaHacerPedido">
    
    </tr>
    </thead>

    <tbody class="bodyTablaHacerPedido">


    </tbody>


    </table>`)
    $(".headerTablaHacerPedido").empty()
    $(".headerTablaHacerPedido").append(`<th scope="col" >Tipo</th>`)

    var j;

    for (j = 1; j <= numero_almuerzos; j++) { 
         $(".bodyTablaHacerPedido").append(`  
                                            <tr class="tablaAlmuerzo${j}">
                                                <th scope="row" >Almuerzo ${j} </th>
  
                                            </tr>
                                            `)
    }
  
    var i;

    for (i = 0; i < categorias.length; i++) { 
         $(".headerTablaHacerPedido").append(`<th scope="col">${categorias[i]}</th>`)
        

        var j;

        for (j = 1; j <= numero_almuerzos; j++) { 
             

            var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
            $(`.tablaAlmuerzo${j}`).append(`
                                            <td > ${valueTable} </td>
                                            `
                )
        }


    }
    var notas=document.forms["PedidoForm"][`notas`].value


    if(notas!=""){
    $( `<p>Notas</p> <small>${notas}</small>`).insertAfter( ".TablaHacerPedido" );

    }


  
    
}

function Atras(){
    $(".modal-body-pedido").css("display","block")
    $(".adicionarMenu").css("display","block")
    $(".quitarMenu").css("display","block")
    $(".atrasBoton").css("display","none") 
    $(".enviarOrden").css("display","none") 
    $(".hacerpedido").css("display","block")

    $(".ModalHacerPedido").css("display","none")
}

function EnviarOrden(){
    var pedido = {};
  
    //Esta funcion escribe en la base de datos de pedidos y tambien hace un append al array 
    // de restaurante con el uiid del cliente. 
    var user = firebase.auth().currentUser
    // pedir la dirección y telefono a la base de datos 
    var consulta_usuario=db.collection('clientes').where("uid","==",user.uid)
    consulta_usuario.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var direccion= doc.data().dir
            var telefono= doc.data().tel
            pedido['tel']=telefono
            pedido['dir']=direccion
            //se tendrá un array con el nombre de la categoria que tenga la orden 
            var categorias = $(".clase-categoria").map(function() { return this.id;});
            var categoriaPedido=[]
            
            //notas del pedido
            var notas=document.forms["PedidoForm"][`notas`].value
            var i;  
            for (i = 0; i < categorias.length; i++) { 
                // arreglo auxiliar para ingresarle lo que va en cada categoria
                var auxiliar_array=[]
                var j;
                for (j = 1; j <= numero_almuerzos; j++) { 
                    var valueTable=document.forms["PedidoForm"][`${categorias[i]}${j}`].value
                    auxiliar_array.push(valueTable)
                }


                pedido[`${categorias[i]}`] = auxiliar_array;
            }


            pedido['uid_cliente']=user.uid
            pedido['uid_restaurante']=uid_restaurante
            pedido['notas']=notas
            pedido['hora_pedido']=Date.now()
            pedido['estado']='ordenado'

            

            GuardarPedido(pedido,uid_restaurante,user.uid)
            console.log(pedido)
        })
    })
    .catch(function(err){
        console.log(err)
    })
   
    
}

function GuardarPedido(pedido,uid_restaurante,user_uid) {

	
    db.collection("pedidos").doc().set(pedido)
    .then(function() {
        console.log("Document successfully written!");
        swal({
            title:"Listo",
              text:"Pedido enviado",
              icon:"success"
          
          }).then(()=>{
            $("#modal-pedido").modal('toggle');
            console.log("cerrar modal")
          })
        var consulta_restaurantes=db.collection('restaurantes').where("uid","==",uid_restaurante)
        consulta_restaurantes.get()
        .then(function(querySnapshot){


            querySnapshot.forEach(function(doc){
                    console.log(doc.data())
                    var clientes=doc.data().clientes
                    var doc_restaurante=doc.id
                    if(clientes.includes(user_uid)!= true){
                    clientes.push(user_uid)
                    var actualizacion_clientes=db.collection('restaurantes').doc(doc_restaurante)
                    return actualizacion_clientes.update({
                        clientes: clientes
                    })
                    .then(function(){
                        console.log("metido en restaurantes")
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                    }

                    })
            
    })
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });

 
    

}
