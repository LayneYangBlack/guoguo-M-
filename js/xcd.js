/**
 * Created by Administrator on 2017/4/17.
 */
var vm = new Vue({
    el:"#app",
    data:{
        flag:true,
        index:0,
        sflag:true,
        allList:[]
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getAllUserJoureny();
        })
    },
    methods:{
        getAllUserJoureny:function () {
            var _this = this;
            if(localStorage.getItem("user")!=undefined){
                var user = JSON.parse(localStorage.getItem("user"));
                $.ajax({
                    url:  getAllUserJoureny,
                    dataType:"json",
                    type:'GET',
                    data:{
                        token:user.user.token
                    },
                    success:function (ret) {
                        var allResults={};
                        var domWidth = document.body.offsetWidth;
                        for(var i=0;i<ret.data.length;i++){
                            for( var j=0;j<ret.data[i].goodList.length;j++){
                                allResults[ret.data[i].goodList[j].id] = ret.data[i].goodList[j];
                                var url =  ret.data[i].goodList[j].icon;
                                var width =domWidth*0.6;
                                var height = 140;
                                var obj = getImgSizeBySize(url,width,height);
                                ret.data[i].goodList[j].style = obj.style;
                            }

                        }
                        _this.allList =ret.data;
                    }
                })

            }else {
               this.showConfirm()
            }

        },
        openEditXcd:function () {
            if(localStorage.getItem("user")){
                window.location.href = "./editXcd.html"
            }else {
                this.showConfirm()
            }
        },
        showConfirm:function () {
            var r = confirm("您当前未登录，是否前往登录页？")
            if(r == true){
                window.location.href = "login.html";
            }else{

            }
        },
        hideShow:function (index) {
            this.flag = !this.flag;
            this.index = index;
        }
    }
})
