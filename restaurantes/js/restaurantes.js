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
  entra_consulta=0;
  entra_pedidos=0;
  entra_carta=0;
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


// mirar si existe el logo, si no seguir 
function PlaceLogo(){
    var storageRef = firebase.storage().ref();
    var user = firebase.auth().currentUser;
    
    var nombreRestaurante=user.displayName
    var LogoRef = storageRef.child(`${nombreRestaurante}/logo.png`);

    // Get the download URL
    LogoRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
        var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function(event) {
                    var blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
                    console.log(url)

    	
    $( `<img id="logoImage" src="${url}" />" `).insertBefore( "#SideUserName" );
    // habilitar cors


   

    //var doc = new jsPDF()

    //doc.text('Hello world!', 10, 10)
    //doc.addImage(Imagebase64, 'JPEG', 15, 40, 180, 160)
    //doc.save('a4.pdf')

    }).catch(function(error) {
  
    console.log(error)
   
  });


}



$(".pedidos").click(function(){
    entra_pedidos=1;
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    
    var cantidad_menus=0
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_carta!=0){
        consulta_carta()
    }

    var user = firebase.auth().currentUser;
     consulta_pedidos=db.collection('pedidos').where("uid_restaurante","==",user.uid).orderBy("hora_pedido","desc")
    .onSnapshot(function(querySnapshot) {
        var audio = new Audio('./sounds/notification.mp3')
        audio.play()
        $(".user-items").empty()

        $(".user-items").append(`
                <div class="input-group input-group-sm mb-3 mt-2 ">

                    <input type="text" id="FitrarPedidos"class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar cualquier categoria">
                </div>`
      )
        $(".user-items").append(`
        <div class="table-responsive">
                <table class="table table-hover table table-bordered">
                                <thead class="thead-dark">
                                <tr class="TablaPedidosHeader">
                                    <th scope="col">Hora</th>
                                    <th scope="col">Pedido</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col">Notas</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                </tr>
                                </thead>
                                <tbody class="TablaPedidosBody" >
                                </tbody>
                </table>
                
        </div>`)

        querySnapshot.forEach(function(doc){
            var pedido={}
            var EntradasPedido=doc.data().Entradas
            var PrincipioPedido=doc.data().Principio
            var PlatoFuertePedido=doc.data().PlatoFuerte
            var BebidasPedido=doc.data().Bebidas
            var PedidoCarta=doc.data().carta
            var nombreCliente=doc.data().nombre
            const hora_pedido=doc.data().hora_pedido
            const total=doc.data().total
            const direccion=doc.data().dir
            const notas=doc.data().notas
            const estado=doc.data().estado
            var date_pedido= new Date (hora_pedido)
            hora_print=date_pedido.toLocaleString()
            console.log(date_pedido)
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(EntradasPedido!= undefined ){
                //Meterse a recorrer el arreglo
                cantidad_menu=EntradasPedido.length
                                
                for (i = 0; i < EntradasPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                     
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = EntradasPedido[i];
                    }
                    else{
         
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(EntradasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
              
                }
            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
                        
            if(PrincipioPedido!= undefined ){
                cantidad_menu=PrincipioPedido.length

                for (i = 0; i < PrincipioPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = PrincipioPedido[i];
                    }
                    else{
               
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(PrincipioPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                   
                }
   
            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header

            if(PlatoFuertePedido!= undefined ){
                cantidad_menu=PlatoFuertePedido.length

                for (i = 0; i < PlatoFuertePedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                    
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = PlatoFuertePedido[i];
                    }
                    else{
                 
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(PlatoFuertePedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                    //pedido[`menu${[i]}`] = EntradasPedido[i];
                }

            }
            //Primero toca Validar si hay algo dentro del item y no esta creado el header
            if(BebidasPedido!= undefined ){
                cantidad_menu=BebidasPedido.length

                for (i = 0; i < BebidasPedido.length; i++) {
                    //Verificar que exista ese key dentro del objeto
                    if (!([`menu${[i]}`] in pedido)){// verdadero si no existe el key
                     
                        pedido[`menu${[i]}`]=[]
                        pedido[`menu${[i]}`][0] = BebidasPedido[i];
                    }
                    else{
                     
                        var array_aux= pedido[`menu${[i]}`]
                        array_aux.push(BebidasPedido[i])
                        pedido[`menu${[i]}`] = array_aux;
                    }
                    //pedido[`menu${[i]}`] = EntradasPedido[i];
                }
        
            }

            console.log(pedido)

            $(".TablaPedidosBody").append(`     <tr id="${doc.id}" onClick="ClickPedido(this.id)">
                                                    <th scope="row" class="hour"><small>${hora_print}</small></th>
                                                    <td id="${doc.id}pedido"></td>
                                                </tr>`)
            
            for( i=0; i<cantidad_menu;i++){

                $(`#${doc.id}pedido`).append(`
                <div class="row">
                    <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                        <p>Menu: ${i+1} <small>${pedido[`menu${i}`]}</small></p>
                    </div>
                </div>
                `)
                
            }

            if(PedidoCarta != undefined && PedidoCarta != ""){

                $(`#${doc.id}pedido`).append(`
                <div class="row">
                    <div class="col-12" style="border-bottom: solid 1px #e8e8e8;">
                        <p>Carta:  <small>${PedidoCarta}</small></p>
                    </div>
                </div>
                `)
            }

            $(`#${doc.id}`).append(`<td ><small>${nombreCliente}</small></td>
                                    <td ><small>${direccion}</small></td>
                                    <td ><small>${notas}</small></td>
                                    <td ><small>${total}</small></td>
                                    <td ><small>${estado}</small></td>`)

            // para la tabla de filtrado

            $(document).ready(function(){
                    $("#FitrarPedidos").on("keyup", function() {
                     var value = $(this).val().toLowerCase();
                    $(".TablaPedidosBody tr").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                            });
                            });
                    });                            


        })
            
        

    })
    
});

$(".settings").click(function(){
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }
    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }

    console.log("configuracion")

    $(".user-items").append( `                     
                            <div class="col-12">
                            <form enctype="multipart/form-data">
                      

                            <div class="form-group">
                            <label for="logo">Logo</label>
                                <input type="file" class="form-control" id="logo" placeholder="Ingresa tu Logo" name="logo" accept ="image/*">
                            </div>

                            <button type="button" class="btn btn-primary"onClick="subirLogo()">Subir Logo</button>
                            </form>
                        </div>`)
                

    
});
// en este módulo se pueden ver los datos de las personas que han pedido al restaurante
$(".clients").click(function(){
    console.log("clientes")
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()

    $(".user-items").append(`
    <div class="input-group input-group-sm mb-3 mt-2 ">

        <input type="text" id="FitrarClientes"class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar cualquier categoria">
    </div>`
)
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }


    $(".user-items").append(`
    <div class="table-responsive">
                        <table class="table table-hover">
                    <thead class="TablaClientesHead">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Email</th>
                        <th scope="col">Dirección</th>
                        </tr>
                    </thead>
                    <tbody class="TablaClientesBody">
                        
                    </tbody>
                    </table>
                    </div>
    
    `)
    var user = firebase.auth().currentUser;

    var consulta_restaurantes=db.collection('restaurantes').where("uid","==",user.uid)
        consulta_restaurantes.get()
        .then(function(querySnapshot){

            querySnapshot.forEach(function(doc){
                    
                    var clientes=doc.data().clientes
                    console.log(clientes)
                    clientes.forEach(function(element){
                        if(element!=""){
                            // Hacer el query a los clientes preguntando por la informacion y agregandola a la tabla 
                            console.log("consultando ",element)
                            var consulta_cliente=db.collection('clientes').where("uid","==",element)
                            consulta_cliente.get()
                                .then(function(query){
                                    query.forEach(function(doc){

                                    
                                    var nombre=doc.data().nombre
                                    var telefono=doc.data().tel
                                    var email=doc.data().email
                                    var direccion=doc.data().dir

                                    $(".TablaClientesBody").append(`
                                                        <tr>
                                                        <th >${nombre}</th>
                                                        <td>${telefono}</td>
                                                        <td>${email}</td>
                                                        <td>${direccion}</td>
                                                    </tr>
                                    `)

                                })

                            })
                            .catch(function(err){
                                console.log(err)
                            })
                        }
                    })
                    })

         // para la tabla de filtrado
            
            $(document).ready(function(){
                $("#FitrarClientes").on("keyup", function() {
                 var value = $(this).val().toLowerCase();
                $(".TablaClientesBody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                        });
                        });
                });    
            
        })
   
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });
        

    

});

