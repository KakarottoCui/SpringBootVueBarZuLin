import Vue from 'vue'
import axios from 'axios'

const baseUrl = 'http://localhost:9091/NmCar';

const urlMap = {
  login: baseUrl + '/login',
  logout: baseUrl + '/logout',
  loginCheck: baseUrl + '/getUserInfo',
  getUserData: baseUrl + '/getUserData',
  uploadFile: baseUrl + '/uploadFile',
  regist: baseUrl + '/regist',

  findNmCarList:baseUrl + '/nmCar/queryList',
  findNmCar: baseUrl+ '/nmCar/queryObject',
  addNmCar: baseUrl + '/nmCar/addNmCar',
  editNmCar: baseUrl + '/nmCar/editNmCar',

  findNmCarGroupList: baseUrl + '/nmCarGroup/queryList',
  findNmCarGroup: baseUrl + '/nmCarGroup/queryObject',
  addNmCarGroup: baseUrl + '/nmCarGroup/addNmCarGroup',
  editNmCarGroup: baseUrl + '/nmCarGroup/editNmCarGroup',

  findSysCarouselList: baseUrl + '/sysCarousel/queryList',
  findSysCarousel: baseUrl + '/sysCarousel/queryObject',
  addSysCarousel: baseUrl + '/sysCarousel/addSysCarousel',
  editSysCarousel: baseUrl + '/sysCarousel/editSysCarousel',

  findNmCarCartList:baseUrl + '/nmCarCart/queryList',
  findNmCarCart: baseUrl+ '/nmCarCart/queryObject',
  addNmCarCart: baseUrl + '/nmCarCart/addNmCarCart',
  editNmCarCart: baseUrl + '/nmCarCart/editNmCarCart',

  findNmCarOrderList:baseUrl + '/nmCarOrder/queryList',
  findNmCarOrder: baseUrl+ '/nmCarOrder/queryObject',
  addNmCarOrder: baseUrl + '/nmCarOrder/addNmCarOrder',
  editNmCarOrder: baseUrl + '/nmCarOrder/editNmCarOrder',

  findNmCarCommentList: baseUrl + '/nmCarComment/queryList',
  findNmCarComment: baseUrl+ '/nmCarComment/queryObject',
  addNmCarComment: baseUrl + '/nmCarComment/addNmCarComment',
  editNmCarComment: baseUrl + '/nmCarComment/editNmCarComment',

  findSysNoticeList: baseUrl + '/sysNotice/queryList',
  findSysNotice: baseUrl+ '/sysNotice/queryObject',
  addSysNotice: baseUrl + '/sysNotice/addSysNotice',
  editSysNotice: baseUrl + '/sysNotice/editSysNotice',

  getPic : baseUrl + "/getFile/0/",
  getAudio : baseUrl + "/getFile/1/",
  localPic: baseUrl + "/static/img/"
}

const request = function(requestOpt) {
  let loading;
  try {
    requestOpt = requestOpt || {};
    if (!requestOpt.url) {
      return;
    }
    var token = '';
    try {
      let value = localStorage.getItem('userInfo');
      if (value) {
        value = JSON.parse(value);
        token = value.token;
      }
    } catch (e) {
      token = '';
    }
    requestOpt.data = requestOpt.data || {};
    requestOpt.data['token'] = token;
    requestOpt.method = requestOpt.method || 'post';
    requestOpt.headers = requestOpt.headers || {
      //'content-type': 'application/x-www-form-urlencoded',
      'token': token
    };
    requestOpt.timeout = requestOpt.timeout || 30000;
    requestOpt.responseType = requestOpt.responseType || 'text';
    requestOpt.dataType = requestOpt.dataType || 'json';
    requestOpt.sslVerify = requestOpt.sslVerify || true;
    requestOpt.success = requestOpt.success || function(res) {};
    requestOpt.fail = requestOpt.fail || function(res) {};
    requestOpt.complete = requestOpt.complete || function(res) {};

    loading = Vue.prototype.$baseLoading();
    axios({
      method: requestOpt.method,
      url: requestOpt.url,
      headers: requestOpt.headers,
      data: requestOpt.data
    }).then(function(response) {
      loading.close();
      requestOpt.success(response);
      if (response.data.code == 401) {
        Vue.prototype.$baseMessage('未登录')
        localStorage.removeItem('user');
      }
    }).catch(function(error) {
      loading.close();
      requestOpt.fail(error);
    });
  } catch (e) {
    //TODO handle the exception
    loading.close();
    Vue.prototype.$baseMessage('网络请求异常')
  }
}

const getUrlParam = function(name) {
  var params = {}; // 存放参数的对象
  window.location.href.replace(/[?&]([^=#]+)=([^&#]*)/g, function (match, key, value) {
      params[key] = decodeURIComponent(value); // 将参数值进行解码
  });
	if (params[name]) {
		return params[name];
	}
	return null;
}

const getUserInfo = function(){
	let user = localStorage.getItem("userInfo");
	if(user){
		return JSON.parse(user);
	}else{
		err("登录过期，请重新登录");
		localStorage.removeItem("userInfo");
    return null;
	}
}

const msg = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const err = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const warn = function(msg){
	Vue.prototype.$baseMessage(msg)
}

const success = function(msg){
	Vue.prototype.$baseMessage(msg)
}

export default {
  request,
  baseUrl,
  urlMap,
  msg,
  err,
  warn,
  success,
  getUrlParam,
  getUserInfo
}
