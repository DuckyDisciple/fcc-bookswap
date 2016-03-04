$(".delete-book").click(function(){
    var delUrl = $(this).siblings("a").first().attr("href").replace("book", "book/delete");
    $.post(delUrl, function(data){
        if(data.hasOwnProperty("error")){
            console.log(data.error);
        }
        location.reload();
    });
});