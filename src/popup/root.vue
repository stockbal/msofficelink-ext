<template>
    <div class="popup">
        <div class="popup-title flex flex--row flex--align-center">
            <img class="popup-icon" src="../../static/icons/Icon128.png" alt="image">
            <h2>MS Office Link</h2>
        </div>
        <el-tabs class="popup-tabs" :value="currentTab">
            <el-tab-pane v-if="form.linkHistoryActive" label="Link History" name="history" class="popup-tabs__history flex flex--column">
                <el-table :data="tableData"
                          border
                          height="350"
                          style="width: 100%">
                    <el-table-column label="Type"
                                     width="60">
                        <template slot-scope="scope">
                            <img v-if="scope.row.type === 'word'" src="../../static/icons/word-app.svg" width="20px"
                                 alt="word">
                            <img v-else-if="scope.row.type === 'excel'" src="../../static/icons/excel-app.svg"
                                 width="20px"
                                 alt="word">
                            <img v-else src="../../static/icons/powerpoint-app.svg" width="20px" alt="word">
                        </template>
                    </el-table-column>
                    <el-table-column prop="file"
                                     label="Name">
                    </el-table-column>
                    <el-table-column label="Action" width="70">
                        <template slot-scope="scope">
                            <el-button round icon="el-icon-more" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="show-history-btn">Show full history</el-button>
            </el-tab-pane>
            <el-tab-pane label="Options" name="options">
                <el-form ref="form" :model="form" label-width="170px">
                    <el-form-item label="Activate Link History">
                        <el-switch v-model="form.linkHistoryActive" @change="onSubmit"></el-switch>
                    </el-form-item>
                    <el-form-item label="Maximum Link History">
                        <el-input-number v-model="form.maxLinkHistory" @change="onSubmit" :disabled="!form.linkHistoryActive" controls-position="right"></el-input-number>
                    </el-form-item>
                    <el-form-item label="Default Link Action">
                        <el-select v-model="form.linkDefaultAction" placeholder="please select your zone" @change="onDefaultActionChange">
                            <el-option label="Original" value="original"></el-option>
                            <el-option label="Show option dialog" value="dialog"></el-option>
                            <el-option label="Open in edit mode" value="edit"></el-option>
                            <el-option label="Open in protected mode" value="read"></el-option>
                            <el-option label="Open online" value="online"></el-option>
                            <el-option label="Download file" value="download"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import FormEntry from '../assets/components/FormEntry';

export default {
  components: {
    FormEntry
  },
  data: () => ({
    currentTab: 'options',
    form: {
      linkHistoryActive: false,
      linkDefaultAction: 'original',
      maxLinkHistory: 10
    },
    tableData: []
  }),
  created() {
    chrome.storage.sync.get('settings', value => {
      Object.assign(this.form, value.settings);
      if (this.form.linkHistoryActive) {
        this.currentTab = 'history';
      }
    });
  },
  methods: {
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
      chrome.storage.sync.set({ settings: this.form }, () => {
        afterSetFunction();
      });
    }
  }
};
</script>
<style lang="scss">
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
    padding: 5px 0;
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

  margin-right: 15px;
}

.popup-title {
  border-radius: 28px 0 0 28px;
  border: 1px solid #e5d8d9;
  padding: 3px 14px;
  background: #0195f9;
  box-shadow: 1px 1px 10px inset #0064a7;
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
</style>
