<template>
  <div class="popup">
    <div class="popup-title flex flex--row flex--align-center">
      <img class="popup-icon" src="../../static/icons/icon.svg" alt="image" />
      <h2>{{ $i18n('extName') }}</h2>
    </div>
    <div class="popup-settings-link">
      <el-link @click="openSettings"
        ><font-awesome-icon icon="cog" /> {{ $i18n('OptionTab_options') }}</el-link
      >
    </div>
    <el-tabs class="popup-tabs" :value="currentTab">
      <!-- Favorite document links -->
      <el-tab-pane name="favs">
        <span slot="label"
          ><font-awesome-icon :icon="['fas', 'star']"></font-awesome-icon>
          {{ $i18n('OptionTab_favs') }}</span
        >
        <div v-if="favorites.length > 0" class="favorites-links">
          <document-link
            v-for="(linkData, idx) in favorites"
            :key="idx"
            :link="linkData"
            mode="fav"
            @favChanged="onIsFavChanged(linkData, idx)"
          ></document-link>
        </div>
        <div v-else class="favorites--empty flex flex--column flex--align-center">
          <span>{{ $i18n('MSG_noFavorites') }}</span>
        </div>
        <div v-if="favorites.length > 0" class="favorites__actions flex flex--row">
          <el-button class="show-history-btn" @click="openFavAndHistory" size="medium">{{
            $i18n('Btn_showAllFavs')
          }}</el-button>
          <clear-favorites-button
            class="show-history-btn"
            size="medium"
            @cleared="favorites = []"
          ></clear-favorites-button>
        </div>
      </el-tab-pane>
      <!-- History entries -->
      <el-tab-pane
        name="history"
        :disabled="!settings.linkHistoryActive"
        class="popup-tabs__history flex flex--column"
      >
        <span slot="label"
          ><font-awesome-icon icon="history"></font-awesome-icon>
          {{ $i18n('OptionTab_history') }}</span
        >
        <div v-if="history.length > 0" class="history-links">
          <document-link
            v-for="(linkData, idx) in history"
            :key="idx"
            :link="linkData"
            @favChanged="onIsFavInHistoryChanged(linkData)"
          ></document-link>
        </div>
        <div v-else class="history--empty flex flex--column flex--align-center">
          <span>{{ $i18n('MSG_noHistory') }}</span>
        </div>
        <div v-if="history.length > 0" class="history__actions flex flex--row">
          <el-button class="show-history-btn" @click="openFavAndHistory" size="medium">{{
            $i18n('Btn_showHistory')
          }}</el-button>
          <clear-history-button
            class="show-history-btn"
            @cleared="history = []"
            size="medium"
          ></clear-history-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ExtStorage } from '../ext/ExtStorage';
import LinkActions from '../assets/components/LinkActions';
import DocumentLink from '../assets/components/DocumentLink';
import ClearFavoritesButton from '../assets/components/ClearFavoritesButton';
import ClearHistoryButton from '../assets/components/ClearHistoryButton';

export default {
  components: {
    ClearHistoryButton,
    ClearFavoritesButton,
    DocumentLink,
    LinkActions
  },
  data: () => ({
    currentTab: 'favs',
    settings: {},
    history: [],
    favorites: []
  }),
  async created() {
    const settings = await ExtStorage.getSettings();
    Object.assign(this.settings, settings);

    this.history = await ExtStorage.getHistoryLinks();
    this.history.sort((link1, link2) => link1.openedOn < link2.openedOn);
    this.history = this.history.slice(0, 20);

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
    },
    onIsFavInHistoryChanged(link) {
      if (link.isFav) {
        this.favorites.push(link);
      } else {
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
    openSettings() {
      chrome.runtime.openOptionsPage();
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

  width: 540px;

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

.popup-tabs__options {
  .el-select {
    width: 250px;
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

.popup-filterlist__input textarea {
  white-space: nowrap;
}

.popup-settings-link {
  position: fixed;
  top: 25px;
  right: 20px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 3px;
  .el-link {
    color: white !important;
  }
  &:hover {
    border-color: #ffffff61;
  }
}
</style>
