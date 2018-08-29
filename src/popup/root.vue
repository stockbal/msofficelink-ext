<template>
    <div class="popup">
        <div class="popup-title flex flex--row flex--align-center">
            <img class="popup-icon" src="../../static/icons/icon.svg" alt="image">
            <h2>MS Doc Link</h2>
        </div>
        <el-tabs class="popup-tabs" :value="currentTab">
            <el-tab-pane v-if="settings.linkHistoryActive" label="Link History" name="history"
                         class="popup-tabs__history flex flex--column">
                <el-table :data="history"
                          border
                          height="350"
                          style="width: 100%">
                    <el-table-column label="Type" class-name="history-type"
                                     width="60">
                        <template slot-scope="scope">
                            <img v-if="scope.row.type === 'ms-word'" src="../../static/icons/word-app.svg" width="20px"
                                 alt="word">
                            <img v-else-if="scope.row.type === 'ms-excel'" src="../../static/icons/excel-app.svg"
                                 width="20px"
                                 alt="word">
                            <img v-else src="../../static/icons/powerpoint-app.svg" width="20px" alt="word">
                        </template>
                    </el-table-column>
                    <el-table-column prop="file"
                                     label="Name">
                    </el-table-column>
                    <el-table-column label="Action" width="70" class-name="history-action">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="left"
                                    width="160"
                                    v-model="scope.row.actionMenuVisible">
                                <div class="history-action__options">
                                    <el-radio v-model="chosenOption" label="read">Open Protected</el-radio>
                                    <el-radio v-model="chosenOption" label="edit">Open Editable</el-radio>
                                    <el-radio v-model="chosenOption" label="online">Open Online</el-radio>
                                    <el-radio v-model="chosenOption" label="download">Download</el-radio>
                                </div>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="scope.row.actionMenuVisible = false">
                                        cancel
                                    </el-button>
                                    <el-button type="primary" size="mini" @click="confirmHistoryLinkAction(scope.row)">
                                        Confirm
                                    </el-button>
                                </div>
                                <el-button slot="reference" round icon="el-icon-more" circle></el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="history__actions flex flex--row">
                <el-button class="show-history-btn" @click="openHistory">Show full history</el-button>
                <el-button class="show-history-btn" @click="clearHistory">Clear History</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Options" name="options">
                <el-form ref="settings" :model="settings" label-width="170px">
                    <el-form-item label="Activate Link History">
                        <el-switch v-model="settings.linkHistoryActive" @change="onSubmit"></el-switch>
                    </el-form-item>
                    <el-form-item label="Maximum Link History">
                        <el-input-number v-model="settings.maxLinkHistory" @change="onSubmit"
                                         :disabled="!settings.linkHistoryActive" :max="100" :min="5"
                                         controls-position="right"></el-input-number>
                    </el-form-item>
                    <el-form-item label="Default Link Action">
                        <el-select v-model="settings.linkDefaultAction" placeholder="please select your zone"
                                   @change="onDefaultActionChange">
                            <el-option label="Original" value="original"></el-option>
                            <el-option label="Show option dialog" value="dialog"></el-option>
                            <el-option label="Open in edit mode" value="edit"></el-option>
                            <el-option label="Open in protected mode" value="read"></el-option>
                            <el-option label="Open online" value="online"></el-option>
                            <el-option label="Download file" value="download"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Open in new Tab">
                        <el-switch v-model="settings.openInNewTab" @change="onSubmit"></el-switch>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import FormEntry from '../assets/components/FormEntry';
import { ExtStorage } from '../ext/storage';
import { LinkHandler } from '../util';

export default {
  components: {
    FormEntry
  },
  data: () => ({
    currentTab: 'options',
    settings: {
      linkHistoryActive: false,
      linkDefaultAction: 'original',
      openInNewTab: false,
      maxLinkHistory: 10
    },
    actionPopoverVisible: true,
    chosenOption: 'online',
    history: []
  }),
  async created() {
    const settings = await ExtStorage.getSettings();
    Object.assign(this.settings, settings);
    if (this.settings.linkHistoryActive) {
      this.currentTab = 'history';
    }
    // read history
    const history = await ExtStorage.getLinkHistory();
    this.history = history.links;
  },
  methods: {
    openHistory() {
      chrome.tabs.create({ url: 'pages/history.html' });
    },
    clearHistory() {
      ExtStorage.clearLinkHistory();
      this.history = [];
      this.$message('Link history was deleted');
    },
    confirmHistoryLinkAction(linkRow) {
      // hide popover
      linkRow.actionMenuVisible = false;
      new LinkHandler(this.chosenOption, linkRow.link).sendTabUpdateImmediately(true);
    },
    onDefaultActionChange(newValue) {
      if (newValue === 'original') {
        // page refresh may be needed
        this.$message({
          message: 'To get the original link action back a page refresh may be needed',
          type: 'warning'
        });
      }
      this.onSubmit(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'updateLinks' });
        });
      });
    },
    onSubmit(afterSetFunction = () => {}) {
      chrome.storage.sync.set({ settings: this.settings }, () => {
        afterSetFunction();
      });
    }
  }
};
</script>
<style lang="scss">
@import '../assets/css/element-ui.scss';

body {
  font-family: Google Sans, Roboto, sans-serif;
}

hr {
  margin: 20px 0;
  border-top: 1px solid #f3f3f3;
}

.popup {
  .el-table th,
  .el-table td {
    padding: 2px 0;
  }

  .el-tabs__item {
    font-size: 15px;
  }

  width: 500px;

  .form-entry__label {
    width: 120px;
    font-size: 14px;
  }
}

.popup-icon {
  width: 50px;
  margin: 0 15px 0 -8px;
}

.popup-title {
  border-radius: 28px 0 0 28px;
  border: 1px solid #e5d8d9;
  padding: 3px 14px;
  background: $--color-primary;
  box-shadow: 1px 1px 10px inset darken($--color-primary, 20%);
  color: white;
  margin: 0 -15px 0 0;
}

.popup-tabs {
  padding: 5px;
}

.popup-tabs__history {
  .show-history-btn {
    margin: 5px 0 0 0;
  }
}

.history-type {
  img {
    vertical-align: middle;
  }
}

.history-action__options {
  padding: 0 0 5px 0;
  font-size: 10px;
  line-height: 2;

  .el-radio {
    & + .el-radio {
      margin-left: 0;
    }
  }
}
</style>
