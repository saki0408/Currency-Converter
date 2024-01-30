var tabs = $('.tabs');
var activeItem = tabs.find('.active');
var activeWidth = activeItem.innerWidth();
$(".selector").css({
    "left": activeItem.position().left + "px",
    "width": activeWidth + "px"
});

$(".tabs").on("click", "a", function (e) {
    e.preventDefault();
    $('.tabs a').removeClass("active");
    $(this).addClass('active');
    var activeWidth = $(this).innerWidth();
    var itemPos = $(this).position();
    $(".selector").css({
        "left": itemPos.left + "px",
        "width": activeWidth + "px"
    });
});

$(".sendmess").click(function () {
    var email = $(".mailinput").val().trim();
    var message = $(".messtxt").val().trim();

    if (email === "" || message === "") {
        alert("Please fill out the required fields.");
        return;
    }
    $(".bar").css("animationName", "send");
    SendMess();
})

function SendMess() {
    setTimeout(function () {
        $(".l1").css("display", "none");
        $(".l2").css("display", "none");
        $(".mailinput").css("display", "none");
        $(".messtxt").css("display", "none");
        $(".sendmess").css("display", "none");

        $(".success").css("display", "inline");
        $(".closemess").css("display", "inline");
    }, 1500);
}

$(".closemess").click(function () {
    $(".bar").css("animationName", "none");
    $(".l1").css("display", "inline");
    $(".l2").css("display", "inline");
    $(".mailinput").css("display", "inline");
    $(".messtxt").css("display", "inline");
    $(".sendmess").css("display", "inline");

    $(".success").css("display", "none");
    $(".closemess").css("display", "none");

    $(".mailinput").val("");
    $(".messtxt").val("");
})