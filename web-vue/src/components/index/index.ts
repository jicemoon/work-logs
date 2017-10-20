import { NavbarComponent } from './../shared/navbar/navbar.component';
import Vue from 'vue';
import Component from 'vue-class-component';

import './index.scss';

@Component({
    template: require('./index.html'),
    components: {
      'navbar': NavbarComponent
    }
})
export class IndexComponent extends Vue {}
