/**
 * Created by Administrator on 2017/4/17.
 */
var vm = new Vue({
    el:"#app",
    data:{
        collectGood:[],
        selectedGoods:[],
        selectedGoods1:[],
        selectedGoods2:[],
        selectedGoods3:[],
        selectedGoods4:[],
        listIndex:'',
        newList:[],
        travelList:[],
        phone:'',
        name:'',
        fee:0,
        time:''
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getColletGood();
        })
    },
    filters:{

    },
    methods:{
        getColletGood:function () {
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
                                var width =domWidth*0.48;
                                var height = 140;
                                var obj = getImgSizeBySize(url,width,height);
                                ret.good[i].style = obj.style;
                            }
                            _this.collectGood = ret.good;
                            console.log(localStorage.getItem("collectGood"))
                        }
                    })
            }else {
                _this.showConfirm()
            }

        },
        shadeShow:function (index) {
            this.listIndex = index;

            //localStorage.setItem("listIndex",index);
            document.getElementById('shade').style.display="block";
            document.body.style.overflow = "hidden";
            document.getElementById('popUpbox').style.display="block";
        },
        hideBox:function () {
            document.getElementById('shade').style.display="none";
            document.getElementById('popUpbox').style.display="none";
            document.body.style.overflow = "visible";
        },
        selectGood:function (data,index) {
          //  var boxId = "newList"+index;

             var travelPage = {};
             travelPage.gid = data.id;
             travelPage.num = data.num;
             travelPage.type = data.type;

                for(var i = 0; i < this.newList.length;i++){
                    if(data.id ==this.newList[i]){
                        alert("不能重复选择!");
                        return false;
                    }
                }
                var ListIndex = this.listIndex;
                if(ListIndex==1){
                    this.newList.push(data.id);
                    this.selectedGoods.push(data);
                }else if(ListIndex==2){
                    this.newList.push(data.id);
                    this.selectedGoods1.push(data);
                }else if(ListIndex==3){
                    this.newList.push(data.id);
                    this.selectedGoods2.push(data);
                }else if(ListIndex==4){
                    this.newList.push(data.id);
                    this.selectedGoods3.push(data);
                }else if(ListIndex==5){
                    this.newList.push(data.id);
                    this.selectedGoods4.push(data);
                }
                this.fee= this.fee + parseInt(data.price);
                this.travelList.push(travelPage);
           // this.selectedGoods = newList;
            this.hideBox();
        },
        postList:function () {
            // console.log(JSON.stringify(JSON.stringify(this.travelList)))
            var _this = this;
            var user = JSON.parse(localStorage.getItem("user"));
            _this.time=localStorage.getItem("BGtime");
            $.ajax({
                url:  submitUserJoureny,
                dataType:"json",
                type:'GET',
                data:{
                    journerysJsonList:JSON.stringify(this.travelList),
                    phone:_this.phone,
                    name:_this.name,
                    fee:_this.fee,
                    token:user.user.token,
                    startDate:_this.time
                },
                success:function (ret) {
                    if(ret.success ==true){
                        alert("保存成功！");
                        window.location.href="./xcd.html";
                    }else{
                        alert("出错了~~")
                    }
                    console.log(JSON.stringify(ret));
                }
            })
        }
    }
});