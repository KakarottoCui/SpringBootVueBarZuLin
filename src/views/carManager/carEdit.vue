<template>
  <div class="layui-card" id="app" style="padding: 30px;min-height: calc( 100vh - 40px );">

    <!-- <div class="padding-10" style="background-color: #2d8cf0;color: white;">
  		<el-page-header  @back="goBack" content="编辑车辆" ></el-page-header>
  	</div> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form :model="carData" :rules="bookRules" ref="carData" label-width="120px" style="margin-top: 30px;">
          <el-form-item label-position="left" placeholder="请输入车辆名称" prop="title" label="车辆名称">
            <el-input v-model="carData.title"></el-input>
          </el-form-item>

          <el-form-item label-position="left" placeholder="请输入车辆型号" prop="modelName" label="车辆型号">
            <el-input v-model="carData.modelName"></el-input>
          </el-form-item>

          <el-form-item label-position="left" prop="gid" label="车辆品牌">
            <el-select v-model="carData.gid" clearable filterable placeholder="请选择车辆品牌">
              <el-option v-for="item in typeList" :key="item.groupName" :label="item.groupName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label-position="left" prop="type" label="车辆类型">
            <el-select v-model="carData.type" clearable filterable placeholder="请选择车辆类型">
              <el-option v-for="(item,index) in ['轿车','SUV','MPV','微面']" :key="index" :label="item" :value="index">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label-position="left" prop="powType" label="动力类型">
            <el-select v-model="carData.powType" clearable filterable placeholder="请选择车辆动力类型">
              <el-option label="汽油机" value="汽油机"></el-option>
              <el-option label="柴油机" value="柴油机"></el-option>
              <el-option label="纯电" value="纯电"></el-option>
              <el-option label="混动" value="混动"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label-position="left" placeholder="请输入车辆功率(kw/匹)" prop="powNum" label="车辆功率">
            <el-input maxlength="10" v-model="carData.powNum"></el-input>
          </el-form-item>

          <el-form-item label-position="left" placeholder="请输入车辆颜色" prop="color" label="车辆颜色">
            <el-input maxlength="10" v-model="carData.color"></el-input>
          </el-form-item>

          <el-form-item label-position="left" placeholder="请输入车座数" prop="seatsNum" label="车座数">
            <el-input type="number" v-model="carData.seatsNum"></el-input>
          </el-form-item>

          <el-form-item label-position="left" placeholder="请输入出租价格(元/天)" prop="price" label="出租价格">
            <el-input type="number" v-model="carData.price"></el-input>
          </el-form-item>

          <el-form-item label-position="left" prop="memo" placeholder="请输入车辆简介" label="车辆简介" label-width="120px">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="carData.memo"
              autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label-position="left" label="车辆图片" label-width="120px">
            <div style="display: flex;justify-content: flex-start;">
              <div style="margin-right: 50px;">
                <el-image :preview-src-list="[getPicUrl(carData.pic)]" :src="getPicUrl(carData.pic)"
                  style="width: 100px; height: 100px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="font-size: 100px;"></i>
                  </div>
                </el-image>
                <div style="display: flex;justify-content: space-between;">
                  <div style="text-align: center;">封面图</div>
                  <div @click="editPic(carData,'')" style="text-align: center;color: #63a35c;">修改</div>
                </div>

              </div>
              <div style="margin-right: 50px;">
                <el-image :preview-src-list="[getPicUrl(carData.pic2)]" :src="getPicUrl(carData.pic2)"
                  style=" width: 100px; height: 100px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="font-size: 100px;"></i>
                  </div>
                </el-image>
                <div style="display: flex;justify-content: space-between;">
                  <div style="text-align: center;">详情图1</div>
                  <div @click="editPic(carData,2)" style="text-align: center;color: #63a35c;">修改</div>
                </div>
              </div>
              <div>
                <el-image :preview-src-list="[getPicUrl(carData.pic3)]" :src="getPicUrl(carData.pic3)"
                  style=" width: 100px; height: 100px;box-shadow: 1px 1px 5px rgba(0,0,0,0.1)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="font-size: 100px;"></i>
                  </div>
                </el-image>
                <div style="display: flex;justify-content: space-between;">
                  <div style="text-align: center;">详情图2</div>
                  <div @click="editPic(carData,3)" style="text-align: center;color: #63a35c;">修改</div>
                </div>
              </div>

            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('carData')">提交</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import common from '@/utils/commonRequest'
  export default {
    name: 'nmCarEdit',
    data: function() {
      return {
        user: '',
        typeList: [],
        selId: 114514,
        carData: {
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
        chapterList: [],
        bookRules: {
          title: [{
            required: true,
            message: '请输入车辆名称',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请输入车辆类型',
            trigger: 'blur'
          }],
          powType: [{
            required: true,
            message: '请输入车辆能源类型',
            trigger: 'blur'
          }],
          powNum: [{
            required: true,
            message: '请输入车辆功率',
            trigger: 'blur'
          }],
          seatsNum: [{
            required: true,
            message: '请输入车辆座位数',
            trigger: 'blur'
          }],
          color: [{
            required: true,
            message: '请输入车辆颜色',
            trigger: 'blur'
          }],
          gid: [{
            required: true,
            message: '请选择车辆品牌',
            trigger: 'blur'
          }],
          memo: [{
            required: true,
            message: '请输入车辆简介',
            trigger: 'blur'
          }]
        },
        showChapter: false,
        fileList: [],
        fileName: "",
        uploadUrl: common.urlMap.uploadFile,
      };
    },
    created() {
      this.user = common.getUserInfo();
      if (!this.user) {
        location.href = '/'
      }
      this.getGroupList();
      let bid = common.getUrlParam("id");
      if (bid) {
        this.getBookData(bid);
      }
    },
    mounted() {

    },
    methods: {
      onSubmit() {
        this.getData();
      },
      goBack() {
        window.location.href = "javascript:history.go(-1)";
      },
      getBookData(bid) {
        let _this = this;
        common.request({
          data: {
            validFlag: 1,
            id: bid
          },
          url: common.urlMap.findNmCar,
          success: function(res) {
            if (res.data.code == 200) {
              _this.carData = res.data.data;
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
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
      },
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            if (!_this.carData.pic) {
              common.err("请上传封面图");
              return;
            }
            if (!_this.carData.pic2) {
              common.err("请上传简介图图");
              return;
            }
            _this.submitBook();

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitBook() {
        let _this = this;
        let url = this.carData.id ? common.urlMap.editNmCar : common.urlMap.addNmCar;
        common.request({
          data: this.carData,
          url: url,
          success: function(res) {
            if (res.data.code == 200) {
              _this.carData = res.data.data;
              common.msg(res.data.msg);
            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        })
      }
      ,
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
              _this.carData['pic' + index] = base64;
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
