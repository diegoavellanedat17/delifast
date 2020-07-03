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
            querySnapshot.forEach(function(doc){
                const nombre=doc.data().nombre
                console.log(nombre)
                $("#nombre").append(nombre)
  
            })
        }
        
    })
}