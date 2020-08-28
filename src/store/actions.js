/**
 * 后台交互代码处理区域actions
 * */
import {
    SET_SWIPER,
    SET_GALLERY_LIST,
    SET_CURRENT_INDEX,
    SAVE_SETTING,
    SET_SEARCH_HISTORY
} from './mutation-type'
export default {
    setGalleryList({ commit }, { list, id }) {
        commit(SET_GALLERY_LIST, { list, id })
    },
    setCurrentIndex({ commit }, value) {
        commit(SET_CURRENT_INDEX, value)
    },
    setSwiper({ commit }, value) {
        commit(SET_SWIPER, value)
    },
    setSearchHistory({ commit }, value) {
        commit(SET_SEARCH_HISTORY, value)
    },
    saveSETTING({ commit }, value) {
        commit(SAVE_SETTING, value)
    }
}
