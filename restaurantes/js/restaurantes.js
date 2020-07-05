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

  // Verificar cual es el nombre del restaurante para pasarlo como parametro

  function getUserData(){
    return new Promise((resolve,reject)=>{
        firebase.auth().onAuthStateChanged(user => {
            const userData={
                uid:user.uid,
                email:user.email,
                name:user.displayName
            }
            resolve(userData)
        });
    })
    
}


$(".pedidos").click(function(){
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
});

$("settings").click(function(){
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
    
});

$(".clients").click(function(){
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
    

});


$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

$(".menu").click(function(){
    $(".user-items").css("background-color","white")
    console.log("menu")
    $(".user-items").empty()
    $(".user-items").append(`              
    <button type="button" class="btn btn-outline-secondary col-12 col-md-3 mt-3 ml-3"  onClick="AdicionarProducto()" >Adicionar Plato</button>
    <a href="#" class="btn btn btn-outline-warning col-12 col-md-3 mt-3 ml-3 " onClick="PrecioMenu()" > Precio del Menú</a>
    <a href="#" class="btn btn-outline-success col-12 col-md-3 mt-3 ml-3 " onClick="VistaMenu()" > Vista del Menú</a>
    `)
    MostrarMenuActual()
});



function AdicionarProducto(){
    $('#modal-producto').modal();
}

function VistaMenu(){
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
    var user = firebase.auth().currentUser;
    var vista_menu=db.collection('menu').where("uid_restaurante","==",user.uid)
    vista_menu.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            alert('Aun no hay un menú creado')
        }
        else{
            $(".user-items").css("background-color","#333333")
            $(".user-items").append(
                `
                
                    <h1 id="tituloMenuDia" class="col-12"style=" color: white;" >Menú del día </h1>
                      
                    <h2 id="tituloAlmuerzos" class="col-12 text-center" style=" color: #fef88f">ALMUERZOS</h2>

            
                `
                )
                
            querySnapshot.forEach(function(doc){
                const categoria=doc.data().categoria
                const nombre=doc.data().nombre
                const descripcion=doc.data().descripcion
               
                var categoriaFix = categoria.replace(/\s/g, '');

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

            

            })
        }
        
    })

    var consulta_precio=db.collection('restaurantes').where("uid","==",user.uid)
    consulta_precio.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const precio=doc.data().precio
         
            $(".user-items").append(`
            
            <div class="col-12 ">
                    <h5 id="titulocategoria" class="col-12 text-center mt-5" style=" color: #fef88f">Precio: $ ${precio}</h5>
            </div>
            
            `)
        })
    })
    


    


}

function PrecioMenu(){
    console.log("Ajustar Precio del Menú")
    // Buscar en la base de datos el precio del menú, si no existe colocal el input vacio, si ya existe colocal el valor actual como placeholder
    var user = firebase.auth().currentUser;
    var consulta_precio=db.collection('restaurantes').where("uid","==",user.uid)
    consulta_precio.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            const precio=doc.data().precio
            console.log(doc.id)
            $('.id-precio').empty()
            $('.id-precio').append(doc.id)
            $('#precio').val(precio)
            $('#modal-precio').modal();
        })
    })
}

