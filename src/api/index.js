/**
 * 保存API以及初始处理数据
 * */
import {
    get
} from './request';
import {
    LocalStorage,
    SessionStorage
} from '../utils/storage';
import moment from "moment";
import { Base64 } from 'js-base64';

// 请求地址
const BASE_URL = '/api';

// 使用正则表达式替换图片地址
const imgProxy = url => url.replace(/i.pximg.net/g, 'pximg.pixiv-viewer.workers.dev');

/**
 * 处理数据结构方法
 **/
const parseIllustV2 = (data) => {
    /**
     * @baoyiwen
     * id: 作品ID
     * title: 标题
     * caption:
     * create_date:
     * tags:
     * tools:
     * width:
     * height:
     * x_restrict: 限制 0: 无限制，1：R-18，2：R-18G
     * total_view:
     * total_bookmarks:
     * images:
     * */
    let {
        id,
        title,
        caption,
        create_date,
        tags,
        tools,
        width,
        height,
        x_restrict,
        total_view,
        total_bookmarks
    } = data;
    let images = [];

    if (data.meta_single_page.original_image_url) {
        images.push({
            s: imgProxy(data.image_urls.square_medium),
            m: imgProxy(data.image_urls.medium),
            l: imgProxy(data.image_urls.large),
            o: imgProxy(data.meta_single_page.original_image_url)
        })
    } else {
        images = data.meta_pages.map(data => {
            return {
                s: imgProxy(data.image_urls.square_medium),
                m: imgProxy(data.image_urls.medium),
                l: imgProxy(data.image_urls.large),
                o: imgProxy(data.image_urls.original)
            }
        })
    }

    const artwork = {
        id,
        title,
        caption,
        author: {
            id: data.user.id,
            name: data.user.name,
            avatar: imgProxy(data.user.profile_image_urls.medium)
        },
        created: create_date,
        images,
        tags,
        tools,
        width,
        height,
        count: data.page_count,
        view: total_view,
        like: total_bookmarks,
        x_restrict
    };

    return artwork;
};
// 处理数据使得数据符合使用要求(此方法处理v1接口数据)
const parseIllustV1 = (data) => {
    /**
     * @baoyiwen
     * id: 作品ID
     * title: 标题
     * caption: 图片描述
     * tags: 图片标签
     * tools:工具
     * width: 图片宽
     * height: 图片高
     * age_limit: 限制 all-age: 无限制，1：R-18，2：R-18G
     * user: 作者信息
     * created_time：创建时间
     * stats： 状态
     * reuploaded_time：重新分配时间
     * images:
     * */
    let {
        id,
        title,
        caption,
        create_date,
        tags,
        tools,
        width,
        height,
        age_limit,
        total_view,
        total_bookmarks,
        pagination,
    } = data;
    let images = [];
    if (data.meta_single_page.original_image_url) {
        images.push({
            s: imgProxy(data.image_urls.px_128x128),
            m: imgProxy(data.image_urls.px_480mw),
            l: imgProxy(data.image_urls.large),
            // o: imgProxy(data.meta_single_page.original_image_url)
        });
    } else {
        images = data.meta_pages.map(data => {
            return {
                s: imgProxy(data.image_urls.square_medium),
                m: imgProxy(data.image_urls.medium),
                l: imgProxy(data.image_urls.large),
                // o: imgProxy(data.image_urls.original)
            }
        });
    };

    const artwork = {
        id,
        title,
        caption,
        author: {
            id: data.user.id,
            name: data.user.name,
            avatar: imgProxy(data.user.profile_image_urls.medium)
        },
        created: create_date,
        images,
        tags,
        tools,
        width,
        height,
        count: data.page_count,
        view: total_view,
        like: total_bookmarks,
        age_limit,
        pagination
    };

    return artwork
};

