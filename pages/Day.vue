<template>
  <section>
    <h1 class="title">
      <fa class="fa" style="float:left;" :icon="['fas', 'chevron-left']" @click="adjustDay(-1)"/>
      <date-pick v-model="date" :format="format"
                 :parseDate="parseDate"
                 :formatDate="formatDate"
                 :inputAttributes="{size: 32}">
        <template v-slot:default="{toggle, inputValue}">
          <span @click="toggle">
            {{ inputValue }}
          </span>
        </template>
      </date-pick>
      <fa class="fa" style="float:right;" :icon="['fas', 'chevron-right']" @click="adjustDay(1)"/>
    </h1>
    <div style="padding: 15px">
      <!-- @append="append"-->
      <vue-masonry-wall :items="items" :options="options" :ssr="{columns: 2}">
        <template v-slot:default="{item,index}">
          <div class="item" :style="'background-color:'+getRandomColor(0.3)">
            <div class="title">{{ item.key }}</div>
            <!--                        <img :src="item.image"/>-->
            <div class="Content">
              <div class="detail" v-for="(itemPrice,index) in item.value" :style="'background-color:'+ itemPrice.color">
                {{ itemPrice.title }}：${{ itemPrice.price }}
              </div>
            </div>
          </div>
        </template>
      </vue-masonry-wall>

    </div>
  </section>
</template>

<script>

  import DatePick from 'vue-date-pick';
  import 'vue-date-pick/dist/vueDatePick.css';
  import VueMasonryWall from "vue-masonry-wall";
  import fecha from 'fecha';
  import _ from 'lodash';

  export default {
    name: "app",
    components: {DatePick, VueMasonryWall},
    head() {
      return {
        title: "日歷"
      };
    },
    data() {
      return {
        user_id: 4,
        format: 'ddd MMM DD, YYYY',/*顯示的日期格式*/
        date: fecha.format(new Date(), 'ddd MMM DD, YYYY'),
        options: {
          width: 300,
          padding: {
            2: 8,
            default: 12
          }
        },
        items: []
      };
    },
    created(){
      for (var i = 0; i < 1000; i++) {
        this.items.push({
          id: i,
          title: '項目名稱',
          date: '2021-11-25 05:59:37',
          item_user_id: Math.floor(Math.random()*(4-3+1))+3,
          user_id: Math.floor(Math.random()*(4-3+1))+3,
          price: Math.floor(Math.random() * 10000),
          owner_id: 1,
          owner_name: Math.floor(Math.random() * 100)
        });
      }
    },
    mounted() {
      let ary_re = [], ary_pay = [];
      _.forEach(this.items, (obj) => {
        if(obj.user_id === this.user_id) {
          obj.color = 'darkseagreen';
          ary_pay.push(obj);
        } else {
          obj.color = 'lightseagreen';
          ary_re.push(obj);
        }
      });
      ary_pay = _.orderBy(ary_pay, ['item_user_id'], ['asc']);
      ary_re = _.orderBy(ary_re, ['user_id'], ['asc']);
      this.items = _.groupBy(_.concat(ary_re, ary_pay), 'owner_name');
      this.items = Object.keys(this.items).map(key => ({key, value: this.items[key]}));
    },
    methods: {
      getRandomColor: function(alpha) {
        let r = Math.floor(Math.random() * 256); //随机生成256以内r值
        let g = Math.floor(Math.random() * 256); //随机生成256以内g值
        let b = Math.floor(Math.random() * 256); //随机生成256以内b值
        return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
      },
      setToday() {
        // this.today.year = this.displayDate.getFullYear()
        // this.today.month = this.displayDate.getMonth() // 0~11
        // this.today.date = this.displayDate.getDate()
        // this.today.day = this.displayDate.getDay()
        // this.displayDate = fecha.format(this.displayDate, 'ddd MMM DD, YYYY')
      },
      adjustDay(fix) {
        let displayDate = fecha.parse(this.date, this.format);
        displayDate.setDate(displayDate.getDate() + fix);
        this.date = fecha.format(displayDate, 'ddd MMM DD, YYYY');
      },
      append() {
        for(let i = 0; i < 20; i++) {
          this.items.push({
            title: `Item ${this.items.length}`,
            content: 'Content',
            image: 'https://picsum.photos/id/1039/300/300'
          })
        }
      },
      parseDate(dateString, format) {
        return fecha.parse(dateString, format);
      },
      formatDate(dateObj, format) {
        return fecha.format(dateObj, format);
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>

  .title{
    background-color: #2F4F4F;
    color:            #FFF;
    text-align:       center;
    font-size:        2em;
    font-weight:      bold;
    margin-top:       0px;
    span{
      font-size:        3em;
      font-weight:      bold;
      background-color: #2F4F4F;
      color:            #FFF;
      margin-top:       0px;
    }
  }
  .fa{
    margin: 4px 10px;
  }
  section{
    text-align: center;
    border:     2px solid #2F4F4F;
    min-height: 500px;
  }
  .item{
    overflow:      hidden;
    border-radius: 4px;
    width:         100%;
    background:    #f5f5f5;
    .detail{
      margin:  5px;
      padding: 0px 2px;
      color:   #FFF;
    }
    .title{
      font-size:        22px;
      padding:          10px;
      background-color: #1f335f;
    }
  }
  .Content{
    padding: 20px;
  }
  img{
    -o-object-fit: cover;
    object-fit:    cover;
    width:         100%;
    height:        100%;
    line-height:   0;
    display:       block;
  }

</style>
