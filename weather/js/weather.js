$(function(){

      // 위도와 경도 
      let myLat=0, myLng=0;
      let key;

//검색
$('.search').on('keypress',function(e){
    // 13 = 엔터키 
    if(e.keyCode == 13){
        let key =$(this).val();
        $(this).val('');
        $('.searchbox').css({
            opacity : 0,
            width: '0px'
        });
        //도시명 검색하면 슬릭 사라지게 
        $('.five-day').slick('unslick');
       getWeather('','',key);
    }
});

// 인풋 한글 금지
$('.search').on('blur keyup', function(){
    $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,''));
    //정규표현식 : /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,''
});

    //윈도우가 로드 되었을 때
    $(window).on('load',function(){


        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                myLat = position.coords.latitude;
                myLng = position.coords.longitude;
                // alert(`내 위치는 위도 :${myLat} , 경도 : ${myLng} 입니다.`);

                getWeather(myLat, myLng,'');
                //getWeather 는 마지막 줄에 선언해뒀으니 참고.
            });
        }
});

    // 검색 아이콘을 클릭 했을 때
    $('a.btn').click(function(e){
        e.preventDefault();
        let w= $('.searchbox').css('width');
        if(w != '350px'){
            $('.searchbox').css({
                opacity: 1,
                width : '350px'
            });
            $('.search').focus();
        }else{
            $('.searchbox').css({
                opacity: 0,
                width : '0px'
            });
        }

      
    });
    // 슬라이드 

function daySlide(){
    $('.five-day').slick({
        centerMode:true,
        centerPadding:'20px',
        slidesToShow: 3,
        slidesToScroll:3,
        arrows:false,
        dots:false,
        autopaly: true,
        autoplaySpeed:3000

    });
}

//https://openweathermap.org/forecast5 이 링크 가입해서 키 값을 가져올 것임. 
function getWeather(lat,lon,city){
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    let url = "//api.openweathermap.org/data/2.5/forecast";
    let apikey = "4142aa9b3d41c8ae467074b414c357cc"; // 내 api 키 
    let wdata;
    if(city== ''){
        wdata= {
            lat: lat,
            lon: lon,
            appid: apikey,
            units :'metric',
            lang :'kr'
        }
    }else{
        wdata ={
            q : city,
            appid : apikey,
            units :'metric',
            lang :'kr'
        }
    }

    $.ajax({
        url : url,
        dataType : 'json',
        type : 'GET',
        data : wdata,
        success: function(data, status, xhr){
            console.log(data);

            $('#city').html(data.city.name);// 도시명
            let nowTemp = data.list[0].main.temp.toFixed(1);
            $('#temp').html(nowTemp); //현재온도
            $('#descript').html(data.list[0].weather[0].description); //설명 ex)구름많음
            $('#feels_like').html(data.list[0].main.feels_like+"°");  // 체감온도
            $('#temp-min').html(data.list[0].main.temp_min);// 최저기온
            $('#temp-max').html(data.list[0].main.temp_max);// 최고기온
            $('#humidity').html(data.list[0].main.humidity); //습도


            //해뜨는 시각, 해지는 시각 확인 
            // console.log("해뜨는 시각" + new Date(data.city.sunrise*1000)) -> 확인용 
            // 유닉스 unix time to 현재시간 => new Date(unixtime * 1000) 
            let sr = new Date(data.city.sunrise*1000);
            let ss = new Date(data.city.sunset*1000);
            sr = transTime(sr.getHours()) + ":" + sr.getMinutes();
            ss = transTime(ss.getHours()) + ":" + ss.getMinutes();
            $('#sunrise').text(sr);
            $('#sunset').text(ss);
            $('#windy').html(data.list[0].wind.speed) //풍속 

            //
            let str = '',ftime, iconList,listTemp;
            let week = ['일','월','화','수','목','금','토'];
            for(let i = 1; i < data.list.length; i++){
                // 날짜
                ftime = new Date(data.list[i].dt*1000);
                ftime =
                        ftime.getDate()+"일("+week[ftime.getDay()]+")"+
                        ftime.getHours()+"시";

                      str+=  '<div class="three-times">'
                      str+=  '<div class="five-date">'+ftime+'</div>'
                      str+=  '<div class="five-icon">'
                      str+=  '<img src="images/icon/'+data.list[i].weather[0].icon+'.png" alt="d01" class="img-fluid">'
                      str+=  '</div>'
                      str+=  '<p class="five-temp">'+data.list[i].main.temp +'</p>'
                      str+=  '<p class="five-descript">'+data.list[i].weather[0].description+'</p>'
                      str+=  '</div>'
                // 아이콘 
                // 온도
            }
            $('.five-day').html(str);
            daySlide();


            backgroundImg(data.list[0].weather[0].icon);
        },
        error: function(xhr, status, error){
            console.log(error);
        }
    })
}


function backgroundImg(icon){
            // 이미지 배경 깔기
            let img; 

if( icon == '50d' || icon == '11d' || icon == '01d'|| icon == '02d'
    || icon == '03d'|| icon == '04d' ){
    img = './images/main01.jpg'; 
}else if(icon == '50n' || icon == '11n' || icon == '01n'
|| icon == '02n'|| icon == '03n'|| icon == '04n'){ 
    img = './images/main02.jpg'; 
}else if(icon == '09d' || icon == '10d'){
    img='./images/main03.jpg'
}else if(icon == '09n' || icon == '10n'){
    img='./images/main05.jpg'
}
            $('.wrapper').css({
                'background-image' : 'url('+ img +')'
    
            });
}

function transTime(t){
    t = Number(t);
    // console.log(t);
    if(t<12){
        t ="AM" + t;
    }else if(t>12 && t<24){
        t ="PM" + t;
    }else{
        t ="AM 00";
    }
    return t;
}
   

});