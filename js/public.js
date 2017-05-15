// public static int type_eat = 5;//吃
//
// public static int type_do = 1;//行
//
// public static int type_live = 2;//住
//
// public  static int type_play = 3;//景点
//
// public static int type_other = 4;//购物

var serverUrl = "http://182.92.191.75:20002";
 serverUrl = "http://youren.paifangwang.com.cn";

//注册相关接口
var registerUrl = serverUrl+"/user/register";
var createAuthCodeUrl = serverUrl+"/user/createAuthCode";
var loginUrl = serverUrl+"/user/login";
//index页
var indexBannerUrl = serverUrl + "/banner/getBanner";//获取首页轮播图
var getAreaId= serverUrl + "/area/getAreaList";
var indexGoodListUrl = serverUrl + "/good/getAllListByPhone";//获取首页商品列表 传areaId type _pager size isHot
var addShoopCarUrl = serverUrl +"/good/addUserCar";//加入购物车 gid 和 num 首页默认1
var getShpoopCarDataUrl = serverUrl + "/good/getAllUserCar";//获取购物车里的所有数据
var colletGoodUrl = serverUrl + "/user/collectGood";//收藏 传gid
var getColletGoodUrl = serverUrl + "/user/getAllCollect";//获取所有收藏
var submitUserJoureny = serverUrl + "/journery/addUserJournery";//保存行程 传 jourenysJsonList name phone fee
var getAllUserJoureny = serverUrl + "/journery/getAllUserJournery";//获取行程
var getCommentListUrl = serverUrl + "/comment/getComment";//获取评论 gid 和_pager
var searchUrl = serverUrl+"/good/search";
var allListUrl = serverUrl+"/good/getAllListByPhoneType";
//
//个人中心
var cartsKey = 'carts';
var path_shopCity="fs://fangzhibo/shoCity.json";
var domWidth = document.body.offsetWidth;
//打开新页

function openNewWindow(url,params){
    var text = "";
    if(isNotBlack(params)){
        text ="?";
        for(var key in params){
            text = text+key+"="+params[key]+"&"
        }
    }
    if(url.indexOf('login.html') == -1){
        location.href =url+text;
    }else{
        location.href = url+text;
    }

}
//加入购物车
function addCar(id){
	var user = getUserInfo();
	if(user){
        var obj = {
            gid:id,
            num:1
        }
        ajaxGet(addShoopCarUrl,obj,function(ret,err){
            if(ret){
                if(ret.success == true){
                    alert('已加入购物车')
                }
            }else{

            }
        })
	}else{
        alert("您还没有登录，请登录！")
	}

}

