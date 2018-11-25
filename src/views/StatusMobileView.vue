<template>
  <div id="status-mobile-view">
    <StatusCard :name="name" :color="color" :statusText="statusText" :lastUpdateText="lastUpdateText" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { firebaseDatabase } from '@/main'
import StatusCard from '@/components/StatusCard/StatusCard.vue'

@Component({
  components: {
    StatusCard,
  },
})
export default class StatusMobileView extends Vue {

  private memberRef!: firebase.database.Reference
  private name = ''
  private color = ''
  private statusText = ''
  private lastUpdateText = ''

  public async created(): Promise<void> {
    const id: string = this.$route.params.id
    const stateSnap = await firebaseDatabase.ref('status').once('value')
    this.memberRef = firebaseDatabase.ref(`members/${id}`)
    this.memberRef.on('value', (snap) => {
      const memStatus = stateSnap.child(snap!.child('status').val()).val()
      const lastStatus = stateSnap.child(snap!.child('last_status').val()).val()
      this.name = snap!.child('last_name').val() + ' ' + snap!.child('first_name').val()
      this.color = memStatus.color
      this.statusText = memStatus.name
      this.lastUpdateText = snap!.child('last_update_date').val() + ' ' + lastStatus.name + '⇒' + memStatus.name
    });
  }

  public destroyed(): void {
    this.memberRef.off()
  }
}
</script>

<style lang="scss" scoped>
  #status-mobile-view {
    margin-top: 30px;
  }
</style>

