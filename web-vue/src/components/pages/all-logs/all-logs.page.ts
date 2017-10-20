import { Prop } from 'vue-property-decorator';
import Vue from 'vue';
import Component from 'vue-class-component';

import './all-logs.page.scss';

@Component({
    template: require('./all-logs.page.html')
})
export class AllLogsComponent extends Vue {

}
