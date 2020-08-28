/**
 *  state更新代码区
 * */
import { LocalStorage } from '@/utils/storage'
import {
    SET_SEARCH_HISTORY,
    SAVE_SETTING,
    SET_CURRENT_INDEX,
    SET_GALLERY_LIST,
    SET_SWIPER
} from './mutation-type'
export default {
    [SET_SEARCH_HISTORY] (state, obj) {
        if (obj === null) {
            state.searchHistory = [];
            LocalStorage.remove('__PIXIV_searchHistory');
        } else {
            if (this.state.searchHistory.includes(obj)) {
                return false;
            }
            if (state.searchHistory.length >= 20) {
                state.searchHistory.shift();
            }
            this.state.searchHistory.push(obj);
            LocalStorage.set('__PIXIV_searchHistory', state.searchHistory);
        }
    },
    [SAVE_SETTING] (state, obj) {
        this.state.SETTING = obj;
        LocalStorage.set('__PIXIV_SETTING', state.SETTING);
    },
    [SET_CURRENT_INDEX] (state, id) {
        state.currentIndex = state.galleryList.findIndex(artwork => artwork.id === id);
    },
    [SET_GALLERY_LIST] (state, {list, id}) {
        state.galleryList = list;
        id && this.commit(SET_CURRENT_INDEX, id);
    },
    [SET_SWIPER] (state, obj) {
        state.$swiper = obj;
    },
}
