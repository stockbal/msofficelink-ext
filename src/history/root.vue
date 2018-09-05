<template>
    <div class="links">
        <header>
            <div class="links-header flex flex--row flex--align-center">
                <img src="../../static/icons/icon.svg">
                <h1>{{$i18n('History_title')}}</h1>
            </div>
        </header>
        <main>
            <section class="links__entries">
                <document-link v-for="(linkData, idx) in documentLinks" :key="idx" :link="linkData"></document-link>
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
    documentLinks: []
  }),
  computed: {},
  async created() {
    // read history
    const links = await ExtStorage.getDocumentLinks();
    this.documentLinks = [];
    Object.entries(links.entries).forEach(([, link]) => {
      this.documentLinks.push(link);
    });
  },
  methods: {
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

.links-header {
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
  .links-header {
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

.links__entries {
  padding: 5px;
}
</style>
