/**
 * Created by Administrator on 2017/4/21.
 */
new Vue({
    el:"#app",
    data:{
        cityCode:'',
        flag:false,
        cursor:0,
        list:[],
        title:''
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getList();
        })
    },
    methods:{
        getList:function () {
            var type = localStorage.getItem("listType");
            var _this = this;
            _this.cityCode = JSON.parse(localStorage.getItem("localCity")).code;
            _this.title = localStorage.getItem("title");
            $.ajax({
                url:  allListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:type,
                    cursor:_this.cursor,
                    size:5
                },
                success:function (ret) {
                    if(ret.hasnext ==false){
                        _this.cursor = 0;
                        _this.flag = false;
                    }else {
                        // _this.cursor = ret.nextCursor;
                        _this.flag = true;
                        localStorage.setItem("cursor",ret.nextCursor);
                    }
                    var allResults={};
                    var domWidth = document.body.offsetWidth;
                    for(var i=0;i<ret.data.length;i++){
                        allResults[ret.data[i].id] = ret.data[i];
                        var url =  ret.data[i].icon;
                        var width =domWidth*0.48;
                        var height = 140;
                        var obj = getImgSizeBySize(url,width,height);
                        ret.data[i].style = obj.style;
                    }
                    _this.list  =ret.data;

                }
            })
        },
        loadMore:function () {
            var type = localStorage.getItem("listType");
            var nextcursor = localStorage.getItem("cursor");
            var _this = this;
            _this.cityCode = JSON.parse(localStorage.getItem("localCity")).code;
            $.ajax({
                url:  allListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:type,
                    cursor:nextcursor,
                    size:5
                },
                success:function (ret) {
                    var allResults={};
                    var domWidth = document.body.offsetWidth;
                    for(var i=0;i<ret.data.length;i++){
                        allResults[ret.data[i].id] = ret.data[i];
                        if(ret.data[i].icon == ""){
                            var url = "http://store.quakoo.com/storage/guoguo/321*157*866c64ee70300eec4e61efa1163ee697.png";
                        }else{
                            url =  ret.data[i].icon;
                        }

                        var width =domWidth*0.48;
                        var height = 140;
                        var obj = getImgSizeBySize(url,width,height);
                        ret.data[i].style = obj.style;
                        _this.imgStyle = ret.data[i].style;
                    }
                    // for (var j in ret.data){
                    //     _this.list.push(ret.data[j])
                    // }
                    for (var j=0;j<ret.data.length;j++){
                        _this.list.push(ret.data[j])
                    }
                    if(ret.hasnext ==false){
                        _this.flag = false;
                    }else {
                        _this.flag = true;
                        localStorage.setItem("cursor",ret.nextCursor);
                    }
                }
            })
        },
        openDetail:function (date) {
            localStorage.setItem("detail",JSON.stringify(date))
            window.location.href = "../html/detail.html"
        }
    }
})

