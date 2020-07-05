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
