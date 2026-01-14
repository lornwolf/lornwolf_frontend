<template>
  <v-app style="height: calc(100vh - 50px); overflow: hidden">
    <v-card
      id="bookApp"
      style="height: calc(100vh - 10px); overflow: hidden"
      @mouseup="cancelMove()"
      @mousemove="moveWord($event)"
    >
      <v-divider />
      <v-row
        class="pa-4"
        justify="space-between"
        style="height: 100%"
      >
        <v-col
          cols="3"
          style="height: 100%; overflow-y: auto;"
        >
          <v-treeview
            v-model:activated="active"
            :items="items"
            :load-children="fetchBooks"
            v-model:opened="open"
            item-value="id"
            activatable
            color="warning"
            open-on-click
            transition
          >
            <template #prepend="{ item }">
              <div
                :id="'book_' + item.id"
                class="books"
                @mouseleave="mouseleave(item.id, $event)"
                @mouseenter="mouseenter(item.id, $event)"
                @mouseup="mouseup(item.id, $event)"
              >
                <v-icon v-if="!item.children">
                  mdi-book-open-page-variant
                </v-icon>
                {{ item.label }}
              </div>
            </template>
          </v-treeview>
        </v-col>

        <v-divider vertical />

        <v-col
          class="d-flex text-center"
          style="height: 100%; overflow: hidden"
        >
          <v-scroll-y-transition mode="out-in">
            <div
              v-if="!selected"
              class="title grey--text text--lighten-1 font-weight-light"
              style="align-self: center; margin: auto;"
            >
              Select a Book
            </div>
            <v-card
              v-else
              :key="selected"
              elevation="2"
              tile
              width="100%"
              style="display: flex; flex-direction: column; height: 100%"
            >
              <div style="flex: 0 1 auto; overflow-y: auto; overflow-x: hidden">
              <v-card
                v-if="words.length > 0"
                elevation="2"
                tile
                class="word"
                style="background-color: lightsteelblue"
              >
                <table style="width: 100%">
                  <tbody>
                    <tr>
                    <td
                      class="text-left"
                      width="30px"
                    />
                    <td
                      class="text-left"
                      width="230px"
                      style="max-width: 240px"
                    >
                      单词
                    </td>
                    <td
                      class="text-left"
                      width="230px"
                      style="max-width: 240px"
                    >
                      读音
                    </td>
                    <td class="text-left">
                      翻译
                    </td>
                    <td
                      width="120px"
                    />
                  </tr>
                  </tbody>
                </table>
              </v-card>
              <v-card
                v-for="item in words"
                :id="'word_' + item.id"
                :key="item.id"
                elevation="2"
                tile
                class="word"
              >
                <table style="width: 100%">
                  <tbody>
                    <tr>
                    <td
                      class="text-left list"
                      width="30px"
                    >
                      <v-icon @mousedown="clickWord(item.id, $event)">
                        mdi-leaf
                      </v-icon>
                    </td>
                    <td
                      class="text-left list"
                      width="230px"
                      style="max-width: 240px"
                    >
                      {{ item.japanese.japanese }}
                    </td>
                    <td
                      class="text-left list"
                      width="230px"
                      style="max-width: 240px"
                    >
                      {{ item.japanese.hiragana }}
                    </td>
                    <td class="text-left list">
                      {{ item.comment }}
                    </td>
                    <td width="120px" class="text-right" style="text-align: right;">
                      <v-btn
                        icon="mdi-pencil"
                        color="cyan"
                        size="x-small"
                        @click="editWordComment(item)"
                      >
                      </v-btn>
                      <v-btn
                        icon="mdi-delete"
                        color="red"
                        size="x-small"
                        class="ml-2"
                        @click="
                          deleteWordId = item.id;
                          deleteWord = item.japanese.japanese;
                          deleteConfirmDialog = true;
                        "
                      >
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </v-card>
              </div>
              <div
                v-if="words.length > 0"
                class="pagination-container"
              </div>
              <div
                v-if="words.length > 0"
                class="pagination-container"
                style="margin-bottom: 5px; display: flex; justify-content: flex-end; padding-right: 20px"
              >
                <v-pagination
                  v-model="page"
                  :circle="circle"
                  :disabled="disabled"
                  :length="length"
                  :next-icon="nextIcon"
                  :prev-icon="prevIcon"
                  :page="page"
                  :total-visible="7"
                  density="compact"
                />
              </div>
            </v-card>
          </v-scroll-y-transition>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="editDialog"
      max-width="560"
      width="560"
    >
      <v-card>
        <v-card-title
          class="headline"
          style="font-family: 'Yahei Mono' !important; font-size: 16px !important"
        >
          编辑
        </v-card-title>
        <v-card-text style="font-family: 'Yahei Mono'; font-size: 14px">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="单词"
                  :model-value="wordForEdit"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="假名"
                  :model-value="kanaForEdit"
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="commentForEdit"
                  label="释义"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="editDialog = false"
          >
            算了
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="updateWordComment()"
          >
            好的
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteConfirmDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title
          class="headline"
          style="font-family: 'Yahei Mono' !important; font-size: 16px !important"
        >
          确认
        </v-card-title>
        <v-card-text style="font-family: 'Yahei Mono'; font-size: 14px">
          确认要从生词本中删除以下单词？
        </v-card-text>
        <v-card-text style="font-family: 'Yahei Mono'; font-size: 14px">
          {{ deleteWord }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="
              deleteWordId = -1;
              deleteConfirmDialog = false;
            "
          >
            算了
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteWordFromBook()"
          >
            好的
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title
          class="headline"
          style="font-family: 'Yahei Mono' !important; font-size: 16px !important"
        >
          确认
        </v-card-title>
        <v-card-text style="font-family: 'Yahei Mono'; font-size: 14px">
          确认移动？
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="
              dialog = false;
              selectedWordId = -1;
            "
          >
            算了
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="moveWordToNewBook()"
          >
            好的
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="errorDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title
          class="headline"
          style="font-family: 'Yahei Mono' !important; font-size: 16px !important"
        >
          错误
        </v-card-title>
        <v-card-text style="font-family: 'Yahei Mono'; font-size: 14px">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="errorDialog = false"
          >
            好的
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    active: [],
    open: [],
    books: [],
    words: [],
    // 在树形结构中选中的生词本的ID。
    selectedBookId: -1,
    // 要移入的生词本ID。
    moveToBookId: -1,
    wordSelected: false,
    // 拖拽中的单词ID。
    selectedWordId: -1,
    selectedObj: null,
    sb_bkx: 0,
    sb_bky: 0,
    /* 对话框显示控制相关 开始 */
    editDialog: false,
    dialog: false,
    errorDialog: false,
    deleteConfirmDialog: false,
    /* 对话框显示控制相关 结束 */
    errorMessage: "",
    /* 分页相关 开始 */
    circle: false,
    disabled: false,
    length: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    page: 1,
    // 可见页面按钮的最大数量。
    totalVisible: 10,
    /* 分页相关 结束 */
    // 要编辑的单词。
    wordForEdit: "",
    // 要编辑的单词假名。
    kanaForEdit: "",
    // 要编辑的单词释义。
    commentForEdit: "",
    // 要删除的单词ID。
    deleteWordId: -1,
    // 要删除的单词。
    deleteWord: "",
  }),

  computed: {
    items() {
      return [
        {
          id: 'root',
          name: "Word Books",
          children: this.books,
        },
      ];
    },
    selected() {
      if (!this.active.length) return undefined;

      const val = this.active[0];
      const id = (typeof val === 'object' && val !== null) ? val.id : val;

      // Verify id is a valid book ID (number) and not 'root' or a Symbol
      if (id && typeof id !== 'symbol' && id !== 'root') {
        this.selectedBookId = id;
        this.words = [];
        fetch(process.env.VUE_APP_PYTHON_API + "/select_words_in_book?book_id=" + id + "&page=" + this.page)
          .then((res) => res.json())
          .then((json) => {
            this.words.push(...json.list);
            this.length = json.totalPage;
          })
          .catch((err) => console.warn(err));
      }

      return id;
    },
  },

  watch: {
    active(val) {
      console.log('Books active watcher:', val)
      // 切换生词本时，重置分页为第1页。
      this.page = 1;
    },
    open(val) {
      console.log('Books open watcher:', val)
    }
  },

  methods: {
    async fetchBooks(item) {
      return fetch(process.env.VUE_APP_PYTHON_API + "/select_all_books")
        .then((res) => res.json())
        .then((json) => item.children.push(...json))
        .catch((err) => console.warn(err));
    },
    clickWord(id, event) {
      this.wordSelected = true;
      this.selectedWordId = id;
      let divObj = document.getElementById("word_" + id);

      let clonedNode = divObj.cloneNode(true);
      clonedNode.setAttribute("id", "clone_word_" + id);
      document.getElementById("bookApp").appendChild(clonedNode);
      divObj.style.visibility = "hidden";

      this.selectedObj = clonedNode;
      clonedNode.style.position = "absolute";
      clonedNode.style.background = "#66CCFF";
      clonedNode.style.visibility = "hidden";
      clonedNode.style["z-index"] = 9999;

      this.sb_bkx = document.getElementsByClassName("el-scrollbar")[0].offsetWidth;
      this.sb_bky = document.getElementsByClassName("navbar")[0].offsetHeight;
    },
    moveWord(event) {
      if (this.wordSelected) {
        let endx = event.clientX - this.sb_bkx + window.scrollX;
        let endy = event.clientY - this.sb_bky + window.scrollY;
        this.selectedObj.style.visibility = "visible";
        this.selectedObj.style.left = endx + "px";
        this.selectedObj.style.top = endy + "px";
      }
    },
    // 松开鼠标左键后的处理。
    cancelMove() {
      if (this.wordSelected) {
        this.wordSelected = false;
        // 删掉克隆的生词DIV对象。
        document.getElementById("bookApp").removeChild(this.selectedObj);
        // 清除生词本树的底色。
        let books = document.getElementsByClassName("books");
        if (books) {
          for (let i in books) {
            if (books[i].style) {
              books[i].style.backgroundColor = "";
            }
          }
        }
        // 恢复列表中的生词DIV对象为可见。
        let divObj = document.getElementById("word_" + this.selectedWordId);
        if (divObj) {
          divObj.style.visibility = "visible";
        }
        // 如果没有被拖到生词本上，则初始化selectedWordId变量。
        if (this.moveToBookId < 0) {
          this.selectedWordId = -1;
        }
      }
    },
    mouseenter(id, event) {
      if (this.wordSelected && this.selectedBookId != id) {
        if (this.books.filter((obj) => obj.id == id && obj.children).length == 0) {
          event.target.style.backgroundColor = "#3399FF";
        }
      }
    },
    mouseleave(id, event) {
      if (this.wordSelected) {
        event.target.style.backgroundColor = "";
      }
    },
    // 拖动单词到某个生词本上后松开鼠标左键后的处理。
    mouseup(id, event) {
      if (this.wordSelected && this.selectedBookId != id) {
        if (this.books.filter((obj) => obj.id == id && obj.children).length == 0) {
          this.dialog = true;
          this.moveToBookId = id;
        }
      }
    },
    moveWordToNewBook() {
      this.dialog = false;
      let obj = this;
      if (this.moveToBookId < 0 || this.selectedWordId < 0) {
        return;
      }
      return fetch(
        process.env.VUE_APP_PYTHON_API + "/move_word?word_id=" + this.selectedWordId + "&book_id=" + this.moveToBookId
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            obj.errorMessage = json.error;
            obj.errorDialog = true;
          } else {
            document.getElementById("word_" + this.selectedWordId).remove();
            this.moveToBookId = -1;
            this.selectedWordId = -1;
          }
        })
        .catch((err) => console.warn(err));
    },
    editWordComment(item) {
      this.selectedWordId = item.id;
      this.wordForEdit = item.japanese.japanese;
      this.kanaForEdit = item.japanese.hiragana;
      this.commentForEdit = item.comment;
      this.editDialog = true;
    },
    updateWordComment() {
      return fetch(
        process.env.VUE_APP_PYTHON_API +
          "/update_word_comment?word_id=" +
          this.selectedWordId +
          "&comment=" +
          this.commentForEdit
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            this.errorMessage = json.error;
            this.errorDialog = true;
          } else {
            this.selectedWordId = -1;
            this.editDialog = false;
          }
        })
        .catch((err) => console.warn(err));
    },
    deleteWordFromBook() {
      return fetch(process.env.VUE_APP_PYTHON_API + "/remove_word_from_book?word_id=" + this.deleteWordId)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            this.errorMessage = json.error;
            this.errorDialog = true;
          } else {
            this.deleteWordId = -1;
            this.deleteConfirmDialog = false;
          }
        })
        .catch((err) => console.warn(err));
    },
  },
};
</script>
<style>
div {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.word {
  margin: 4px;
  padding: 4px;
  background-color: #cbffd3;
  font-family: "Yahei Mono";
  font-size: 12px;
}
.books {
  font-family: "Yahei Mono";
  font-size: 12px;
}
.pagination-container {
  display: inline-block;
  float: right;
  margin-top: 20px;
}
.list {
  white-space: nowrap;
  overflow: hidden;
}
.v-application--wrap {
  min-height: 100%;
}
</style>
