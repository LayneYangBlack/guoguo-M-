/**
 * Created by Administrator on 2017/4/17.
 */
var vm =new Vue({
    el:"#app",
    data:{
        goodList : []
    },
    mounted:function () {
        this.$nextTick(function () {
            this.initData();
        })
    },
    methods:{
        initData:function () {
            var _this = this;
            if(localStorage.getItem("user")!=undefined){
                var user = JSON.parse(localStorage.getItem("user"));
                $.ajax({
                    url:  getShpoopCarDataUrl,
                    dataType:"json",
                    type:'GET',
                    data:{
                        token:user.user.token
                    },
                    success:function (ret) {
                        var allResults={};
                        var domWidth = document.body.offsetWidth;
                        for(var i=0;i<ret.good.length;i++){
                            allResults[ret.good[i].id] = ret.good[i];
                            var url =  ret.good[i].icon;
                            var width =domWidth*0.48*0.95;
                            var height = 140;
                            var obj = getImgSizeBySize(url,width,height);
                            ret.good[i].style = obj.style;
                        }
                        _this.goodList = ret.good;
                    }
                })
            }else {
                _this.showConfirm()
            }

        },
        showConfirm:function () {
            var r = confirm("您当前未登录，是否前往登录页？")
            if(r == true){
                window.location.href = "login.html";
            }else{

            }
        },
        openDetail:function (data) {
            localStorage.setItem("detail",JSON.stringify(data))
            window.location.href = "./detail.html"
        }
    }
})