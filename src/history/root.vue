<template>
    <div class="history">
        <header>
            <div class="history-header flex flex--row flex--align-center">
                <img src="../../static/icons/icon.svg">
                <h1>Document Link History</h1>
            </div>
        </header>
        <main>
            <section class="history__links">
                <history-link v-for="(linkData, idx) in history" :key="idx" :link="linkData"></history-link>
            </section>
        </main>
    </div>
</template>
<script>
import { ExtStorage } from '../ext/storage';
import HistoryLink from '../assets/components/HistoryLink';

export default {
  components: { HistoryLink },
  data: () => ({
    history: []
  }),
  computed: {},
  async created() {
    // read history
    const history = await ExtStorage.getLinkHistory();
    this.history = [];
    Object.entries(history.links).forEach(([, value]) => {
      this.history.push(value);
    });
  },
  methods: {
    openHistory() {
      chrome.tabs.create({ url: 'pages/history.html' });
    },
    clearHistory() {
      ExtStorage.clearLinkHistory();
      this.history = [];
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

.history-header {
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

header {
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #2b579a 0%, #2e7142 100%);
  padding: 30px 20px;
}

main {
  width: 100%;
  max-width: $maxWidth;
  background: white;
  min-height: 400px;
  height: 100%;
  margin: -75px auto 25px;
  border-radius: 2px;
}

@media (max-width: 1080px) {
  .history-header {
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
    border-radius: 0;
    box-shadow: none;
    border: none;
    max-width: none;
  }
}

.history__links {
  padding: 5px;
}
</style>
