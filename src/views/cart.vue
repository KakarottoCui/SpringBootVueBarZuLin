<template>

  <div class="padding-15" style="width: 100vw;">

      <div style="width: 980px;margin-left: calc( 50% - 490px );">

        <el-empty v-if="cartList.length ==0" description="购物车空空如也" style="width: 100%;"></el-empty>

        <div v-for="(item,index) in cartList" :key="index" class="v-flex padding-10 v-r-between view-shadow margin-b" style="width: 100%;height: 100px;border-radius: 5px;">



          <div :disabled='item.state!=1' class="v-flex-column" style="justify-content: space-around;">
              <el-checkbox @change="changeBox($event,item)" :checked="item.check"></el-checkbox>
          </div>

          <div class="v-flex-column" style="justify-content: space-around;">
              <img :src="picPath+item.car.pic" width="100%" height="80px" />
          </div>

          <div class="v-r-between v-flex-column" style="wjustify-content: space-around;">
            <div class="v-flex" style="height: 20px;line-height: 20px;">
              <div class="margin-r"><el-tag size="mini" effect="dark">{{findTypeName(item.car.gid)}}</el-tag></div>
              <div class="margin-r text-bold">{{item.car.title}}</div>
            </div>
            <div class="v-flex-column margin-t" style="">
              <div class="margin-r"><span class="text-gray">型号:</span>{{item.car.modelName}}</div>
              <div class="margin-r"><span class="text-gray">颜色:</span>{{item.car.color}}</div>
              <div class="margin-r"><span class="text-gray">座位:</span>{{item.car.seatsNum}}</div>
            </div>
          </div>

          <div class="v-flex-column v-r-between margin-t" style="width: 100px;justify-content: space-around;">
            <div class="margin-r"><span class="text-gray">车型:</span>{{typeNameArr[item.car.type]}}</div>
            <div class="margin-r"><span class="text-gray">动力:</span>{{item.car.powType}}</div>
            <div class="margin-r"><span class="text-gray">功率:</span>{{item.car.powNum}}</div>
          </div>
          <div class="v-flex-column" style="justify-content: space-around;">

            <div class="v-flex" style="height: 20px;line-height: 20px;align-items: center;justify-content: flex-start;">
              <div class="text-gray">价格:</div>
              <div class="text-yellow text-bold margin-l">{{item.car.price||'/'}}</div>元/天
            </div>
            <div class="v-flex" style="align-items: center;">
              <div class="text-gray margin-r">租用天数:</div>
              <el-input style="width: 100px;" v-model="item.rentalDay" type="number"></el-input>
            </div>

          </div>
          <div class="v-flex-column" style="justify-content: space-around;">
            <div class="v-flex" style="align-items: center;">
              <div class="text-gray">合计:<span class="text-red">{{item.rentalDay*item.car.price}}</span>元</div>
            </div>
          </div>
          <div class="v-flex-column" style="justify-content: space-around;">
            <el-button @click="delCart(item)" type="danger" icon="el-icon-delete" circle></el-button>
          </div>

        </div>
        <div class="v-flex" style="position: fixed;bottom: 20px; width: 980px;margin-left: calc( 50% - 490px );justify-content: center;">
          <el-button v-if="cartList.length>0" @click="showSub=true" type="success">提交订单</el-button>
          <el-button @click="backToIndex" type="primary">返回首页</el-button>
        </div>

      </div>


      <el-dialog
        title="提示"
        :visible.sync="showSub"
        width="30%">
        <span>是否提交订单？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSub = false">取 消</el-button>
          <el-button type="primary" @click="subOrder">确 定</el-button>
        </span>
      </el-dialog>

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
            modelName: "",

          },
          showSub:false,
          cartList:[],
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
        if (this.user) {
          this.getData();
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
        delCart(item){
          let _this = this;
          item.validFlag = 0;
          common.request({
            data: item,
            url: common.urlMap.editNmCarCart,
            success: function(res) {
              if (res.data.code == 200) {
                _this.getData();
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })
        },
        changeBox(val,item){
          item.check = val;
        },
        backToIndex(){
          window.location.href="#/nmCar"
        },
        subOrder(){
          let selOrder = [];
          this.cartList.map(function(item,index,arr){
            if(item.check){
              item.car.rentalDay = item.rentalDay;
              selOrder.push(item.car);
            }
          })
          if(selOrder.length<1){
            common.msg("未选择车辆");
            this.showSub = false;
            return;
          }

          let _this = this;
          common.request({
            data: {
              validFlag: 1,
              cartCars:selOrder
            },
            url: common.urlMap.addNmCarOrder,
            success: function(res) {
              if (res.data.code == 200) {
                common.msg(res.data.msg);
                _this.getData();
                _this.showSub = false;
              } else {
                common.err(res.data.msg);
              }
            },
            fail: function(res) {
              common.err("网络异常");
            }
          })

        },
        getData() {
          let _this = this;
          common.request({
            data: {
              validFlag: 1,
              creater: this.user.uid
            },
            url: common.urlMap.findNmCarCartList,
            success: function(res) {
              if (res.data.code == 200) {
                _this.cartList = res.data.data;
                _this.cartList.map(function(item,index,arr){
                  item['check'] = false;
                  item.car.cartId=item.id;
                })
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
