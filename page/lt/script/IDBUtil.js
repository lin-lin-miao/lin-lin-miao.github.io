// idb-util.js - 保留ES6（class/箭头函数等），仅移除模块化导出
class IDBUtil {
	// localStorage 存储数据库大小的键（静态私有常量）
	static #dbSizeRecord = 'dbSizeRecord';

	/**
	 * 累加数据库仓库的字节大小到localStorage
	 * @param {string} dbName 数据库名
	 * @param {string} storeName 仓库名
	 * @param {number} bytes 要累加的字节数
	 */
	static #addSize(dbName, storeName, bytes) {
		if (bytes === 0) return;
		try {
			const existingRecord = localStorage.getItem(this.#dbSizeRecord);
			const sizeRecord = existingRecord ? JSON.parse(existingRecord) : {};

			if (!sizeRecord[dbName]) sizeRecord[dbName] = {};
			sizeRecord[dbName][storeName] = (sizeRecord[dbName][storeName] || 0) + bytes;

			localStorage.setItem(this.#dbSizeRecord, JSON.stringify(sizeRecord));
			console.log(`✅ 字节数已累加：${dbName} → ${storeName} = ${sizeRecord[dbName][storeName]} B`);
		} catch (storageError) {
			console.error('❌ 保存字节数失败：', storageError.message);
		}
	}

	/**
	 * 计算JS对象的UTF-8字节大小（精准）
	 * @param {any} obj 任意JS对象/基本类型
	 * @returns {number} 字节数（失败返回0）
	 */
	static #calculateObjectSize(obj) {
		try {
			if (obj === null || obj === undefined) return 0;
			const dataStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
			const encoder = new TextEncoder();
			return encoder.encode(dataStr).length;
		} catch (error) {
			console.error('计算对象大小失败：', error.message);
			return 0;
		}
	}

	/**
	 * 保存对象到IndexedDB
	 * @param {string} dbName 数据库名
	 * @param {string} storeName 仓库名
	 * @param {string} key 唯一标识（对应仓库主键id）
	 * @param {object} obj 要保存的对象
	 * @param {number} [version=1] 数据库版本号
	 * @returns {Promise<string>} 成功提示
	 */
	static saveObjectToIDB(dbName, storeName, key, obj, version = 1) {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, version);

			// 数据库版本升级/首次创建时初始化仓库
			request.onupgradeneeded = (e) => {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'id' });
				}
			};

			// 数据库打开成功
			request.onsuccess = (e) => {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'id' });
				}
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);

				// 读取旧数据（计算大小差值）
				const getOldRequest = store.get(key);
				getOldRequest.onsuccess = (getEvent) => {
					const oldData = getEvent.target.result;
					const oldDataSize = oldData?.data ? this.#calculateObjectSize(oldData.data) : 0;
					const newDataSize = this.#calculateObjectSize(obj);
					const sizeDiff = newDataSize - oldDataSize; // 新增/覆盖的大小差值

					console.log(`📌 旧数据大小：${oldDataSize} B | 新数据大小：${newDataSize} B | 差值：${sizeDiff} B`);

					// 写入新数据
					const putRequest = store.put({ id: key, data: obj });
					putRequest.onsuccess = () => {
						this.#addSize(dbName, storeName, sizeDiff);
					};
				};

				// 事务完成/失败处理
				tx.oncomplete = () => {
					db.close();
					resolve(`✅ 对象保存成功（key：${key}）`);
				};
				tx.onerror = (e) => reject(`❌ 保存失败：${e.target.error.message}`);
			};

			// 数据库打开失败
			request.onerror = (e) => reject(`❌ 数据库打开失败：${e.target.error.message}`);
		});
	}

	/**
	 * 从IndexedDB读取对象
	 * @param {string} dbName 数据库名
	 * @param {string} storeName 仓库名
	 * @param {string} key 保存时的唯一标识
	 * @param {number} [version=1] 数据库版本号
	 * @returns {Promise<object|null>} 读取的对象（无数据返回null）
	 */
	static getObjectFromIDB(dbName, storeName, key, version = 1) {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, version);

			request.onsuccess = (e) => {
				const db = e.target.result;
				const tx = db.transaction(storeName, 'readonly');
				const store = tx.objectStore(storeName);

				const getRequest = store.get(key);
				getRequest.onsuccess = () => {
					db.close();
					resolve(getRequest.result ? getRequest.result.data : null);
				};
				getRequest.onerror = (e) => reject(`❌ 读取失败：${e.target.error.message}`);
			};

			request.onerror = (e) => reject(`❌ 数据库打开失败：${e.target.error.message}`);
		});
	}
}

// 核心修改：将类挂载到window全局对象，无需import即可使用
window.IDBUtil = IDBUtil;