//收藏
function colletGood (id){
    var user = getUserInfo();
    if(user){
        ajaxGet(colletGoodUrl,{gid:id},function(ret,err){
            if(ret){
                if(ret.success == true){
                    alert('已收藏')
                }
            }else{
            }
        })
	}else{
        alert("您还没有登录，请登录！")
    }

}
$('#selectBtn').on('click',function(){
    $.areaSelect();
})
function checkLogin(){
    var user = getUserInfo()
    if(user){
        $("#welcom").hide();
    }else{
        $("#welcom").show();
    }
}
function checkLogin(){
	var user = getUserInfo();
	if(user){
		$("#welcom").hide();
	}else{
        $("#welcom").show();
    }
}
$("#goout").click(function(){
	localStorage.removeItem('user')
	window.location.reload()
})
$(function(){
    if(localStorage.getItem('lastCode')){
        var lastCode = localStorage.getItem('lastCode');
        var cityName = localStorage.getItem('cityName')
        $('.cityname').html(cityName)
    }else{
        var cityName = '北京';
        $('.cityname').html('北京')
    }
});
function setUserInfo(user){
    localStorage.setItem('user',JSON.stringify(user));
}
function getUserInfo(){
    var user = localStorage.getItem('user');
    if(isNotBlack(user)){
        return JSON.parse(user);
    }else{

    }
}
function ajaxGetVitorer(url,getData,callback,err){
    var data = getData;
    ajax(url,data,false,'post',callback,err);
}
function ajaxGet(url,getData,callback,err){
    var user = getUserInfo();
    getData.token = user.user.token;
    ajax(url,getData,false,'post',callback,err);
}
function ajax(url,data,sync,dataType,callback,err){
    if(isBlack(url)){
        alert('你没有传url');
        return;
    }
    data = data || {};

    $.ajax({
        url:url,
        type:"post",
        async:sync,
        data:data,
        dataType:"json",
        success:function(data){
            if(data || data ==0){
                if(isFunction(callback)){
                    callback(data);
                }
            }else {
                if(isFunction(err)){
                    err();
                }else{
                    alert('当前网络不给力');
                }
            }
        },
        error:function(){
            if(isFunction(err)){
                err();
            }else{
                alert('当前网络不给力');
            }
        }
    })
}
//获取图片真实尺寸
function getImageRealSize(url){
    if(url.startWith("http")){
        if(url.indexOf("/guoguo/") != (-1)){
            var s1=url.split("store.quakoo.com/storage/guoguo/");
        }else if(url.indexOf("/fangpai/") != (-1)){
            var s1=url.split("store.paifangwang.com.cn/storage/fangpai/");
        }
        var group=s1[1].split("*");
        var orgWidth=parseFloat(group[0]);
        var orgHeight=parseFloat(group[1]);
        var obj ={w:orgWidth,h:orgHeight};
        return obj;
    }
}
function getHeightFromWidth(realWidth,realHeight,thumWidth){
    var thumHeight = Math.round((thumWidth/realWidth)*realHeight);//显示宽度除以图片真实宽度 乘以 图片真实高度
    return thumHeight;
}
//截取照片
function getImgSizeBySize(url,showWidth,showHieght){
    var realSize = getImageRealSize(url);
    var thumSize = {w:showWidth,h:showHieght};
    var h = getHeightFromWidth(realSize.w,realSize.h,thumSize.w);

    //判断高度是否超出；大于，图片不够显示，截左右
    if(thumSize.h > h){
        var w = getHeightFromWidth(realSize.h,realSize.w,thumSize.h);//肯定超出去
        var over = 0-Math.round((w - thumSize.w)/2);//左右截取
        //margin-left: 17px;margin-right: 17px
        var obj = {style:"margin-left:"+over+"px"+"; margin-right:"+over+"px;height:"+showHieght+"px"};
        //var obj={over:over,type:1}
        return obj;
    }else{
        var over =  0-Math.round((h - thumSize.h)/2);
        var obj = {style:"margin-top:"+over+"px"+";margin-bottom:"+over+"px;width:"+showWidth+"px"};
        // var obj={over:over,type:2}
        return obj;
    }

}
function isBlack(data) {
    return (data == "" || typeof(data)  == "undefined" || data == null || isNullJson(data)) ? true : false;
}

function checkMobileNum(mobileNum){
    if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobileNum))){
        return false;
    }
    return true;
}
function  isNullJson(obj) {
    return isJson(obj) && JSON.stringify(obj) == '{}';
}
function isJson(obj) {
    return typeof(obj) == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}
//将商品添加到购物车
function addToCarts(obj,mallId,mallName){
	getItem(cartsKey,function(ret,err){
		if(ret.status){
			var carts;
			if(isNotBlack(ret.data)){
				carts = JSON.parse(ret.data);
				var mallIdIndex = -1;
				for(var i = 0;i < carts.length;i++){
					if(carts[i].mallId == mallId){
						mallIdIndex = i;
						for(var n = 0;n < carts[i].list.length;n++){
							if(obj.id == carts[i].list[n].id){
								api.toast({
								    msg: "商品已添加至购物车！",
								    duration:2000,
								    location: 'bottom'
								});
								return;
							}
						}
					}
				}
			}else{
				carts = [];
			}

			if(mallIdIndex >= 0){
				carts[mallIdIndex].list.push(obj);
			}else{
				var cart = {};
				cart.mallId = mallId;
				cart.mallName = mallName;
				cart.list = [];
				cart.list.push(obj);
				carts.push(cart);
			}

			setItem(cartsKey,JSON.stringify(carts),function(ret){
				api.toast({
				    msg: "添加购物车成功！",
				    duration:2000,
				    location: 'bottom'
				});
			});
		}else{
//			alert(err)
			api.toast({
			    msg: err.msg,
			    duration:2000,
			    location: 'bottom'
			});
		}
	});
}

//========系统级别的公共方法（结束）==========





//========首页的公共方法（开始）==========
function setLocalFunctionPorts(result){
    var cacheKey = createCacheKey(functionportUrl, {});
    setItem(cacheKey, JSON.stringify(result));
}

function getLocalFunctionPorts(callBackOnGetData){
    var cacheKey = createCacheKey(functionportUrl, {});
    getItem(cacheKey, function (ret, err) {
        var storageStr = "{}";
        if (isNotBlack(ret.data)) {
            storageStr = ret.data;
        }
        var value = JSON.parse(storageStr);
        if (isBlack(value)) {
            callBackOnGetData({});
        } else {
            callBackOnGetData(value);
        }
    });
}

//========首页的公共方法（结束）==========
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
				? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
};




