<template>
  <div>
    <button v-repeat-click="repeathandler">repeat-click</button>
  </div>
</template>
<script>
import RepeatClick from '../../utils/directives/repeat-click';

export default {
  directives: {
    repeatClick: RepeatClick
  },
  methods: {
    repeathandler() {
      console.log('1')
    }
  }
}
</script>