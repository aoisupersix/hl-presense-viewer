import { Component, Vue } from 'vue-property-decorator'
import axios, { AxiosPromise } from 'axios'
import Moment from 'moment'
import OccupancyRate from '@/components/OccupancyRate/OccupancyRate'

@Component({
  components: {
    OccupancyRate
  }
})
export default class StatusDetailModal extends Vue {
  private isOpen: boolean = false
  private id!: number
  private member!: any
  private states!: any
  private percentAll: number = 0
  private percentLesson: number = 0
  private timeLines!: any
  private occupancyIsLoading: boolean = false
  private isLoadingTimelines: boolean = false

  public openModal(id: number, members: any, states: any): void {
    this.id = id
    this.member = members[id]
    this.states = states
    this.isOpen = true

    this.setTimelineData(id)
  }

  public closeModal() {
    this.isOpen = false
    this.percentAll = 0
    this.percentLesson = 0
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
