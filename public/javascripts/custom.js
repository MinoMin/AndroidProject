//안씀 예제
/*
$(document).ready(function(){
        var text;
        $("#sendfaq").click(function(){
        });   });

*/



// 알러트창 생성 및 보낼시 확인
function alertfaq() {
    if (confirm("궁물 운영진에게 메일을 보내시겠습니까?") == true) {
        var text=$("#content").val();
            $.get("http://localhost:3000/send",{text:text},function(data){
                if(data=="sent")
                {
                     alert("전송되었습니다!");
                    location.replace("http://localhost:3000/#myinfo");
                }
            });
    } else {
        //취소 버튼 아무 효과없음
    }
}

//이메일 중복확인
function checkemail() {

        var email=$("#signupemail").val();
            $.post("http://localhost:3000/checkemail",{email:email},function(data){
                if(data=="ok")
                {

                    document.getElementById("result").innerHTML = "이메일을 입력해주세요.";

                }
                if(data=="no")
                {

                    document.getElementById("result").innerHTML = "사용하실 수 없는 이메일입니다.";
                }
            });

}

//닉네임 중복확인
function checknickname() {

        var nickname=$("#nickname").val();
            $.post("http://localhost:3000/checknickname",{nickname:nickname},function(data){
                if(data=="ok")
                {

                    document.getElementById("result").innerHTML = "닉네임을 입력해주세요.";

                }
                if(data=="no")
                {

                    document.getElementById("result").innerHTML = "사용하실 수 없는 닉네임입니다.";
                }
            });

}


// 회원가입
$(document).ready(function(){
        $("#signupuser").click(function(){
var email=$("#signupemail").val();
    var password=$("#signuppassword").val();
        var nickname=$("#nickname").val();
            $.post("http://localhost:3000/singupuser",{email:email, password:password, nickname:nickname},function(data){
                if(data=="ok")
                {

                     alert("가입되었습니다!");
                     $.mobile.changePage("http://localhost:3000/#myinfo");
                       //location.replace("http://localhost:3000/#myinfo");
$('#loginemail').val('');
                      $('#loginpassword').val('');
                        $("#loginform").hide();
                        $("#logout").show();
                }else{

                }

            });


        });
    });


// 비밀번호찾기
$(document).ready(function(){
        $("#searchpassword").click(function(){
            /*
var email=$("#signupemail").val();
    var password=$("#signuppassword").val();
        var nickname=$("#nickname").val();
            $.post("http://localhost:3000/singupuser",{email:email, password:password},function(data){
                if(data=="ok")
                {

                     alert("가입되었습니다!");
                     $.mobile.changePage("http://localhost:3000/#myinfo");
                     //location.replace("http://localhost:3000/#myinfo");

                }else{

                }

            });
*/

        });
    });






// 로그인하기
$(document).ready(function(){
        $("#login").click(function(){
var email=$("#loginemail").val();
    var password=$("#loginpassword").val();        
            $.post("http://localhost:3000/login",{email:email, password:password},function(data){

if(data=="no"){

 
}else{


alert("로그인 되었습니다.");    
socket.emit('adduser', data);
                        $('#loginemail').val('');
                      $('#loginpassword').val('');
                        $("#loginform").hide();
                        $("#logout").show();

}
          });


        });
    });


// 로그아웃하기
$(document).ready(function(){
        $("#logout").click(function(){
            $.post("http://localhost:3000/logout", function(data){
                if(data=="ok")
                {
                    
                     alert("로그아웃 되었습니다.");                     
                     $("#loginform").show();
                     $("#logout").hide();
                      



                }else{
 alert("로그인이 실패하였습니다!"); 
                }

            });


        });
    
    });



$(document).ready(function(){
        $("#removeconver").click(function(){
            $("#conversation").empty();


        });
    
    });








// 채팅함수
    var socket = io.connect('http://localhost:3000');
    socket.on('connect', function(){
        // 여기는 소켓 접속하자마자 쓰임... 아마 DB에서 세션값을 가져와야하지않을까?

    });

    // 메시지 갱신
    socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
    });

    // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    //0819수정
    //room이 업데이트되고 empty로 다 지운다음에 append는 맨마지막 자식노드에 추가
    socket.on('updaterooms', function(rooms, current_room) {
      $('#rooms').empty();
      $.each(rooms, function(key, value) {
         if((value == current_room) && (value != null)){
            // $('#rooms').append('<div>' + value + '</div>');
            $('#rooms').append('<li><p onclick="switchRoom(\''+value+'\')">' + value + key+ '</p></li>');
            //history.go(-1);
         }
         else {//<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>
            if(value!=null){
            $('#rooms').append('<li><p onclick="switchRoom(\''+value+'\')">' + value + key+'</p></li>');
         }}
      });
   });




// 방입장할때 로그인 여부 체크
    function switchRoom(room){

$.post("http://localhost:3000/checkjoinask", function(data){
if(data=="ok"){

$.mobile.changePage("http://localhost:3000/#chatting");
socket.emit('switchRoom', room);

}else{
    alert("로그인 후 이용해주세요.");
    $.mobile.changePage("http://localhost:3000/#myinfo");
}
                
            });   





        socket.emit('switchRoom', room);
    }



    // on load of page
    $(function(){
        // when the client clicks SEND
        $('#datasend').click( function() {
            var message = $('#data').val();
            //val()은 value를 배열로 반환해줌
            $('#data').val('');
            // tell server to execute 'sendchat' and send along one parameter
            socket.emit('sendchat', message);
        });

        // when the client hits ENTER on their keyboard
        $('#data').keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#datasend').focus().click();
            }
        });
    });



// 방목록 새로고침 역할
$(function(){
    // when the client clicks SEND
    $('#mainpage1').click( function(){
        //var caca = socket.room;
        //io.sockets.manager.rooms;
        socket.emit('duduman');
    });
});



// 질문 삭제
$(function(){
    // when the client clicks SEND
    $('#dede').click( function(){
        alert('이 질문은 이제 삭제 됩니다.');
        $("#conversation").empty();
        socket.emit('jiu');
        $.mobile.changePage("http://localhost:3000/#mainpage1");
    });
});

// 질문할때 로그인돼있으면 질문하고 아니면 로그인창 이동
function gomainpage() {

$.post("http://localhost:3000/checkask", function(data){
if(data=="ok"){

var r_data = $('#bang_data').val();
        document.getElementById("rooms").innerHTML = r_data;
        socket.emit('makingask', r_data);
$.post("http://localhost:3000/saveask", {roomname : r_data}, function(data){

 });   

        $('#bang_data').val('');

$.mobile.changePage("http://localhost:3000/#chatting");
}else{
    alert("로그인 후 이용해주세요.");
    $.mobile.changePage("http://localhost:3000/#myinfo");
}
                
            });    
}
