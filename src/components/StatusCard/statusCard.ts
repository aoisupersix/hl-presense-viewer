import { Component, Vue, Prop, } from 'vue-property-decorator';

@Component
export default class StatusCard extends Vue {
  @Prop({ type: String })
  public color!: string

  @Prop({ type: String })
  public name!: string

  @Prop({ type: String })
  public statusText!: string

  @Prop({ type: Boolean })
  public isShowingStatusDetail!: boolean

  @Prop({ type: String })
  public statusDetailText!: string

  @Prop({ type: String })
  public lastUpdateText!: string
}

Vue.component('status-card', StatusCard)
