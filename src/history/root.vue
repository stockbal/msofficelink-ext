<template>
    <div class="links">
        <header class="links__header">
            <img src="../../static/icons/icon.svg">
            <div class="search-bar" v-if="!selectedLinks.length">
                <el-input autofocus class="link-search" v-model="search" :placeholder="$i18n('History_search')"
                          @change="onSearchChange">
                    <span v-if="search" slot="append" class="link-search__clear" :title="$i18n('Tip_searchClass')"
                          @click="onClearSearch">
                        <font-awesome-icon icon="times-circle"></font-awesome-icon>
                    </span>
                </el-input>
            </div>
            <div class="toolbar flex flex--row flex--align-center" v-else>
                <el-button class="toolbar__cancel" type="text" :title="$i18n('Cancel')" @click="cancelSelection">
                    <font-awesome-icon icon="times"></font-awesome-icon>
                </el-button>
                <span class="toolbar__select-text">{{$i18n('History_entriesSelected', [selectedLinks.length])}}</span>
                <el-button type="text" @click="cancelSelection">{{$i18n('Cancel')}}</el-button>
                <el-button type="text">{{$i18n('Delete')}}</el-button>
            </div>
        </header>
        <main>
            <section v-if="favorites.length && !loading" class="links__entries--favorites">
                <h2 class="section--header">{{$i18n('OptionTab_favs')}}</h2>
                <document-link v-for="(link, idx) in favorites" :key="idx" :link="link" checkable mode="fav"
                               v-on:update:checked="onCheck(link, $event)"
                               @favChanged="onFavChanged(linkData)"></document-link>
            </section>
            <section v-else class="flex links__empty" v-loading="loading">
                <h3>{{$i18n('MSG_favsEmptyInfoText')}}</h3>
            </section>
            <div v-if="hasHistory && !loading">
                <section v-for="(historyByDate, key) in history" :key="key" class="links__entries--history">
                    <h2 class="section--header">{{key}}</h2>
                    <document-link v-for="(link, idx) in historyByDate.links" :key="idx" :link="link" checkable
                                   mode="history-page" @favChanged="onFavChanged(link)"
                                   v-on:update:checked="onCheck(link, $event)"></document-link>
                </section>
            </div>
            <section v-else class="flex links__empty" v-loading="loading">
                <h3>{{$i18n('MSG_historyEmptyInfoText')}}</h3>
            </section>
        </main>
    </div>
</template>
<script>
import { ExtStorage } from '../ext/storage';
import DocumentLink from '../assets/components/DocumentLink';

export default {
  components: { DocumentLink },
  data: () => ({
    favorites: [],
    search: '',
    history: {},
    loading: true,
    selectedLinks: []
  }),
  computed: {
    hasHistory() {
      return !!(this.history && Object.keys(this.history).length > 0);
    }
  },
  async created() {
    // read history
    this.favorites = await ExtStorage.getFavoriteLinks();
    const tempHistory = await ExtStorage.getHistoryLinks();
    tempHistory.sort((link1, link2) => link1.openedOn < link2.openedOn);
    tempHistory.forEach(link => {
      const openedOn = new Date(link.openedOn).toLocaleDateString(chrome.i18n.getUILanguage(), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      // check if there already is a link for this date
      let historyForDate = this.history[openedOn];
      if (historyForDate) {
        historyForDate.links.push(link);
      } else {
        this.$set(this.history, openedOn, { links: [link] });
      }
    });
    window.setTimeout(() => {
      this.loading = false;
    }, 300);
  },
  methods: {
    onSearchChange(value) {},
    onClearSearch() {
      this.search = '';
      // show all links
    },
    onFavChanged(link) {
      if (link.isFav) {
        this.favorites.push(link);
      } else {
        const linkToRemove = this.favorites.findIndex(el => el.href === link.href);
        if (linkToRemove !== -1) {
          this.favorites.splice(linkToRemove, 1);
        }
      }
    },
    cancelSelection() {
      this.selectedLinks.forEach(link => {
        link.checked = false;
      });
      this.selectedLinks = [];
    },
    checkSelection() {},
    onCheck(link, checked) {
      // link.checked = checked;
      if (link.checked) {
        this.selectedLinks.push(link);
      } else {
        // find link and remove it
        const linkToRemove = this.selectedLinks.findIndex(el => el.href === link.href);
        if (linkToRemove !== -1) {
          this.selectedLinks.splice(linkToRemove, 1);
        }
      }
    },
    clearHistory() {
      ExtStorage.clearLinkHistory();
      this.$message('Link history was deleted');
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/scrollbar';

$maxWidth: 1024px;

.el-checkbox {
  + .el-checkbox {
    margin: 0;
  }
}

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

.links__header {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  height: 75px;
  background: linear-gradient(45deg, $--word 0%, $--excel 100%);
  padding: 15px 20px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);

  img {
    padding: 5px;
    width: 60px;
    position: fixed;
    left: 10px;
    top: 8px;
  }
  .search-bar {
    margin: 0 auto;
    max-width: 550px;
  }
  .toolbar {
    margin: 0 auto;
    font-size: 13px;
    max-width: $maxWidth;

    .toolbar__cancel {
    }

    .toolbar__select-text {
      flex: 1;
      color: white;
      padding: 0 20px;
    }
    .el-button {
      color: white;
      font-size: inherit;
      font-family: inherit;
      text-transform: uppercase;
    }
  }
}

main {
  width: 100%;
  margin-top: 120px;

  section {
    max-width: $maxWidth;
    background: white;
    margin: 10px auto 20px;
    border-radius: 2px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 1170px) {
  .links__header {
    img {
      display: none;
    }
  }
}

.links__entries {
  padding: 5px;
}

.links__toolbar {
  * {
    padding: 5px;
  }
}

.link-search {
  .el-input__inner,
  .el-input-group__append {
    border: none;
    background: transparent;
    border-bottom: 1px solid #aba5a5;
    border-radius: 0;
    padding: 0;
  }
  .el-input__inner {
    font-size: 17px;
    color: white;
  }
  .el-input-group__append {
    font-size: 20px;
  }
  .link-search__clear {
    cursor: pointer;
    color: white;
  }
}

.links__empty {
  h2,
  h3 {
    margin: 75px auto;
    font-weight: 200;
  }
}

.section--header {
  margin: 0;
  border-bottom: 1px solid #d5d5d5;
  font-weight: 200;
  padding: 10px 8px;
}

.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2000;
}
</style>
