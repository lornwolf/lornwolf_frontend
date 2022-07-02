<template>
    <v-app>
        <div class="card" id="card">
            <div class="front" id="front">
                <div class="info">
                    <div class="japanese">{{japanese}}</div><br>
                    <div class="hiragana">{{hiragana}}</div><br>
                    <div class="comment">{{explanation}}</div>
                </div>
                <v-progress-linear v-model="progress"></v-progress-linear>
                <div class="detail">
                    <dl v-html="html"></dl>
                </div>
            </div>
            <div class="back" id="back">
                <div class="info">
                    <div class="japanese">{{japanese}}</div><br>
                    <div class="hiragana">{{hiragana}}</div><br>
                    <div class="comment">{{explanation}}</div>
                </div>
                <v-progress-linear v-model="progress"></v-progress-linear>
                <div class="detail">
                    <dl v-html="html"></dl>
                </div>
            </div>
        </div>

        <div align="center" justify="space-around">
            <div style="text-align:center;">
                <v-btn color="green darken-1" @click="confirmDialog=true;" class="button">
                    重新复习
                </v-btn>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <v-btn color="green darken-1" @click="next();" id="btnNextWord">
                    下一单词
                </v-btn>
            </div>
        </div>
        <br>
        <br>
        <v-progress-linear v-model="totalProgress"></v-progress-linear>
        <br>
        <br>
        <div class="text-center">
            <v-btn class="ma-2" outlined color="indigo">
                60天后
            </v-btn>
            <v-btn class="ma-2" outlined color="indigo">
                180天后
            </v-btn>
            <v-btn class="ma-2" outlined color="indigo">
                已经掌握
            </v-btn>
            <v-btn class="ma-2" outlined color="indigo">
                完全随机
            </v-btn>
        </div>
        <br>
        <div class="text-center" style="font-family: 'Yahei Mono';">
            本次 {{words.length}} 词，共 {{totalWords}} 词。
        </div>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline" style="font-family: 'Yahei Mono' !important;font-size: 16px !important;">
                    完成
                </v-card-title>
                <v-card-text style="font-family: 'Yahei Mono';font-size: 14px;">
                    已完成一组复习。
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="teal" text @click="dialog = false;$router.push({path: '/study/calendar'})">
                        就此结束
                    </v-btn>
                    <v-btn color="green darken-1" text @click="dialog = false;loadDictForStudy();">
                        再来一组
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmDialog" max-width="290">
            <v-card>
                <v-card-title class="headline" style="font-family: 'Yahei Mono' !important;font-size: 16px !important;">
                    确认
                </v-card-title>
                <v-card-text style="font-family: 'Yahei Mono';font-size: 14px;">
                    确认作为全新单词重新复习？
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="confirmDialog = false;">
                        算了
                    </v-btn>
                    <v-btn color="green darken-1" text @click="confirmDialog = false; next(0);">
                        好的
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>
import { isKataKana, isHiragana } from '@/utils'

