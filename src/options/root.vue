<template>
  <div class="options">
    <header class="options__header">
      <div class="options__header-content flex flex--align-center">
        <img src="../../static/icons/icon.svg" />
        <h1 class="title">{{ $i18n('extName') }}</h1>
      </div>
    </header>
    <main class="options__content">
      <section>
        <h2 class="section--header">
          <font-awesome-icon icon="cog"></font-awesome-icon> {{ $i18n('OptionTab_options') }}
        </h2>
        <div class="section--content">
          <el-form
            ref="settings"
            :model="settings"
            label-width="240px"
            size="medium"
            class="popup-tabs__options"
          >
            <el-form-item :label="$i18n('Setting_popupDefaultTab')">
              <el-select v-model="settings.popupDefaultTab" @change="onSubmit">
                <el-option :label="$i18n('OptionTab_favs')" value="favs"></el-option>
                <el-option :label="$i18n('OptionTab_history')" value="history"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$i18n('Setting_defaultMenuLinkAction')">
              <el-select v-model="settings.menuLinkDefaultAction" @change="onDefaultActionChange">
                <el-option :label="$i18n('LinkOption_openEdit')" value="edit"></el-option>
                <el-option :label="$i18n('LinkOption_openProtected')" value="read"></el-option>
                <el-option :label="$i18n('LinkOption_openOnline')" value="online"></el-option>
                <el-option :label="$i18n('LinkOption_download')" value="download"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$i18n('Setting_defaultLinkAction')">
              <el-select v-model="settings.linkDefaultAction" @change="onDefaultActionChange">
                <el-option :label="$i18n('LinkOption_original')" value="original"></el-option>
                <el-option :label="$i18n('LinkOption_popover')" value="dialog"></el-option>
                <el-option :label="$i18n('LinkOption_openEdit')" value="edit"></el-option>
                <el-option :label="$i18n('LinkOption_openProtected')" value="read"></el-option>
                <el-option :label="$i18n('LinkOption_openOnline')" value="online"></el-option>
                <el-option :label="$i18n('LinkOption_download')" value="download"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$i18n('Setting_copyLinkMode')">
              <el-select v-model="settings.copyLinkMode" @change="onSubmit">
                <el-option :label="$i18n('LinkOption_original')" value="original"></el-option>
                <el-option :label="$i18n('LinkOption_openEdit')" value="edit"></el-option>
                <el-option :label="$i18n('LinkOption_openProtected')" value="read"></el-option>
                <el-option :label="$i18n('LinkOption_openOnline')" value="online"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$i18n('Setting_newTab')">
              <el-switch v-model="settings.openInNewTab" @change="onSubmit"></el-switch>
            </el-form-item>
            <el-form-item :label="$i18n('Setting_activateHistory')">
              <el-switch
                v-model="settings.linkHistoryActive"
                @change="onHistoryActivate"
              ></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <!-- Blacklist/Whitelist options for extension -->
      <section>
        <h2 class="section--header">
          <font-awesome-icon :icon="filterListIcon"></font-awesome-icon>
          {{ typeText }}
        </h2>
        <div class="section--content options__filterlist-form">
          <el-radio-group
            class="options__filterlist-form-el"
            v-model="settings.filterListType"
            @change="updateFilterListType"
          >
            <el-radio label="black">{{ $i18n('MSG_blackList') }}</el-radio>
            <el-radio label="white">{{ $i18n('MSG_whiteList') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            class="popup-filterlist__input options__filterlist-form-el"
            spellcheck="false"
            :autosize="{ minRows: 10 }"
            v-model="settings.urlFilterList"
            @input="onSubmit"
          ></el-input>
          <el-collapse value="1" accordion class="options__filterlist-form-el">
            <el-collapse-item
              :title="$i18n('MSG_filterListInfoHeader') + ' ' + typeText + '?'"
              name="1"
            >
              <div class="tip" v-html="whiteListInformation"></div>
            </el-collapse-item>
            <el-collapse-item :title="$i18n('MSG_filterPatternHelpHeader')" name="2">
              <div>
                <span v-html="$i18n('MSG_filterListManualIntro')"></span>:<br />
                <div class="tip m-t-10">
                  <span v-html="$i18n('MSG_domainFilterDescription')"></span><br />
                  {{ $i18n('Examples') }}:
                  <ul class="list">
                    <li>org.example.com</li>
                    <li>amazon.com</li>
                  </ul>
                </div>
                <div class="tip m-t-10">
                  <span v-html="$i18n('MSG_singlePageFilterDescription')"></span><br />
                  {{ $i18n('Examples') }}:
                  <ul class="list">
                    <li>https://www.amazon.com</li>
                    <li>https://en.wikipedia.org/wiki/Microsoft</li>
                  </ul>
                </div>
                <div class="tip m-t-10">
                  <span v-html="$i18n('MSG_simplePatternFilterDescription')"></span> <br />
                  {{ $i18n('Examples') }}:
                  <ul class="list">
                    <li>*reddit.com/r/privacy/*</li>
                    <li>https://github.com/stockbal/msofficelink-ext*</li>
                  </ul>
                </div>
                <div class="tip m-t-10">
                  <span v-html="$i18n('MSG_complexRegExFilterDescription')"></span><br />
                  {{ $i18n('Examples') }}:
                  <ul class="list">
                    <li><strong>/</strong>^https?://192\.168\.0\.\d+<strong>/</strong></li>
                    <li><strong>/</strong>https?://(read|lesen)\.amazon.*$<strong>/</strong></li>
                  </ul>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </section>
    </main>
    <el-backtop target=".options__content"></el-backtop>
  </div>
</template>

<script>
import { ExtStorage } from '../ext/ExtStorage';
import LinkActions from '../assets/components/LinkActions';
import DocumentLink from '../assets/components/DocumentLink';

export default {
  components: {
    DocumentLink,
    LinkActions
  },
  data: () => ({
    currentTab: 'favs',
    settings: {
      linkHistoryActive: false,
      menuLinkDefaultAction: 'online',
      linkDefaultAction: 'original',
      popupDefaultTab: 'options',
      copyLinkMode: 'original',
      openInNewTab: false,
      filterListType: 'black',
      urlFilterList: ''
    },
    typeText: '',
    typeIcon: '',
    history: [],
    favorites: []
  }),
  computed: {
    filterListIcon() {
      return this.settings.filterListType === 'white' ? 'clipboard-check' : 'ban';
    },
    whiteListInformation() {
      let notActiveText = '';
      if (this.settings.filterListType !== 'white') {
        notActiveText = ` ${this.$i18n('MSG_not')}`;
      }
      return this.$i18n('MSG_urlFilterListInfo', [
        `<strong>${this.typeText}</strong>`,
        `<strong>${notActiveText}</strong>`
      ]);
    }
  },
  async created() {
    const settings = await ExtStorage.getSettings();
    Object.assign(this.settings, settings);
    this.updateFilterListType(this.settings.filterListType);
  },
  methods: {
    updateFilterListType(type) {
      if (type === 'white') {
        this.typeText = this.$i18n('MSG_whiteList');
        this.typeIcon = 'clipboard-check';
      } else {
        this.typeText = this.$i18n('MSG_blackList');
        this.typeIcon = 'ban';
      }
      this.onSubmit();
    },
    async onHistoryActivate(newValue) {
      if (!newValue) {
        try {
          await this.$confirm(this.$i18n('MSG_deactivateHistoryWarning'), this.$i18n('Warning'), {
            confirmButtonText: this.$i18n('Yes'),
            cancelButtonText: this.$i18n('No'),
            type: 'warning'
          });
          this.onSubmit();
          // delete the history
          ExtStorage.clearLinkHistory();
        } catch (e) {
          this.settings.linkHistoryActive = true;
        }
      } else {
        this.onSubmit();
      }
    },
    onDefaultActionChange(newValue) {
      if (newValue === 'original') {
        // page refresh may be needed
        this.$message({
          message: this.$i18n('MSG_linkOptionSwitchedToOriginal'),
          type: 'warning'
        });
      }
      this.onSubmit(() => {
        chrome.tabs.query({ active: false, currentWindow: true }, tabs => {
          tabs.forEach(t => {
            chrome.tabs.sendMessage(t.id, { action: 'updateLinks' });
          });
        });
      });
    },
    onSubmit(afterSetFunction = () => {}) {
      if (afterSetFunction !== undefined && typeof afterSetFunction !== 'function') {
        afterSetFunction = () => {};
      }
      chrome.storage.sync.set({ settings: this.settings }, () => {
        afterSetFunction();
      });
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/scrollbar';

$maxWidth: 1024px;
*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  margin: 0;
  background: #f7f7f7;
  font-family: Google Sans, Roboto, sans-serif;
}

.options__header {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  height: 75px;
  background: linear-gradient(45deg, $--word 0%, $--excel 100%);
  padding: 5px 20px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
}

.options__header-content {
  margin: 0 auto;
  padding-top: 2px;
  max-width: $maxWidth;
  color: white;
  text-align: center;
  img {
    padding: 5px;
    width: 60px;
  }

  .title {
    font-weight: normal;
    padding-left: 10px;
  }
}

main {
  width: 100%;
  margin-top: 120px;
}
section {
  max-width: $maxWidth;
  background: white;
  margin: 10px auto 20px;
  border-radius: 2px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.section--header {
  margin: 0;
  border-bottom: 1px solid #d5d5d5;
  font-weight: 200;
  padding: 10px 8px;
  color: $--color-primary;

  span {
    flex: 1;
  }
}
.section--content {
  padding: 20px 10px;
}

@media (max-width: $maxWidth) {
  section {
    margin: 10px 10px 20px;
  }
}
.options__filterlist-form-el {
  margin-bottom: 10px;
  &,
  span {
    font-size: $--default-font-size;
  }
}

.options__filterlist-form {
  .options__filterlist-form-el:first-child {
    margin-top: 5px;
  }
}

code {
  background: #e2e2e2;
  border-radius: 4px;
  padding: 1px 5px;
}
</style>