function UpdatePrecio(){
    var precio=document.forms["PrecioForm"]["precio"].value;
    var user = firebase.auth().currentUser;
    var precio_id = $(".id-precio").text(); //preferred
    var actualizacion_precio=db.collection('restaurantes').doc(precio_id)
    return actualizacion_precio.update({
        precio:precio
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Precio de Menú Actualizado",
              icon:"success"
          
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function Click_modificar(ref_id){
    console.log(ref_id)
    var consulta_producto=db.collection('menu').doc(ref_id)
    consulta_producto.get()
    .then(function(doc){
            
                const nombrePlato=doc.data().nombre
                const categoria=doc.data().categoria
                const descripcion=doc.data().descripcion
                const dia=doc.data().dia
                const estado=doc.data().estado
                const semana_array=['LunesM','MartesM','MiercolesM','JuevesM','ViernesM','SabadoM','DomingoM']
                var i;

                for (i = 0; i < dia.length; i++) { 
                         $(`#${semana_array[i]}`).prop('checked', false);  
                 }

                for (i = 0; i < dia.length; i++) {
                   if (dia[i]=== true){
                       
                        $(`#${semana_array[i]}`).prop('checked', true);
                   }
                }
                $('.id-modificar').empty()
                $('.id-modificar').append(ref_id)
                $('#modificar-nombrePlato').val(nombrePlato)
                $('#modificar-categoria').val(categoria)
                $('#modificar-descripcion').val(descripcion)
                $('#modificar-estado').val(estado)
                // Checks the box
                $('#modal-modificar-producto').modal();

            });
      
}

function UpdatePlato(){
    console.log("Actualizar el plato")
    ValidarFormularioModificarProducto()
}

function GuardarPlato(){
    ValidarFormularioProducto()
}

function EliminarPlato(){
    var ref_id = $(".id-modificar").text(); // tomo el ID del Documento 
    db.collection('menu').doc(ref_id).delete().then(function(){
        swal({
            title:"Listo",
              text:"Producto Eliminado ",
              icon:"success"
          
          })

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


}

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location = '../login.html'; 
    }
});

getUserData()
.then(userData=>{
$(".user-name").text(userData.name)
  console.log(userData)
    $("#nombre-restaurante").append(userData.name)
    var nombreRestaurante=userData.name.replace(/\s/g, '')
    nombreRestaurante=nombreRestaurante.toLowerCase()
    console.log(nombreRestaurante)

    $(".user-items").append(`  
    <div class=" alert alert-success mt-5 col-12 mr-3 ml-3" role="alert" >
    <h4 class="alert-heading">Hola Restaurante ${userData.name}!</h4>
    <p> Envía el sigueinte link a tus usuarios para que puedan hacer sus pedidos  </p>
    <hr>
    <p class="mb-0" id="link">https://diegoavellanedat17.github.io/delifast/menu/menu.html?restaurante=${nombreRestaurante}</p>

    </div>
`
)
})
.catch(error=>{
    console.error(error)

    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html

})

function CrearNuevoPlato(categoria,semana,nombre,uid,descripcion){

   
   
        db.collection("menu").doc().set({
            categoria:categoria,
            dia:semana,
            nombre:nombre,
            estado:"activo",
            uid_restaurante:uid,
            descripcion:descripcion
        })
        .then(function() {
            swal({
                title:"Listo",
                  text:"Producto Adicionado ",
                  icon:"success"
              
              })
        })
        .catch(function(error) {
        console.error("Error writing document: ", error);
        });
    
    



}

function ModificarPlato(categoria,semana,nombre,ref_id,estado,descripcion){

    var actualizacion_producto=db.collection('menu').doc(ref_id)
    return actualizacion_producto.update({
        categoria:categoria,
        dia:semana,
        nombre:nombre,
        estado:estado,
        descripcion:descripcion
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Actualizado ",
              icon:"success"
          
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}


function ValidarFormularioProducto(){

    var NombrePlato = document.forms["crearProductoForm"]["NombrePlato"].value;
    var categoria = document.forms["crearProductoForm"]["categoria"].value;
    var Lunes = document.forms["crearProductoForm"]["Lunes"].checked;
    var Martes = document.forms["crearProductoForm"]["Martes"].checked;
    var Miercoles = document.forms["crearProductoForm"]["Miercoles"].checked;
    var Jueves = document.forms["crearProductoForm"]["Jueves"].checked;
    var Viernes = document.forms["crearProductoForm"]["Viernes"].checked;
    var Sabado = document.forms["crearProductoForm"]["Sabado"].checked;
    var Domingo = document.forms["crearProductoForm"]["Domingo"].checked;
    var Descripcion = document.forms["crearProductoForm"]["descripcion"].value;
    var Semana=[Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo]

    if(NombrePlato===""){
        alert("Debes agregar el nombre de algún plato")
    }
    var user = firebase.auth().currentUser;
    console.log(NombrePlato);
    console.log(Semana);
    console.log(categoria);
    CrearNuevoPlato(categoria,Semana,NombrePlato,user.uid,Descripcion)
}


function ValidarFormularioModificarProducto(){

    var NombrePlato = document.forms["modificarProductoForm"]["modificar-nombrePlato"].value;
    var categoria = document.forms["modificarProductoForm"]["modificar-categoria"].value;
    var Lunes = document.forms["modificarProductoForm"]["Lunes"].checked;
    var Martes = document.forms["modificarProductoForm"]["Martes"].checked;
    var Miercoles = document.forms["modificarProductoForm"]["Miercoles"].checked;
    var Jueves = document.forms["modificarProductoForm"]["Jueves"].checked;
    var Viernes = document.forms["modificarProductoForm"]["Viernes"].checked;
    var Sabado = document.forms["modificarProductoForm"]["Sabado"].checked;
    var Domingo = document.forms["modificarProductoForm"]["Domingo"].checked;
    var Descripcion = document.forms["modificarProductoForm"]["modificar-descripcion"].value;
    var Semana=[Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo]
    var estado=document.forms["modificarProductoForm"]["modificar-estado"].value;
    var ref_id = $(".id-modificar").text(); //preferred

    if(NombrePlato===""){
        alert("Debes agregar el nombre de algún plato")
    }

    var user = firebase.auth().currentUser;
    console.log("documento a modificar")
    console.log(ref_id);
 

    ModificarPlato(categoria,Semana,NombrePlato,ref_id,estado,Descripcion)

}


function MostrarMenuActual(){
    var user = firebase.auth().currentUser;
     consulta_menu=db.collection('menu').where("uid_restaurante","==",user.uid)
    .onSnapshot(function(querySnapshot) {
        $(".menuDia").empty()
        $(".menuDia").append(`
        <div class="table-responsive">
                <table class="table table-hover table table-bordered">
                                <thead>
                                <tr>
                                
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Semana</th>
                                    <th scope="col">Estado</th>
                                
                                </tr>
                                </thead>
                                <tbody class="menu-item-body">
                                </tbody>
                </table>
                
        </div>`)

        querySnapshot.forEach(function(doc) {
        const nombrePlato=doc.data().nombre
        const categoria=doc.data().categoria
        const descripcion=doc.data().descripcion
        const dia=doc.data().dia
        const estado=doc.data().estado
        var dias_array=[];
        const semana_array=['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo']
        var i;
        for (i = 0; i < dia.length; i++) {
           if (dia[i]=== true){
                dias_array.push(semana_array[i])
           }
        }


        $(".menu-item-body").append(`
        <tr id="${doc.id}" onClick="Click_modificar(this.id)" class="item_product"> 
            <td>${categoria}</td>
            <td>${nombrePlato}</td>
            <td>${descripcion}</td>
            <td>${dias_array}</td>
            <td>${estado}</td>
        
        </tr>
        
        `)
        
        });
    });

    
}

