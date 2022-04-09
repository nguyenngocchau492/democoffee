const addCartBtn = document.querySelector(".add-cart");
if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    const idbook = document.querySelector(".id-book").value;
    const typeOrder = document
      .querySelector("span.active")
      .getAttribute("data-type");
    const quantity = document.querySelector(".action-input").value;
    $.ajax({
      type: "POST",
      url: "/order",
      data: { bookId: idbook, type_order: typeOrder, quantity: quantity },
      dataType: "json",
      success: function (response) {
        alert(response.message)
        CountCart()
     location.replace("/order")
      },
      error: function (response) {
        alert(response.responseJSON.message);
      },
    });
  });
}


function CountCart(){
  $.ajax({
    type: "GET",
    url: "/order/count",
    success: function (response) {
      console.log(response.count)
      if(response.count> 0){
        document.querySelector(".count-cart").innerHTML=response.count <9 ? response.count : "9+"
      } else {
        document.querySelector(".count-cart").innerHTML=0
      }
    
    },error: function(err){
      console.log(err)
    }
  });
}
CountCart()

$(window).on("scroll", function () {
  $(this).scrollTop() > 130
    ? $(".header-part").addClass("active")
    : $(".header-part").removeClass("active");
}),
  $(window).on("scroll", function () {
    $(this).scrollTop() > 700 ? $(".backtop").show() : $(".backtop").hide();
  }),
  $(function () {
    $(".dropdown-link").click(function () {
      $(this).next().toggle(),
        $(this).toggleClass("active"),
        $(".dropdown-list:visible").length > 1 &&
          ($(".dropdown-list:visible").hide(),
          $(this).next().show(),
          $(".dropdown-link").removeClass("active"),
          $(this).addClass("active"));
    });
  }),
  $(".nav-link").on("click", function () {
    $(".nav-list li a").removeClass("active"), $(this).addClass("active");
  }),
  $(".header-cate, .cate-btn").on("click", function () {
    $("body").css("overflow", "hidden"),
      $(".category-sidebar").addClass("active"),
      $(".category-close").on("click", function () {
        $("body").css("overflow", "inherit"),
          $(".category-sidebar").removeClass("active"),
          $(".backdrop").fadeOut();
      });
  }),
  $(".header-user").on("click", function () {
    $("body").css("overflow", "hidden"),
      $(".nav-sidebar").addClass("active"),
      $(".nav-close").on("click", function () {
        $("body").css("overflow", "inherit"),
          $(".nav-sidebar").removeClass("active"),
          $(".backdrop").fadeOut();
      });
  }),
  $(".header-cart, .cart-btn").on("click", function () {
    location.replace("/order");
  }),
  $(".header-user,  .header-cate, .cart-btn, .cate-btn").on(
    "click",
    function () {
      $(".backdrop").fadeIn(),
        $(".backdrop").on("click", function () {
          $(this).fadeOut(),
            $("body").css("overflow", "inherit"),
            $(".nav-sidebar").removeClass("active"),
            $(".cart-sidebar").removeClass("active"),
            $(".category-sidebar").removeClass("active");
        });
    }
  ),
  $(".coupon-btn").on("click", function () {
    $(this).hide(), $(".coupon-form").css("display", "flex");
  }),
  $(".header-src").on("click", function () {
    $(".header-form").toggleClass("active"),
      $(this).children(".fa-search").toggleClass("fa-times");
  }),
  $(".wish").on("click", function () {
    $(this).toggleClass("active");
  }),
  // $(".product-add").on("click", function () {
  //   var e = $(this).next(".product-action");
  //   e.css("display", "flex");
  // }),
  $(".action-plus").on("click", function () {
    var e = $(this).closest(".product-action").children(".action-input").get(0)
        .value++,
      c = $(this).closest(".product-action").children(".action-minus");
    e > 0 && c.removeAttr("disabled");
  }),
  $(".action-minus").on("click", function () {
    2 ==
      $(this).closest(".product-action").children(".action-input").get(0)
        .value-- && $(this).attr("disabled", "disabled");
  }),
  $(".review-widget-btn").on("click", function () {
    $(this).next(".review-widget-list").toggle();
  }),
  $(".offer-select").on("click", function () {
    $(this).text("Copied!");
  }),
  $(".modal").on("shown.bs.modal", function (e) {
    $(".preview-slider, .thumb-slider").slick("setPosition", 0);
  }),
  $(".profile-card.schedule").on("click", function () {
    $(".profile-card.schedule").removeClass("active"),
      $(this).addClass("active");
  }),
  $(".profile-card.contact").on("click", function () {
    $(".profile-card.contact").removeClass("active"),
      $(this).addClass("active");
  }),
  $(".profile-card.address").on("click", function () {
    $(".profile-card.address").removeClass("active"),
      $(this).addClass("active");
  }),
  $(".payment-card.payment").on("click", function () {
    $(".payment-card.payment").removeClass("active"),
      $(this).addClass("active");
  });

const selectPrice = document.querySelector(".price");
const selectRent = document.querySelector(".rent");
if (selectPrice) {
  selectPrice.addEventListener("click", () => {
    selectPrice.classList.add("active");
    selectRent.classList.remove("active");
    document.querySelector(".type-order").value = "buy";
  });

  selectRent.addEventListener("click", () => {
    selectRent.classList.add("active");
    selectPrice.classList.remove("active");
    document.querySelector(".type-order").value = "rent";
  });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

if (getCookie('id')) {
  document.querySelector(".login-btn").style.display = "none"
  const avatar = getCookie("avatar");
  document.querySelector(".avatar-user").src = decodeURIComponent(avatar);
  document.querySelector(".user-name").innerHTML = decodeURIComponent(getCookie("name"));
} else {
  document.querySelector(".logout-btn").style.display = "none"
  document.querySelector(".change-pass").style.display = "none"
}

const btns = document.querySelectorAll(`.trash`);
btns.forEach((btn) => {
  console.log("click liost");
  btn.addEventListener("click", () => {
    console.log("Clicked");
    const id = btn.getAttribute("data-id");
    if (confirm("bạn có chắc chắn muốn xóa sản phẩm này ra khỏi giỏ hàng?")) {
      $.ajax({
        type: "DELETE",
        url: `/order/`+ id,
        dataType: "json",
        success: function (response) {
          alert(response.message);
          location.reload();
        },
        error: function (request, error) {
          alert(request.responseJSON.message);
        },
      });
    }
  });
});

var loadFile = function(event) {
  document.getElementById('blah').style.display ="flex"
  var output = document.getElementById('blah');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
};

document.querySelector(".checkout-proced").addEventListener('click',()=>{
  $.ajax({
    type: "GET",
    url: "order/wait-acept",
    dataType: "json",
    success: function (response) {
      alert(response.message)
      location.replace("/order")
    }, error: function(req,err){
      console.log(err)
    }
  });
})