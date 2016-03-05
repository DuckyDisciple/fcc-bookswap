// var stockName = document.querySelector(".stock-name") || null;
// var stockSymbol = document.querySelector(".stock-symbol") || null;
// var userUL = document.querySelector(".watching-list") || null;

// var watchUrl = appUrl + '/api/watch/';
// var unwatchUrl = appUrl + '/api/unwatch/';
// var userListUrl = appUrl + '/api/users/';

var socket = io();

var bookId = $(".request-book").attr("id");

function updateForm(){
    $.get("/request/user/"+bookId, function(data){
        if(data.loggedIn){
            if(data.owner){
                if(data.requested){
                    //show accept and deny buttons
                    console.log("Someone requested my book");
                }else{
                    //show nobody requested
                    console.log("Nobody wants my book");
                }
            }else if(data.requester){
                //show cancel button
                console.log("I want this");
            }
            else{
                if(data.requested){
                    //show requested status
                    console.log("Someone beat me to it");
                }else{
                    $(".request-book").removeClass("hide");
                }
            }
        }
    });
}

$(document).on('ready', function(){
    updateForm();
});

$(".request-book").on('click', function(){
    $.post("/request/book/"+bookId,function(data){
        socket.emit("request",bookId);
    });
    
});

socket.on("requested", function(bookId){
    updateForm();
});

// $(".watch").click(function(){
//     var mySymbol = stockSymbol.innerHTML;
//     var myName = stockName.innerHTML;
//     var postUrl = watchUrl + mySymbol + "/" + myName;
//     ajaxFunctions.ajaxRequest("POST",postUrl,function(){
//         socket.emit("watch","added");
//         $(".watch").addClass("hide");
//         $(".unwatch").removeClass("hide");
//     });
// });

// $(".unwatch").click(function(){
//     var mySymbol = stockSymbol.innerHTML;
//     var delUrl = unwatchUrl + mySymbol;
//     ajaxFunctions.ajaxRequest("DELETE",delUrl,function(){
//         socket.emit("unwatch","removed");
//         $(".watch").removeClass("hide");
//         $(".unwatch").addClass("hide");
//     });
// });

// socket.on("update",function(msg){
//   ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",userListUrl+stockSymbol.innerHTML,function(data) {
//             updateWatchersList(JSON.parse(data),userUL);
//         })); 
// });

// function updateWatchersList(userList,element){
//     while(element.firstChild){
//         element.removeChild(element.firstChild);
//     }
//     if(userList.length === 0){
//         var nobody = document.createElement("li");
//         nobody.innerHTML = "Nobody is watching this yet";
//         element.appendChild(nobody);
//     }else{
//         for(var i=0; i< userList.length; i++){
//             var item = document.createElement("li");
//             item.innerHTML=userList[i];
//             element.appendChild(item);
//         }
//     }
// }