import { configure } from '@storybook/vue';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);