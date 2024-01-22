<template>
  <div class="layui-card" id="app">

    <el-container class="margin-t">
      <el-header class="main-view" height="10vh">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="车辆名称">
            <el-input v-model="title" placeholder="订单车辆名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>

      </el-header>
      <el-main class="main-view" style="min-height: 87vh;">

        <el-table :stripe="true" :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60">
          </el-table-column>
          <el-table-column prop="title" label="状态" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2 text-bold" :class=" 'text-'+stateColorNameArr[scope.row.state] ">{{stateNameArr[scope.row.state]}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="车辆ID" width="100">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.car.id}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="车辆名称" width="120">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="用户ID" width="100">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.user.uid}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="用户昵称" width="100">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.user.nickName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="租金单价" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.car.price}}元/天</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="出租时间" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.rentalDay}}天</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="总价" width="80">
            <template slot-scope="scope">
              <div class="text-ellipsis-2">{{scope.row.priceSum}}元</div>
            </template>
          </el-table-column>

          <el-table-column prop="pic" label="图片" width="100">
            <template slot-scope="scope">
              <div>
                <el-image :preview-src-list="[ picPath+scope.row.car.pic ]" :src="picPath+scope.row.car.pic"
                  style="width: 80px; height: 80px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="150">
          </el-table-column>
          <el-table-column prop="planBackTime" label="预计(实际)归还时间" width="150">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state==0" @click="changeState(scope.row)" type="text" size="small">结束订单</el-button>
              <el-button @click="delData(scope.row)" type="text" class="text-red" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>

    <el-dialog title="编辑轮播图" :visible.sync="show">
      <el-form :model="dataView">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="dataView.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" label-width="120px">
          <div style="display: flex;justify-content: space-between;">
            <div>
              <el-image :preview-src-list="[getPicUrl(dataView.pic)]" :src="getPicUrl(dataView.pic)"
                style="width: 100px; height: 100px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 100px;"></i>
                </div>
              </el-image>
              <div style="display: flex;justify-content: space-between;">
                <div style="text-align: center;">主图</div>
                <div @click="editPic(dataView,'')" style="text-align: center;color: #63a35c;">修改</div>
              </div>
            </div>
          </div>
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
        picPath: common.urlMap.getPic,
        stateNameArr:['租用中','已还车','已评价'],
        stateColorNameArr:['red','blue','green']
      };
    },
    mounted() {

    },
    created() {
      this.user = common.getUserInfo();
      if (!this.user || this.user.type != 1) {
        location.href = '/#test'
      }
      this.getData();
    },
    methods: {
      onSubmit(){
        this.getData();
      },
      getData() {
        let _this = this;
        common.request({
          data: {
            validFlag: 1,
            title:this.title
          },
          url: common.urlMap.findNmCarOrderList,
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
          pic:"",
          validFlag:1,
          title:""
        }
        this.show = true;
      },
      toEdit(row) {
        this.dataView = row;
        this.show = true;
      },
      changeState(row) {
        this.dataView = row;
        this.dataView["state"] = 1;
        this.editData();
      },
      delData(row) {
        this.dataView = row;
        this.dataView["validFlag"] = 0;
        this.editData();
      },
      editData() {
        let _this = this;
        let url = this.dataView.id ? common.urlMap.editNmCarOrder : common.urlMap.addNmCarOrder;
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
      },
      createInput(index) {
        let _this = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.setAttribute("accept", "image/*,.png,.jpg,.jpeg,.bmp"); //仅能选择图片
        input.id = "hidden-input-file";
        input.style.display = "none";
        input.onchange = function() {
          var file = this.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(e) {
            var data = e.target.result;

            function dealImage(base64, w, size, callback, quality) {
              var newImage = new Image();
              var picSize = base64.length / 1024;
              quality = quality || 0.85; //压缩系数0-1之间
              size = size || 512;
              //根据图片大小调整压缩比
              if (picSize < size / 3) {
                callback(base64);
                return;
              } else if (picSize > 6144) {
                quality = 0.7;
              }
              newImage.src = base64;
              newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
              var imgWidth, imgHeight;
              newImage.onload = function() {
                imgWidth = this.width;
                imgHeight = this.height;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                if (Math.max(imgWidth, imgHeight) > w) {
                  if (imgWidth > imgHeight) {
                    canvas.width = w;
                    canvas.height = w * imgHeight / imgWidth;
                  } else {
                    canvas.height = w;
                    canvas.width = w * imgWidth / imgHeight;
                  }
                } else {
                  canvas.width = imgWidth;
                  canvas.height = imgHeight;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                var base64 = canvas.toDataURL("image/jpeg", quality); //绘制压缩,修改格式需注意，png格式不能用此方式压缩
                // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
                while (base64.length / 1024 > size) {
                  quality -= 0.05;
                  base64 = canvas.toDataURL("image/jpeg", quality);
                }
                callback(base64); //必须通过回调函数返回，否则无法及时拿到该值
              }
            }

            dealImage(data, 1440, 1560, function(base64) {
              _this.dataView['pic' + index] = base64;
              _this.$forceUpdate();
            })

          };
        };
        input.click();
      }
    }
  }
</script>

<style>
</style>
