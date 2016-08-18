var socket = io.connect('http://192.168.25.46');
        $("#msgbox").keyup(function(event) {
            if (event.which == 13) {
                socket.emit('fromclient',{msg:$('#msgbox').val()});
                $('#msgbox').val('');
            }
        });
        socket.on('toclient',function(data){
            console.log(data.msg);
            $('#msgs').append(data.msg+'<BR>');
        });