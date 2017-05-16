/**
 * Created by Administrator on 2017/4/14.
 */
var vm = new Vue({
    el:"#app",
    data:{
        imgList:[],
        eatList:[],
        hotelList:[],
        goList:[],
        shopList:[],
        viewList:[],
        cityList:[],
        cityCode:''
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getCityList();
            // this.getLocalCity();
            this.getSwiperImg();
             //this.getIndexList();
        })
    },
    filters:{

    },
    watch:{

    },
    methods:{
        getSwiperImg:function () {
            this.$http.get(indexBannerUrl).then(function (ret) {
                this.imgList = ret.body.banner;
                // alert( JSON.stringify(ret.body.banner))
            })
        },
        getIndexList:function () {//首页商品列表
            var _this = this;
            _this.cityCode = JSON.parse(localStorage.getItem("localCity")).code;
            $.ajax({
                url:  indexGoodListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:1,
                    size:2,
                    isHot:1
                },
                success:function (ret) {
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
                    _this.goList = ret.data;
                }
            })
                //住
            $.ajax({
                url:  indexGoodListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,//
                    type:2,
                    size:2,
                    isHot:1
                },
                success:function (ret) {
                    // console.log(JSON.stringify(ret));
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
                    _this.hotelList  =ret.data;
                }
            })
                //景点
            $.ajax({
                url:  indexGoodListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:3,
                    size:2,
                    isHot:1
                },
                success:function (ret) {
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
                    _this.viewList  =ret.data;
                }
            })
                //购物
            $.ajax({
                url:  indexGoodListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:4,
                    size:2,
                    isHot:1
                },
                success:function (ret) {
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
                    //console.log(JSON.stringify(ret));
                    _this.shopList  =ret.data;
                }
            })
                //吃
            $.ajax({
                url:  indexGoodListUrl,
                dataType:"json",
                type:'GET',
                data:{
                    areaId :_this.cityCode,
                    type:5,
                    size:2,
                    isHot:1
                },
                success:function (ret) {
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
                    _this.eatList  =ret.data;
                }
            })
        },
        getCity:function () {//城市列表
            var _this = this;
            if(localStorage.getItem("citysData")){
                var citydata = localStorage.getItem("citysData");
                _this.cityList = JSON.stringify(citydata);
            }else{
                this.$http.get("http://192.168.1.4:10007/area/getAreaList").then(function (ret) {
                    localStorage.setItem("citysData",JSON.stringify(ret.body.region));

                    _this.cityList = ret.body.region;

                })
            }

        },
        openMore:function (type) {
            if(type==3){
                localStorage.setItem("title",'热门景点');
            }else if(type ==1){
                localStorage.setItem("title",'出行优惠');
            }else if(type ==2){
                localStorage.setItem("title",'优惠酒店');
            }else if(type ==4){
                localStorage.setItem("title",'疯狂购物');
            }else if(type ==5){
                localStorage.setItem("title",'美食推荐');
            }
            if(localStorage.getItem("user")){
                localStorage.setItem("listType",type);
                window.location.href = "./html/moreList.html"
            }else {
                this.showConfirm()
            }

        },
        openDetail:function (date) {
            localStorage.setItem("detail",JSON.stringify(date))
            window.location.href = "./html/detail.html"
        },
        getCityList:function () {
            var _this = this;
            var ua = window.navigator.userAgent;
            var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;
            if(isSafari){
                alert("safari用户请关闭无痕浏览之后查看");
            }
            if(localStorage.getItem("citysData")){
                var cityData =JSON.parse(localStorage.getItem("citysData"));
                _this.cityList =cityData ;
                _this.getLocalCity();
            }else {
                $.ajax({
                    url: getAreaId,
                    dataType: "json",
                    type: 'GET',
                    data: {},
                    success: function (ret) {
                        localStorage.setItem("citysData", JSON.stringify(ret.region));
                        _this.cityList = ret.region;
                        _this.getLocalCity();
                    }
                })
            }
        },
        getLocalCity:function () {
            var geolocation = new BMap.Geolocation();
            var gc = new BMap.Geocoder();
            var _this = this;

            if(localStorage.getItem("localCity")!=undefined){
                $("#city").text(JSON.parse(localStorage.getItem("localCity")).name);
                _this.cityCode = JSON.parse(localStorage.getItem("localCity")).code;
                _this.getIndexList();
            }else{
                geolocation.getCurrentPosition( function(r) {

                        //定位结果对象会传递给r变量
                        if(this.getStatus() == BMAP_STATUS_SUCCESS)
                        {  //通过Geolocation类的getStatus()可以判断是否成功定位。
                            var pt = r.point;
                            gc.getLocation(pt, function(rs){
                                //定位的城市

                                var addComp = rs.addressComponents;
                                var newCityName;
                                //如果是省就取市 是直辖市就取区县
                                    if(addComp.province.indexOf("省")==0){
                                            newCityName = addComp.city;
                                    }else if(addComp.province.indexOf("市")==0){
                                            newCityName = addComp.district;
                                    }else {
                                            newCityName = addComp.district;
                                    }

                                $("#city").text(newCityName);
                                var allResult={};
                                for (var i = 0; i <_this.cityList.length; i++) {
                                    for (var j = 0; j < _this.cityList[i].state.length; j++) {
                                        allResult[_this.cityList[i].state[j].name] = _this.cityList[i].state[j];
                                    }
                                }
                                var localCityDate = allResult[newCityName];
                                 localStorage.setItem("localCity",JSON.stringify(localCityDate));//定位的地点数据
                                _this.cityCode = localCityDate.code;

                                _this.getIndexList();
                            });
                        }
                        else
                        {
                            _this.cityCode = 35;
                            $("#city").text("北京");
                            //关于状态码
                            //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
                            //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
                            //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
                            //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
                            //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
                            //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
                            //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
                            //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
                            //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
                            switch( this.getStatus() )
                            {
                                case 2:
                                    alert( '位置结果未知 获取位置失败.' );
                                    break;
                                case 3:
                                    alert( '导航结果未知 获取位置失败..' );
                                    break;
                                case 4:
                                    alert( '非法密钥 获取位置失败.' );
                                    break;
                                case 5:
                                    alert( '对不起,非法请求位置  获取位置失败.' );
                                    break;
                                case 6:
                                    alert( '对不起,当前 没有权限 获取位置失败.' );
                                    break;
                                case 7:
                                    alert( '对不起,服务不可用 获取位置失败.' );
                                    break;
                                case 8:
                                    alert( '对不起,请求超时 获取位置失败.' );
                                    break;

                            }
                        }

                    },
                    {enableHighAccuracy: true}
                )
            }

        },
        openXcd:function () {
            if(localStorage.getItem("user")){
                window.location.href = "./html/xcd.html"
            }else {
                this.showConfirm()
            }
        },
        openShopCar:function () {
            if(localStorage.getItem("user")){
                window.location.href = "./html/shopCar.html"
            }else {
                this.showConfirm()
            }
        },
        openUser:function () {
            if(localStorage.getItem("user")){
                window.location.href = "./html/user.html"
            }else {
                this.showConfirm()
            }
        },
        showConfirm:function () {
            var r = confirm("您当前未登录，是否前往登录页？");
            if(r == true){
                window.location.href = "./html/login.html";
            }else{

            }
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
