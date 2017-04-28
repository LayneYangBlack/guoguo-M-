/**
 * Created by Administrator on 2017/4/15.
 */
var vm = new Vue({
    el:"#app",
    data:{
        pageData:'',
        imgList:'',
        num:1,
        gid:'',
        comment:'',
        flag:null
    },
    mounted:function () {
        this.$nextTick(function () {
            this.initPage();
        })
    },
    methods:{

        initPage:function () {
            var data = JSON.parse(localStorage.getItem("detail"));
                data.info = decodeURIComponent(data.info);
                this.pageData =data;
                this.gid = data.id;
                this.num = data.num;
                var imgs = data.carousel.split(",");
                    this.imgList = imgs;
            this.getCommentList();
        },
        personNum:function (num,dom) {
            var _this = this;
            if(num<0){
                var index = $(dom).val();
                index--;
                if(index < 1){
                    return false;
                }else{
                    $(dom).val(index);
                    _this.num = index;
                }
            }else{
                var index = $(dom).val();
                index++;
                $(dom).val(index);
                _this.num = index;

            }
        },
        inShopCar:function () {
            var _this = this;
            if (localStorage.getItem("user").user.token!=undefined){
                var user = JSON.parse(localStorage.getItem("user"));
                $.ajax({
                    url:  addShoopCarUrl,
                    dataType:"json",
                    type:'GET',
                    data:{
                        gid :_this.gid,
                        num:_this.num,
                        token:user.user.token
                    },
                    success:function (ret) {
                        console.log(JSON.stringify(ret));
                        alert("添加成功")
                    }
                })
            }else{
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
        inCollect:function () {
            var _this = this;
            if(localStorage.getItem("user").user.token!=undefined){
                var user = JSON.parse(localStorage.getItem("user"));
                $.ajax({
                    url:  colletGoodUrl,
                    dataType:"json",
                    type:'GET',
                    data:{
                        gid :_this.gid,
                        token:user.user.token
                    },
                    success:function (ret) {
                        console.log(JSON.stringify(ret));
                        alert("收藏成功");
                    }
                })
            }else {
                _this.showConfirm()
            }

        },
        getCommentList:function () {
            var data = JSON.parse(localStorage.getItem("detail"));
            var _this =this;
            $.ajax({
                url:  getCommentListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    gid:data.id
                },
                success:function (ret) {
                    if(ret.data.length == 0){
                        _this.flag = true;
                    }else {
                        for(var i=0;i<ret.data.length;i++){
                            ret.data[i].ctime = formatTimeToDate( ret.data[i].ctime)
                        }
                        _this.comment = ret.data[0];
                        _this.flag = false;
                    }
                }
            })
        }

    }
})
vm.$watch('imgList',function () {
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay : 2500
    });
})
