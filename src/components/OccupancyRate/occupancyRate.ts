import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import axios, { AxiosPromise } from 'axios'
import Moment from 'moment'

@Component
export default class OccupancyRate extends Vue {

  @Prop({ type: Number })
  public memberId!: number

  private isLoading: boolean = false
  private percentLesson: number = 0
  private percentAll: number = 0

  public get percentLessonLabel(): string {
    return `合算在室率：${this.percentLesson}%`
  }

  public get percentAllLabel(): string {
    return `授業時間（90x5分）の在室率：${this.percentAll}%`
  }

  public created(): void {
    if (this.memberId !== undefined && this.memberId > -1) {
      this.setRate()
    }  }

  @Watch('memberId')
  public onMemberIdChanged(newMemberId: number, oldMemberId: number): void {
    if (newMemberId !== undefined && newMemberId > -1) {
      this.setRate()
    }
  }

  /**
   * 直近一週間の在室率を取得してプログレスバーに設定します。
   */
  private setRate(): void {
    this.isLoading = true
    const getStatusId: number = 2 // 在室
    const startDate: string = Moment().subtract(7, 'day').format('YYYY/MM/DD')
    const endDate: string = Moment().format('YYYY/MM/DD')
    this.getPresenseTime(this.memberId, getStatusId, startDate, endDate).then((value) => {
      const presenseMinute: number = value.data
      const pa = Math.round(presenseMinute / ( 7 * 24 * 60) * 100)
      const pl = Math.round(presenseMinute / (5 * 7.5 * 60) * 100)
      this.percentAll = pa <= 100 ? pa : 100
      this.percentLesson = pl <= 100 ? pl : 100
      this.isLoading = false
    }).catch((reason) => {
      // TODO エラー処理
      this.isLoading = false
    })
  }

  /**
   * 引数に与えられたメンバー、ステータスID、期間の滞在時間を取得して返します。
   * @param memberId メンバーID
   * @param stateId 取得対象のステータスID
   * @param startDateString 取得開始日(YYYY/MM/DD)
   * @param endDateString 取得終了日(YYYY/MM/DD)
   */
  private getPresenseTime(
    memberId: number,
    stateId: number,
    startDateString: string,
    endDateString: string
  ): AxiosPromise {
    const ret = axios.get('https://hlmanager-32609.firebaseapp.com/holdTime', {
      params: { memberId, stateId, startDate: startDateString, endDate: endDateString }
    })
    return ret
  }
}
