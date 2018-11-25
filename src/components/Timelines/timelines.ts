import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import axios from 'axios'
import Moment from 'moment'

@Component
export default class Timelines extends Vue {

  @Prop({ type: Number })
  public memberId!: number

  private isLoading: boolean = false
  private timelines: any = []

  public created(): void {
    if (this.memberId !== undefined && this.memberId > -1) {
      this.setTimelineData(this.memberId)
    }  }

  @Watch('memberId')
  public onMemberIdChanged(newMemberId: number, oldMemberId: number): void {
    if (newMemberId !== undefined && newMemberId > -1) {
      this.setTimelineData(newMemberId)
    }
  }

  /**
   * 一週間分のタイムラインを取得してtimeLinesに設定します。
   * @param memberId メンバーID
   */
  private setTimelineData(memberId: number): void {
    this.isLoading = true
    const startDate: string = Moment().subtract(7, 'day').format('YYYY/MM/DD')
    const endDate: string = Moment().format('YYYY/MM/DD')
    this.getTimelineData(memberId, startDate, endDate).then((value) => {
      this.timelines = value.data
      this.isLoading = false
    }).catch((reason) => {
      // TODO エラー処理
      this.isLoading = false
    })
  }

  /**
   * 引数に与えられたメンバー、期間のタイムラインデータを取得して返します。
   * @param memberId メンバーID
   * @param startDateString 取得開始日(YYYY/MM/DD)
   * @param endDateString 取得終了日(YYYY/MM/DD)
   */
  private getTimelineData(memberId: number, startDateString: string, endDateString: string) {
    const ret = axios.get('https://hlmanager-32609.firebaseapp.com/getTimelineData', {
      params: { memberId, startDate: startDateString, endDate: endDateString }
    })
    return ret
  }
}
