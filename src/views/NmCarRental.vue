<template>

  <div id="app">
    <div class="top-bar bg-white">
      <div class="top-logo" style="padding-left: calc( 50% - 590px );">
        <img width="50px" height="50px" :src="baseUrl+'/static/img/nuoMi.png'" />
        <div style="padding-left: 10px;">
          <span style="color:#ff9c0a;">糯 </span><span class="text-blue">米 </span><span
            style="color: white;text-stroke: 1px black;">租 车</span>
        </div>
        <div class="v-flex v-c-center" style="padding-left: 50px;line-height: 60px;">
          <el-input placeholder="请输入车辆信息搜索" prefix-icon="el-icon-search" v-model="title"
            @keyup.enter.native="getBookList(0)">
          </el-input>
        </div>
      </div>
      <div class="v-flex v-c-center" style="padding-right: calc( 50% - 590px );">
        <el-avatar size="medium" :src="baseUrl+'/static/img/'+(user?'nuoMi.png':'unknow.png')"></el-avatar>
        <div class=" text-shadow text-blue" style="padding-left: 15px;">
          {{ user? (user.nickName+'['+getUserType(user.type)+']'):'游客' }}
        </div>
        <!--            <div class="text-shadow text-red" style="padding-left: 15px;" @click="showFed=true;">意见反馈</div>-->
      </div>
    </div>

    <div class="tab-list" style="padding-left: calc( 50% - 590px );">
      <div @click="changeTab(index,item)" class="tab-item" :class="(selType==index ? 'tab-sel':'')"
        v-for="(item ,index ) in typeList" :key="index" v-if="index<18">{{item.groupName}}</div>
    </div>

    <div style="width: 1180px;margin-left: calc( 50% - 590px );">
      <div class="l-block-top" style="width: 813px;margin:10px 5px;">
        <div class="bg-white padding-10" style="min-height: calc( 100vh - 160px );margin-left: 0;">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item :label="item.title" v-for="item in carList"
              :key="item.title">
              <div class="medium view-shadow">
                <el-image :src="picPath+item.pic" fit="contain"></el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="text-bold text-15 margin-b"><span class="text-red view-radius-s"
              style="border: 3px solid #f44336;padding:0 5px;">{{ selType ? 'BEST':'NEW'}}</span><span
              class="margin-l">{{ selType?typeList[selType].groupName:'全部车型' }}</span></div>
          <div class="v-flex" style="flex-wrap: wrap;width: 100%;min-height: 616px;overflow-x: hidden;">

            <el-empty v-if="bookList.length ==0" description="暂无数据" style="width: 100%;"></el-empty>

            <div class="v-flex-column v-r-left" v-for="item in bookList"
              style="width: 245px;margin: 8px;">
              <div style="width: 100%;height: 138px;">
                <img :src="picPath+item.pic" width="100%" height="138px" />
              </div>
              <div class="text-12 bookItem margin-t" style="width: 245px;">
                <div class="v-flex v-r-between" style="width: 245px;">
                  <div class="v-flex" style="height: 20px;line-height: 20px;">
                    <div class="margin-r"><el-tag size="mini" effect="dark">{{findTypeName(item.gid)}}</el-tag></div>
                    <div class="margin-r text-bold">{{item.title}}</div>
                  </div>

                  <div class="" style="height: 20px;line-height: 20px;">
                    <span class="text-gray">价格:</span>
                    <span class="text-yellow text-bold margin-l">{{item.price||'/'}}</span>元/天
                  </div>
                </div>
                <div class="v-flex v-r-between margin-t" style="width: 245px;">
                  <div class="margin-r"><span class="text-gray">车型:</span>{{typeNameArr[item.type]}}</div>
                  <div class="margin-r"><span class="text-gray">动力:</span>{{item.powType}}</div>
                  <div class="margin-r"><span class="text-gray">功率:</span>{{item.powNum}}</div>
                </div>
                <div class="v-flex v-r-between margin-t" style="width: 245px;">
                  <div class="margin-r"><span class="text-gray">型号:</span>{{item.modelName}}</div>
                  <div class="margin-r"><span class="text-gray">颜色:</span>{{item.color}}</div>
                  <div class="margin-r"><span class="text-gray">座位:</span>{{item.seatsNum}}</div>
                </div>
                <div class="text-ellipsis-3 margin-t" ><span class="text-gray">简介:</span>{{item.memo}}</div>

                <div class="v-flex v-r-between" style="width: 245px;">

                  <div class="margin-t">

                    <span class="text-gray margin-r">状态:</span>

                    <el-tag size="mini" effect="dark" :type="stateColorNameArr[item.state]">{{stateNameArr[item.state]}}</el-tag>

                  </div>
                  <div class="margin-t">
                      <el-tag @click="listenPage(item.id)" size="mini" type="info">查看详情 > </el-tag>
                  </div>
                </div>

                <!-- <div class=""><span class="text-gray">作者:</span>{{item.cname}}</div>

                <div class=""><span class="text-gray">阅读:</span>{{item.hisNum}}</div> -->
              </div>
            </div>
          </div>
          <div class="v-flex v-r-center">
            <div>
              <span v-if="page!=1" class="padding-10 text-blue hover-green" @click="getBookList(-1)">上一页</span>
              <span class="padding-10">{{page}}</span>
              <span v-if="next" class="padding-10 text-blue hover-green" @click="getBookList(1)">下一页</span>
            </div>

          </div>

        </div>
      </div>
      <div class="l-block-top" style="width: 338px;margin: 10px 5px;">

        <div class="bg-white margin-b padding-20" style="height: 95px;">
          <div v-if="!user" class="v-flex v-c-center v-r-center" style="height: 100%;">
            <el-form label-position="left" label-width="60px" size="mini">
              <el-form-item label="用户名">
                <el-input size="mini" placeholder="请输入用户名" suffix-icon="el-icon-user" v-model="nick">
                </el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input size="mini" placeholder="请输入密码" suffix-icon="el-icon-set-up" type="password" v-model="pass">
                </el-input>
              </el-form-item>
              <div class="v-flex v-r-center">
                <div style="margin-right: 50px;">
                  <el-button size="mini" type="primary" @click="login">登录</el-button>
                </div>
                <el-button @click="resign" size="mini">注册</el-button>
              </div>

            </el-form>
          </div>

          <div v-if="user">
            <div class="v-flex v-r-between padding-10">
              <div class="v-flex v-r-left">
                <el-avatar :src="baseUrl+'/static/img/'+(user?'nuoMi.png':'unknow.png')"></el-avatar>
                <div>
                  <div v-if="user" class="text-shadow text-blue" style="padding-left: 15px;">{{user.nickName}}</div>
                  <div v-if="user" class="text-shadow text-green text-12" style="padding-left: 15px;">
                    {{ getUserType(user.type) }}
                  </div>
                </div>
              </div>
              <div style="line-height: 40px;">
                <div v-if="user" @click="logOut" class="text-shadow text-red text-12">退出登录</div>
              </div>
            </div>
            <div class="v-flex v-r-between padding-10">
              <div class="text-blue" @click="toCart">购物车<span class="padding-l text-yellow"></span></div>
              <div class="text-blue" @click="toOrder">订单中心<span class="padding-l text-yellow"></span></div>
              <div class="text-blue" @click="toNotice">公告中心<span class="padding-l text-yellow"></span></div>
              <div v-if="user.type==1" @click="toManager" class="text-blue">管理中心</div>
              <!--                        <div v-if="user.type==3" @click="jumpManager" class="text-blue">阅读记录</div>-->
              <!--                        <div v-if="user.type==2" @click="jumpManager" class="text-blue">作品管理</div>-->
              <!--                        <div v-if="user.type==1" @click="jumpManager" class="text-blue">后台管理</div>-->
            </div>
          </div>
        </div>
        <div class="bg-white" style="min-height: calc( 100vh - 160px );padding:10px;">
          <div class="text-bold text-15 margin-b"><span class="text-red view-radius-s"
              style="border: 3px solid #f44336;padding:0 5px;">HOT</span><span class="margin-l">最新车型</span></div>
          <div v-if="index<20" @click="listenPage(item.id)" class="border-b list-item" v-for="(item,index) in hotList"
            :kay="index">
            <div>
              <i v-if="item.push==1" class="el-icon-star-on text-red text-middle"></i>
              <i v-else class="el-icon-star-off text-blue text-middle"></i>
              <span :class=" item.push==1 ? 'text-red':'text-blue'">{{item.title}}</span>
            </div>
            <div><span class="text-10"
                :class=" item.push==1 ? 'text-red':'text-yellow'">{{ item.push==1 ?'糯米推荐' :(getTypeName(item.gid))}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="用户注册" :visible.sync="showRe">
      <el-form>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="reNick" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input type="number" v-model="phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="pass1" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" label-width="120px">
          <el-input v-model="pass2" type="password" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRe = false">取 消</el-button>
        <el-button type="primary" @click="resignSub">确 定</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
  import common from '@/utils/commonRequest'

  export default {
    name: 'nmCar',
    data() {
      return {
        user: false,
        showRe: false,
        showFed: false,
        fed: [0, 0, 0, 0],
        userItem: {
          allCollect: [],
          allHis: [],
          allStar: [],
          allBook: []
        },
        carList:[],
        typeList: [],
        selType: 0,
        hotList: [],
        bookList: [],
        title: "",
        dataView: {},
        tableData: [],
        userInfo: {},
        showMapSel: false,
        selObj: {},
        selName: "",
        activeIndex: '1',
        activeIndex2: '1',
        tabText: "",
        text: "",
        nick: "",
        pass: "",
        pushList: [],
        picPath: common.urlMap.getPic,
        reNick: '',
        phone:'',
        pass1: "",
        pass2: "",
        commentText: '',
        page: 1,
        limit: 9,
        next: true,
        baseUrl:common.baseUrl,
        typeNameArr:['轿车','SUV','MPV','微面'],
        stateNameArr:['未发布','可用','出租中'],
        stateColorNameArr:['danger','success','danger'],
      }
    },
    created() {
      this.text = "";
      this.getGroupList();
      this.getTopBar();
      this.getCarousel();
      this.user = common.getUserInfo();
    },
    mounted() {

    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      toTips(){

      },
      changeTab(index, item) {
        this.selType = index;
        this.getBookList(0);
      },
      getUserType(type) {
        switch (type) {
          case 1:
            return "管理员";
            break;
          case 2:
            return "用户";
            break;
          case 3:
            return "游客";
            break;
        }
      },
      getGroupList() {

        let _this = this;
        common.request({
          data: {
            validFlag: 1
          },
          url: common.urlMap.findNmCarGroupList,
          success: function(res) {
            if (res.data.code == 200) {
              _this.typeList = res.data.data;
              _this.typeList.unshift({
                groupName: "首页"
              });
              _this.getBookList(0);
              _this.getHotBookList();
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
      },
      login() {
        if (this.nick == "" || this.pass == "") {
          common.err("请填写用户ID和密码");
          return;
        }
        let _this = this;
        common.request({
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            nick: _this.nick,
            pass: window.btoa(_this.pass)
          },
          url: common.urlMap.login,
          success: function(res) {
            if (res.data.code == 200) {
              try {
                _this.user = res.data.data;
                _this.getUserData();
                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                _this.getUserData();
              } catch (e) {
                _this.user = "";
                localStorage.removeItem("userInfo");
              }
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })

      },
      getUserData() {
        let _this = this;
        common.request({
          loading: false,
          url: common.urlMap.getUserData,
          success: function(res) {
            if (res.data.code == 200) {
              if (res.data.data) {
                _this.userItem = res.data.data;
              }
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
      },
      logOut() {
        localStorage.removeItem("userInfo");
        this.user = false;
        common.request({
          url: common.urlMap.logout
        });
      },
      jumpManager() {
        location.href = "./view/manager/myInfo.html";
      },
      getTopBar() {
        let _this = this;
        common.request({
          data: {
            push: 1,
            validFlag: 1
          },
          url: common.urlMap.findNmCarList,
          success: function(res) {
            if (res.data.code == 200) {
              _this.pushList = res.data.data;
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
      },
      getHotBookList() {
        let _this = this;
        common.request({
          data: {
            validFlag: 1
          },
          url: common.urlMap.findNmCarList,
          success: function(res) {
            if (res.data.code == 200) {
              _this.hotList = res.data.data.sort(function(a, b) {
                return b.push - a.push;
              });
            } else {
              common.err(res.data.msg);
            }
          }
        })
      },
      getBookList(num) {
        this.page = num == 0 ? 1 : (this.page + num);
        this.next = true;
        let _this = this;
        let gid = this.typeList[this.selType].id;
        common.request({
          data: {
            gid: gid ? gid : "",
            validFlag: 1,
            title: this.title,
            page: this.page,
            limit: this.limit
          },
          url: common.urlMap.findNmCarList,
          success: function(res) {
            if (res.data.code == 200) {
              if (res.data.data.length < _this.limit && _this.page > 1) {
                common.msg("已是最后一页了");
                _this.next = false;
              }
              if (res.data.data.length < _this.limit && _this.page == 1) {
                _this.next = false;
              }

              _this.bookList = res.data.data;
              // if(!gid){
              //     _this.hotList = _this.bookList.sort(function(a,b){
              //         return b.push - a.push;
              //     });
              // }
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
      },
      getTypeName(typeId) {
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].id == typeId) {
            return this.typeList[i].groupName;
          }
        }
        return "";
      },
      getCarousel(){
        let _this = this;
        common.request({
          data: {
            validFlag: 1
          },
          url: common.urlMap.findSysCarouselList,
          success: function(res) {
            if (res.data.code == 200) {
              _this.carList = res.data.data;
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        });
      },
      listenPage(id) {
        window.location.href = "#/carInfo?id="+id;
      },
      resign() {
        this.reNick = "";
        this.pass1 = "";
        this.pass2 = "";
        this.showRe = true;
      },
      findTypeName(gid){
          var name = "";
          this.typeList.map(function(item,index,arr){
            if(!name && item.id == gid){
              name = item.groupName;
            }
          })
          return name??"未知";
      },
      toCart(){
        window.open("#/cart")
      },
      toOrder(){
        window.open("#/myOrder")
      },
      toManager(){
        window.open("#/index")
      },
      toNotice(){
        window.open("#/notice")
      },
      resignSub() {
        this.reNick = this.reNick.replace(/\s/g, "");

        if (!this.reNick || !this.pass1 || !this.pass2) {
          common.err("请填写完整");
          return;
        }

        if(this.phone < 10000000000){
          common.err("手机号不正确");
          return;
        }

        if (this.reNick.length < 3 || this.reNick.length > 8) {
          common.err("用户名长度应为3-8位");
          return;
        }
        // var patt = new RegExp(/[a-zA-Z\u4e00-\u9fa5]+/);
        // if (!patt.test(this.reNick)) {
        //   common.err("用户名至少应包含一个字母或者汉字");
        //   return;
        // }

        if (this.pass1 != this.pass2) {
          common.err("两次密码不一致");
          return;
        }

        if (this.pass1.length > 12 || this.pass1.length < 6) {
          common.err("密码长度应为6-12位");
          return;
        }
        // var patt2 = new RegExp(/[a-zA-Z]+/);
        // if (!patt2.test(this.pass1)) {
        //   common.err("密码必须包含字母");
        //   return;
        // }

        let data = {
          nickName: this.reNick,
          password: btoa(this.pass1),
          phone:this.phone,
          validFlag: 1,
          type: 2,
          pic: 'nuoMi.png'
        }
        let _this = this;
        let gid = this.typeList[this.selType].id;
        common.request({
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            data: JSON.stringify(data)
          },
          url: common.urlMap.regist,
          success: function(res) {
            if (res.data.code == 200) {
              common.msg("注册成功，请登录");
              _this.showRe = false;
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })

      }
    },
  }
</script>

<style lang="scss">
  @import url("../styles/nmMain.css");

  body {
    background-color: #f3f3f3;
  }
  .tab-item:hover {
    background-color: #3f80de;
  }
  .tab-item {
    padding: 15px;
    color: white;
  }
  .tab-sel {
    background-color: #3f80de;
  }
  .tab-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #409EFF;
  }
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  .top-logo {
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #E6A23C;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }
  .bookItem {
    width: 100%;
    height: 148px;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    height: 24px;
  }
  .el-carousel__item div {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .el-form-item--mini {
    margin-bottom: 10px !important;
  }
  .text-shadow {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  .text-white {
    color: white;
  }
  .text-black {
    color: #0c0c0c;
  }
  .text-red {
    color: #f44336;
  }
  .text-blue {
    color: #409EFF;
  }
  .text-green {
    color: #63a35c;
  }
  .text-yellow {
    color: #f6ad55;
  }
  .text-gray {
    color: #909399;
  }
  .text-light {
    color: lightgrey;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-big {
    font-size: 30px;
  }
  .text-middle {
    font-size: 20px;
  }
  .text-18 {
    font-size: 12px;
  }
  .text-15 {
    font-size: 15px;
  }
  .text-10 {
    font-size: 10px;
  }
  .text-12 {
    font-size: 12px;
  }
  .padding-2 {
    padding: 2px;
  }
  .padding-10 {
    padding: 10px;
  }
  .padding-15 {
    padding: 15px;
  }
  .padding-20 {
    padding: 20px;
  }
  .padding-l {
    padding-left: 10px;
  }
  .padding-r {
    padding-right: 10px;
  }
  .padding-b {
    padding-bottom: 10px;
  }
  .padding-t {
    padding-bottom: 10px;
  }
  .margin-2 {
    margin: 2px;
  }
  .margin-10 {
    margin: 10px;
  }
  .margin-15 {
    margin: 15px;
  }
  .margin-20 {
    margin: 20px;
  }
  .margin-l {
    margin-left: 10px;
  }
  .margin-r {
    margin-right: 10px;
  }
  .margin-b {
    margin-bottom: 10px;
  }
  .margin-t {
    margin-top: 10px;
  }
  .bg-white {
    background-color: white !important;
  }
  .border-b {
    border-bottom: 1px solid #F2F6FC;
  }
  .border-t {
    border-top: 1px solid #F2F6FC;
  }
  .left-line {
    border-left: 5px solid #409EFF;
  }
  .view-shadow {
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  .view-radius-s {
    border-radius: 5px;
  }
  .view-radius-m {
    border-radius: 10px;
  }
  .view-radius-l {
    border-radius: 15px;
  }
  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
  .text-ellipsis-3 {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .text-ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .v-flex {
    display: flex;
    flex-direction: row;
  }
  .v-flex-column {
    display: flex;
    flex-direction: column;
  }
  .v-r-center {
    justify-content: center;
  }
  .v-r-left {
    justify-content: flex-start;
  }
  .v-r-right {
    justify-content: flex-end;
  }
  .v-r-between {
    justify-content: space-between;
  }
  .v-c-center {
    align-items: center;
  }
  .v-c-left {
    align-items: flex-start;
  }
  .v-c-right {
    align-items: flex-end;
  }
  .l-block-top {
    display: inline-block;
    vertical-align: top;
  }
  .v-center {
    text-align: center;
  }
  .v-left {
    text-align: left;
  }
  .v-right {
    text-align: right;
  }
  .hover-blue:hover {
    color: #63a35c;
  }
  .hover-white:hover {
    color: white;
  }
  .hover-black:hover {
    color: #0c0c0c;
  }
  .hover-red:hover {
    color: #f44336;
  }
  .hover-green:hover {
    color: #63a35c;
  }
  .hover-yellow:hover {
    color: #f6ad55;
  }
  .hover-gray:hover {
    color: #909399;
  }
  .hover-light:hover {
    color: lightgrey;
  }
  .hover-big:hover {
    transform: scale(1.2);
    transition: .2s;
  }
</style>