$(".qrcode").click(function(){
    console.log("mi página")
        // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    if(entra_carta!=0){
        consulta_carta()
    }
    $(".user-items").css("background-color","white")
    $(".user-items").empty()
    $(".menuDia").empty()
    getUserData()
    .then(userData=>{
  
        var nombreRestaurante=userData.name.replace(/\s/g, '')
        nombreRestaurante=nombreRestaurante.toLowerCase()
        console.log(nombreRestaurante)

        $(".user-items").append(`
        <div><p class="miLink">https://diegoavellanedat17.github.io/delifast/menu/menu.html?restaurante=${nombreRestaurante}</p></div>
        <div id="qrcode" class="col-12 mb-5"></div>
        <button type="button" class="btn btn-primary col-12 mt-3" onclick="DescargarPDF()" >Descargar QR</button>
        
    `
    )
    var qrcode= new QRCode(document.getElementById("qrcode"), `https://diegoavellanedat17.github.io/delifast/menu/menu.html?restaurante=${nombreRestaurante}`);
        console.log(qrcode)
        var QRBdom = $($("#qrcode").find('img')[0])
        //var Base64URL=scrQRBase.getAttribute("src");
        var srcDOM = QRBdom.attr("id","imagenQR")
        console.log(srcDOM)

    })


})

