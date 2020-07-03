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
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
});

$("settings").click(function(){
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
    
});

$(".clientes").click(function(){
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
    console.log("menu")
    $(".user-items").empty()
    $(".user-items").append(`              
    <button type="button" class="btn btn-outline-secondary col-12 col-md-5 mt-3 ml-3"  onClick="AdicionarProducto()" >Adicionar Plato</button>
    <a href="#" class="btn btn-outline-success col-12 col-md-5 mt-3 ml-3 " onClick="ModificarMenu()" > Vista del Menú</a>
    `)
    MostrarMenuActual()
});

function AdicionarProducto(){
    $('#modal-producto').modal();
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

                console.log(nombrePlato)
                console.log(categoria)
                console.log(descripcion)
                $('#modificar-nombrePlato').val(nombrePlato)
                $('#modificar-categoria').val(categoria)
                $('#modificar-descripcion').val(descripcion)
                $("#Lunes").prop('checked', true);  // Checks the box
                $('#modal-modificar-producto').modal();

            });
       
}

function GuardarPlato(){
    ValidarFormularioProducto()
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
    <p class="mb-0" id="link">http://127.0.0.1:5500/menu/menu.html?restaurante=${nombreRestaurante}</p>

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


function MostrarMenuActual(){
    var user = firebase.auth().currentUser;
     consulta_menu=db.collection('menu').where("uid_restaurante","==",user.uid)
    .onSnapshot(function(querySnapshot) {
        $(".menuDia").empty()
        $(".menuDia").append(`
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
        </table>`)

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
        <tr id="${doc.id}" onClick="Click_modificar(this.id)">
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

