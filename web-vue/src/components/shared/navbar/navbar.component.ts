import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';
import { Link } from './link';
import { Logger } from '../../../util/log';

@Component({
  template: require('./navbar.component.html')
})
export class NavbarComponent extends Vue {
  protected logger: Logger;

  @Prop({ default: true })
  inverted: boolean; // default value

  object: { default: string } = { default: 'Default object property!' }; // objects as default values don't need to be wrapped into functions

  links: Link[] = [
    new Link('AllLogs', '/')
  ];

  @Watch('$route.path')
  pathChanged() {
    this.logger.info('Changed current path to: ' + this.$route.path);
  }

  mounted() {
    if (!this.logger) {
      this.logger = new Logger();
    }
    this.$nextTick(() => this.logger.info(this.object.default));
  }
}
