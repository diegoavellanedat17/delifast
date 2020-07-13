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

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        var user = firebase.auth().currentUser;
        consulta_pedidos=db.collection('pedidos').where("uid_cliente","==",user.uid)
        consulta_pedidos.orderBy("hora_pedido", "desc").get() // fue necesario habilitar un índice compuesto en firebase para que este query funcione
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc){
                var fecha = new Date(doc.data().hora_pedido).toLocaleString("en-US")
                var entrada = doc.data().Entradas
                var principio = doc.data().Principio
                var platofuerte = doc.data().PlatoFuerte
                var bebida = doc.data().Bebidas
                var notas = doc.data().notas
                var estado = doc.data().estado
                const len = platofuerte.length
                console.log(len)

                for(i=0; i < len; i++){ 
                    $(".TablaPedidosBody").append(`
                    <tr>
                    <th scope="row"><small>${fecha}</small></th>
                    <td>${entrada[i]}</td>
                    <td>${principio[i]}</td>
                    <td>${platofuerte[i]}</td>
                    <td>${bebida[i]}</td>
                    <td>${notas}</td>
                    <td>${estado}</td>
                    </tr>
                    `);
                }
                
                // $(".TablaPedidosBody").append(`
                // <tr>
                // <th rowspan="${len}" scope="rowgroup"><small>${fecha}</small></th>`)

                // var i = 0;
                // const tr = `<tr>`;
                // const rowtext = `
                // <td>${entrada[i]}</td>
                // <td>${principio[i]}</td>
                // <td>${platofuerte[i]}</td>
                // <td>${bebida[i]}</td>
                // <td>${notas}</td>
                // <td>${estado}</td>
                // </tr>
                // `;
                // console.log(tr.concat(rowtext))
                // for(; i < len; i++){ 
                //     if (i=0) {
                //         $(".TablaPedidosBody").append(rowtext)
                //     } else {
                //         $(".TablaPedidosBody").append(tr.concat(rowtext))
                //     }
                // }                               
            })
        })
    $(".icon").css("color","green")
    $(".user-name").append(user.displayName)
  
    }
    else{
      console.log("Is the first time dont redirect or Logout")
      $(".icon").css("color","white")
      $(".user-name").empty()
    }
});

$(".logout").click(function(){
    firebase.auth().signOut()
     window.location = '../login.html'; 
});

