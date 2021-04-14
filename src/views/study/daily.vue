<template>
    <v-app>
        <div class="container">
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
        </div>
        <div align="center" justify="space-around">
            <div style="text-align:center;">
                <v-btn color="green darken-1" @click="">
                    重新复习
                </v-btn>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <v-btn color="green darken-1" @click="next();">
                    下一单词
                </v-btn>
            </div>
        </div>
    </v-app>
</template>
<script>
    export default {
        data: () => ({
            // 卡片正反面状态。
            status: 0,
            index: -1,
            japanese: '',
            japaneseId: '',
            hiragana: '',
            explanation: '',
            html: '',
            words: [],
            progress: 100
        }),
        created() {
            fetch('https://www.lornwolf.cn/dictionary/select_words_for_study?loginId=lornwolf')
                .then(res => res.json())
                .then(json => {
                    this.words.push(...json);
                    if (this.words.length > 0) {
                        this.index = 0;

                        // 隐藏详细解释区域。
                        this.showCnAndDetail(false);

                        let word = this.words[0];
                        this.japanese = word.japanese.japanese;
                        this.japaneseId = word.japaneseId;
                        this.hiragana = word.japanese.hiragana;
                        this.explanation = word.comment;

                        this.getDetail();

                        // 5秒钟后显示详细解释。
                        let that = this;
                        var interval = setInterval(function() {
                            that.progress -= 5;
                            if (that.progress <= 0) {
                                that.showCnAndDetail(true);
                                clearInterval(interval);
                            }
                        }, 250);
                    }
                })
                .catch(err => console.warn(err))
        },
        methods: {
            next() {
                if (this.index >= this.words.length - 1) {
                    return;
                }
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
                this.progress = 100;
                let that = this;
                // 等卡片旋转完后再显示内容。
                setTimeout(function() {
                    that.index += 1;
                    let word = that.words[that.index];
                    that.japanese = word.japanese.japanese;
                    that.japaneseId = word.japaneseId;
                    that.hiragana = word.japanese.hiragana;
                    that.explanation = word.comment;

                    that.getDetail();
                }, 1000)

                // 5秒钟后显示详细解释。
                var interval = setInterval(function() {
                    that.progress -= 5;
                    if (that.progress <= 0) {
                        that.showCnAndDetail(true);
                        clearInterval(interval);
                    }
                }, 250);
            },
            getDetail() {
                this.html = '';
                fetch("https://www.lornwolf.cn/dictionary/select_japanese_by_id?id=" + this.japaneseId + "&detail=true")
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
            }
        }
    }
</script>
<style>
    .container {
        width: 1080px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        grid-gap: 20px;
        margin: 0 auto;
    }

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
        height: auto;
        border-radius: 0 0 5px 5px;
        padding: 15px 10px;
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
</style>
