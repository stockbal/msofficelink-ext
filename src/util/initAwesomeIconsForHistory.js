import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faGlobe,
  faGlasses,
  faDownload,
  faFolderOpen,
  faFileAlt,
  faFile,
  faHistory,
  faCog,
  faStar as faStarSolid,
  faTimesCircle,
  faTimes,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faLink,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { faStar, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from '@fortawesome/vue-fontawesome';

library.add(
  faEdit,
  faGlobe,
  faGlasses,
  faDownload,
  faFolderOpen,
  faFileAlt,
  faFile,
  faStar,
  faHistory,
  faStarSolid,
  faCog,
  faTrashAlt,
  faTimesCircle,
  faTimes,
  faFileExcel,
  faFileWord,
  faFilePowerpoint,
  faLink,
  faCopy
);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);
Vue.component(FontAwesomeLayers.name, FontAwesomeLayers);
Vue.component(FontAwesomeLayersText.name, FontAwesomeLayersText);