// convertir a BAse64 la imagen para poner en PDF
var convertImgToDataURLviaCanvas = function(url, callback) {
  var img = new Image();

  img.crossOrigin = 'Anonymous';

  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL();
    callback(dataURL);
    canvas = null;
  };

  img.src = url;
}
// verificar si hay una imagen 

//descargar PDF
function DescargarPDF(){
    var src=$("#imagenQR").attr("src")
    if($('#logoImage').length){
       
        var Logosrc=$("#logoImage").attr("src")

    convertImgToDataURLviaCanvas( Logosrc, function( base64_data ) {

        console.log( base64_data );
        var doc = new jsPDF()

        doc.setFont('Yellowtail')
        doc.text('Código QR mi restaurante !', 10, 10)
        doc.addImage(src, 'JPEG', 50,50, 100, 100)
        doc.addImage(base64_data, 'JPEG', 80, 20, 40, 20)
        doc.save('a4.pdf')
        
    } );

    }
    else{
    
        var doc = new jsPDF()

        doc.setFont('Yellowtail')
        doc.text('Código QR mi restaurante !', 10, 10)
        doc.addImage(src, 'JPEG', 50,50, 100, 100)

        doc.save('a4.pdf')
        
    }
    


}

$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

$(".menu").click(function(){
    if(entra_pedidos!=0){
        consulta_pedidos()
    }
    if(entra_carta!=0){
        consulta_carta()
    }


    $(".user-items").css("background-color","white")
    console.log("menu")
    $(".user-items").empty()
   
    $(".user-items").append(`              
    <button type="button" class="btn btn-outline-secondary col-12 col-md-3 mt-3 ml-3"  onClick="AdicionarProducto()" >Adicionar Plato</button>
    <a href="#" class="btn btn btn-outline-warning col-12 col-md-3 mt-3 ml-3 " onClick="PrecioMenu()" > Precio del Menú</a>
    <a href="#" class="btn btn-outline-success col-12 col-md-3 mt-3 ml-3 " onClick="VistaMenu()" > Vista del Menú</a>
    `)
    $(".user-items").append(`
    <div class="input-group input-group-sm mb-3 mt-4 ">

        <input type="text" id="FitrarMenu"class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar cualquier categoria">
    </div>`
    )
    MostrarMenuActual()
});

$(".carta").click(function(){
    console.log("carta")
    if(entra_consulta!=0){
        consulta_menu()
    }

    if(entra_pedidos!=0){
        consulta_pedidos()
    }

    $(".user-items").css("background-color","white")
    console.log("menu")
    $(".user-items").empty()
    $(".user-items").append(`              
    <button type="button" class="btn btn-outline-secondary col-12  mt-3 ml-3"  onClick="AdicionarProductoCarta()" >Adicionar Plato Carta</button>

    `)

    $(".user-items").append(`
    <div class="input-group input-group-sm mb-3 mt-4 ">

        <input type="text" id="FitrarCarta"class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Escribe para filtrar cualquier categoria">
    </div>`
    )
    MostrarCartaActual()

})



