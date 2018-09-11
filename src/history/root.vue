<template>
    <div class="links">
        <header class="links__header">
            <img src="../../static/icons/icon.svg">
            <div class="search-bar" v-if="!selectedLinksCount">
                <el-input autofocus class="link-search" v-model="search" :placeholder="$i18n('History_search')"
                          @input="onSearchChange">
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
                <span class="toolbar__select-text">{{$i18n('History_entriesSelected', [selectedLinksCount])}}</span>
                <el-button type="text" @click="cancelSelection">{{$i18n('Cancel')}}</el-button>
                <el-button type="text" @click="deleteSelection">{{$i18n('Delete')}}</el-button>
            </div>
        </header>
        <main>
            <section v-if="favorites.length && !loading" class="links__entries--favorites">
                <h2 v-if="!search" class="section--header flex flex--row">
                    <span>{{$i18n('OptionTab_favs')}}</span>
                    <clear-favorites-button @cleared="clearFavs" type="text"></clear-favorites-button>
                </h2>
                <h2 v-else class="section--header flex flex--row">
                    {{favSearchResultText}}
                </h2>
                <document-link v-if="isInFavSearchResult(link)" v-for="(link, idx) in favorites" :key="idx" :link="link"
                               checkable mode="fav"
                               v-on:update:checked="onCheck('fav', link)"
                               @favChanged="onFavChanged(link)"></document-link>
            </section>
            <section v-else class="flex links__empty" v-loading="loading">
                <h3>{{$i18n('MSG_favsEmptyInfoText')}}</h3>
            </section>
            <section v-if="history.length && !loading" class="links__entries--history">
                <h2 v-if="!search" class="section--header flex flex--row">
                    <span>{{$i18n('OptionTab_history')}}</span>
                    <clear-history-button @cleared="history = []" type="text"></clear-history-button>
                </h2>
                <h2 v-else class="section--header flex flex--row">
                    {{historySearchResultText}}
                </h2>
                <document-link v-if="isInHistorySearchResult(link)" v-for="(link, idx) in history" :key="idx"
                               :link="link" checkable
                               mode="history-page" @favChanged="onFavChanged(link)" :show-opened-on="true"
                               v-on:update:checked="onCheck('hist', link)"></document-link>
            </section>
            <section v-else class="flex links__empty" v-loading="loading">
                <h3>{{$i18n('MSG_historyEmptyInfoText')}}</h3>
            </section>
        </main>
    </div>
</template>
<script>
import { ExtStorage } from '../ext/storage';
import { off, on } from '../util';
import DocumentLink from '../assets/components/DocumentLink';
import ClearFavoritesButton from '../assets/components/ClearFavoritesButton';
import ClearHistoryButton from '../assets/components/ClearHistoryButton';

