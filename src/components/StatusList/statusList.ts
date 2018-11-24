import { Component, Vue } from 'vue-property-decorator';
import { firebaseDatabase } from '@/main';
import StatusDetailModal from '@/components/StatusDetailModal/StatusDetailModal'

@Component({
  components: {
    StatusDetailModal
  }
})
export default class StatusList extends Vue {
  public $refs!: {
    statusDetail: StatusDetailModal
  }
  private memberReference!: firebase.database.Reference
  private states = null
  private members = null

  public async created(): Promise<void> {
    // データの取得
    const stateSnap = await firebaseDatabase.ref('status').once('value')
    this.states = stateSnap.val()
    this.memberReference = firebaseDatabase.ref('members')
    this.memberReference.on('value', (memSnap) => {
      this.members = memSnap!.val()
    })
  }

  public destroyed(): void {
    this.memberReference.off()
  }

  protected toggle(id: number) {
    const statusDetailModal = this.$refs.statusDetail
    statusDetailModal.openModal(id, this.members, this.states)
  }
}
