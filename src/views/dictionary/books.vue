<template>
    <v-app>
    <v-card>
        <!--
        <v-card-title class="indigo white--text headline">
            我的生詞本
        </v-card-title>
        -->
        <v-row class="pa-4" justify="space-between">
            <v-col cols="5">
                <v-treeview
                    :active.sync="active"
                    :items="items"
                    :load-children="fetchBooks"
                    :open.sync="open"
                    activatable
                    color="warning"
                    open-on-click
                    transition
                >
                    <template v-slot:prepend="{item}" >
                            <v-icon v-if="!item.children">
                                mdi-book-open-page-variant
                            </v-icon>
                    </template>
                </v-treeview>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col class="d-flex text-center">
                <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected" class="title grey--text text--lighten-1 font-weight-light" style="align-self: center;">
                        Select a Book
                    </div>
                    <v-card v-else :key="selected.id" width="100%">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>単詞</th>
                                    <th>読音</th>
                                    <th>意味</th>
                                </tr>
                                </thead>
                                <tr v-for="item in words" :key="item.id">
                                    <td class="text-left">{{ item.id }}</td>
                                    <td class="text-left">{{ item.japanese.japanese }}</td>
                                    <td class="text-left">{{ item.japanese.hiragana }}</td>
                                    <td class="text-left">{{ item.comment }}</td>
                                </tr>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-scroll-y-transition>
            </v-col>
        </v-row>
    </v-card>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            active: [],
            open: [],
            books: [],
            words: [],
        }),

        computed: {
            items () {
                return [
                    {
                        name: 'Word Books',
                        children: this.books,
                    },
                ]
            },
            selected () {
                if (!this.active.length) return undefined

                const id = this.active[0]

                if (id) {
                    this.words = [];
                    fetch('http://127.0.0.1:8000/api/select_words_in_book?book_id=' + id)
                        .then(res => res.json())
                        .then(json => (this.words.push(...json)))
                        .catch(err => console.warn(err))
                }

                return id;
            },
        },

        methods: {
            async fetchBooks (item) {
                return fetch('http://127.0.0.1:8000/api/select_all_books')
                    .then(res => res.json())
                    .then(json => (item.children.push(...json)))
                    .catch(err => console.warn(err))
            },
        },
    }
</script>