function AdicionarProducto(){
    $('#modal-producto').modal();
}

function VistaMenu(){
    $(".user-items").empty()
    $(".menuDia").empty()
    // para ya no escuchar las consultas de menu en tiempo real y no
    //consumir tanto ancho de banda
    consulta_menu()
    const dia_actual=VerificarDia()
    const dias_semana = ["Lunes", "Martes", "Miercoles","Jueves","Viernes","Sábado","Domingo"];
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
                
                    <h1 id="tituloMenuDia" class="col-12"style=" color: white;" >Menú del día ${dia_actual} </h1>
                      
                    <h2 id="tituloAlmuerzos" class="col-12 text-center" style=" color: #fef88f">ALMUERZOS</h2>

            
                `
                )
                
            querySnapshot.forEach(function(doc){
                const categoria=doc.data().categoria
                const nombre=doc.data().nombre
                const descripcion=doc.data().descripcion
                const dias= doc.data().dia
                const estado= doc.data().estado
               
                var categoriaFix = categoria.replace(/\s/g, '');

                if(dias[dia_actual]===true && estado==='activo'){  
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
    // Carta del restaurante 
    
    var vista_carta=db.collection('carta').where("uid_restaurante","==",user.uid)
    vista_carta.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            console.log("No hay productos de carta ")
        }
        else{
            $(".user-items").append(`<h2 id="tituloAlmuerzos" class="col-12 text-center mt-5" style=" color: #fef88f">CARTA</h2>`)
             
            querySnapshot.forEach(function(doc){
                const categoria=doc.data().categoria
                const nombre=doc.data().nombre
                const descripcion=doc.data().descripcion
                const precio= doc.data().precio
                const estado= doc.data().estado
                console.log(doc.data())
                var categoriaFix = categoria.replace(/\s/g, '');

                if(estado==='activo'){  
                    if($(`#${categoriaFix}Carta`).length == 0) {
                        //si no existe esa categoria debe crearse
                    
                        $(".user-items").append(`
                        <div class="col-12 col-md-6" id="${categoriaFix}Carta">
                                <h5 id="titulocategoria" class="col-12 text-center" style="color: #fef88f">${categoria}</h5>
                                <h5 id="platoMenu" class="col-12 text-center" style=" color: white">${nombre}<br> <small class="text-muted">${descripcion}</small> <small class="text-muted">${precio}</small></h5>
                        </div>`
                        )
                    }

                    else{
                        $(`#${categoriaFix}Carta`).append(`<h5 id="platoMenu" class="col-12 text-center" style=" color: white">${nombre}<br> <small class="text-muted">${descripcion}</small> <small class="text-muted">${precio}</small></h5>`)
                    }
                }
            })

        }
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
          
          }).then(()=>{
            $("#modal-modificar-producto").modal('toggle');
            console.log("cerrar modal")
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
    <div class="col-12 col-md-6">

        <div class="card mb-3 mt-3 ">
            <img class="card-img-top" src="./assets/img/portada.jpg" alt="Card image cap">
            <div class="card-body">
                <div class="row d-flex align-items-center">
                <i class="material-icons icon-store col-3 col-md-2" >storefront</i>
                <h5 class="card-title col-9 ml-md-3 " >${userData.name}</h5>
                <p class="card-text col-10" ><small class="text-muted small-link">https://diegoavellanedat17.github.io/delifast/menu/menu.html?restaurante=${nombreRestaurante}</small></p>
                
                <i class="material-icons icon justify-content-end col-1 mr-1" style="font-size:18px">content_copy</i>
                
                </div>
                
            </div>

        </div>

    </div>

`
)


PlaceLogo()
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
          
          }).then(function(){
            $('#modal-modificar-producto').modal("toggle");
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
    entra_consulta=1;
    var user = firebase.auth().currentUser;
     consulta_menu=db.collection('menu').where("uid_restaurante","==",user.uid).orderBy("categoria")
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
            <td class="${categoria}TablaMenu">${categoria}</td>
            <td>${nombrePlato}</td>
            <td>${descripcion}</td>
            <td>${dias_array}</td>
            <td>${estado}</td>
        
        </tr>
        
        `)

        // para la tabla de filtrado
            
        $(document).ready(function(){
            $("#FitrarMenu").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".menu-item-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                });
            }); 
        
        });
    });

    
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

