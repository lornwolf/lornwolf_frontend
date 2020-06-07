import request from '@/utils/request'

export function getWeeklyWorkTimes(date) {
    return request({
        url: '/weeklyWorktimes/' + date,
        method: 'get'
    })
}

export function getMonthlyWorkTimes(month, user) {
    return request({
        url: '/monthlyWorkTimes/' + month + '/' + user,
        method: 'get'
    })
}

export function checkWorkTimes(month, user) {
    return request({
        url: '/checkWorkTimes/' + month + '/' + user,
        method: 'get'
    })
}

export function getUsers() {
    return request({
        url: '/getUsers',
        method: 'get'
    })
}
