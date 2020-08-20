/**
 * Storage浏览器缓存操作方法
 * */
class Storage {

    /**
     * 根据键获取相关值
     * @param key: 储存键
     * @param def:
     *
     * */
    get (key, def) {
        let result = this.drive.getItem(key);
        if (result) {
            let data = deserialize(result);
            if (Math.floor(+new Date() / 1000) >= data.expires && data.expires !== -1 ) {
                data.data = def;
                this.remove(key);
            }
            return data.data;
        } else {
            return def;
        }
    }

    /**
     * 将值存入浏览器缓存中
     * @param {String} key: 键
     * @param {String} val: 值
     * @param {Number} expires: 到期时间
     * */
    set (key, val, expires = -1) {
        try{
            if (val === undefined) {
                return this.remove(key);
            }
            if (typeof expires === 'number' && expires >= 0) {
                expires = Math.floor(+new Date() / 1000) + expires;
            } else {
                expires = -1;
            }
            let data = {
                data: val,
                expires,
            };
            this.drive.setItem(key, serialize(data));
        } catch (e) {
            console.log("Local Storage is full, Please empty data");
        }
        return val;
    }

    /**
     * 检查键是否存在于浏览器缓存中
     * */
    has (key) {
        return this.get(key) !== undefined;
    }

    /**
     * 在浏览器缓存中移除对应键值
     * */
    remove (key) {
        this.drive.removeItem(key);
    }

    clear () {
        this.drive.clear();
    }
}

class Local extends Storage{
    constructor () {
        super();
        this.drive = window.localStorage;
    }
}

class Session extends Storage{
    constructor () {
        super();
        this.drive = window.sessionStorage;
    }
}

export const LocalStorage = new Local();
export const SessionStorage = new Session();
/**
 * 将对象或者数组转换为json字符串
 * */
function serialize (val) {
    return JSON.stringify(val);
}
/**
 * 将json字符串转换为对应的对象或者数组
 * */
function deserialize (val) {
    if (typeof val !== 'string') {
        return undefined;
    }
    try {
        return JSON.parse(val);
    } catch (e) {
        return val || undefined;
    }
}