export default {
  components: { ClearHistoryButton, ClearFavoritesButton, DocumentLink },
  data: () => ({
    favorites: [],
    search: '',
    history: [],
    resultInHistory: [],
    resultInFavs: [],
    loading: true,
    selectedFavs: [],
    selectedHistory: [],
    searchTimer: null
  }),
  computed: {
    selectedLinksCount() {
      return this.selectedFavs.length + this.selectedHistory.length;
    },
    historySearchResultText() {
      return this.$i18n('MSG_searchResultText', [
        this.resultInHistory.length,
        this.resultInHistory.length !== 1 ? this.$i18n('ResultPluralSuffix') : '',
        this.$i18n('OptionTab_history'),
        this.search
      ]);
    },
    favSearchResultText() {
      return this.$i18n('MSG_searchResultText', [
        this.resultInFavs.length,
        this.resultInFavs.length !== 1 ? this.$i18n('ResultPluralSuffix') : '',
        this.$i18n('OptionTab_favs'),
        this.search
      ]);
    }
  },
  async created() {
    on(document, 'keydown', this.onSearch);
    // read history
    const favorites = await ExtStorage.getFavoriteLinks();
    favorites.forEach(link => {
      link.checked = false;
    });
    this.favorites = favorites;
    await this.readHistory();

    window.setTimeout(() => {
      this.loading = false;
    }, 300);
  },
  mounted() {
    this.$refs.search = this.$el.querySelector('.link-search').querySelector('input');
  },
  destroyed() {
    off(document, 'keydown', this.onSearch);
  },
  methods: {
    onSearch(e) {
      if (e.keyCode === 70) {
        if (e.ctrlKey && !e.altKey && !e.shiftKey) {
          this.$refs.search.focus();
          this.$refs.search.select();
          e.preventDefault();
          return;
        }
      }
      if (e.keyCode === 27) {
        if (document.activeElement === this.$refs.search) {
          this.onClearSearch();
          e.preventDefault();
        }
      }
    },
    async readHistory() {
      const history = await ExtStorage.getHistoryLinks();
      history.sort((link1, link2) => new Date(link2.openedOn) - new Date(link1.openedOn));
      history.forEach(link => {
        link.checked = false;
        link.openedOn = new Date(link.openedOn).toLocaleDateString(chrome.i18n.getUILanguage(), {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
      this.history = history;
    },
    isInHistorySearchResult(link) {
      return !this.search || this.resultInHistory.includes(link);
    },
    isInFavSearchResult(link) {
      return !this.search || this.resultInFavs.includes(link);
    },
    async clearFavs() {
      this.favorites = [];
      this.history = [];
      await this.readHistory();
    },
    onSearchChange(value) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      if (!this.timer) {
        this.timer = window.setTimeout(() => {
          this.resultInFavs = [];
          this.resultInHistory = [];

          value = value.toLowerCase();

          const search = (source, result) => {
            source.forEach(link => {
              if (
                link.href.toLowerCase().includes(value) ||
                link.file.toLowerCase().includes(value)
              ) {
                result.push(link);
              }
            });
          };
          search(this.history, this.resultInHistory);
          search(this.favorites, this.resultInFavs);
        }, 500);
      }
    },
    onClearSearch() {
      this.search = '';
      this.resultInFavs = [];
      this.resultInHistory = [];
    },
    onFavChanged(link) {
      if (link.isFav) {
        const linkClone = Object.assign({}, link);
        linkClone.checked = false;
        this.favorites.push(linkClone);
      } else {
        const linkToRemove = this.favorites.findIndex(el => el.href === link.href);
        if (linkToRemove !== -1) {
          this.favorites.splice(linkToRemove, 1);
        }
        // check if this is a history link
        if (this.history) {
          const historyLink = this.history.find(el => el.href === link.href);
          if (historyLink) {
            historyLink.isFav = false;
          }
        }
      }
    },
    cancelSelection() {
      this.selectedFavs.forEach(link => {
        link.checked = false;
      });
      this.selectedHistory.forEach(link => {
        link.checked = false;
      });

      this.selectedFavs = [];
      this.selectedHistory = [];
    },
    deleteSelection() {
      // collect selected elements
      const linksToRemove = [];

      this.selectedFavs.forEach(link => {
        linksToRemove.push({ href: link.href, deleteFav: true, deleteHistory: false });
      });
      this.selectedHistory.forEach(link => {
        const existing = linksToRemove.find(el => el.href === link.href);
        if (existing) {
          existing.deleteHistory = true;
        } else {
          linksToRemove.push({ href: link.href, deleteFav: false, deleteHistory: true });
        }
      });
      ExtStorage.removeLinks(linksToRemove);

      // clear selected lists
      this.selectedHistory = [];
      this.selectedFavs = [];
      this.favorites.forEach((fav, index) => {
        if (fav.checked) {
          this.favorites.splice(index, 1);
        }
      });
      this.history.forEach((historyEntry, index) => {
        if (historyEntry.checked) {
          this.history.splice(index, 1);
        }
      });
    },
    onCheck(type, link) {
      let selectedLinks;
      if (type === 'fav') {
        selectedLinks = this.selectedFavs;
      } else {
        selectedLinks = this.selectedHistory;
      }

      if (link.checked) {
        selectedLinks.push(link);
      } else {
        // find link and remove it
        const linkToRemove = selectedLinks.findIndex(el => el.href === link.href);
        if (linkToRemove !== -1) {
          selectedLinks.splice(linkToRemove, 1);
        }
      }
    }
  }
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

  span {
    flex: 1;
  }
  .el-button {
    text-transform: uppercase;
    padding: 0;
    color: inherit;
    font-family: inherit;
    font-weight: 200;
    &:hover {
      text-decoration: underline;
    }
  }
}

.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

@media (max-width: 1170px) {
  .links__header {
    img {
      display: none;
    }
  }
  main {
    section {
      margin: 10px 10px 20px;
    }
  }
}
</style>
