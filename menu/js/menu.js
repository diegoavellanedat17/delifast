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

function VerificarExistenciarestaurante(){
    const urlParams = new URLSearchParams(window.location.search);
    const QueryRestaurante = urlParams.get('restaurante');

    var consulta_restaurantes=db.collection('restaurantes').where("nombreRestaurante","==",QueryRestaurante)
    consulta_restaurantes.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            console.log("No existe restaurante")
            $("#nombre").empty()
            $("#nombre").append(" No tenemos este restaurante lo sentimos")

        }
        else{
            $(".user-items").css("background-color","#333333")
            
            $(".user-items").append(
                `
                
                    <h1 id="tituloMenuDia" class="col-12 mt-3"style=" color: white;" >Menú del día </h1>
                      
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
}