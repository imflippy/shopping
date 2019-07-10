$(document).ready(function(){
    //navigacija burger logika
    $('.navbar-toggle ul ').hide();
    $('.navbar-toggle').click(function(){
        $(this).find('ul').slideToggle(2000);
    });
    navi();
    ////////////////////////////////////////////////////////
    //slajder sa index.html
    if(url.indexOf("index.html") != -1){
    ucitajSlajder();
    setInterval(function() {
        moveRight();
        }, 3000);
    }
    ////////////////////////////////////////////////////////
     //sa stranice cart.js
    if(url.indexOf("cart.html") != -1){
        let products = kopackeUkorpi();
        if(!products.length){
            pokaziPraznuKorpu();}
        else{
            prikaziKorpu();}
    
        document.getElementById("btnPoruka").addEventListener("click", provera);
        
        // bonus forma za kupovinu
        $('#bonus').hide();
    
        $('#more').click(function (e) {
            e.preventDefault();

            if ($('#bonus').is(':visible')) {
                $('#bonus').slideUp();
            } else {
                $('#bonus').slideDown();
            }
        });
    }

////////////////////////////////////////////////////
    if(url.indexOf("category.html") != -1){
        dohvatiProizvode();
        ispisddlCategory();
        
        document.getElementById("sortAsc").addEventListener("click", categorySortAsc);
        document.getElementById("sortDesc").addEventListener("click", categorySortDesc);
        document.getElementById("sortAZ").addEventListener("click", categorySortAZ);
        document.getElementById("sortZA").addEventListener("click", categorySortZA);

        document.getElementById("search").addEventListener("keyup", function(){
            filterSearch(this.value);
        });

}

/////////////////////////////////////////////////////////////////
if(url.indexOf("contact.html") != -1){
    document.getElementById("tbname").focus();
    document.getElementById("btnPoruka").addEventListener("click", provera);
}
});

window.onscroll = function(){
    skrolovanje();
}
//dinamicki ispis navigacije, sve 3
function navi(){
    $.ajax({
        url: "data/nav.json",
        method: "GET",
        dataType: "json",
        success: function(data){
            navHeader(data);
            navFooter(data);
            navBurger(data);
        },
        error: function(xhr, status, error){
            alert(status);
        }
    });
}

function navBurger(data){
    let navi = "";
    for (let n of data){
        navi += `<li><a href="${n.link}">${n.naziv}</a></li>`;
    }
    document.getElementById("navBurger").innerHTML = navi;
   
}

function navHeader(data){
    let navi = "";
    for (let n of data){
        navi += `<li><a href="${n.link}">${n.naziv}</a></li>`;
    }
    document.getElementById("navHeader").innerHTML = navi;
}

function navFooter(data){
    let navi = "";
    for (let n of data){
        navi += `<li><a href="${n.link}">${n.naziv}</a></li>`;
    }
    document.getElementById("navFooter").innerHTML = navi;
   
}
//skrolovanje na klik
function skrolovanje() {
    if (document.documentElement.scrollTop < 17) {
        document.getElementById("scrollTop").style.display = "none";
    } else {
        document.getElementById("scrollTop").style.display = "block";
    }
}

$("#scrollTop").click(function(){
    document.documentElement.scrollTop = 0;
});
/////////////////////////////////////////////////////////////////////
var url = window.location.href;
///////////////////////////////////////////////////////////////////
//Sadrzaj za index.html
if(url.indexOf("index.html") != -1){
    var slideCount = $("#slider ul li").length;
    var slideWidth = $("#slider ul li").width();
    var slideHeight = $("#slider ul li").height();
    var sliderUlWidth = slideCount * slideWidth;
  
    $("#slider").css({ width: slideWidth, height: slideHeight });
    $("#slider ul").css({ width: sliderUlWidth, marginLeft: -slideWidth });
    $("#slider ul li:last-child").prependTo("#slider ul");
  
    function moveRight() {
      $("#slider ul").animate(
        {
          left: -slideWidth
        },
        200,
        function() {
          $("#slider ul li:first-child").appendTo("#slider ul");
          $("#slider ul").css("left", "");
        }
      );
    }

// Slajder, nastavak
function ucitajSlajder(){
  $.ajax({
      url : "data/slajder.json",
      method : "GET",
      dataType : "json",
      success : function(data){
          ispisSlajder(data);
      },
      error : function(xhr, error, status){
          alert (status);
      }
  });
}

function ispisSlajder(data){
  for(i = 0; i < data.length; i++){
      $("#images").append("<li><img class='slider_image' src="+data[i].src+" alt="+data[i].alt+" /></li>");

    }
}

}

