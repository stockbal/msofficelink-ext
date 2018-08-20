<template>
    <div class="popup">
        <div class="popup-title flex flex--row flex--align-center">
            <img class="popup-icon" src="../../static/icons/Icon128.png" alt="image">
            <h2>MS Office Link</h2>
        </div>
        <h2>Link History</h2>
        <el-table :data="tableData"
                  border
                  height="350"
                  style="width: 100%">
            <el-table-column label="Type"
                             width="60">
                <template slot-scope="scope">
                    <img v-if="scope.row.type === 'word'" src="../../static/icons/word-app.svg" width="20px" alt="word">
                    <img v-else-if="scope.row.type === 'excel'" src="../../static/icons/excel-app.svg" width="20px"
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
        <hr>
        <el-button round>Show full history</el-button>
        <el-button round>Options</el-button>
        <!--<form-entry class="flex flex&#45;&#45;row flex&#45;&#45;align-center" label="Activate Options">-->
            <!--<el-switch v-model="form.delivery"></el-switch>-->
        <!--</form-entry>-->
        <!--<form-entry class="flex flex&#45;&#45;row flex&#45;&#45;align-center" label="Default Action">-->
            <!--<el-select v-model="form.region" placeholder="please select your zone">-->
                <!--<el-option label="Zone one" value="shanghai"></el-option>-->
                <!--<el-option label="Zone two" value="beijing"></el-option>-->
            <!--</el-select>-->
        <!--</form-entry>-->
    </div>
</template>

<script>
import FormEntry from '../assets/components/FormEntry';

export default {
  components: {
    FormEntry
  },
  data: () => ({
    form: {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    },
    tableData: []
  }),
  methods: {
    onSubmit() {
      console.log('submit!');
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

  width: 500px;

  .form-entry__label {
    width: 120px;
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
</style>
