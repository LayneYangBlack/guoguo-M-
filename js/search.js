/**
 * Created by Administrator on 2017/4/20.
 */
var vm =new Vue({
    el:"#app",
    data:{
        words:'',
        cityCode:'',
        flag:false,
        cursor:0,
        list:[]
    },
    mounted:function () {
        this.$nextTick(function () {
            window.onload = function () {
                document.getElementsByClassName("search")[0].focus()
            }
        })
    },
    methods:{
        getList:function () {
            var _this = this;
            _this.cityCode = JSON.parse(localStorage.getItem("localCity")).code;
            if(localStorage.getItem("user")!=undefined){
                var user = JSON.parse(localStorage.getItem("user"));
                $.ajax({
                    url:  searchUrl,
                    dataType:"json",
                    type:'GET',
                    data:{
                        title:_this.words,
                        size:10,
                        preCursor:_this.cursor,
                        parentId:_this.cityCode,
                        token:user.user.token
                    },
                    success:function (ret) {
                        _this.cursor = ret.nextCursor;
                        var allResults={};
                        var domWidth = document.body.offsetWidth;
                        for(var i=0;i<ret.data.length;i++){
                            allResults[ret.data[i].id] = ret.data[i];
                            if(ret.data[i].icon == ""){
                                var url = "http://store.quakoo.com/storage/guoguo/321*157*866c64ee70300eec4e61efa1163ee697.png";
                            }else{
                                url =  ret.data[i].icon;
                            }
                            var width =domWidth*0.5;
                            var height = 140;
                            var obj = getImgSizeBySize(url,width,height);
                            ret.data[i].style = obj.style;
                        }
                        _this.list = ret.data;
                        //判断是否需要加在更多
                        if(ret.hasnext ==false){
                            _this.flag = false;
                        }else {
                            _this.flag = true;
                        }
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
            localStorage.setItem("detail",JSON.stringify(data));
            window.location.href = "./detail.html";
        }
    }
})