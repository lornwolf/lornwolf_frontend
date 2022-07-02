<template>
    <v-app>
        <v-sheet height="600" width="1080" style="margin: 20px auto;">
            <v-calendar
                ref="calendar"
                v-model="value"
                :weekdays="weekday"
                :type="type"
                :events="events"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
                :event-color="getEventColor"
                @change="getEvents"
            ></v-calendar>
        </v-sheet>
    </v-app>
</template>
<script>
export default {
    data: () => ({
        type: 'month',
        types: ['month', 'week', 'day', '4day'],
        mode: 'stack',
        modes: ['stack', 'column'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [
            { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
            { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
            { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
            { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
        ],
        value: '',
        events: [],
    }),
    created() {
    },
    methods: {
        getEvents() {
            this.events = [];
            fetch("https://www.lornwolf.com/dictionary/select_revise_history?type=1", { cache: "no-cache" })
                .then(res => res.json())
                .then(json => {
                    for (let i=0; i < json.length; i++) {
                        this.events.push({
                            name: "单词",
                            start: new Date(json[i]),
                            end: new Date(json[i]),
                            color: 'blue',
                            timed: false,
                        })
                    }
                })
                .then(() => {return fetch("https://www.lornwolf.com/dictionary/select_revise_history?type=2", { cache: "no-cache" });})
                .then(res => res.json())
                .then(json => {
                    for (let i=0; i < json.length; i++) {
                        this.events.push({
                            name: "例句",
                            start: new Date(json[i]),
                            end: new Date(json[i]),
                            color: 'orange',
                            timed: false,
                        })
                    }
                })
                .catch(err => console.warn(err));
        },
        getEventColor (event) {
            return event.color
        },
    }
}
</script>
<style>
</style>
