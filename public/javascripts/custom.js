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
$("#loginform").remove(); 
                }else{

                }
                
            });


        });
    });


// 비밀번호찾기
$(document).ready(function(){        
        $("#searchpassword").click(function(){
var email=$("#signupemail").val();  
    var password=$("#signuppassword").val();  
        var nickname=$("#nickname").val();           
            $.post("http://localhost:3000/singupuser",{email:email, password:password, nickname:nickname},function(data){
                if(data=="ok")
                {
                    
                     alert("가입되었습니다!");
                     $.mobile.changePage("http://localhost:3000/#myinfo");
                     //location.replace("http://localhost:3000/#myinfo");
                     
                }else{

                }
                
            });


        });
    });