export default {
    data: () => ({
        // 卡片正反面状态。
        status: 0,
        // 当前单词的索引。
        index: -1,
        japanese: '',
        japaneseId: '',
        hiragana: '',
        explanation: '',
        html: '',
        // 本次要复习的所有单词。
        words: [],
        // 进度条初始值。
        progress: 100,
        totalProgress: 0,
        // 复习计数器。
        count: 0,
        // 是否随机复习。
        random: false,
        // 对话框显示flag。
        dialog: false,
        confirmDialog: false,
        // 今日任务数
        totalWords: 0
    }),
    created() {
        this.loadDictForStudy();
    },
    methods: {
        loadDictForStudy() {
            // 变量初始化。
            this.status = 0;
            this.index = -1;
            this.japanese = '';
            this.japaneseId = '';
            this.hiragana = '';
            this.explanation = '';
            this.html = '';
            this.words = [];
            this.progress = 100;
            this.totalProgress = 0;
            this.count = 0;
            this.random = false;
            // 获取要复习的单词。
            fetch('https://www.lornwolf.com/dictionary/select_words_for_study?loginId=lornwolf', {cache: "no-cache"})
                .then(res => res.json())
                .then(async(json) => {
                    if (json.length == 0) {
                        // 如果没有当日任务，则按复习日期排序取前15件。
                        try {
                            let response = await fetch('https://www.lornwolf.com/dictionary/select_words_random?loginId=lornwolf&random=false', {cache: "no-cache"});
                            return response.json();
                        } catch (error) {
                            console.log('Request Failed', error);
                        }
                        // 随机复习标记。
                        this.random = true;
                    } else {
                        return json;
                    }
                })
                .then(json => {
                    this.words.push(...json);
                    if (this.words.length > 0) {
                        this.index = 0;

                        // 隐藏详细解释区域。
                        this.showCnAndDetail(false);
                        // 设置按钮不可用。
                        document.getElementById('btnNextWord').classList.remove('v-btn--is-elevated');
                        document.getElementById('btnNextWord').classList.add('v-btn--disabled');
                        // 获取单词内容。
                        let word = this.words[0];
                        this.japanese = word.japanese.japanese;
                        this.japaneseId = word.japaneseId;
                        this.hiragana = (isKataKana(this.japanese) || isHiragana(this.japanese)) ? '' : word.japanese.hiragana;
                        this.explanation = word.comment;
                        // 生成详细页面。
                        this.getDetail();

                        // 5秒钟后显示详细解释。
                        let that = this;
                        let interval = setInterval(function() {
                            that.progress -= 5;
                            if (that.progress <= 0) {
                                that.showCnAndDetail(true);
                                // 恢复按钮活性。
                                document.getElementById('btnNextWord').classList.remove('v-btn--disabled');
                                document.getElementById('btnNextWord').classList.add('v-btn--is-elevated');
                                clearInterval(interval);
                            }
                        }, 250);
                    }
                })
                .catch(err => console.warn(err))

            fetch('https://www.lornwolf.com/dictionary/count_words_for_study?loginId=lornwolf', {cache: "no-cache"})
                .then(res => res.text())
                .then(text => {
                    if (text && !isNaN(text)) {
                        this.totalWords = text;
                    }
                })
                .catch(err => console.warn(err))
        },
        next(step = 1) {
            // 获取当前单词。
            let currentWord = this.words[this.index];
            // 判断是不是重新复习。
            if (step == 0) {
                currentWord.prof = 0;
            }
            // 当前单词复习次数加1（每个单词复习两遍）。
            if (!currentWord.times) {
                currentWord.times = 1;
            } else {
                // 一个单词复习两遍以后，更新下次复习日期和最终复习日期。
                if (!this.random) {
                    let baseDate = null, prof = currentWord.prof;
                    let nextResiveDate = currentWord.nextResiveDate ? new Date(currentWord.nextResiveDate) : null;
                    if (nextResiveDate == null || nextResiveDate <= new Date()) {
                        baseDate = new Date();
                        // 计算下次复习日期。
                        switch (currentWord.prof) {
                            case 0:
                                prof = 1;
                                baseDate.setDate(baseDate.getDate() + 1);
                                break;
                            case 1:
                                prof = 2;
                                baseDate.setDate(baseDate.getDate() + 2);
                                break;
                            case 2:
                                prof = 4;
                                baseDate.setDate(baseDate.getDate() + 4);
                                break;
                            case 4:
                                prof = 7;
                                baseDate.setDate(baseDate.getDate() + 7);
                                break;
                            case 7:
                                prof = 15;
                                baseDate.setDate(baseDate.getDate() + 15);
                                break;
                            case 15:
                                prof = 30;
                                baseDate.setDate(baseDate.getDate() + 30);
                                break;
                            case 30:
                                prof = 30;
                                baseDate.setDate(baseDate.getDate() + 30);
                                break;
                            case 60:
                                prof = 60;
                                baseDate.setDate(baseDate.getDate() + 60);
                                break;
                            case 180:
                                prof = 180;
                                baseDate.setDate(baseDate.getDate() + 180);
                                break;
                            default:
                                prof = 1;
                                baseDate.setDate(baseDate.getDate() + 1);
                                break;
                        }
                        let obj = {
                            id: currentWord.id,
                            prof: prof,
                            nextResiveDate: this.time2str(baseDate, "Y-M-D")
                        };
                        // 将下次复习时间更新至数据库。
                        fetch("https://www.lornwolf.com/dictionary/update_word?word=" + encodeURI(JSON.stringify(obj)), { cache: "no-cache" })
                            .then(res => res.text())
                            .then(text => {
                                if (text.indexOf("ERROR") >= 0) {
                                    console.warn(text);
                                }
                            })
                            .catch(err => console.warn(err));
                    }
                }
                // 将最终复习时间更新至数据库。
                fetch("https://www.lornwolf.com/dictionary/update_last_revise_date?id=" + currentWord.id + "&type=1", { cache: "no-cache" })
                    .then(res => res.text())
                    .then(text => {
                        if (text.indexOf("ERROR") >= 0) {
                            console.warn(text);
                        }
                    })
                    .catch(err => console.warn(err));
            }

            // 计数器加1。
            this.count += 1;
            this.totalProgress = (this.count * 100) / (this.words.length * 2);
            // 判断是否完成了一组任务。
            if (this.count == this.words.length * 2) {
                // 将复习记录保存至数据库。
                fetch("https://www.lornwolf.com/dictionary/insert_revise_history?loginId=lornwolf&type=1", {cache: "no-cache"})
                    .then(res => res.text())
                    .then(text => {
                        if (text.indexOf("ERROR") >= 0) {
                            console.warn(text);
                        }
                    })
                    .catch(err => console.warn(err))
                this.count = 0;
                this.dialog = true;
                return;
            }

            if (this.index == this.words.length - 1) {
                this.index = -1;
            }

            // 清空显示内容。
            this.japanese = '';
            this.hiragana = '';
            this.explanation = '';
            this.html = '';

            // 旋转卡片。
            if (this.status == 0) {
                let front = document.getElementById("front");
                if (front) {
                    front.style.transform = "rotateY(-180deg)";
                    front.style["-webkit-transform"] = "rotateY(-180deg)";
                }
                let back = document.getElementById("back");
                if (back) {
                    back.style.transform = "rotateY(-360deg)";
                    back.style["-webkit-transform"] = "rotateY(-360deg)";
                }
                this.status = 1;
            } else {
                let front = document.getElementById("front");
                if (front) {
                    front.style.transform = "rotateY(-360deg)";
                    front.style["-webkit-transform"] = "rotateY(-360deg)";
                }
                let back = document.getElementById("back");
                if (back) {
                    back.style.transform = "rotateY(-180deg)";
                    back.style["-webkit-transform"] = "rotateY(-180deg)";
                }
                this.status = 0;
            }

            // 隐藏详细解释区域。
            this.showCnAndDetail(false);
            // 设置按钮不可用。
            document.getElementById('btnNextWord').classList.remove('v-btn--is-elevated');
            document.getElementById('btnNextWord').classList.add('v-btn--disabled');
            this.progress = 100;
            let that = this;
            // 等卡片旋转完后再显示内容。
            setTimeout(function() {
                that.index += 1;
                let word = that.words[that.index];
                that.japanese = word.japanese.japanese;
                that.japaneseId = word.japaneseId;
                that.hiragana = (isKataKana(that.japanese) || isHiragana(that.japanese)) ? '' : word.japanese.hiragana;
                that.explanation = word.comment;

                that.getDetail();
            }, 1000)

            // 5秒钟后显示详细解释。
            let interval = setInterval(function() {
                that.progress -= 5;
                if (that.progress <= 0) {
                    that.showCnAndDetail(true);
                    // 恢复按钮活性。
                    document.getElementById('btnNextWord').classList.remove('v-btn--disabled');
                    document.getElementById('btnNextWord').classList.add('v-btn--is-elevated');
                    clearInterval(interval);
                }
            }, 250);
        },
        getDetail() {
            this.html = '';
            fetch("https://www.lornwolf.com/dictionary/select_japanese_by_id?id=" + this.japaneseId + "&detail=true")
                .then(res => res.json())
                .then(japanese => {
                    if (japanese.partsOfSpeech) {
                        this.html += '<span style="line-height: 35px;color: red">' + japanese.partsOfSpeech + "</span><br>";
                    }
                    if (japanese.translations && japanese.translations.length > 0) {
                        for (let j = 0; j < japanese.translations.length; j++) {
                            this.html += '<span style="line-height: 35px">' + (j + 1) + '. ' + japanese.translations[j].cn;
                            if (japanese.translations[j].jp) {
                                this.html += '<span style="color:gray">（' + japanese.translations[j].jp + '）</span></span>';
                            }
                            this.html += '<br>';
                            if (japanese.translations[j].examples && japanese.translations[j].examples.length > 0) {
                                for (let k = 0; k < japanese.translations[j].examples.length; k++) {
                                    this.html += '<span style="line-height: 35px">&nbsp;&nbsp;&nbsp;&nbsp;' + japanese.translations[j].examples[k].jp + '&nbsp;&nbsp;<span style="color:royalblue">' + japanese.translations[j].examples[k].cn + '</span></span><br>'
                                }
                            }
                        }
                    }
                })
                .catch(err => console.warn(err))
        },
        showCnAndDetail(visible) {
            let details = document.getElementsByClassName("detail");
            if (details) {
                for (let i in details) {
                    if (details[i].style) {
                        details[i].style.visibility = visible ? "visible" : "hidden";
                    }
                }
            }
            details = document.getElementsByClassName("comment");
            if (details) {
                for (let i in details) {
                    if (details[i].style) {
                        details[i].style.visibility = visible ? "visible" : "hidden";
                    }
                }
            }
        },
        time2str(time = 0, format = "Y-M-D h:i:s") {
            if (time == 0) return "";

            let date = new Date(time);
            let Y = date.getFullYear();
            let M = date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1;
            let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            let i = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

            return format
                .replace("Y", Y)
                .replace("M", M)
                .replace("D", D)
                .replace("h", h)
                .replace("i", i)
                .replace("s", s);
        }
    }
}
</script>
<style>
.card {
    position: relative;
    width: 600px;
    height: 420px;
    margin: 20px auto;
    font-family: "Yahei Mono";
}