////////////////////////////////////////////////////
if(url.indexOf("cart.html") != -1){
    function prikaziKorpu(){
        let products = kopackeUkorpi();
    
        $.ajax({
            url: "data/kopacke.json",
            method: "GET",
            dataType: "json",
            success: function(data){
                data = data.filter(p=>{
                    for (let prod of products){
                        if(p.id == prod.id){
                            p.quantity = prod.quantity;
                            return true;}
                    }
                    return false;
                });
                napraviTabelu(data);
            }
        });
    }
    
    function napraviTabelu(products){
        let html = `<table class="table table-bordered chart">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody>`;
        for(let p of products){
            html += napraviTr(p);
        }
        html +=     `</tbody>
                </table>`;
        $("#content").html(html);
    
        function napraviTr(p){
            return `<tr>
            <td><img src="${p.slika}" width="100" alt="${p.naziv}" /></td>
            <td>${p.naziv}</td>
            <td>${p.quantity}</td>
            <td>${p.cena.cenaNova}</td>
            <td>${p.cena.cenaNova * p.quantity}</td>
            <td><button onclick='obrisiKorpu(${p.id})'>Remove</button></td>
        </tr>`
        }
    
    }
    function pokaziPraznuKorpu(){
        $("#content").html ("<h1>Your cart is empty!</h1>");
    }
    
    function kopackeUkorpi(){
        return JSON.parse(localStorage.getItem("products"));
    }
    
    function obrisiKorpu(id){
        let products = kopackeUkorpi();
        let filtered = products.filter(p => p.id != id);
    
        localStorage.setItem("products", JSON.stringify(filtered));
    
        prikaziKorpu();
    }
    // Dodatna forma za isporuku
    
    function provera(){
        var podaci = [];
        var nameFL = document.getElementById("tbnameFL").value.trim();
        var email = document.getElementById("tbemail").value.trim();
        var card = document.getElementById("tbcard").value.trim();
    
        var errorNameFL = document.getElementById("errorFL");
        var errorEmail = document.getElementById("errorEmail");
        var errorCard = document.getElementById("errorCard");
    
        var reNameFL = /^([A-Z][a-z]+\s)+[A-Z][a-z]+$/;
        var reEmail = /^[A-z]+\d*\@(gmail|hotmail|yahoo|(ict.edu))\.(com)$/;
        var reCard = /^\d{4}\-\d{4}\-\d{4}\-\d{4}$/;
    
        if(nameFL == ""){
            errorNameFL.innerHTML = "-You must fill this textbox!";
        }else if(!reNameFL.test(nameFL)){
            errorNameFL.innerHTML = "-Your must enter First and Last name!";
        }else{
            podaci.push(nameFL);
            errorNameFL.innerHTML = "";
        }
       
        if(email == ""){
            errorEmail.innerHTML = "-You must fill with your email adress!";
        }else if(!reEmail.test(email)){
            errorEmail.innerHTML = "-Your email must be in valid format!";
        }else{
            podaci.push(email);
            errorEmail.innerHTML = "";
        }
    
        if(card == ""){
            errorCard.innerHTML = "-You must fill this textbox!";
        }else if(!reCard.test(card)){
            errorCard.innerHTML = "-Enter valid card number!";
        }else{
            podaci.push(card);
            errorCard.innerHTML = "";
        }
    
        if(podaci[2]) {
            var ispis = "<p>Your purchase has been completed <3 </p>";
            localStorage.removeItem("products");
            $("#content").html ("<h1>Your cart is empty!</h1>");
            document.querySelector("#uspeh").innerHTML = ispis;
        } else {
            document.querySelector("#uspeh").innerHTML = "-You must fill required slots!";
        }
        
    
    }
    
}

