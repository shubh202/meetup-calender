<template>
<div>
<chart ref="chartThing"/>

<v-app>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64"  width = "614px">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark @click.stop="dialog = true">
            New Event
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="Event Name (required)"></v-text-field>
              <v-text-field v-model="details" type="text" label="Description"></v-text-field>
              <v-text-field v-model="start" type="date" label="Start Date (required)"></v-text-field>
              <v-text-field v-model="end" type="date" label="End Date (required)"></v-text-field>
              <v-select
                v-model="priority"
                :items="priorityList"
                label="Choose Priority"
                outlined>
              </v-select>
              <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">
                create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDate" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="event name (required)"></v-text-field>
              <v-text-field v-model="details" type="text" label="detail"></v-text-field>
              <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
              <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
              <v-select
                v-model="priority"
                :items="priorityList"
                label="Choose Priority"
                outlined>
              </v-select>
              <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">
                Create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

<v-sheet height="450" width = "614px">
  <v-calendar
  ref="calendar"
  v-model="focus"
  color="primary"
  :events="events"
  :event-color="getEventColor"
  :event-margin-bottom="3"
  :now="today"
  :type="type"
  @click:event="showEvent"
  @click:more="viewDay"
  @click:date="setDialogDate"
  @change="updateRange"
  ></v-calendar>
  <v-menu
  v-model="selectedOpen"
  :close-on-content-click="false"
  :activator="selectedElement"
  full-width
  offset-x
  >
  <v-card color="grey lighten-4" :width="350" flat>
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn @click="deleteEvent(selectedEvent.eventId)" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>

    <v-card-text>
      <form v-if="currentlyEditing !== selectedEvent.eventId">
        {{ selectedEvent.details }}
      </form>
      <form v-else>
        <textarea-autosize
        v-model="selectedEvent.details"
        type="text"
        style="width: 100%"
        :min-height="100"
        placeholder="add note">
      </textarea-autosize>
    </form>
  </v-card-text>
</v-card>
</v-menu>
</v-sheet>
</v-col>
</v-row>
</v-app>
</div>

</template>

<script>
    import chart  from "./charts";

export default {
    components: {
    chart,
  },
  data: () => ({
    priorityList: ['High','Medium','Low'],
    eventId: 1,
    colorMap:{
    'High': 'ff0019',
    'Medium': 'fbff00',
    'Low': '5e8000'
    },
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    name: null,
    details: null,
    start: null,
    end: null,
    priority: '', // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false
  }),
  mounted () {
    this.getEvents()
  },
  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear
      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)
      switch (this.type) {
        case 'month':
        return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
        return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
        return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    }
  },
  methods: {
    getEvents () {
      let eventList = localStorage.getItem('eventsList');
      if(eventList){
        let ev = JSON.parse(eventList);
        this.events = []; // s
        this.events = this.events.concat(ev);
      }
      else{
        this.events = [];
      }
    },
    setDialogDate( { date }) {
      this.dialogDate = true
      this.focus = date
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    addEvent () {
      if (this.name && this.start && this.end && this.priority) {
        let event = {
          eventId: this.eventId,
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: `#${this.colorMap[this.priority]}`,
        }
        let events = localStorage.getItem('eventsList') ;
        if(events){
            let evnt = JSON.parse(events);
            evnt.push(event);
            localStorage.setItem('eventsList',JSON.stringify(evnt)) ;
            this.eventId++;
        }
        else{
            let events = [];
            events.push(event);
            localStorage.setItem('eventsList',JSON.stringify(events)) ;
            this.eventId++;
        }
        this.$refs.chartThing.getPriorityList();
        this.getEvents();
        this.name = '',
        this.details = '',
        this.start = '',
        this.end = '',
        this.priority = ''
      } else {
        alert('You must enter event name, start, and end time')
      }
    },


    deleteEvent (ev) {
      let events = localStorage.getItem('eventsList') ;
      if(events){
        let evnt = JSON.parse(events);
        let index = evnt.findIndex(x => x.eventId === ev);
        evnt.splice(index,1);
        localStorage.setItem('eventsList',JSON.stringify(evnt)) ;
      }
      this.selectedOpen = false,
      this.$refs.chartThing.getPriorityList();
      this.getEvents()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    nth (d) {
      return d > 3 && d < 21
      ? 'th'
      : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    }
  }
}
</script>

<style>
/* .style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
} */
</style>