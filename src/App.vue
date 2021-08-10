<template>
  <v-app>
    <v-main>
      <MeetupCalender/>
    </v-main>
  </v-app>
</template>

<script>

import MeetupCalender from './components/meetupCalender';
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'App',

  components: {
    MeetupCalender,
    Datepicker
  },

  data: () => ({
    //
  }),
};
</script>
