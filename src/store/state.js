/**
 * 状态state管理区
 * */
import {
    LocalStorage,
    SessionStorage,
} from '../utils/storage'
export default {
    themeColor: '#66ccff',
    galleryList: [],
    currentIndex: -1,
    $swiper: null,
    searchHistory: LocalStorage.get('__PIXIV_searchHistory', []),
    SETTING: LocalStorage.get('__PIXIV_SETTING', {
        r18: false,
        r18g: false
    })
}