function ClickPedido(ref_id){
    $('.id-pedido').empty()
    $('.id-pedido').append(ref_id)
    $(".infoPedido").empty()
    console.log(ref_id)
    var consulta_pedido=db.collection('pedidos').doc(ref_id)
    consulta_pedido.get()
    .then(function(doc){

        const tel= doc.data().tel
        const dir= doc.data().dir
        const estado= doc.data().estado
        console.log(tel)
        $(".infoPedido").append(`                                 
        <div>
        <h5>Contacto del pedido</h5>
        <p>Telefono : <small>${tel}</small></p>
        <p>Dirección: <small>${dir}</small></p>
        </div>`)
        $(`#pedido-ordenado`).prop('checked', false);  
        $(`#pedido-recibido`).prop('checked', false);  
        $(`#pedido-entregado`).prop('checked', false);  
        if(estado=== 'ordenado'){
            $(`#pedido-ordenado`).prop('checked', true);  
        }
        else if(estado==='recibido'){
            $(`#pedido-recibido`).prop('checked', true);  
        }
        else{
            $(`#pedido-entregado`).prop('checked', true);  
        }
    })
    
    $("#modal-pedido").modal()
}

function EstadoPedido(){
    var ref_id = $(".id-pedido").text(); //preferred
    var Ordenado = document.forms["PedidoForm"]["ordenado"].checked;
    var Recibido = document.forms["PedidoForm"]["recibido"].checked;
    var Entregado= document.forms["PedidoForm"]["entregado"].checked;
    if(Ordenado!=true && Recibido!=true && Entregado!= true){
        console.log("selecciona alguna")
    }

    else{
        var estado=''
        if(Ordenado===true){
            estado='ordenado'
        }
        else if (Recibido===true){
            estado='recibido'
        }
        else{
            estado='entregado'
        }
        var actualizar_estado_pedido=db.collection('pedidos').doc(ref_id)
        return actualizar_estado_pedido.update({
            estado: estado
        })
        .then(function() {
            swal({
                title:"Estado del Pedido",
                  text:"Modificado ",
                  icon:"success"
              
              }).then(()=>{
                $("#modal-pedido").modal('toggle');
                console.log("cerrar modal")
              })
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        
        
    }

}

// Módulo de Carta 

function MostrarCartaActual(){
    entra_carta=1;
    var user = firebase.auth().currentUser;
     consulta_carta=db.collection('carta').where("uid_restaurante","==",user.uid).orderBy("categoria")
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
                                    <th scope="col">Precio</th>
                                    <th scope="col">Estado</th>
                                
                                </tr>
                                </thead>
                                <tbody class="carta-item-body">
                                </tbody>
                </table>
                
        </div>`)

        querySnapshot.forEach(function(doc) {
        const nombrePlato=doc.data().nombre
        const categoria=doc.data().categoria
        const descripcion=doc.data().descripcion
        const precio=doc.data().precio
        const estado=doc.data().estado
       
        $(".carta-item-body").append(`
        <tr id="${doc.id}" onClick="Click_modificarCarta(this.id)" class="item_product"> 
            <td class="${categoria}TablaMenu">${categoria}</td>
            <td>${nombrePlato}</td>
            <td>${descripcion}</td>
            <td>$${precio}</td>
            <td>${estado}</td>
        
        </tr>
        
        `)

        $(document).ready(function(){
            $("#FitrarCarta").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".carta-item-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                });
            });
        
        });
    });

    
}

function AdicionarProductoCarta(){
    $('#modal-producto-carta').modal();
}

function GuardarPlatoCarta(){
    ValidarFormularioProductoCarta()
}

function ValidarFormularioProductoCarta(){

    var NombrePlato = document.forms["crearProductoCartaForm"]["NombrePlato"].value;
    var categoria = document.forms["crearProductoCartaForm"]["categoria"].value;
    var Descripcion = document.forms["crearProductoCartaForm"]["descripcion"].value;
    var Precio =document.forms["crearProductoCartaForm"]["precio"].value;


    if(NombrePlato==="" || Precio ===""){
        alert("Debes agregar el nombre de algún plato")
    }

    else{

        var user = firebase.auth().currentUser;
  
        CrearNuevoPlatoCarta(categoria,Precio,NombrePlato,user.uid,Descripcion)
    }


}

function CrearNuevoPlatoCarta(categoria,Precio,nombre,uid,descripcion){

   
   
    db.collection("carta").doc().set({
        categoria:categoria,
        nombre:nombre,
        estado:"activo",
        uid_restaurante:uid,
        descripcion:descripcion,
        precio: Precio,
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Adicionado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-producto-carta').modal("toggle");
          })
    })
    .catch(function(error) {
    console.error("Error writing document: ", error);
    });





}

function Click_modificarCarta(ref_id){
    console.log(ref_id)
    var consulta_producto=db.collection('carta').doc(ref_id)
    consulta_producto.get()
    .then(function(doc){
            
                const nombrePlato=doc.data().nombre
                const categoria=doc.data().categoria
                const descripcion=doc.data().descripcion
                const precio=doc.data().precio
                const estado=doc.data().estado
                

                $('.id-modificarCarta').empty()
                $('.id-modificarCarta').append(ref_id)
                $('#modificarCarta-nombrePlato').val(nombrePlato)
                $('#modificarCarta-categoria').val(categoria)
                $('#modificarCarta-descripcion').val(descripcion)
                $('#modificarCarta-precio').val(precio)
                $('#modificarCarta-estado').val(estado)
                // Checks the box
                $('#modal-modificarCarta-producto').modal();

            });
      
}

function UpdatePlatoCarta(){
    console.log("Actualizar el plato")
    ValidarFormularioModificarProductoCarta()
}


function ValidarFormularioModificarProductoCarta(){

    var NombrePlato = document.forms["modificarCartaProductoForm"]["modificarCarta-nombrePlato"].value;
    var categoria = document.forms["modificarCartaProductoForm"]["modificarCarta-categoria"].value;
    
    var Descripcion = document.forms["modificarCartaProductoForm"]["modificarCarta-descripcion"].value;
    var Precio = document.forms["modificarCartaProductoForm"]["modificarCarta-precio"].value;
    var estado=document.forms["modificarCartaProductoForm"]["modificarCarta-estado"].value;
    var ref_id = $(".id-modificarCarta").text(); //preferred

    if(NombrePlato==="" || Precio ===""){
        alert("Debes agregar el nombre de algún plato o el precio")
    }

    var user = firebase.auth().currentUser;
    console.log("documento a modificar")
    console.log(ref_id);
 

    ModificarPlatoCarta(categoria,Precio,NombrePlato,ref_id,estado,Descripcion)

}

function ModificarPlatoCarta(categoria,Precio,nombre,ref_id,estado,descripcion){

    var actualizacion_producto=db.collection('carta').doc(ref_id)
    return actualizacion_producto.update({
        categoria:categoria,
        precio:Precio,
        nombre:nombre,
        estado:estado,
        descripcion:descripcion
    })
    .then(function() {
        swal({
            title:"Listo",
              text:"Producto Actualizado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-modificarCarta-producto').modal("toggle");
          })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}

function EliminarPlatoCarta(){
    var ref_id = $(".id-modificarCarta").text(); // tomo el ID del Documento 
    db.collection('carta').doc(ref_id).delete().then(function(){
        swal({
            title:"Listo",
              text:"Producto Eliminado ",
              icon:"success"
          
          }).then(function(){
            $('#modal-modificarCarta-producto').modal("toggle");
          })

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


}

function subirLogo(){
    var user = firebase.auth().currentUser;
    var nombreRestaurante=user.displayName
    // obtener la imagen 
    var image= document.getElementById("logo").files[0]

    // verificar el tipo de archivo 
    if(image.type=="image/png" || image.type=="image/jpg" || image.type=="image/jpeg"){

        // obtener nombre de la imagen 
        var ImageName= image.name;
        // dodne se va guardar en firebase 
        var storageRef=firebase.storage().ref(`${nombreRestaurante}/logo.png`)
        // subir la imagen al path seleccionado del storage

        var uploadTask= storageRef.put(image);

        uploadTask.on('state_changed',function(snapshot){
            // Un observador del cambio de estado como el progereso, pausa y resume
            // mirar el progreso de la tarea incluyendo el porcentaje de bits subido 
            var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log(`La subida esta en ${progress}%`)

        },function(error){
            console.log(error)
        },function(){
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                console.log(downloadURL)
            })
        })
    }
    else{
        alert("Ingresa un formato válido para la imagen ")
    }
}