//========相册的公共方法（开始）==========
//打开用户列表
//if(type==0){
//    titleDiv.innerHTML="相册访客";
//}else if(type==1){
//    titleDiv.innerHTML="相册赞过的人";
//}else if(type=2){
//    titleDiv.innerHTML="最近浏览过的人";
//}else if(type==3){
//    titleDiv.innerHTML="最近赞过的人";
//}
function openAlbumUserList(type,id){
    openNewWindow("userList","./userList.html",{type:type,id:id},{reload:true});
}

//========相册的公共方法（结束）==========



//===========打开聊天=======
function openChat(type,thirdId,thirdNick){
	openNewWindow("chat"+type+"_"+thirdId,"../message/chat.html",{type:type,thirdId:thirdId,thirdNick:thirdNick});
}

var selectData = [{value: '2',
					text: '无'
 					},{value: '1',
						text: '有'
					}];


var sexData = [{value: '1',
					text: '男'
					},{value: '2',
					text: '女'
				}];
var ageData = [{"text":1,"value":1},{"text":2,"value":2},{"text":3,"value":3},{"text":4,"value":4},{"text":5,"value":5},{"text":6,"value":6},{"text":7,"value":7},{"text":8,"value":8},{"text":9,"value":9},{"text":10,"value":10},{"text":11,"value":11},{"text":12,"value":12},{"text":13,"value":13},{"text":14,"value":14},{"text":15,"value":15},{"text":16,"value":16},{"text":17,"value":17},{"text":18,"value":18},{"text":19,"value":19},{"text":20,"value":20},{"text":21,"value":21},{"text":22,"value":22},{"text":23,"value":23},{"text":24,"value":24},{"text":25,"value":25},{"text":26,"value":26},{"text":27,"value":27},{"text":28,"value":28},{"text":29,"value":29},{"text":30,"value":30},{"text":31,"value":31},{"text":32,"value":32},{"text":33,"value":33},{"text":34,"value":34},{"text":35,"value":35},{"text":36,"value":36},{"text":37,"value":37},{"text":38,"value":38},{"text":39,"value":39},{"text":40,"value":40},{"text":41,"value":41},{"text":42,"value":42},{"text":43,"value":43},{"text":44,"value":44},{"text":45,"value":45},{"text":46,"value":46},{"text":47,"value":47},{"text":48,"value":48},{"text":49,"value":49},{"text":50,"value":50},{"text":51,"value":51},{"text":52,"value":52},{"text":53,"value":53},{"text":54,"value":54},{"text":55,"value":55},{"text":56,"value":56},{"text":57,"value":57},{"text":58,"value":58},{"text":59,"value":59},{"text":60,"value":60},{"text":61,"value":61},{"text":62,"value":62},{"text":63,"value":63},{"text":64,"value":64},{"text":65,"value":65},{"text":66,"value":66},{"text":67,"value":67},{"text":68,"value":68},{"text":69,"value":69},{"text":70,"value":70},{"text":71,"value":71},{"text":72,"value":72},{"text":73,"value":73},{"text":74,"value":74},{"text":75,"value":75},{"text":76,"value":76},{"text":77,"value":77},{"text":78,"value":78},{"text":79,"value":79},{"text":80,"value":80},{"text":81,"value":81},{"text":82,"value":82},{"text":83,"value":83},{"text":84,"value":84},{"text":85,"value":85},{"text":86,"value":86},{"text":87,"value":87},{"text":88,"value":88},{"text":89,"value":89},{"text":90,"value":90},{"text":91,"value":91},{"text":92,"value":92},{"text":93,"value":93},{"text":94,"value":94},{"text":95,"value":95},{"text":96,"value":96},{"text":97,"value":97},{"text":98,"value":98},{"text":99,"value":99},{"text":100,"value":100}]

function isNotBlack(data) {
	return (data == "" || typeof(data)  == "undefined"|| data == null || isNullJson(data)) ? false : true;
}

function isNullJson(obj) {
	return isJson(obj) && JSON.stringify(obj) == '{}';
}

function isJson(obj) {
	return typeof(obj) == "object" &&
		Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}


function isBlack(data) {
	return (data == "" || typeof(data)  == "undefined" || data == null || isNullJson(data)) ? true : false;
}


//检查是否是数字
function isNum(num){
	if(!(/^\d*$/.test(num))){
		return false;
	}
	return true;
}
//检查手机号码
function checkMobileNum(mobileNum){
    if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobileNum))){
        return false;
    }
    return true;
}

function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

function isFunction(func) {
	if (typeof(func) == "function") {
		return true;
	}
	return false;
}



