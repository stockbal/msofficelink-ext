<template>
  <div class="history">
    <header>
      <div class="history-header flex flex--row flex--align-center">
        <img src="../../static/icons/icon.svg">
        <h1>Document Link History</h1>
      </div>
    </header>
    <main>
      <section class="history__data">
        <el-table :data="tableData"
                  border
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
      </section>
    </main>
  </div>
</template>
<script>
export default {
  data: () => ({
    tableData: []
  }),
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
@import '../assets/css/base';

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

.history__data {
  padding: 5px;
}
</style>
