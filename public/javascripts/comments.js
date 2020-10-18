
$(()=>{
    $('#comment').submit((event)=>{
        event.preventDefault();
        let comm = $("#comm").val();
        let id = $("#id").val();
        console.log(comm, id);
        $.ajax({
            url: '/wits/comment',
            type: 'POST',
            dataType: 'JSON',
            data: {comm, id},
            success: function (data, status, msg) {
                console.log(data);
                let content = `<div class=" shadow p-2 mb-3 bg-white rounded">
                <h5 class="card-title h4 text-success p-1">${data.com.userName}</h5>
                <p class="card-text p-1">Now</p>
                <p class="card-text p-1">${data.com.comment}</p>
                </div>`;
                $("#resultComm").append(content);
                $('input[type="text"],textarea').val('');
            
            },
            error: function (err, status,) {
                console.log(err);
            },
        })
    })

    $('#like').click((event)=>{
        event.preventDefault();
        let id = $("#id").val();
        console.log(id);
        $.ajax({
            url: '/wits/Likes',
            type: 'POST',
            dataType: 'JSON',
            data: {id},
            success: function (data, status, msg) {
                if (data) {  
                    $("#likeUp").append(`${data.obj.Likes.length}`);
                }
                
            },
            error: function (err, status,) {
                console.log(err);
            },
        })
    })
})
