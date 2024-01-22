<template>

  <div>

    <el-row>
      <el-col :lg="12" :md="12"><div class="padding-15">
        <div style="width: 100%;height: 400px;">
          <img :src="picPath+item.pic" width="100%" height="400px" />
          </div>
        </div>
      </el-col>
      <el-col :lg="12" :md="12">
        <div class="v-flex v-flex-column padding-15" style="font-size:15px;">

          <div class="v-flex margin-b v-r-between" style="width:100%;height: 28px;line-height: 28px;font-size:25px;align-items: center;">

            <div class="v-flex">
              <el-tag size="medium" effect="dark">{{findTypeName(item.gid)}}</el-tag>
              <div class="margin-l text-bold">{{item.title}}</div>
            </div>
            <el-button type="primary" plain @click="backToIndex">返回首页 ></el-button>
          </div>

          <div class="margin-10"><span class="text-gray">车型:</span>{{typeNameArr[item.type]}}</div>
          <div class="margin-10"><span class="text-gray">动力:</span>{{item.powType}}</div>
          <div class="margin-10"><span class="text-gray">功率:</span>{{item.powNum}}</div>
          <div class="margin-10"><span class="text-gray">型号:</span>{{item.modelName}}</div>
          <div class="margin-10"><span class="text-gray">颜色:</span>{{item.color}}</div>
          <div class="margin-10"><span class="text-gray">座位:</span>{{item.seatsNum}}</div>

          <div class="margin-10" style="height: 20px;line-height: 20px;"><span class="text-gray">价格:</span><span class="text-yellow text-bold margin-l">{{item.price||'/'}}</span>元/天</div>

          <div class="v-flex margin-10" style="height: 28px;line-height: 28px;font-size:15px;align-items: center;">
            <span class="text-gray margin-r" style="margin-right: 20px;">状态:</span>
            <el-tag size="medium" :type="stateColorNameArr[item.state]">{{stateNameArr[item.state]}}</el-tag>
          </div>

          <div class="v-flex margin-10" v-if="user">
            <div class="margin-r">
              <el-button type="success" @click="addToCart" round>加入购物车</el-button>
            </div>
            <div class="margin-r">
              <el-button @click="toCart" type="primary" round>查看购物车</el-button>
            </div>
          </div>
          <div v-else>
            <div class="margin-r">
              <el-button round @click="backToIndex">前往首页登录</el-button>
            </div>
          </div>


        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="24" :md="24">
        <div class="padding-15">
          <el-tabs >
            <el-tab-pane label="详情">
              <div class="margin-10">
                {{item.memo}}
              </div>
              <div class="v-flex">
                <div class="margin-10">
                  <img :src="picPath+item.pic2" height="250px" />
                </div>
                <div class="margin-10">
                  <img :src="picPath+item.pic3" height="250px" />
                </div>
              </div>



            </el-tab-pane>
            <el-tab-pane label="评论">
              <div class="padding-20">
                <div v-for="(item,index) in commentList" :key="index" class="v-flex-column view-shadow margin-b" style="width: 100%; justify-content: space-around;">
                  <div class="v-flex margin-10" style="align-items: center;">
                    <el-avatar :src="baseUrl+'/static/img/nuoMi.png'"></el-avatar>

                    <div class="margin-l">{{item.nickName}}</div>
                    <div class="margin-l">
                      <el-rate v-model="item.starNum"></el-rate>
                    </div>
                  </div>
                  <div class="v-flex margin-10 margin-l">
                    <div>{{item.content}}</div>
                  </div>
                  <div class="v-flex margin-10">
                    <div>{{item.createTime}}</div>
                  </div>
                </div>



              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

    </el-row>




  </div>

</template>

<script>

    import common from '@/utils/commonRequest'

    export default {
      name: 'nmCarInfo',
      data() {
        return {
          user: false,
          item: {
            title: "",
            state: 1,
            gid: "",
            memo: "",
            pic: "",
            type: 0,
            pic1Str: '',
            pic2: "",
            pic2Str: '',
            pic3: "",
            pic3Str: '',
            push: 0,
            powType: "",
            powNum: "",
            seatsNum: "",
            color: "",
            modelName: ""
          },
          commentList:[],
          baseUrl:common.baseUrl,
          picPath: common.urlMap.getPic,
          typeList: [],
          typeNameArr:['轿车','SUV','MPV','微面'],
          stateNameArr:['未发布','可用','出租中'],
          stateColorNameArr:['danger','success','danger'],
        }
      },
      created() {
        this.user = common.getUserInfo();
        this.getGroupList();
        let bid = common.getUrlParam("id");
        if (bid) {
          this.getCarData(bid);
        }else{
          window.location.href="#/nmCar"
        }
      },
      mounted() {

      },
      beforeDestroy() {
        clearInterval(this.timer)
      },
      methods: {
        addToCart(){
          if(this.item.state != 1 ){
            common.msg("车辆不在可用状态");
            return;
          }

          let _this = this;
          common.request({
            data: {
              carId:this.item.id,
              carName:this.item.title,
              rentalDay:1
            },
            url: common.urlMap.addNmCarCart,
            success: function(res) {
              if (res.data.code == 200) {
                common.msg(res.data.msg);
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })
        },
        toCart(){
          window.location.href="#/cart"
        },
        backToIndex(){
          window.location.href="#/nmCar"
        },
        getCarData(bid) {
          let _this = this;
          common.request({
            data: {
              validFlag: 1,
              id: bid
            },
            url: common.urlMap.findNmCar,
            success: function(res) {
              if (res.data.code == 200) {
                _this.item = res.data.data;
                _this.getCommentData();
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })
        },
        getCommentData() {
          let _this = this;
          common.request({
            data: {
              validFlag: 1,
              carId: this.item.id
            },
            url: common.urlMap.findNmCarCommentList,
            success: function(res) {
              if (res.data.code == 200) {
                _this.commentList = res.data.data;
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })
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
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })
        }
      }
     }

</script>

<style>
</style>
