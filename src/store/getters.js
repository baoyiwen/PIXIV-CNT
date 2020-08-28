/**
 * getters计算属性区
 * */
export default {
    currentId: state => state.galleryList[state.currentIndex] ? state.galleryList[state.currentIndex].id : -1,
    isCensored: state => artwork => {
        if (artwork.x_restrict === 1) {
            return state.SETTING.r18 ? false : true;
        } else if (artwork.x_restrict === 2) {
            return state.SETTING.r18g ? false : true;
        } else {
            return false;
        }
    }
}
