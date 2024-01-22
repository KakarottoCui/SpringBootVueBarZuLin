<template>
  <div class="layui-card" id="app">

    <el-container class="margin-t">
      <el-header class="main-view" height="10vh">
        <el-form :inline="true" class="demo-form-inline">
            <el-button type="success" @click="add()">新增公告</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main class="main-view" style="min-height: 87vh;">

        <el-table :stripe="true" :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="120">
          </el-table-column>
          <el-table-column prop="title" label="标题" width="200">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.title}}</div>
            </template>
          </el-table-column>

         <el-table-column prop="content" label="内容" width="200">
           <template slot-scope="scope">
             <div class="text-ellipsis-2">{{scope.row.content}}</div>
           </template>
         </el-table-column>
          <el-table-column prop="createTime" label="添加时间" width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delData(scope.row)" type="text" class="text-red" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>

    <el-dialog title="编辑公告" :visible.sync="show">
      <el-form :model="dataView">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="dataView.title" autocomplete="off"></el-input>
        </el-form-item>
      <el-form-item label="内容" label-width="120px">
          <el-input type="textarea" v-model="dataView.content" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>

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
        dataView: {},
        tableData: [],
        userInfo: {},
        selObj: {},
        selName: "",
        setBtn: false,
        picPath: common.urlMap.getPic
      };
    },
    mounted() {

    },
    created() {
      this.user = common.getUserInfo();
      if (!this.user || this.user.type != 1) {
        location.href = '#/nmCar'
      }
      this.getData();
    },
    methods: {
      getData() {
        let _this = this;
        common.request({
          data: {
            validFlag: 1
          },
          url: common.urlMap.findSysNoticeList,
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
      add() {
        this.dataView = {
          title:"",
          content:"",
          validFlag:1,
        }
        this.show = true;
      },
      toEdit(row) {
        this.dataView = row;
        this.show = true;
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
        let url = this.dataView.id ? common.urlMap.editSysNotice : common.urlMap.addSysNotice;
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
      },
      getPicUrl(pic) {
        if (!pic || pic.length < 100) {
          return common.urlMap.getPic + pic;
        } else {
          return pic;
        }
      },
      editPic(data, index) {
        this.createInput(index);
      }
    }
  }
</script>

<style>
</style>