const api = {
    /**
     *
     * @param {Number} id 作品ID
     * @param {Number} index 页数 0起始
     */
    url(id, index) {
        if (!index) {
            return `https://pixiv.cat/${id}.png`
        } else {
            return `https://pixiv.cat/${id}-${index}.png`
        }
    },

    /**
     *
     * @param {Number} offset 偏移值
     * @param {Number} per_page 每页数量
     */
    async getLatest(offset = 0, per_page = 40) {
        let res = await get('/v1/', {
            type: 'latest',
            offset,
            per_page
        })

        let data, artList
        if (res.status === 'success') {
            data = res.response
        } else if (res.error) {
            return {
                status: -1,
                msg: res.error.user_message || res.error.message
            }
        } else {
            return {
                status: -1,
                msg: '未知错误'
            }
        }

        artList = data.map(art => {
            let { id, title, caption, tags, tools, width, height, age_limit } = art
            return {
                id,
                title,
                caption,
                author: {
                    id: art.user.id,
                    name: art.user.name,
                    avatar: imgProxy(art.user.profile_image_urls.px_50x50)
                },
                images: [{
                    s: imgProxy(art.image_urls.px_128x128),
                    m: imgProxy(art.image_urls.px_480mw),
                    l: imgProxy(art.image_urls.large),
                    o: imgProxy(art.image_urls.large)
                }],
                tags,
                tools,
                width,
                height,
                count: art.page_count,
                age_limit
            }
        })

        return { status: 0, data: artList }
    },

    /**
     *
     * @param {Number} id 作品ID
     * @param {Number} page 页数 [1,5]
     */
    async getRelated(id, page = 1) {
        let relatedList
        if (!SessionStorage.has(`relatedList_${id}_p${page}`)) {

            let res = await get('/v2/', {
                type: 'related',
                id,
                page
            })

            let data
            if (res.illusts) {
                data = res.illusts
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }

            relatedList = data.map(art => {
                return parseIllustV2(art)
            })

            SessionStorage.set(`relatedList_${id}_p${page}`, relatedList, 60 * 60 * 3)
        } else {
            relatedList = SessionStorage.get(`relatedList_${id}_p${page}`)
        }


        return { status: 0, data: relatedList }
    },

    /**
     *
     * @param {String} mode 排行榜类型  ['day', 'week', 'month', 'week_rookie', 'week_original', 'day_male', 'day_female', 'day_r18', 'week_r18', 'day_male_r18', 'day_female_r18', 'week_r18g']
     * @param {Number} page 页数
     * @param {String} date YYYY-MM-DD 默认为「前天」
     */
    async getRankList(mode = 'weekly', page = 1, date = moment().subtract(2, 'days').format('YYYY-MM-DD')) {
        let rankList
        date = moment(date).format('YYYY-MM-DD')
        if (!SessionStorage.has(`rankList_${mode}_${date}_${page}`)) {

            let res = await get('/v2/', {
                type: 'rank',
                mode,
                page,
                date
            })

            let data
            if (res.illusts) {
                data = res.illusts
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }

            rankList = data.map(art => {
                return parseIllustV2(art)
            })

            SessionStorage.set(`rankList_${mode}_${date}_${page}`, rankList, 60 * 60 * 24)
        } else {
            rankList = SessionStorage.get(`rankList_${mode}_${date}_${page}`)
        }


        return { status: 0, data: rankList }
    },

    /**
     *
     * @param {String} word 关键词
     * @param {Number} page 页数
     */
    async search(word, page = 1) {
        let searchList, key = `searchList_${Base64.encode(word)}_${page}`
        if (!SessionStorage.has(key)) {

            let res = await get('/v2/', {
                type: 'search',
                word,
                page
            })

            let data
            if (res.illusts) {
                data = res.illusts
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }
            searchList = data.map(art => {
                return parseIllustV2(art)
            })

            SessionStorage.set(key, searchList, 60 * 60 * 24)
        } else {
            searchList = SessionStorage.get(key)
        }


        return { status: 0, data: searchList }
    },

    /**
     *
     * @param {Number} id 作品ID
     */
    async getArtwork(id) {
        let artwork
        if (!LocalStorage.has(`artwork_${id}`)) {

            let res = await get('/v2/', {
                type: 'illust',
                id
            })

            let data
            if (res.illust) {
                data = res.illust
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }

            artwork = parseIllustV2(data)

            LocalStorage.set(`artwork_${id}`, artwork)
        } else {
            artwork = LocalStorage.get(`artwork_${id}`)
        }


        return { status: 0, data: artwork }
    },

    /**
     *
     * @param {Number} id 画师ID
     */
    async getMemberInfo(id) {
        let memberInfo
        if (!LocalStorage.has(`memberInfo_${id}`)) {

            let res = await get('/v2/', {
                type: 'member',
                id
            })

            if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                memberInfo = res
            }

            LocalStorage.set(`memberInfo_${id}`, memberInfo)
        } else {
            memberInfo = LocalStorage.get(`memberInfo_${id}`)
        }


        return { status: 0, data: memberInfo }
    },

    /**
     *
     * @param {Number} id 画师ID
     */
    async getMemberArtwork(id) {
        let memberArtwork
        if (!LocalStorage.has(`memberArtwork_${id}`)) {

            let res = await get('/v2/', {
                type: 'member_illust',
                id
            })

            let data;
            if (res.illusts) {
                data = res.illusts
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }

            memberArtwork = data.map(art => {
                return parseIllustV2(art)
            })

            LocalStorage.set(`memberArtwork_${id}`, memberArtwork)
        } else {
            memberArtwork = LocalStorage.get(`memberArtwork_${id}`)
        }

        return { status: 0, data: memberArtwork }
    },

    async getTags() {
        let tags
        if (!LocalStorage.has(`tags`)) {

            let res = await get('/v2/', {
                type: 'tags'
            })

            if (res.trend_tags) {
                let temp = res.trend_tags

                tags = temp.map(data => {
                    let { tag, translated_name } = data
                    return {
                        name: tag,
                        tname: translated_name,
                        pic: imgProxy(data.illust.image_urls.square_medium)
                    }
                })
            } else if (res.error) {
                return {
                    status: -1,
                    msg: res.error.user_message || res.error.message
                }
            } else {
                return {
                    status: -1,
                    msg: '未知错误'
                }
            }

            LocalStorage.set(`tags`, tags, 60 * 60 * 24)
        } else {
            tags = LocalStorage.get(`tags`)
        }

        return { status: 0, data: tags }
    }
};

export default api;