var rotateLeft = function(lValue, iShiftBits) {
	return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

var addUnsigned = function(lX, lY) {
	var lX4, lY4, lX8, lY8, lResult;
	lX8 = (lX & 0x80000000);
	lY8 = (lY & 0x80000000);
	lX4 = (lX & 0x40000000);
	lY4 = (lY & 0x40000000);
	lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
	if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
	if (lX4 | lY4) {
		if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
		else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
	} else {
		return (lResult ^ lX8 ^ lY8);
	}
}

var F = function(x, y, z) {
	return (x & y) | ((~ x) & z);
}

var G = function(x, y, z) {
	return (x & z) | (y & (~ z));
}

var H = function(x, y, z) {
	return (x ^ y ^ z);
}

var I = function(x, y, z) {
	return (y ^ (x | (~ z)));
}

var FF = function(a, b, c, d, x, s, ac) {
	a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
	return addUnsigned(rotateLeft(a, s), b);
};

var GG = function(a, b, c, d, x, s, ac) {
	a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
	return addUnsigned(rotateLeft(a, s), b);
};

var HH = function(a, b, c, d, x, s, ac) {
	a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
	return addUnsigned(rotateLeft(a, s), b);
};

var II = function(a, b, c, d, x, s, ac) {
	a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
	return addUnsigned(rotateLeft(a, s), b);
};

var convertToWordArray = function(string) {
	var lWordCount;
	var lMessageLength = string.length;
	var lNumberOfWordsTempOne = lMessageLength + 8;
	var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
	var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
	var lWordArray = Array(lNumberOfWords - 1);
	var lBytePosition = 0;
	var lByteCount = 0;
	while (lByteCount < lMessageLength) {
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
		lByteCount++;
	}
	lWordCount = (lByteCount - (lByteCount % 4)) / 4;
	lBytePosition = (lByteCount % 4) * 8;
	lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
	lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
	lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
	return lWordArray;
};

var wordToHex = function(lValue) {
	var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
	for (lCount = 0; lCount <= 3; lCount++) {
		lByte = (lValue >>> (lCount * 8)) & 255;
		WordToHexValueTemp = "0" + lByte.toString(16);
		WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
	}
	return WordToHexValue;
};

var uTF8Encode = function(string) {
	string = string.replace(/\x0d\x0a/g, "\x0a");
	var output = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			output += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			output += String.fromCharCode((c >> 6) | 192);
			output += String.fromCharCode((c & 63) | 128);
		} else {
			output += String.fromCharCode((c >> 12) | 224);
			output += String.fromCharCode(((c >> 6) & 63) | 128);
			output += String.fromCharCode((c & 63) | 128);
		}
	}
	return output;
};

function base64_encode(str) {
	var c1, c2, c3;
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i = 0, len = str.length, string = '';

	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt((c1 & 0x3) << 4);
			string += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt((c2 & 0xF) << 2);
			string += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		string += base64EncodeChars.charAt(c1 >> 2);
		string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		string += base64EncodeChars.charAt(c3 & 0x3F)
	}
	return string
}

function base64_decode(str) {
	var c1, c2, c3, c4;
	var base64DecodeChars = new Array(
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
		58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
		7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
		37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
		-1, -1
	);
	var i = 0, len = str.length, string = '';

	while (i < len) {
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
		} while (
		i < len && c1 == -1
			);

		if (c1 == -1) break;

		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
		} while (
		i < len && c2 == -1
			);

		if (c2 == -1) break;

		string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 == 61)
				return string;

			c3 = base64DecodeChars[c3]
		} while (
		i < len && c3 == -1
			);

		if (c3 == -1) break;

		string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 == 61) return string;
			c4 = base64DecodeChars[c4]
		} while (
		i < len && c4 == -1
			);

		if (c4 == -1) break;

		string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
	}
	return string;
}




//显示数据

function showValue(id,data){
	if(isBlack(document.getElementById(id))){
		return;
	}
	if(isBlack(data)){
		return;
	}
	var imgList = document.getElementById(id).querySelectorAll("*[data-type]");
	for(var i= 0;i<imgList.length;i++){
		var img = imgList[i];
		var id = img.getAttribute("id");

		if(!document.getElementById(id)){
			return;
		}
		if(img.getAttribute("data-type") == 'show-image'){
			document.getElementById(id).src = data[id];
		}else if(img.getAttribute("data-type") == 'show-value'){
			document.getElementById(id).value = data[id];
		}else if(img.getAttribute("data-type") == 'show-inner'){
			document.getElementById(id).innerHTML = data[id];
		}
	}
}

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};
var formatTimeToDate = function(time){
    return new Date(time).format("yyyy-MM-dd hh:mm");
};