.info {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0 0;
    padding: 15px 0;
    text-align: center;
}

.detail {
    width: 100%;
    height: 289px;
    border-radius: 0 0 5px 5px;
    padding: 5px 10px;
    overflow: auto
}

.detail::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;
    height: 1px;
}

.detail::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
}

.detail::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #9dd3fa;
}

.japanese {
    display: inline-block;
    transform: rotate(.03deg);
    font-weight: 700;
    font-family: "MS Mincho";
    font-size: 3vh;
}

.hiragana {
    display: inline-block;
    transform: rotate(.03deg);
    font-weight: 700;
    font-family: "MS Mincho";
    font-size: 18px;
}

.comment {
    display: inline-block;
    transform: rotate(.03deg);
    font-weight: 700;
    font-family: "SimSun";
    font-size: 18px;
}

.front,
.back {
    position: absolute;
    transfor: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: #9dd3fa;
    backface-visibility: hidden;
    -webkit-transition: all 1.5s;
    -moz-transition: all 1.5s;
    -ms-transition: all 1.5s;
    -o-transition: all 1.5s;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    overflow: hidden;
}

.back {
    m: rotateY(-180deg);
    -webkit-transform: rotateY(-180deg);
}

.back p {
    font-size: 3vh;
    text-align: center;
    line-height: 360px;
}

.disable-events {
    pointer-events: none
}

.v-application--wrap {
    min-height: calc(100vh - 50px) !important;
}
</style>
