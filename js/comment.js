/**
 * Created by Administrator on 2017/4/22.
 */
var vm = new Vue({
    el:"#app",
    data:{
        comment:''
    },
    mounted:function () {
      this.$nextTick(function () {
            this.getComment();
      })
    },
    methods:{
        getComment:function () {
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
                        for(var i=0;i<ret.data.length;i++){
                            ret.data[i].ctime = formatTimeToDate( ret.data[i].ctime)
                        }
                        _this.comment = ret.data;

                    }
            })
        }
    }
})