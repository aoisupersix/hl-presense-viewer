<template>
  <div id="home">
    <h1 class="ui header title">
      早川研究室 在室状況
      <div class="sub header">
        Hayakawa Laboratory's presence in the laboratory !
      </div>
    </h1>
    <StatusList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StatusList from '@/components/StatusList/StatusList.vue'; // @ is an alias to /src

@Component({
  components: {
    StatusList,
  },
})
export default class Home extends Vue {}
</script>
