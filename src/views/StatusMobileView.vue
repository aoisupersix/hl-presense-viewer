<template>
  <div id="status-mobile-view">
    <sui-dimmer :active="isLoading">
      <sui-loader>Loading...</sui-loader>
    </sui-dimmer>
    <StatusCard :name="name" :color="color" :statusText="statusText" :lastUpdateText="lastUpdateText" :statusDetailText="statusDetail" :isShowingStatusDetail="isShowingStatusDetail" />
    <occupancy-rate class="margin-top" :memberId="memberId" />
    <time-lines class="margin-top" :memberId="memberId" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { firebaseDatabase } from '@/main'
import OccupancyRate from '@/components/OccupancyRate/OccupancyRate.vue'
import StatusCard from '@/components/StatusCard/StatusCard.vue'
import Timelines from '@/components/Timelines/Timelines.vue'

@Component({
  components: {
    OccupancyRate,
    StatusCard,
    Timelines
  },
})
export default class StatusMobileView extends Vue {

  private memberRef!: firebase.database.Reference
  private isLoading: boolean = false
  private memberId: number = -1
  private statusId: number = -1
  private name = ''
  private color = ''
  private statusText = ''
  private geofenceStatusText = ''
  private lastUpdateText = ''

  private get isShowingStatusDetail(): boolean {
    if (this.statusId === 1 || this.statusId === 2) {
      return true
    }

    return false
  }

  private get statusDetail(): string {
    if (this.statusId === 1) {
      // ジオフェンス状態から表示
      return this.geofenceStatusText
    } else if (this.statusId === 2) {
      // 研究室
      return '研究室内(3-22)にいます。'
    }

    return ''
  }

  public async created(): Promise<void> {
    this.isLoading = true
    const id: string = this.$route.params.id
    this.memberId = +id
    const stateSnap = await firebaseDatabase.ref('status').once('value')
    this.memberRef = firebaseDatabase.ref(`members/${id}`)
    this.memberRef.on('value', (snap) => {
      const memStatus = stateSnap.child(snap!.child('status').val()).val()
      const lastStatus = stateSnap.child(snap!.child('last_status').val()).val()
      this.statusId = snap!.child('status').val()
      this.name = snap!.child('last_name').val() + ' ' + snap!.child('first_name').val()
      this.color = memStatus.color
      this.statusText = memStatus.name
      this.geofenceStatusText = snap!.child('geofence_message').val()
      this.lastUpdateText = snap!.child('last_update_date').val() + ' ' + lastStatus.name + '⇒' + memStatus.name

      // 最初の読み込み時以降はfalseになるだけなのでここで問題ないはず
      this.isLoading = false
    });

  }

  public destroyed(): void {
    this.memberRef.off()
  }
}
</script>

<style lang="scss" scoped>
  #status-mobile-view {
    margin-top: 10px;
    width: 95% !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .margin-top {
    margin-top: 30px !important;
  }
</style>

