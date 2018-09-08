<template>
    <div class="links">
        <header class="links__header">
            <div class="flex flex--row flex--align-center">
                <img src="../../static/icons/icon.svg">
                <h1>{{$i18n('History_title')}}</h1>
            </div>
        </header>
        <main>
            <section class="links__toolbar flex flex--row flex--align-center">
                <el-input autofocus class="link-search" v-model="search" :placeholder="$i18n('History_search')"
                          @change="onSearchChange">
                    <span v-if="search" slot="append" class="link-search__clear" :title="$i18n('Tip_searchCleas')"
                          @click="onClearSearch">
                        <font-awesome-icon icon="times-circle"></font-awesome-icon>
                    </span>
                </el-input>

            </section>
            <section v-if="favorites.length" class="links__entries--favorites">
                <h2 class="section--header">{{$i18n('OptionTab_favs')}}</h2>
                <document-link v-for="(linkData, idx) in favorites" :key="idx" :link="linkData" checkable mode="fav"
                               :checked.sync="linkData.checked" v-on:update:checked="onCheck"></document-link>
            </section>
            <section v-else class="flex links__empty">
                <h3>{{$i18n('MSG_favsEmptyInfoText')}}</h3>
            </section>
            <div v-if="hasHistory">
                <section v-for="(historyByDate, key) in history" :key="key" class="links__entries--history">
                    <h2 class="section--header">{{key}}</h2>
                    <document-link v-for="(link, idx) in historyByDate.links" :key="idx" :link="link" checkable
                                   mode="history-page"
                                   :checked.sync="link.checked" v-on:update:checked="onCheck"></document-link>
                </section>
            </div>
            <section v-else class="flex links__empty">
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
    history: {}
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
      console.log(link.openedOn);
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
  },
  methods: {
    onSearchChange(value) {},
    onClearSearch() {
      this.search = '';
      // show all links
    },
    onCheck(val) {},
    clearHistory() {
      ExtStorage.clearLinkHistory();
      this.documentLinks = [];
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
  height: 100px;
  background: linear-gradient(45deg, $--word 0%, $--excel 100%);
  padding: 15px 20px;

  div {
    img {
      padding: 0 10px 0 0;
      width: 80px;
    }
    margin: 0 auto;
    max-width: $maxWidth;

    h1 {
      color: white;
      font-size: 300%;
      font-weight: 200;
    }
  }
}

main {
  width: 100%;

  section {
    max-width: $maxWidth;
    background: white;
    margin: 20px auto 0;
    border-radius: 2px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 1080px) {
  .links__header {
    img {
      width: 50px;
    }
    h1 {
      font-size: 200%;
    }
  }
  header {
    height: 80px;
    padding: 20px 20px 0;
  }
  main {
    margin-top: 0;
    padding: 5px;
    border-radius: 0;
    box-shadow: none;
    border: none;
    max-width: none;
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
  .el-input__inner {
    border: none;
    font-size: 17px;
  }
  .el-input-group__append {
    border: none;
    background: transparent;
    font-size: 25px;
  }
  .link-search__clear {
    cursor: pointer;
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
</style>
