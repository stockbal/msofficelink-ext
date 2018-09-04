<template>
    <div class="popup">
        <div class="popup-title flex flex--row flex--align-center">
            <img class="popup-icon" src="../../static/icons/icon.svg" alt="image">
            <h2>MS Doc Link</h2>
        </div>
        <el-tabs class="popup-tabs" :value="currentTab">
            <!-- Favorite document links -->
            <el-tab-pane name="favs">
                <span slot="label"><font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon> Favorites</span>
                <div v-if="favorites.length > 0" class="favorites-links">
                    <document-link v-for="(linkData, idx) in favorites" :key="idx" :link="linkData" mode="fav"
                                   @favChanged="onIsFavChanged(linkData, idx)"></document-link>
                </div>
                <div v-else class="favorites--empty flex flex--column flex--align-center">
                    <span>No Favorites yet</span>
                </div>
                <div v-if="favorites.length > 0" class="favorites__actions flex flex--row">
                    <el-button class="show-history-btn" @click="openFavAndHistory" size="medium">Show all favorites</el-button>
                    <el-button class="show-history-btn" @click="clearFavorites" size="medium">Delete all favorites</el-button>
                </div>
            </el-tab-pane>
            <!-- History entries -->
            <el-tab-pane name="history" :disabled="!settings.linkHistoryActive"
                         class="popup-tabs__history flex flex--column">
                <span slot="label"><font-awesome-icon icon="history"></font-awesome-icon> History</span>
                <div v-if="history.length > 0" class="history-links">
                    <document-link v-for="(linkData, idx) in history" :key="idx" :link="linkData"
                                   @favChanged="onIsFavInHistoryChanged(linkData)"></document-link>
                </div>
                <div v-else class="history--empty flex flex--column flex--align-center">
                    <span>No History entries yet</span>
                </div>
                <div v-if="history.length > 0" class="history__actions flex flex--row">
                    <el-button class="show-history-btn" @click="openFavAndHistory" size="medium">Show full history</el-button>
                    <el-button class="show-history-btn" @click="clearHistory" size="medium">Clear History</el-button>
                </div>
            </el-tab-pane>
            <!-- Extension options -->
            <el-tab-pane name="options">
                <span slot="label"><font-awesome-icon icon="cog"></font-awesome-icon> Options</span>
                <el-form ref="settings" :model="settings" label-width="170px">
                    <el-form-item label="Default Visible Menu">
                        <el-select v-model="settings.popupDefaultTab"
                                   @change="onSubmit">
                            <el-option label="Favorites" value="favs"></el-option>
                            <el-option label="History" value="history"></el-option>
                            <el-option label="Options" value="options"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Default Link Action">
                        <el-select v-model="settings.linkDefaultAction"
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
                    <el-form-item label="Activate Link History">
                        <el-switch v-model="settings.linkHistoryActive" @change="onSubmit"></el-switch>
                    </el-form-item>
                    <el-form-item label="Maximum Link History">
                        <el-input-number v-model="settings.maxLinkHistory" @change="onSubmit"
                                         :disabled="!settings.linkHistoryActive" :max="100" :min="5"
                                         controls-position="right"></el-input-number>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ExtStorage } from '../ext/storage';
import LinkActions from '../assets/components/LinkActions';
import DocumentLink from '../assets/components/DocumentLink';

export default {
  components: {
    DocumentLink,
    LinkActions
  },
  data: () => ({
    currentTab: 'options',
    settings: {
      linkHistoryActive: false,
      linkDefaultAction: 'original',
      popupDefaultTab: 'options',
      openInNewTab: false,
      maxLinkHistory: 10
    },
    history: [],
    favorites: []
  }),
  async created() {
    const settings = await ExtStorage.getSettings();
    Object.assign(this.settings, settings);

    this.history = await ExtStorage.getHistoryLinks();

    this.refreshFavorites();

    if (this.popupDefaultTab === 'history' && !this.settings.linkHistoryActive) {
      this.currentTab = 'favs';
    } else {
      this.currentTab = this.settings.popupDefaultTab;
    }
  },
  methods: {
    async refreshFavorites() {
      this.favorites = await ExtStorage.getFavoriteLinks();
    },
    onIsFavChanged(link, idx) {
      this.favorites.splice(idx, 1);
      ExtStorage.removeLinkFromFavorites(link.href);
    },
    onIsFavInHistoryChanged(link) {
      if (link.isFav) {
        ExtStorage.addLinkToFavorites(link);
        this.favorites.push(link);
      } else {
        // try to remove it from the favories
        ExtStorage.removeLinkFromFavorites(link.href);
        // find the favorites link in array
        const favIndex = this.favorites.findIndex(lnk => lnk.href === link.href);
        if (favIndex !== -1) {
          this.favorites.splice(favIndex, 1);
        }
      }
    },
    openFavAndHistory() {
      chrome.tabs.create({ url: 'pages/history.html' });
    },
    clearFavorites() {
      ExtStorage.clearLinkFavorites();
      this.favorites = [];
      this.$message('Favorites have been deleted');
    },
    clearHistory() {
      ExtStorage.clearLinkHistory();
      this.history = [];
      this.$message('Link history was deleted');
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
@import '../assets/css/base';
@import '../assets/css/scrollbar';

body {
  font-family: Google Sans, Roboto, sans-serif;
}

hr {
  margin: 20px 0;
  border-top: 1px solid #f3f3f3;
}

.popup {
  user-select: none;
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
  font-size: 10px;
  line-height: 2;
}

.history-action__option {
  font-size: 13px;
  padding: 5px 7px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f3f3f3;
  }
  &:active {
    background: darken(#e5e5e5, 5%);
    font-weight: 600;
  }
}

.history-action {
  &.el-popover {
    padding: 0;
  }
}

.favorites-links,
.history-links {
  height: 350px;
  overflow: auto;
}

.favorites--empty,
.history--empty {
  span {
    margin: auto;
  }
  height: 350px;
  font-size: 15px;
}
</style>
