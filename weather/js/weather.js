$(function(){
    //윈도우가 로드 되었을 때
    $(window).on('load',function(){
        $('.wrapper').css({
            'background-image' : 'url(./images/main01.jpg)',
        })
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
        }else{
            $('.searchbox').css({
                opacity: 0,
                width : '0px'
            });
        }

      
    });



    daySlide();
});


function daySlide(){
    $('.five-day').slick({
        centerMode:true,
        centerPadding:'20px',
        slidesToShow: 3,
        slidesToScroll:3,
        arrows:false,
        dots:false,
        autopaly: true,
        autoplaySpeed:2000

    });
}
