<template>
  <div class="app-container">
    <div class="block" style="display: flex; align-items: center; gap: 10px">
      <el-input
        v-model="input"
        :placeholder="placeholder"
        style="width: 400px"
        clearable
        @keypress.enter="search()"
      />
      <el-select
        v-model="mode"
        clearable
        style="width: 150px"
      >
        <el-option
          v-for="item in modes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        :loading="loading"
        type="primary"
        :disabled="disabled"
        @click="search"
      >
        翻訳
      </el-button>
    </div>
    <br>
    <el-tabs
      v-if="visible"
      v-model="activeTab"
      type="border-card"
    >
      <el-tab-pane
        v-for="item in result"
        :label="item.text"
        :name="item.name"
      >
        <dl v-html="item.content"></dl>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  selectJapanese,
  selectByLike,
  selectByHana,
  selectExamplesByLikeJp,
  selectExamplesByLikeCn,
  selectByCn,
} from "@/api/tools"
import { isKataKana, isHiragana } from "@/utils"

const input = ref("")
const placeholder = ref("请输入要查询的单词")
const result = ref([])
const mode = ref("1")
const modes = reactive([
  { id: "1", name: "完全一致" },
  { id: "2", name: "曖昧検索" },
  { id: "3", name: "仮名検索" },
  { id: "4", name: "日文例句" },
  { id: "5", name: "中文例句" },
  { id: "6", name: "中日翻訳" },
])
const activeTab = ref("")
const loading = ref(false)
const disabled = ref(false)
const visible = ref(false)

onMounted(() => {
  mode.value = "1"
})

const search = () => {
  if (!input.value) {
    return
  }
  result.value = []
  loading.value = true
  visible.value = false

  if (["1", "2", "3", "6"].includes(mode.value)) {
    let runMethod = null
    if (mode.value == "1") {
      runMethod = selectJapanese
    } else if (mode.value == "2") {
      runMethod = selectByLike
    } else if (mode.value == "3") {
      runMethod = selectByHana
    } else if (mode.value == "6") {
      runMethod = selectByCn
    }

    runMethod(input.value).then((response) => {
      let data = response
      for (let i = 0; i < data.length; i++) {
        let con = ""
        if (data[i].partsOfSpeech) {
          con += '<span style="line-height: 35px;color: red">' + data[i].partsOfSpeech + "</span><br>"
        }
        if (data[i].translations && data[i].translations.length > 0) {
          for (let j = 0; j < data[i].translations.length; j++) {
            con += '<span style="line-height: 35px">' + (j + 1) + ". " + data[i].translations[j].cn
            if (data[i].translations[j].jp) {
              con += '<span style="color:limegreen">（' + data[i].translations[j].jp + "）</span></span>"
            }
            con += "<br>"
            if (data[i].translations[j].examples && data[i].translations[j].examples.length > 0) {
              for (let k = 0; k < data[i].translations[j].examples.length; k++) {
                con +=
                  '<span style="line-height: 35px">&nbsp;&nbsp;&nbsp;&nbsp;' +
                  data[i].translations[j].examples[k].jp +
                  '&nbsp;&nbsp;<span style="color:royalblue">' +
                  data[i].translations[j].examples[k].cn +
                  "</span></span><br>"
              }
            }
          }
        }
        if (data[i].id) {
          result.value[i] = {
            text:
              isKataKana(data[i].japanese) || isHiragana(data[i].japanese)
                ? data[i].japanese
                : data[i].japanese + "（" + data[i].hiragana + "）",
            name: data[i].id,
            content: con,
          }
        }
      }
      loading.value = false
      visible.value = true
      // Check if result has items before accessing
      if (result.value.length > 0) {
         activeTab.value = result.value[0].name
      }
    })
  } else if (mode.value == "4") {
    selectExamplesByLikeJp(input.value).then((response) => {
      let data = response
      if (!data || data.length < 1) {
        loading.value = false
        visible.value = false
        return
      }
      let con = ""
      for (let i = 0; i < data.length; i++) {
        con +=
          '<span style="line-height: 35px">' +
          (i + 1) +
          ". " +
          data[i].jp +
          '&nbsp;&nbsp;<span style="color:limegreen">' +
          data[i].cn +
          "</span></span><br>"
      }
      result.value[0] = {
        text: "結果",
        name: "result",
        content: con,
      }
      loading.value = false
      visible.value = true
      activeTab.value = result.value[0].name
    })
  } else if (mode.value == "5") {
    selectExamplesByLikeCn(input.value).then((response) => {
      let data = response
      if (!data || data.length < 1) {
        loading.value = false
        visible.value = false
        return
      }
      let con = ""
      for (let i = 0; i < data.length; i++) {
        con +=
          '<span style="line-height: 35px">' +
          (i + 1) +
          ". " +
          data[i].cn +
          '&nbsp;&nbsp;<span style="color:limegreen">' +
          data[i].jp +
          "</span></span><br>"
      }
      result.value[0] = {
        text: "結果",
        name: "result",
        content: con,
      }
      loading.value = false
      visible.value = true
      activeTab.value = result.value[0].name
    })
  }
}
</script>
