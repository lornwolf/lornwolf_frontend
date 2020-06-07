<template>
    <div class="app-container">
        <div class="block">
            <el-input
                :placeholder="placeholder"
                v-model="input"
                size="100"
                style="width:500px;"
                clearable>
            </el-input>
            <el-select filterable
                v-model="mode"
                clearable
                class="item-width">
                <el-option
                    v-for="item in modes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button :loading="loading" @click="search" type="primary" size="medium" style="margin-left: 12px;" :disabled="disabled">
                翻訳
            </el-button>
        </div>
        <br>
        <el-tabs type="border-card" v-model="activeTab">
            <el-tab-pane v-for = "item in result" :label="item.text" :name="item.name">
                <dl v-html="item.content">
                    {{item.content}}
                </dl>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { selectJapanese, selectByLike, selectByHana, selectExamplesByLikeJp, selectExamplesByLikeCn, selectByCn } from '@/api/tools'

export default {
    data() {
        return {
            input: '',
            placeholder : '请输入要查询的单词',
            result: [],
            mode: '',
            modes: [
              {id : "1", name : "完全一致"},
              {id : "2", name : "曖昧検索"},
              {id : "3", name : "仮名検索"},
              {id : "4", name : "日文例句"},
              {id : "5", name : "中文例句"},
              {id : "6", name : "中日翻訳"}
            ],
            activeTab: '',
            loading: false,
            disabled: false
        }
    },
    created() {
        this.mode = '1';
    },
    methods: {
        search() {
            if (!this.input) {
                return;
            }
            this.result = [];
            this.loading = true
            if (this.mode == '1' || this.mode == '2' || this.mode == '3' || this.mode == '6') {
                let runMethod = null;
                if (this.mode == '1') {
                    runMethod = selectJapanese;
                } else if (this.mode == '2') {
                    runMethod = selectByLike;
                } else if (this.mode == '3') {
                    runMethod = selectByHana;
                } else if (this.mode == '6') {
                    runMethod = selectByCn;
                }
                runMethod(this.input).then(response => {
                    let data = response;
                    for (let i = 0; i < data.length; i++) {
                        let con = '';
                        if (data[i].partsOfSpeech ) {
                            con += '<span style="line-height: 35px;color: red">' + data[i].partsOfSpeech + "</span><br>";
                        }
                        if (data[i].translations && data[i].translations.length > 0) {
                            for (let j = 0; j < data[i].translations.length; j++) {
                                con += '<span style="line-height: 35px">' + (j + 1) + '. ' + data[i].translations[j].cn + '（<span style="color:limegreen">' + data[i].translations[j].jp + '</span>）</span><br>'
                                if (data[i].translations[j].examples && data[i].translations[j].examples.length > 0) {
                                    for (let k = 0; k < data[i].translations[j].examples.length; k++) {
                                        con += '<span style="line-height: 35px">&nbsp;&nbsp;&nbsp;&nbsp;' + data[i].translations[j].examples[k].jp + '&nbsp;&nbsp;<span style="color:royalblue">' + data[i].translations[j].examples[k].cn + '</span></span><br>'
                                    }
                                }
                            }
                        }
                        if (data[i].id) {
                            this.result[i] = {
                                text: data[i].japanese + '（' + data[i].hiragana + '）',
                                name: data[i].id,
                                content: con
                            }
                        }
                    }
                    this.loading = false;
                    this.activeTab = this.result[0].name;
                })
            }
            else if (this.mode == '4') {
                selectExamplesByLikeJp(this.input).then(response => {
                    let data = response;
                    if (!data || data.length < 1) {
                        return;
                    }
                    let con = '';
                    for (let i = 0; i < data.length; i++) {
                        con += '<span style="line-height: 35px">' + (i + 1) + '. ' + data[i].jp + '&nbsp;&nbsp;<span style="color:limegreen">' + data[i].cn + '</span></span><br>'
                    }
                    this.result[0] = {
                        text: '結果',
                        name: 'result',
                        content: con
                    }
                    this.loading = false
                })
            }
            else if (this.mode == '5') {
                selectExamplesByLikeCn(this.input).then(response => {
                    let data = response;
                    if (!data || data.length < 1) {
                        return;
                    }
                    let con = '';
                    for (let i = 0; i < data.length; i++) {
                        con += '<span style="line-height: 35px">' + (i + 1) + '. ' + data[i].cn + '&nbsp;&nbsp;<span style="color:limegreen">' + data[i].jp + '</span></span><br>'
                    }
                    this.result[0] = {
                        text: '結果',
                        name: 'result',
                        content: con
                    }
                    this.loading = false
                })
            }
        }
    }
}
</script>
