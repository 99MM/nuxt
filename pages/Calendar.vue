<template>
  <div id="app" v-cloak>
    <h1>{{ calendar.year }} 年 {{ calendar.month + 1 }} 月</h1>
    <div>
      <button @click="adjustYear(-1)">上一年</button>
      <button @click="adjustMonth(-1)">上個月</button>
      <button @click="setToday">今天</button>
      <button @click="adjustMonth(1)">下個月</button>
      <button @click="adjustYear(1)">下一年</button>
    </div>
    <div class="calendar">
      <div class="weekDay">
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
      </div>
      <div class="week" v-for="i in calendarWeekCount">
        <div class="day" v-for="j in 7" :data-date="calendarMonth[(i-1)*7+j-1].date"
             :class="{
             today:calendarMonth[(i-1)*7+j-1].year === today.year && calendarMonth[(i-1)*7+j-1].month === today.month && calendarMonth[(i-1)*7+j-1].date === today.date,
             other:calendarMonth[(i-1)*7+j-1].month !== calendar.month
            }"
        >
          <div style="position:relative; margin-top: 30px;">
            <div style="position: absolute;">

<!--              <span class="item" style="background-color: lightseagreen;">-->
<!--                收款項目 3-->
<!--              </span>-->
<!--              <span class="item" style="background-color: darkseagreen;">-->
<!--                付款項目 2-->
<!--              </span>-->

            </div>
          </div>

        </div>
      </div>
    </div>
    <Modal v-show="showModal" @close-modal="showModal = false"/>
  </div>
</template>

<script>
  import Modal from '~/components/Modal.vue'

  export default {
    components: {Modal},
    name: "app",
    head() {
      return {
        title: "行事曆"
      };
    },
    data() {
      return {
        today: {
          year: 0,
          month: 0,
          date: 0,
          day: 0
        },
        calendar: {
          year: 0,
          month: 0,
          date: 0,
          day: 0,
          weekCount: 0
        },
        showModal: false
      };
    },
    mounted() {
      this.setToday()
    },
    methods: {
      setToday() {
        const date = new Date()
        this.today.year = this.calendar.year = date.getFullYear()
        this.today.month = this.calendar.month = date.getMonth() // 0~11
        this.today.date = this.calendar.date = date.getDate()
        this.today.day = this.calendar.day = date.getDay()
      },
      adjustYear(fix) {
        this.calendar.year += fix
      },
      adjustMonth(fix) {
        // this.calendar.month += fix 範圍
        let month = this.calendar.month + fix
        if(month > 11) {
          this.adjustYear(1)
          this.calendar.month = 0
        } else if(month < 0) {
          this.adjustYear(-1)
          this.calendar.month = 11
        } else {
          this.calendar.month = month
        }

      }
    },
    computed: {
      calendarFirstDay() {
        const mDate = new Date(this.calendar.year, this.calendar.month, 1)
        console.log(mDate)
        const date = new Date(this.calendar.year, this.calendar.month, 1 - mDate.getDay())
        console.log(date)
        return {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
          day: date.getDay()
        }
      },
      calendarMonth() {
        const data = []
        let date
        for(let i = 0; i < 42; i++) {
          date = new Date(this.calendarFirstDay.year, this.calendarFirstDay.month, this.calendarFirstDay.date + i)
          data.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            day: date.getDay()
          })
        }
        return data
      },
      calendarWeekCount() {
        // 計算週數
        let firstOfMonth = new Date(this.calendar.year, this.calendar.month, 1);
        let lastOfMonth = new Date(this.calendar.year, this.calendar.month + 1, 0);
        let used = firstOfMonth.getDay() + lastOfMonth.getDate();
        return Math.ceil(used / 7);
      }

    }
  }
</script>

<style lang="scss" scoped>

  [v-cloak]{
    display: none;
  }
  .calendar{
    margin:     30px 0;
    text-align: center;
    border:     2px solid #2F4F4F;
  }
  .weekDay, .week{
    display:       flex;
    border-bottom: 1px solid #ddd;
  }
  .weekDay > div{
    flex:             110%;
    line-height:      50px;
    background-color: #2F4F4F;
    font-weight:      600;
    color:            #FFF;
    font-size:        26px;
  }
  .week{
    border-right: 1px solid #ddd;
  }
  .week > div{
    position:       relative;
    flex:           110%;
    height:         120px;
    flex-direction: column;
    line-height:    30px;
    border-left:    1px solid #ddd;
  }
  .week > div:not(.other):before{
    position:  absolute;
    content:   attr(data-date);
    top:       0;
    right:     0;
    display:   block;
    width:     30px;
    font-size: 24px;
  }
  .today{
    color:            #2F4F4F;
    background-color: #fffdd0;
    font-size:        24px;
  }
  .other{
    background-color: #ddd;
  }
  .day:not(.today){
    font-size: 24px;
    color:     #949494;
  }
  .item{
    margin:    5px;
    padding:   0px 2px;
    flex-grow: 1;
    color:     #FFF;
  }
</style>
