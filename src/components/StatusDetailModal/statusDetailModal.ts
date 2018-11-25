import { Component, Vue } from 'vue-property-decorator'
import Timelines from '@/components/Timelines/Timelines'
import OccupancyRate from '@/components/OccupancyRate/OccupancyRate'

@Component({
  components: {
    Timelines,
    OccupancyRate
  }
})
export default class StatusDetailModal extends Vue {
  private isOpen: boolean = false
  private memberId!: number
  private member!: any
  private states!: any

  public openModal(id: number, members: any, states: any): void {
    this.memberId = id
    this.member = members[id]
    this.states = states
    this.isOpen = true
  }

  public closeModal() {
    this.isOpen = false
  }
}
