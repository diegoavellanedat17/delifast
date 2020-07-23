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
        
        consulta_pedidos=db.collection('pedidos').where("uid_cliente","==",user.uid).orderBy("hora_pedido", "desc")
        .onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc){
                var fecha = new Date(doc.data().hora_pedido).toLocaleString("es-CO")
                var entrada = doc.data().Entradas
                var principio = doc.data().Principio
                var platofuerte = doc.data().PlatoFuerte
                var bebida = doc.data().Bebidas
                var carta=doc.data().carta
                var notas = doc.data().notas
                var estado = doc.data().estado
                var menu = [entrada, principio, platofuerte, bebida]
                var len

                if (platofuerte != undefined){
                    len = platofuerte.length
                } else if (entrada != undefined){
                    len = entrada.length
                } else if (principio != undefined){
                    len = principio.length
                } else {
                    len = bebida.length
                }
                            
                
                function TableDisplay(i, len){
                    var pedido ={};
                    var menuaux = [];

                    pedido['rs1'] = `
                        <tr>
                        <th rowspan="${len}" scope="rowgroup">${fecha}</th>`;
                    pedido['cartatext'] =`
                        <td>Plato a la carta: ${carta}</td>`; 
                    pedido['rs2'] = `
                        <th rowspan="${len}" scope="rowgroup">${notas}</th>
                        <th rowspan="${len}" scope="rowgroup">${estado}</th>`;
                    pedido['tr1'] = `
                        <tr>`; 
                    pedido['tr2'] =`
                        </tr>`;
                    
                    for (j =0 ; j < menu.length; j++){
                        if (menu[j] != undefined && menu[j].length != 0){
                        
                        menuaux.push(menu[j][i])
                        
                        pedido['menutext'] = `
                            <td>Menu ${[i+1]}: ${menuaux}</td>`;
                        
                        
                        console.log(menuaux)
                        }
                    }
                    return pedido
                }

                if (carta == "" || carta == undefined) {
                    for(i = 0 ; i < len; i++){ 
                        pedido = TableDisplay(i, len);
                        if (i==0) {
                            $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2']))
                        } else {   
                            $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2']))
                        }
                    }  
                } else if (platofuerte == ""){
                    pedido = TableDisplay(0, 1);
                    $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['cartatext'], pedido['rs2'], pedido['tr2']))
                } else if (len == 1 && carta != "") {
                    pedido = TableDisplay(0, 2);
                    $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2'], pedido['tr1'], pedido['cartatext'], pedido['tr2']))    
                } else {
                    for(i = 0 ; i < len; i++){ 
                        pedido = TableDisplay(i, len+1);
                        if (i==0) {
                            $(".TablaPedidosBody").append(pedido['rs1'].concat(pedido['menutext'], pedido['rs2'], pedido['tr2']))
                        } else if (i==len-1) {
                            $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2'], pedido['tr1'], pedido['cartatext'], pedido['tr2']))
                        } else {   
                            $(".TablaPedidosBody").append(pedido['tr1'].concat(pedido['menutext'], pedido['tr2']))
                        }
                    }
                }                               
            })
        })
    $(".icon").css("color","white")
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

