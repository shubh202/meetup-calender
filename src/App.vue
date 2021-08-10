<template>
  <v-app>
    <v-main>
      <MeetupCalender/>
    </v-main>
  </v-app>
</template>

<script>

import MeetupCalender from './components/meetupCalender';

export default {
  name: 'App',

  components: {
    MeetupCalender,
  },

  data: () => ({
    //
  }),
};
</script>
