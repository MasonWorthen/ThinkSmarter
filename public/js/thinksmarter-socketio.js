
$(document).ready(function(){
    let headersLetters = ["a","b","c","d","e","f","g","h"];
    let headersNumber = ["8","7","6","5","4","3","2","1"];
    let chose = null; 
    let gameRequestCounter = 0;
    let userWins = 0;
    let userLoses = 0;
    let jQueryChose = null;
    let jQueryMove = null;
    let move = null;
    let possibleChose = null;
    let d = new Date();
 
    let piece = null;
    let color = null;
    let current = null;
    //let socket = io("thinksmarter.royalwebsters.com",{transports: ['websocket']});
    let socket = io();
    let challenger = null;
    let match  = null;  
    $('.search').hide();
    $(".canceled").hide();
    $(".canceledr").hide();

    $(".surrender").hide();
    $('.game').hide();

      $(".canceled").click(()=>{
        $(".canceled").hide();
        $("#request").show();
        $(".cpu").show();
        $(".match-parent").show()
        console.log("hit")

        $(".lobbybtn").show();
      socket.emit("cancel",match)
      $('.search').hide();
    });

    $(".canceledr").click(()=>{
        $(".canceledr").hide();
        $("#request").show();
        $(".cpu").show();
        $(".lobbybtn").show();
        $(".match-parent").show()
        console.log("cancelr")
        $(".lobbybtn").show();
      socket.emit("cancel",match,'request',$('#username').text().replace("username:",""),challenger)
      $('.search').hide();
    });

    
    
    
    socket.username = $('.identifier').text();
    $('.identifier').remove();

    socket.on('set',(matchid)=>{
        match = matchid
    });

    socket.on('cancelChallenger',(from)=>{
        $(`.${from}`).remove();
              gameRequestCounter -=1
              $(".gamerequestcount").text(gameRequestCounter);
    });

    $(document).keypress(
        function(event){
            if (event.which == '13') {
                if($('.messagebox').val() != ""){
                    socket.emit("message",$('.messagebox').val(),$('#username').text().replace("username:",""));
                    $('.messagebox').val('')
                    event.preventDefault();
                }
                else{
                    event.preventDefault();
                }
                
            }
        });

    

   
    try{
       socket.emit("user",socket.username,$('#username').text().replace("username:",""));
       $(".status").show();
       setTimeout(function(){
           $(".status").fadeOut();
       },3000)
    }
    catch(e){
       console.log("error occured");
    }
    

    socket.on("challenger",(matchid,username)=>{
        gameRequestCounter +=1;
        $(".gamerequestcount").text(gameRequestCounter);
        let connecteduser = document.createElement('li');
        let status = document.createElement('span');
        status.innerHTML =  "&#11044;";
        status.className = "text-success"
        let btnspan = document.createElement('span');
        btnspan.innerHTML = "&#10173;"+"  "
        btnspan.className ="text-warning"
        let btnrequest = document.createElement('button');
        btnrequest.value = matchid
        btnrequest.style ="background-color:transparent; border:none;";
        connecteduser.addEventListener('click',function(evt){
            $(".lobbybtn").hide();
            $(".match-parent").hide()
              socket.emit("join",matchid);
              $(`.${username}`).remove();
              gameRequestCounter -=1
              $(".gamerequestcount").text(gameRequestCounter);

        });
        connecteduser.className =`text-center  ${username}`
        btnrequest.append(btnspan)
        let line = document.createElement('hr');

        
        connecteduser.prepend(`  ${username}   `)
        //connecteduser.append(status);
        //connecteduser.append(btnrequest);
        connecteduser.append(line);
        document.getElementById("request").append(connecteduser)
    });


    socket.on("users",(users,usercount)=>{
      
        $(".usercount").text(usercount.toString());
        document.getElementById("active").innerHTML = "";
        for(let t=0;t<users.length;t++){
            let connecteduser = document.createElement('li');
            let status = document.createElement('span');
            status.innerHTML =  "&#11044;";
            status.className = "text-success"
            let btnspan = document.createElement('span');
            btnspan.innerHTML = "&#10173;"+"  "
            btnspan.className ="text-warning"
            let btnrequest = document.createElement('button');
            btnrequest.value = users[t];;
            btnrequest.style ="background-color:transparent; border:none;";
            btnrequest.addEventListener('click',function(evt){
                let confirmWindow = window.confirm(`Are you sure you want to send a request to ${users[t]}`);
                if(confirmWindow){
                   socket.emit("request",users[t],$('#username').text().replace("username:","")); 
                   $(".canceledr").show()
                   challenger = users[t];
                   $(".lobbybtn").hide();
                   $(".cpu").hide();
                   $("#request").hide();
                   $(".match-parent").hide();
                   $('.sent').show();
                   $('.search').show();
                   setTimeout(
                       function() 
                       {
                          $(".sent").fadeOut(3000)
                       }, 5000);
                }
                else{
                  
                    $('.cancel').show();
                    setTimeout(
                        function() 
                        {
                           $(".cancel").fadeOut(3000)
                        }, 5000);
                }
                  
            });
            btnrequest.append(btnspan)
            let line = document.createElement('hr');
            if (users[t] == $('#username').text().replace("username:","")){
                connecteduser.prepend("You ")
                connecteduser.append(status);
                connecteduser.append(line);
            }
            else{
            connecteduser.prepend(`  ${users[t]}   `)
            connecteduser.append(status);
            connecteduser.append(btnrequest);
            connecteduser.append(line);
            }
            document.getElementById("active").append(connecteduser)
        }
});

$(".lobbybtn").click(()=>{
    $(".cpu").hide();
    $(".lobbybtn").hide();
    $("#request").hide();
    socket.emit("create");
    $(".match-parent").hide()
    $('.search').show();
    $(".canceled").show();

});

socket.on("matches",(user,matchid,status)=>{
    let row = document.createElement("tr");
    let match =document.createElement('td')
    let statusdt =document.createElement('td')
    match.innerText  = matchid;
    let joindt = document.createElement('td');

   
    if(status == "ongoing"){
        statusdt.innerHTML = `<span class="text-success">  &#11044;</span>`;
        row.append(match);
        row.append(statusdt);
        row.append(joindt);
    }
    else{
        if($('#username').text().replace("username:","")!= user){
        
        let joinbtn = document.createElement('button');
        joinbtn.value = matchid;
        joinbtn.innerHTML = `<span class="text-warning">&#10173; </span>`;
        joinbtn.type = "button";
        joinbtn.style ="background:transparent; border:none;";
        joinbtn.addEventListener('click',function(evt){
            socket.emit('join',matchid);
        });
        statusdt.innerHTML = `<span class="text-danger">  &#11044;</span>`
        row.append(match);
        row.append(statusdt);
        joindt.append(joinbtn);
        row.append(joindt);
        }
    }
   
    document.querySelector(".matches").prepend(row);
});

socket.on("updtmatch",(matchids,status)=>{
    console.log(matchids);
    console.log(status);
    document.querySelector(".matches").innerHTML = ""
    
    for(let r=0; r<matchids.length;r++){

        let row = document.createElement("tr");
        let match =document.createElement('td')
        let statusdt =document.createElement('td')
        let joindt = document.createElement('td');
        match.innerText  = matchids[r];
     
        if(status[r] == "ongoing"){
            statusdt.innerHTML = `<span class="text-success">  &#11044;</span>`
            row.append(match);
            row.append(statusdt);
            row.append(joindt);
        }
        else{
            let joinbtn = document.createElement('button');
            joinbtn.value = matchids[r];
            joinbtn.style ="background:transparent; border:none;";
            joinbtn.innerHTML = `<span class="text-warning">&#10173; </span>`;
        
            joinbtn.addEventListener('click',function(evt){
                  socket.emit('join',matchids[r]);
            });
            statusdt.innerHTML = `<span class="text-danger">  &#11044;</span>`
            row.append(match);
            row.append(statusdt);
            joindt.append(joinbtn);
            row.append(joindt);
        }
    
        document.querySelector(".matches").prepend(row);
    }
   
});


   
    $(".surrender").click(function (){
        if(match != null){
            socket.emit("surrender",match,color);
        }  
    })


    $('td').click(function(){
        if(current == color){
            let $this = $(this);

            let location = headersLetters[$this.index()-1]+ headersNumber[$this.closest('tr').index()-1];

            if(chose == null){
                chose = location;
                jQueryChose = $this;
                socket.emit("possible",location,match);
                socket.emit("isFinished",match);
                $this.attr('style','background-color:red');
                piece = $this.text();
            }
            else if(chose != null && chose == location){
                chose = null;
                jQueryChose = null;
                $this.attr('style','');
                for(let r=0;r<possibleChose.length;r++){
                    $("."+possibleChose[r].toLowerCase()).attr('style','');
                }
            }
            else if(move == null){
                move = location;
                jQueryMove = $this;
                if((move).toUpperCase().indexOf("1") >=0  && color == "black") {

                    if (piece == "♟"){
                        $(".promotion").show();
                    }

                }
                else if((move).toUpperCase().indexOf("8") >=0 && color =="white"){
                    if (piece == "♙"){
                        $(".promotion").show();
                    }
                }
                else{
                    socket.emit("moves",{start:chose,last:move,piece:piece,condition:false},match);
                   
                    for(let r=0;r<possibleChose.length;r++){
                        $("."+possibleChose[r].toLowerCase()).attr('style','');
                    }

                    jQueryChose.attr('style','');

                    chose = null;
                    move = null;
                }
            }
        }
    });

    $('.send').click(function (){
        if($('.messagebox').val() != ""){
            socket.emit("message",$('.messagebox').val(),$('#username').text().replace("username:",""));
            $('.messagebox').val('')
        }
        
    })


    socket.on("lobby",(mid,player,turn)=>{
        $("#request").hide();
        $('.lobbybtn').hide();
        $(".surrender").show();
        $(".cpu").hide();
        match = mid
        $(".game").show();
        $(".match-parent").hide()
        $(".search").hide();
        color = player;

        

        current = turn
        $('.playerTurn').text("Color: "+color)

        if(current ==color){
            $('.playerOpp').text("Your turn")
        }
        else{
            $('.playerOpp').text("Waiting for opponent...")
        }
        
        console.log()
        console.log(current);
        console.log(color);

        if(color=="black"){
            $(".game-promotion").html(`<button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9818;</button><button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9821;</button>
        <button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9822;</button><button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9820;</button>`);
        }
        else{
            $(".game-promotion").html(`<button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9813;</button><button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9816;</button>
        <button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9815;</button><button type="button" class="btn btn-outline-danger promotion" style="width: 300px;">&#9814;</button>`);
        }

        $(".promotion").click(function (){
            const piece =$(this).html()
            console.log(piece);
            console.log("event emiited")
            socket.emit("moves",{start:chose,last:move,piece:piece,condition:true},match);
            $(".promotion").hide();
            for(let r=0;r<possibleChose.length;r++){
                $("."+possibleChose[r].toLowerCase()).attr('style','');
            }
    
            jQueryChose.attr('style','');
    
            chose = null;
            move = null;
        });

        $(".promotion").hide();

    });

    socket.on("switch",(turn)=>{
        current = turn;

        if(current == color){
            $('.playerOpp').text("Your turn")
        }
        else{
            $('.playerOpp').text("Waiting for opponent...")
        }
    });

 
    socket.on("end",(result,colo)=>{
        let win_color = null;
        if (colo != null){
            if(colo =="black"){
                win_color ="white";
                result["winner"] = win_color;
                result["loser"] = "black";
            }
            else{
                win_color ="black"
                result["winner"] = win_color;
                result["loser"] = "white";
            }
        }
        else{

            if(result.turn =="black"){
                win_color ="white";
                result["winner"] = win_color;
                result["loser"] = "black";
            }
            else{
                win_color ="black"
                result["winner"] = win_color;
                result["loser"] = "white";
            }
        }
    userWins = Number($('#userWins').text().replace("wins",""));
    userLoses = Number($('#userLoses').text().replace("loses",""));

   if(color === win_color){
    $('#userWins').text(`wins ${userWins+1}`)
       result["message"] = "You win but, that doesn't mean there isn't a challenge out there for you! ";
       result["header"] = "You have won!";
   }
   else{
    $('#userLoses').text(`loses ${userLoses+1}`)
       result["message"] = "You lose but, You're getting better everyday!"
       result["header"] = "You have lost!";
   }

   $('.userGameData').text(JSON.stringify(result))
   $('.userGameStatus').text(result["header"])
   $('.userGameMessage').text(result['message'])
   if(match != null){
    $(".match-parent").show()
    $('.lobbybtn').show();
$("#myModal").modal('show');
 headersLetters = ["a","b","c","d","e","f","g","h"];
 headersNumber = ["8","7","6","5","4","3","2","1"];
chose = null;
jQueryChose = null;
jQueryMove = null;
move = null;
possibleChose = null;
piece = null;
color = null;
current = null;
match  = null;  
challenger = null;
$(".canceled").hide();
$(".canceledr").hide();
$("#request").show();
$(".surrender").hide();
$(".cpu").show();
$('.game').hide();
$('.search').hide();

$(".chess-board").html(`<tbody>
<tr>
    <th></th>
    <th>a</th>
    <th>b</th>
    <th>c</th>
    <th>d</th>
    <th>e</th>
    <th>f</th>
    <th>g</th>
    <th>h</th>
</tr>
<tr>
    <th>8</th>
    <td class="light a8">&#9820;</td>
    <td class="dark b8">&#9822;</td>
    <td class="light c8">&#9821;</td>
    <td class="dark d8">&#9819;</td>
    <td class="light e8">&#9818;</td>
    <td class="dark f8">&#9821;</td>
    <td class="light g8">&#9822;</td>
    <td class="dark h8">&#9820;</td>
</tr>
<tr>
    <th>7</th>
    <td class="dark a7">&#9823;</td>
    <td class="light b7">&#9823;</td>
    <td class="dark c7">&#9823;</td>
    <td class="light d7">&#9823;</td>
    <td class="dark e7">&#9823;</td>
    <td class="light f7">&#9823;</td>
    <td class="dark g7">&#9823;</td>
    <td class="light h7">&#9823;</td>
</tr>
<tr>
    <th>6</th>
    <td class="light a6"></td>
    <td class="dark b6"></td>
    <td class="light c6"></td>
    <td class="dark d6"></td>
    <td class="light e6"></td>
    <td class="dark f6"></td>
    <td class="light g6"></td>
    <td class="dark h6"></td>
</tr>
<tr>
    <th>5</th>
    <td class="dark a5"></td>
    <td class="light b5"></td>
    <td class="dark c5"></td>
    <td class="light d5"></td>
    <td class="dark e5"></td>
    <td class="light f5"></td>
    <td class="dark g5"></td>
    <td class="light h5"></td>
</tr>
<tr>
    <th>4</th>
    <td class="light a4"></td>
    <td class="dark b4"></td>
    <td class="light c4"></td>
    <td class="dark d4"></td>
    <td class="light e4"></td>
    <td class="dark f4"></td>
    <td class="light g4"></td>
    <td class="dark h4"></td>
</tr>
<tr>
    <th>3</th>
    <td class="dark a3"></td>
    <td class="light b3"></td>
    <td class="dark c3"></td>
    <td class="light d3"></td>
    <td class="dark e3"></td>
    <td class="light f3"></td>
    <td class="dark g3"></td>
    <td class="light h3"></td>
</tr>
<tr>
    <th>2</th>
    <td class="light a2">&#9817;</td>
    <td class="dark b2">&#9817;</td>
    <td class="light c2">&#9817;</td>
    <td class="dark d2">&#9817;</td>
    <td class="light e2">&#9817;</td>
    <td class="dark f2">&#9817;</td>
    <td class="light g2">&#9817;</td>
    <td class="dark h2">&#9817;</td>
</tr>
<tr>
    <th>1</th>
    <td class="dark a1">&#9814;</td>
    <td class="light b1">&#9816;</td>
    <td class="dark c1">&#9815;</td>
    <td class="light d1">&#9813;</td>
    <td class="dark e1">&#9812;</td>
    <td class="light f1">&#9815;</td>
    <td class="dark g1">&#9816;</td>
    <td class="light h1">&#9814;</td>
</tr>
</tbody>`);

$(".moves").html('');
}  
$('td').click(function(){
    if(current == color){
        let $this = $(this);

        let location = headersLetters[$this.index()-1]+ headersNumber[$this.closest('tr').index()-1];

        if(chose == null){
            chose = location;
            jQueryChose = $this;
            socket.emit("possible",location,match);
            socket.emit("isFinished",match);
            $this.attr('style','background-color:red');
            piece = $this.text();
        }
        else if(chose != null && chose == location){
            chose = null;
            jQueryChose = null;
            $this.attr('style','');
            for(let r=0;r<possibleChose.length;r++){
                $("."+possibleChose[r].toLowerCase()).attr('style','');
            }
        }
        else if(move == null){
            move = location;
            jQueryMove = $this;
            if((move).toUpperCase().indexOf("1") >=0  && color == "black") {

                if (piece == "♟"){
                    $(".promotion").show();
                }

            }
            else if((move).toUpperCase().indexOf("8") >=0 && color =="white"){
                if (piece == "♙"){
                    $(".promotion").show();
                }
            }
            else{
                socket.emit("moves",{start:chose,last:move,piece:piece,condition:false},match);
               
                for(let r=0;r<possibleChose.length;r++){
                    $("."+possibleChose[r].toLowerCase()).attr('style','');
                }

                jQueryChose.attr('style','');

                chose = null;
                move = null;
            }
        }
    }
});

    });

    socket.on("default",(result)=>{
   
     
    userWins = Number($('#userWins').text().replace("wins",""));

 
    $('#userWins').text(`wins ${userWins+1}`)
       result["message"] = "You win!! your opponent disconnected";
       result["header"] = "You have won!";

   $('.userGameData').text(result["header"])
   $('.userGameStatus').text("You win!! Your opponenet disconnected unexpectedly.")
   $('.userGameMessage').text(result['message'])
   if(match != null){
    $(".match-parent").show()
    $('.lobbybtn').show();
$("#myModal").modal('show'); 
headersLetters = ["a","b","c","d","e","f","g","h"];
headersNumber = ["8","7","6","5","4","3","2","1"];
chose = null;
jQueryChose = null;
jQueryMove = null;
move = null;
possibleChose = null;
piece = null;
color = null;
current = null;
match  = null;  
challenger = null;
$(".canceled").hide();
$(".canceledr").hide();
$("#request").show();
$(".surrender").hide();
$(".cpu").show();
$('.game').hide();
$('.search').hide();
$('.search').hide();
$('.game').hide();

$(".chess-board").html(`<tbody>
<tr>
    <th></th>
    <th>a</th>
    <th>b</th>
    <th>c</th>
    <th>d</th>
    <th>e</th>
    <th>f</th>
    <th>g</th>
    <th>h</th>
</tr>
<tr>
    <th>8</th>
    <td class="light a8">&#9820;</td>
    <td class="dark b8">&#9822;</td>
    <td class="light c8">&#9821;</td>
    <td class="dark d8">&#9819;</td>
    <td class="light e8">&#9818;</td>
    <td class="dark f8">&#9821;</td>
    <td class="light g8">&#9822;</td>
    <td class="dark h8">&#9820;</td>
</tr>
<tr>
    <th>7</th>
    <td class="dark a7">&#9823;</td>
    <td class="light b7">&#9823;</td>
    <td class="dark c7">&#9823;</td>
    <td class="light d7">&#9823;</td>
    <td class="dark e7">&#9823;</td>
    <td class="light f7">&#9823;</td>
    <td class="dark g7">&#9823;</td>
    <td class="light h7">&#9823;</td>
</tr>
<tr>
    <th>6</th>
    <td class="light a6"></td>
    <td class="dark b6"></td>
    <td class="light c6"></td>
    <td class="dark d6"></td>
    <td class="light e6"></td>
    <td class="dark f6"></td>
    <td class="light g6"></td>
    <td class="dark h6"></td>
</tr>
<tr>
    <th>5</th>
    <td class="dark a5"></td>
    <td class="light b5"></td>
    <td class="dark c5"></td>
    <td class="light d5"></td>
    <td class="dark e5"></td>
    <td class="light f5"></td>
    <td class="dark g5"></td>
    <td class="light h5"></td>
</tr>
<tr>
    <th>4</th>
    <td class="light a4"></td>
    <td class="dark b4"></td>
    <td class="light c4"></td>
    <td class="dark d4"></td>
    <td class="light e4"></td>
    <td class="dark f4"></td>
    <td class="light g4"></td>
    <td class="dark h4"></td>
</tr>
<tr>
    <th>3</th>
    <td class="dark a3"></td>
    <td class="light b3"></td>
    <td class="dark c3"></td>
    <td class="light d3"></td>
    <td class="dark e3"></td>
    <td class="light f3"></td>
    <td class="dark g3"></td>
    <td class="light h3"></td>
</tr>
<tr>
    <th>2</th>
    <td class="light a2">&#9817;</td>
    <td class="dark b2">&#9817;</td>
    <td class="light c2">&#9817;</td>
    <td class="dark d2">&#9817;</td>
    <td class="light e2">&#9817;</td>
    <td class="dark f2">&#9817;</td>
    <td class="light g2">&#9817;</td>
    <td class="dark h2">&#9817;</td>
</tr>
<tr>
    <th>1</th>
    <td class="dark a1">&#9814;</td>
    <td class="light b1">&#9816;</td>
    <td class="dark c1">&#9815;</td>
    <td class="light d1">&#9813;</td>
    <td class="dark e1">&#9812;</td>
    <td class="light f1">&#9815;</td>
    <td class="dark g1">&#9816;</td>
    <td class="light h1">&#9814;</td>
</tr>
</tbody>`);

$(".moves").html('');
}  
$('td').click(function(){
    if(current == color){
        let $this = $(this);

        let location = headersLetters[$this.index()-1]+ headersNumber[$this.closest('tr').index()-1];

        if(chose == null){
            chose = location;
            jQueryChose = $this;
            socket.emit("possible",location,match);
            socket.emit("isFinished",match);
            $this.attr('style','background-color:red');
            piece = $this.text();
        }
        else if(chose != null && chose == location){
            chose = null;
            jQueryChose = null;
            $this.attr('style','');
            for(let r=0;r<possibleChose.length;r++){
                $("."+possibleChose[r].toLowerCase()).attr('style','');
            }
        }
        else if(move == null){
            move = location;
            jQueryMove = $this;
            if((move).toUpperCase().indexOf("1") >=0  && color == "black") {

                if (piece == "♟"){
                    $(".promotion").show();
                }

            }
            else if((move).toUpperCase().indexOf("8") >=0 && color =="white"){
                if (piece == "♙"){
                    $(".promotion").show();
                }
            }
            else{
                socket.emit("moves",{start:chose,last:move,piece:piece,condition:false},match);
               
                for(let r=0;r<possibleChose.length;r++){
                    $("."+possibleChose[r].toLowerCase()).attr('style','');
                }

                jQueryChose.attr('style','');

                chose = null;
                move = null;
            }
        }
    }
});

    });

    socket.on("transfer",(message,user)=>{

        $(".messages").prepend(`<p><span class="">${user+": "} </span>${message}</p><hr/>`);
    });
    socket.on("rpossible",(moves)=>{
        possibleChose = moves;

        for(let r=0;r<moves.length;r++){
            $("."+moves[r].toLowerCase()).attr('style','background-color:red');
        }
    });

    socket.on("rmoves",(moves)=>{
        
        socket.emit("isFinished",match);
        if(moves.piece == '♔' && moves.last == "g1" && moves.start == "e1"){
            $('.g1').text('♔');
            $('.f1').text('♖');
            $('.h1').text('');
            $('.e1').text('');
        }
        else if(moves.piece == '♚' && moves.last == "g8" && moves.start == "e8"){
            $('.g8').text('♚');
            $('.f8').text('♜');
            $('.h8').text('');
            $('.e8').text('');
        }
        $(".moves").prepend('<p>'+moves.piece+ ' moved from '+ moves.start+" to "+moves.last+'</p>');
        $("."+moves.start).text('');
        $("."+moves.last).text(moves.piece);

    });
});


