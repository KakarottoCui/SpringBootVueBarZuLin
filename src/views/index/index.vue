<template>
  <div class="index-container">
    <el-row :gutter="20">

      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <div class="v-flex margin-b">
          <div class="margin-r">
            <el-date-picker
            v-model="beginDate"
            type="month"
            format="yyyy-MM" value-format="yyyy-MM">
            placeholder="选择起始月">
            </el-date-picker>
          </div>

          <div class="margin-l margin-r">
            <el-date-picker
            v-model="endDate"
            type="month"
            format="yyyy-MM"
            placeholder="选择终止月" value-format="yyyy-MM">
            </el-date-picker>
          </div>
          <div class="margin-l">
            <el-button type="primary" @click="getData()">查询</el-button>
          </div>
          <div class="margin-l">
            <el-button type="success" @click="backToIndex()">前往网站主页</el-button>
          </div>


        </div>
        </el-col>

      <el-col :lg="12" :md="12" :sm="24" :xl="6" :xs="24">

        <el-card shadow="never">
          <div slot="header">
            <span>每月出租数量</span>
          </div>
          <vab-chart autoresize :option="fwl" />
          <div class="bottom">
            <span>
              总出租数:

              {{ count2 }}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <div slot="header">
            <span>每月销售额</span>
          </div>
          <vab-chart autoresize :option="sqs" />
          <div class="bottom">
            <span>
              总销售额:
              {{ count1 }}
            </span>
          </div>
        </el-card>
      </el-col>


    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { dependencies, devDependencies } from '../../../package.json'
  import { getList } from '@/api/changeLog'
  import { getNoticeList } from '@/api/notice'
  import Plan from './components/Plan'
  import VersionInformation from './components/VersionInformation'
  import common from '@/utils/commonRequest'

  export default {
    name: 'Index',
    components: {
      VabChart,
      Plan,
      VersionInformation,
    },
    data() {
      return {
        beginDate:"2023-08",
        endDate:"2024-01",
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        count1:0,
        count2:0,
        //访问量
        fwl: {
          color: ['#1890FF', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5'],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '访问量',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
              label:{
                show:true
              }
            },
          ],
        },
        //授权数
        sqs: {
          color: ['#1890FF', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5'],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              /*boundaryGap: false,*/
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '授权数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
              label:{
                show:true
              }
            },

          ],
        },


        //更新日志
        reverse: true,
        activities: [],
        noticeList: [],
        //其他信息
        userAgent: navigator.userAgent,
      }
    },
    created() {
      this.getData();
    },
    beforeDestroy() {
      // clearInterval(this.timer)
    },
    mounted() {

    },
    methods: {
      backToIndex(){
        window.open("#/nmCar")
      },
      getData(){
        let _this = this;
        common.request({
          method:"get",
          url: common.baseUrl + '/nmCarOrder/countPriceSum?beginDate='+this.beginDate+"&endDate="+this.endDate,
          success: function(res) {
            if (res.data.code == 200) {

              var month = [];
              var data = [];
              var count1 = 0
              res.data.data.price.map(function(item,index){
                month.push(item.title);
                data.push(item.price);
                count1 += item.price;
              })

              _this.sqs.xAxis[0].data = month;
              _this.sqs.series[0].data = data;

              var month2 = [];
              var data2 = [];
              var count2 = 0

              res.data.data.num.map(function(item,index){
                month2.push(item.title);
                data2.push(item.price)
                count2 += item.price;
              })

              _this.fwl.xAxis[0].data = month2;
              _this.fwl.series[0].data = data2;

              _this.count1 = count1;
              _this.count2 = count2;

            } else {
              common.err(res.data.msg);
            }
          },
          fail: function(res) {
            common.err("网络异常");
          }
        });
      },
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`)
      },
      handleZrClick() {},
      handleChangeTheme() {
        this.$baseEventBus.$emit('theme')
      },
      async fetchData() {
        const { data } = await getList()
        data.map((item, index) => {
          if (index === data.length - 1) {
            item.color = '#0bbd87'
          }
        })
        this.activities = data
        const res = await getNoticeList()
        this.noticeList = res.data
        /* getRepos({
    token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
  }).then((res) => {
    const per_page = Math.ceil(res.data.stargazers_count / 100);
    alert(per_page);
    getStargazers({
      token: "1061286824f978ea3cf98b7b8ea26fe27ba7cea1",
      page: 1,
      per_page: res.per_page,
    }).then((res) => {
      alert(JSON.stringify(res));
    });
  }); */
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
