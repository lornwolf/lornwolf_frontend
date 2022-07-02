import request from '@/utils/request'

export function selectJapanese(word) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/translation?jp=' + word + '&detail=true',
        method: 'get'
    })
}

export function selectByLike(jp) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/select_by_like?jp=' + jp,
        method: 'get'
    })
}

export function selectByHana(jp) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/select_by_hana?jp=' + jp,
        method: 'get'
    })
}

export function selectExamplesByLikeJp(jp) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/select_examples_by_like_jp?jp=' + jp,
        method: 'get'
    })
}

export function selectExamplesByLikeCn(cn) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/select_examples_by_like_cn?cn=' + cn,
        method: 'get'
    })
}

// 中日互译
export function selectByCn(word) {
    return request({
        url: 'https://www.lornwolf.com/dictionary/select_by_cn?cn=' + word,
        method: 'get'
    })
}
