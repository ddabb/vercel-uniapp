if (typeof uni === 'undefined') {
    uni = {};
}

uni.addInterceptor({
    returnValue (res) {
        if (!(!!res && (typeof res === "object" || typeof res === "function") && typeof res.then === "function")) {
            return res;
        }
        return new Promise((resolve, reject) => {
            res.then((res) => {
                if (!res) return resolve(res);
                if (res instanceof Error) {
                    return reject(res);
                }
                return res[0] ? reject(res[0]) : resolve(res[1]);
            });
        });
    },
});