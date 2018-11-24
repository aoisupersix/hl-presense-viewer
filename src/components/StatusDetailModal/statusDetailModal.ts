import { Component, Vue } from 'vue-property-decorator'
import axios, { AxiosPromise } from 'axios'
import Moment from 'moment'

@Component
export default class StatusDetailModal extends Vue {
  private isOpen: boolean = false
  private id!: number
  private member!: any
  private states!: any
  private percentAll: number = 0
  private percentLesson: number = 0
  private timeLines!: any
  private isLoadingPercent: boolean = false
  private isLoadingTimelines: boolean = false

  get percentAllLabel(): string {
    const percent = this.percentAll > 100 ? '100' : this.percentAll.toFixed(0)
    return `合算在室率：${percent}%`
  }

  get percentLessonLabel(): string {
    const percent = this.percentLesson > 100 ? '100' : this.percentLesson.toFixed(0)
    return `授業時間（90x5分）の在室率：${percent}%`
  }

  public openModal(id: number, members: any, states: any): void {
    this.id = id
    this.member = members[id]
    this.states = states
    this.isOpen = true

    this.setPercent(id)
    this.setTimelineData(id)
  }

  public closeModal() {
    this.isOpen = false
    this.percentAll = 0
    this.percentLesson = 0
  }

  /**
   * 一週間の在室率を取得してpercentに設定します。
   * @param memberId メンバーID
   */
  private setPercent(memberId: number): void {
    this.isLoadingPercent = true
    const getStatusId: number = 2 // 在室
    const startDate: string = Moment().subtract(7, 'day').format('YYYY/MM/DD')
    const endDate: string = Moment().format('YYYY/MM/DD')
    this.getPresenseTime(memberId, getStatusId, startDate, endDate).then((value) => {
      const presenseMinute: number = value.data
      this.percentAll = (presenseMinute / ( 7 * 24 * 60) * 100)
      this.percentLesson = (presenseMinute / (5 * 7.5 * 60) * 100)
      this.isLoadingPercent = false
    }).catch((reason) => {
      // TODO エラー処理
      console.error(reason)
      this.isLoadingPercent = false
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

  /**
   * 一週間分のタイムラインを取得してtimeLinesに設定します。
   * @param memberId メンバーID
   */
  private setTimelineData(memberId: number): void {
    this.isLoadingTimelines = true
    const startDate: string = Moment().subtract(7, 'day').format('YYYY/MM/DD')
    const endDate: string = Moment().format('YYYY/MM/DD')
    this.getTimelineData(memberId, startDate, endDate).then((value) => {
      this.timeLines = value.data
      this.isLoadingTimelines = false
    }).catch((reason) => {
      // TODO エラー処理
      console.error(reason)
      this.isLoadingTimelines = false
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