////////////////////////////////////////////////////
if(url.indexOf("category.html") != -1){

    function ajaxKopacke(callSuccess){
        $.ajax({
            url : "data/kopacke.json",
            method : "GET",
            dataType : "json",
            success : callSuccess,
            error : function(xhr, error, status){
                alert (status);
            }
        });
    }    
    function dohvatiProizvode(){
        ajaxKopacke(function (data){
            ispisCategory(data);
        });
    }
    
    function ispisCategory(data){
    
        document.getElementById("ispisProizvoda").innerHTML = pripremaCategory();
    
    
    function pripremaCategory(){
        let html = "";
        for (let c of data){
            html +=`
            <li class="gridlist-inner">
                <div class="white">
                <div class="row clearfix">
                    <div class="col-md-4">
                        <div class="pr-img">
                            <a href="#"><img src="${c.slika}" alt="${c.naziv}" class="img-responsive animacija"/></a>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="gridlisttitle">${c.naziv} <span></span></div>
                        <p class="gridlist-desc">
                            ${c.opis}
                        </p><br>
                        ${dostava(c.dostava)}
                    </div>
    
                    <div class="col-md-2">
                        <div class="gridlist-pricetag blue ${c.cena.sale}"><div class="inner"><span ><span class="oldprice">${c.cena.cenaStara}</span>$${c.cena.cenaNova}</span></div></div>
                    </div>
                </div>
                </div>
                <div class="gridlist-act">
                    <input type="button" data-id=${c.id} value="Add to cart" class="button btn add-to-cart btn-red dodajUkorpu" />
                    <div class="clearfix"></div>
                </div>
            </li>`;
        }
        return html;
        }
        $(".pr-img a img").hover(function(){
            $(this).animate({width: '-=15px'}, 1000);
        }, function (){
            $(this).animate({width: '+=15px'}, 1000);
        });
        bindCartEvents();
    }
    function dostava(data){
        if(data){
            return "Delivery is possible!";
        }else{
            return "<del>Delivery</del> is not possible!";
        }
    }
    //Ispis option tagova za kategorije
    function ispisddlCategory(){
        $.ajax({
            url : "data/vrstaKop.json",
            method : "GET",
            dataType : "json",
            success : function(data){
                let ispis = `<select id='vrsta'><option value='0'>Choose...</option>`;
    
                for(let i of data){
                    ispis += `<option value = "${i.id}">${i.naziv}</option> `;
                }
                ispis +=`</select>`;
                document.getElementById("catFilter").innerHTML = ispis;
    
                document.getElementById("vrsta").addEventListener("change", function(){
                    Number(this.value) ? categoryFilter(this.value) : dohvatiProizvode();
                });
            
            },
            error : function(xhr, error, status){
                alert (status);
            }
        });
    }
    
    // Filter po kategorijama
    function categoryFilter(vrstaId){
        ajaxKopacke(function(data){
                data = data.filter(d=> d.markaKop.id == vrstaId);
                ispisCategory(data);
        });
    }
    
    //Sortiranje po ceni 
    function categorySortAsc(){
        ajaxKopacke(function(data){
                data.sort(function(a,b){
                    if(a.cena.cenaNova == b.cena.cenaNova)
                        return 0;
                    if(a.cena.cenaNova > b.cena.cenaNova)
                        return 1;
                    if(a.cena.cenaNova < b.cena.cenaNova)
                        return -1;
    
                });
                ispisCategory(data)
        });
    }
    
    //Sortiranje po ceni 
    function categorySortDesc(){
       ajaxKopacke(function(data){
                data.sort(function(a,b){
                    if(a.cena.cenaNova == b.cena.cenaNova)
                        return 0;
                    if(a.cena.cenaNova > b.cena.cenaNova)
                        return -1;
                    if(a.cena.cenaNova < b.cena.cenaNova)
                        return 1;
    
                });
                ispisCategory(data)
        });
    }
    
    //filter po imenu
    function categorySortAZ(){
        ajaxKopacke(function(data){
                data.sort(function(a,b){
                    if(a.naziv == b.naziv)
                        return 0;
                    if(a.naziv > b.naziv)
                        return -1;
                    if(a.naziv < b.naziv)
                        return 1;
                });
                ispisCategory(data)
        });
    }
    
    //filter po imenu
    function categorySortZA(){
        ajaxKopacke(function(data){
                data.sort(function(a,b){
                    if(a.naziv == b.naziv)
                        return 0;
                    if(a.naziv > b.naziv)
                        return 1;
                    if(a.naziv < b.naziv)
                        return -1;
    
                });
                ispisCategory(data)
        });
    }
    
    // Filter na osnovu search
    function filterSearch(data){
        ajaxKopacke(function (kopacke){
                kopacke = kopacke.filter(k=>{
                    if(k.naziv.toLowerCase().indexOf(data.toLowerCase()) !== -1){
                        return true;
                    }
                    if(k.markaKop.naziv.toLowerCase().indexOf(data.toLowerCase()) !== -1){
                        return true;
                    }
                    if(k.opis.toLowerCase().indexOf(data.toLowerCase()) !== -1){
                        return true;
                    }
                });
                ispisCategory(kopacke);
        });
    }
    
    function bindCartEvents(){
        $(".dodajUkorpu").click(dodajUkorpu);
    }
    
    function kopackeUkorpi(){
        return JSON.parse(localStorage.getItem("products"));
    }
    
    
    function dodajUkorpu(){
        let id = $(this).data("id");
    
         var products = kopackeUkorpi();
    
        if(products) {
            if(kopackeVecUKorpi()) {
                dodajKopacke();
            } else {
                dodajUlocalStorage()
            }
        } else {
            dodajPrvuKopacku();
        }
    alert ("Cart successfully updated!");
    
    function kopackeVecUKorpi() {
        return products.filter(p => p.id == id).length;
    }
    
    function dodajUlocalStorage() {
        let products = kopackeUkorpi();
        products.push({
            id : id,
            quantity : 1
        });
        localStorage.setItem("products", JSON.stringify(products));
    }
    
    function dodajKopacke() {
        let products = kopackeUkorpi();
        for(let i in products)
        {
            if(products[i].id == id) {
                products[i].quantity++;
                break;
            }      
        }
    
        localStorage.setItem("products", JSON.stringify(products));
    }
    
    
    function dodajPrvuKopacku() {
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        localStorage.setItem("products", JSON.stringify(products));
    }
    }
    
    function obrisiKorpu() {
        localStorage.removeItem("products");
    }
    
    

}
///////////////////////////////////////////////////////////////////////////////
if(url.indexOf("contact.html") != -1){

    
function provera(){
    var podaci = [];
    var name = document.getElementById("tbname").value.trim();
    var email = document.getElementById("tbemail").value.trim();
    var text = document.getElementById("tbtext").value.trim();

    var errorName = document.getElementById("errorName");
    var errorEmail = document.getElementById("errorEmail");
    var errorText = document.getElementById("errorText");

    var reName = /^[A-Z][a-z]+$/;
    var reEmail = /^[A-z]+\d*\@(gmail|hotmail|yahoo|(ict.edu))\.(com)$/;
    var reText = /^([A-Z][a-z]+(\s?[a-z]+)*(\.|\!|\?)?\s?)+$/;

    if(name == ""){
        errorName.innerHTML = "-You must fill this textbox!";
    }else if(!reName.test(name)){
        errorName.innerHTML = "-Your name must begin with big first letter!";
    }else{
        podaci.push(name);
        errorName.innerHTML = "";
    }
   
    if(email == ""){
        errorEmail.innerHTML = "-You must fill with your email adress!";
    }else if(!reEmail.test(email)){
        errorEmail.innerHTML = "-Your email must be in valid format!";
    }else{
        podaci.push(email);
        errorEmail.innerHTML = "";
    }

    if(text == ""){
        errorText.innerHTML = "-You must fill this textbox!";
    }else if(!reText.test(text)){
        errorText.innerHTML = "-Your message must be in valid format!";
    }else{
        podaci.push(text);
        errorText.innerHTML = "";
    }

    if(podaci[2]) {
        var ispis = "<p>Your message has been sent <3 </p>";
        
        document.querySelector("#uspeh").innerHTML = ispis;
    } else {
        document.querySelector("#uspeh").innerHTML = "-You must fill required slots!";
    }
}


}