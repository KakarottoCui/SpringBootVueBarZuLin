<template>
  <div class="layui-card" id="app">

    <el-container class="margin-t">
      <el-header class="main-view" height="10vh">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="车辆名称">
            <el-input v-model="title" placeholder="车辆名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addBook">新增</el-button>
          </el-form-item>
        </el-form>


      </el-header>


      <el-main class="main-view" style="min-height: 87vh;">

        <el-table :stripe="true" :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80">
          </el-table-column>
          <el-table-column prop="title" label="车辆名称" width="150">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="gid" label="车辆品牌" width="100">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{getTypeName(scope.row.gid)}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="类型" width="100">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{typeNameArr[scope.row.type]}}</div>
            </template>
          </el-table-column>


          <el-table-column prop="state" label="状态" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{stateNameArr[scope.row.state]}}</div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="price" label="租金" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2" style="text-align: center;width: 100%;">{{scope.row.price}}元/天</div>
            </template>
          </el-table-column>

          <el-table-column prop="pic" label="简介图" width="80">
            <template slot-scope="scope">
              <div>
                <el-image :preview-src-list="[ picPath+scope.row.pic ]" :src="picPath+scope.row.pic"
                  style="width: 80px; height: 80px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="color" label="颜色" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2" style="text-align: center;width: 100%;">{{scope.row.color}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="modelName" label="型号" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.modelName}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="powType" label="动力" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.powType}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="powNum" label="功率" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.powNum}}</div>
            </template>
          </el-table-column>

          <el-table-column prop="seatsNum" label="座位数" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.seatsNum}}</div>
            </template>
          </el-table-column>


          <el-table-column prop="memo" label="车辆简介" width="220">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.memo}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="pic2" label="详情图" width="80">
            <template slot-scope="scope">
              <div>
                <el-image :preview-src-list="[ picPath+scope.row.pic2 ]" :src="picPath+scope.row.pic2"
                  style="width: 80px; height: 80px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="pic3" label="详情图2" width="80">
            <template slot-scope="scope">
              <div>
                <el-image :preview-src-list="[ picPath+scope.row.pic3 ]" :src="picPath+scope.row.pic3"
                  style="width: 80px; height: 80px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
          </el-table-column>



          <!--						<el-table-column prop="num" label="票价" width="80">-->
          <!--						</el-table-column>-->
          <el-table-column prop="createTime" label="添加时间" width="180">
          </el-table-column>
          <!--						<el-table-column prop="creater" label="添加人">-->
          <!--						</el-table-column>-->
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.state<2" @click="changeState(scope.row)" type="text"
                :class="scope.row.state == 0 ?'text-green':(scope.row.state == 1?'text-red':'')"
                size="small">{{getBookType(scope.row.state,true)}}</el-button>
              <el-button @click="delData(scope.row)" type="text" class="text-red" size="small">删除</el-button>
              <el-button @click="addPush(scope.row)" type="text" :class="scope.row.push == 1 ? 'text-red':'text-green'"
                size="small">{{scope.row.push == 1?'取消推荐':'添加推荐'}}</el-button>

            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>


  </div>
</template>

<script>
  import common from '@/utils/commonRequest'
  export default {
    name: 'nmCarManager',
    data: function() {
      return {
        title: "",
        user: '',
        show: false,
        typeList: [],
        dataView: {},
        dataStationView: {},
        tableData: [],
        userInfo: {},
        showMapSel: false,
        selObj: {},
        selName: "",
        showStationTable: false,
        showStationEdit: false,
        tableStationData: [],
        setBtn: false,
        picPath: common.urlMap.getPic,
        typeNameArr:['轿车','SUV','MPV','微面'],
        stateNameArr:['未发布','可用','出租中']
      };
    },
    mounted() {

    },
    created() {
      this.user = common.getUserInfo();
      if (!this.user || this.user.type != 1) {
        location.href = '*/nmCar'
      }
      if (this.typeList.length == 0) {
        this.getGroupList();
      } else {
        this.getData();
      }
    },
    methods: {
      onSubmit() {
        this.getData();
      },
      getData() {
        let _this = this;
        common.request({
          data: {
            title: _this.title,
            validFlag: 1
          },
          url: common.urlMap.findNmCarList,
          success: function(res) {
            if (res.data.code == 200) {
              _this.tableData = res.data.data;
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        });
      },
      addBook() {
        window.location.href = "#/carManager/carEdit";
      },
      getBookType(type, flag) {
        switch (type) {
          case 0:
            return flag ? "发布" : "下架";
            break;
          case 1:
            return flag ? "下架" : "发布";
            break;
        }
      },
      getTypeName(typeId) {
        for (let i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].id == typeId) {
            return this.typeList[i].groupName;
          }
        }
        return "";
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
      showData(row) {
        this.dataView = row;
        this.show = true;
      },
      addPush(row) {
        this.dataView = row;
        this.dataView["push"] = this.dataView["push"] ? 0 : 1;
        this.editData();
      },
      toEdit(row) {
        window.location.href = "#/carManager/carEdit?id=" + row.id;
      },
      changeType(row) {
        this.dataView = row;
        switch (row.type) {
          case 0:
            this.dataView.type = 1;
            break;
          case 1:
            this.dataView.type = 2;
            break;
          case 2:
            this.dataView.type = 1;
            break;
        }
        this.editData();
      },
      changeState(row) {
        this.dataView = row;
        this.dataView["state"] = row.state == 1 ? 0 : 1;
        this.editData();
      },
      delData(row) {
        this.dataView = row;
        this.dataView["validFlag"] = 0;
        this.editData();
      },
      editData() {
        let _this = this;
        let url = common.urlMap.editNmCar;
        common.request({
          url: url,
          data: _this.dataView,
          success: function(res) {
            if (res.data.code == 200) {
              common.success(res.data.msg)
              _this.show = false;
              _this.getData();
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
